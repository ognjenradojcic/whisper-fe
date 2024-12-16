import { UserOption } from "../../pages/GroupCreate";
import {
  base64Encode,
  base64ToArrayBuffer,
  base64ToUint8Array,
} from "../helpers/helpers";
import { IMessage } from "../models/Message";
import { IUser } from "../models/User";
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
  authUserId: number,
  isPrivateChat: boolean,
  groupAesKey: string
): Promise<string> {
  try {
    let messageAesKey = "";

    if (isPrivateChat) {
      messageAesKey =
        message.receiver.id === authUserId
          ? message.receiver_aes_key
          : message.sender_aes_key;
    } else {
      messageAesKey = groupAesKey;
    }

    const encryptedAESKey = base64ToArrayBuffer(messageAesKey || "");

    const aesKeyBuffer = await EncryptionService.decryptAESKey(
      encryptedAESKey,
      storage.get("private_key")
    );

    const aesKey = await crypto.subtle.importKey(
      "raw",
      aesKeyBuffer,
      { name: "AES-GCM", length: 256 },
      true,
      ["decrypt"]
    );

    const encryptedPayload = base64ToArrayBuffer(message.payload);
    const iv = base64ToUint8Array(message.iv || "");

    const decryptedPayloadBuffer = await EncryptionService.decryptMessage(
      encryptedPayload,
      aesKey,
      iv
    );

    const decryptedPayload = new TextDecoder().decode(decryptedPayloadBuffer);

    return decryptedPayload;
  } catch (error) {
    console.error(`Failed to decrypt message ${message.id}:`, error);
    return "Error decrypting message";
  }
}

export async function decryptAllMessages(
  messages: IMessage[],
  authUserId: number,
  isPrivateChat: boolean,
  groupAesKey: string
): Promise<IMessage[]> {
  const decryptedMessages = await Promise.all(
    messages.map(async (message) => {
      const decryptedPayload = await decryptMessagePayload(
        message,
        authUserId,
        isPrivateChat,
        groupAesKey
      );

      return { ...message, payload: decryptedPayload };
    })
  );

  return decryptedMessages;
}

export async function encryptMessagePayload(
  message: string,
  groupAesKey: string,
  recipientPublicKey: string,
  isPrivateChat: boolean
): Promise<{
  payload: string;
  sender_aes_key?: string;
  receiver_aes_key?: string;
  iv: string;
}> {
  try {
    const aesKey = isPrivateChat
      ? await EncryptionService.generateAESKey()
      : await decryptAndImportAESKey(groupAesKey);

    const { cipherText, iv } = await EncryptionService.encryptMessage(
      message,
      aesKey
    );

    const payloadBase64 = base64Encode(cipherText);

    const ivBase64 = btoa(String.fromCharCode(...iv));

    let result: any = {
      payload: payloadBase64,
      iv: ivBase64,
    };

    if (isPrivateChat) {
      const [encryptedSenderAESKey, encryptedReceiverAESKey] =
        await Promise.all([
          EncryptionService.encryptAESKey(aesKey, storage.get("public_key")),
          EncryptionService.encryptAESKey(aesKey, recipientPublicKey),
        ]);

      const senderAesKeyBase64 = base64Encode(encryptedSenderAESKey);
      const receiverAesKeyBase64 = base64Encode(encryptedReceiverAESKey);

      result = {
        ...result,
        sender_aes_key: senderAesKeyBase64,
        receiver_aes_key: receiverAesKeyBase64,
      };
    }

    return result;
  } catch (error) {
    console.error("Error encrypting message:", error);
    throw new Error("Message encryption failed");
  }
}

export async function encryptGroupAesKey(
  selectedUsers: UserOption[],
  authUser: IUser
): Promise<{ user_id: string; aes_key: string }[]> {
  const aesKey = await EncryptionService.generateAESKey();

  selectedUsers.push({
    value: authUser.id.toString(),
    label: authUser.name,
    public_key: storage.get("public_key"),
  });

  const mappedUsers = await Promise.all(
    selectedUsers.map(async (user) => ({
      user_id: user.value,
      aes_key: base64Encode(
        await EncryptionService.encryptAESKey(aesKey, user.public_key)
      ),
    }))
  );

  console.log("mapped users", mappedUsers);

  return mappedUsers;
}

async function decryptAndImportAESKey(
  encryptedAESKeyBase64: string
): Promise<CryptoKey> {
  try {
    const encryptedAESKeyBuffer = base64ToArrayBuffer(encryptedAESKeyBase64);

    const decryptedAESKeyBuffer = await EncryptionService.decryptAESKey(
      encryptedAESKeyBuffer,
      storage.get("private_key")
    );

    const aesKey = await crypto.subtle.importKey(
      "raw",
      decryptedAESKeyBuffer,
      { name: "AES-GCM", length: 256 },
      true,
      ["decrypt", "encrypt"]
    );

    return aesKey;
  } catch (error) {
    console.error("Error decrypting and importing AES key:", error);
    throw new Error("Failed to decrypt and import AES key");
  }
}
