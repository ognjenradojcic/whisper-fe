import { IUser } from "../models/User";
import { EncryptionService } from "../services/EncryptionService";
import { UserService } from "../services/UserService";
import storage from "../Storage";

export async function publicKeyUpdate() {
  const { privateKey, publicKey } = await EncryptionService.generateKeyPair();

  setKeyPair(privateKey, publicKey);
}

export function setKeyPair(privateKey: string, publicKey: string) {
  storage.set("private_key", privateKey);
  storage.set("public_key", publicKey);

  UserService.update({
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

export function updateUserStorageData(userData: IUser) {
  const user = storage.get("user");

  if (user) {
    const updatedUser = {
      ...user,
      data: userData,
    };

    storage.set("user", updatedUser);
  } else {
    throw Error("No user found in local storage");
  }
}
