import { IUser } from "../models/User";
import { EncryptionService } from "../services/EncryptionService";
import { UserService } from "../services/UserService";
import storage from "../Storage";

export async function publicKeyUpdate(userData: IUser) {
  const { privateKey, publicKey } = await EncryptionService.generateKeyPair();

  storage.set("private_key", privateKey);
  storage.set("public_key", publicKey);

  UserService.update(userData.id, {
    name: userData.name,
    public_key: publicKey,
  });
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  return base64ToUint8Array(base64).buffer;
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

export function base64Encode(buffer: ArrayBuffer | Uint8Array) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
