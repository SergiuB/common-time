"use server";

import crypto from "crypto";

// Encryption function
export async function encryptSafeUrlPart(text: string, secretKey: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encodeURIComponent(
    iv.toString("hex") + ":" + encrypted.toString("hex"),
  );
}

// Decryption function
export async function decryptSafeUrlPart(text: string, secretKey: string) {
  let textParts = decodeURIComponent(text).split(":");
  let iv = Buffer.from(textParts.shift()!, "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
