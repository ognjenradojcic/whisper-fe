import { base64ToArrayBuffer, base64ToUint8Array } from "../helpers/helpers";
import { IMessage } from "../models/Message";
import storage from "../Storage";

export const EncryptionService = {
  async generateKeyPair() {
    const keyPair = crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicKey = await crypto.subtle.exportKey(
      "spki",
      (
        await keyPair
      ).publicKey
    );
    const privateKey = await crypto.subtle.exportKey(
      "pkcs8",
      (
        await keyPair
      ).privateKey
    );

    return {
      publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
      privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
    };
  },

  async generateAESKey() {
    return await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  },

  async encryptAESKey(aesKey: CryptoKey, recipientPublicKey: string) {
    const publicKey = await crypto.subtle.importKey(
      "spki",
      Uint8Array.from(atob(recipientPublicKey), (c) => c.charCodeAt(0)),
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      true,
      ["encrypt"]
    );

    const exportedAESKey = await crypto.subtle.exportKey("raw", aesKey);

    return await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      exportedAESKey
    );
  },

  async decryptAESKey(encryptedAESKey: ArrayBuffer, privateKey: string) {
    const importedPrivateKey = await crypto.subtle.importKey(
      "pkcs8",
      Uint8Array.from(atob(privateKey), (c) => c.charCodeAt(0)),
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      true,
      ["decrypt"]
    );

    return await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      importedPrivateKey,
      encryptedAESKey
    );
  },

  async encryptMessage(message: string, aesKey: CryptoKey) {
    const encodedMessage = new TextEncoder().encode(message);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const cipherText = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      encodedMessage
    );

    return { cipherText, iv };
  },

  async decryptMessage(
    encryptedMessage: ArrayBuffer,
    aesKey: CryptoKey,
    iv: Uint8Array
  ) {
    return await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      encryptedMessage
    );
  },
};

export async function decryptMessagePayload(
  message: IMessage,
  authUserId: number
): Promise<string> {
  try {
    // Step 1: Decrypt AES key using the user's private RSA key

    const messageAesKey =
      message.receiver.id === authUserId
        ? message.receiver_aes_key
        : message.sender_aes_key;

    const encryptedAESKey = base64ToArrayBuffer(messageAesKey || "");
    const aesKeyBuffer = await EncryptionService.decryptAESKey(
      encryptedAESKey,
      storage.get("private_key")
    );

    // Import the decrypted AES key back as a CryptoKey
    const aesKey = await crypto.subtle.importKey(
      "raw",
      aesKeyBuffer,
      { name: "AES-GCM", length: 256 },
      true,
      ["decrypt"]
    );

    // Step 2: Convert the payload and IV from Base64
    const encryptedPayload = base64ToArrayBuffer(message.payload);
    const iv = base64ToUint8Array(message.iv || "");

    // Step 3: Decrypt the message payload using AES key and IV
    const decryptedPayloadBuffer = await EncryptionService.decryptMessage(
      encryptedPayload,
      aesKey,
      iv
    );

    // Convert the decrypted ArrayBuffer to a string
    const decryptedPayload = new TextDecoder().decode(decryptedPayloadBuffer);

    return decryptedPayload;
  } catch (error) {
    console.error(`Failed to decrypt message ${message.id}:`, error);
    return "Error decrypting message";
  }
}

export async function decryptAllMessages(
  messages: IMessage[],
  authUserId: number
): Promise<IMessage[]> {
  const decryptedMessages = await Promise.all(
    messages.map(async (message) => {
      const decryptedPayload = await decryptMessagePayload(message, authUserId);

      // Return a new object with the decrypted payload
      return { ...message, payload: decryptedPayload };
    })
  );

  return decryptedMessages;
}

export async function encryptMessagePayload(
  message: string,
  aesKey: CryptoKey,
  recipientPublicKey: string
): Promise<{
  payload: string; // Encrypted message payload (Base64)
  sender_aes_key: string; // Encrypted AES key (Base64)
  receiver_aes_key: string; // Encrypted AES key (Base64)
  iv: string; // Initialization vector (Base64)
}> {
  try {
    // Step 1: Encrypt the message with AES-GCM
    const { cipherText, iv } = await EncryptionService.encryptMessage(
      message,
      aesKey
    );

    // Step 2: Encrypt the AES key with the recipient's public RSA key
    const encryptedSenderAESKey = await EncryptionService.encryptAESKey(
      aesKey,
      storage.get("public_key")
    );
    const encryptedReceiverAESKey = await EncryptionService.encryptAESKey(
      aesKey,
      recipientPublicKey
    );

    // Step 3: Convert all results to Base64 for transmission/storage
    const payloadBase64 = btoa(
      String.fromCharCode(...new Uint8Array(cipherText))
    );
    const senderAesKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encryptedSenderAESKey))
    );
    const receiverAesKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encryptedReceiverAESKey))
    );
    const ivBase64 = btoa(String.fromCharCode(...iv));

    // Step 4: Return the encrypted message object
    return {
      payload: payloadBase64,
      sender_aes_key: senderAesKeyBase64,
      receiver_aes_key: receiverAesKeyBase64,
      iv: ivBase64,
    };
  } catch (error) {
    console.error("Error encrypting message:", error);
    throw new Error("Message encryption failed");
  }
}
