import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { WhoopConfigurationError } from "@/lib/whoop/config";

const TOKEN_FORMAT_VERSION = "v1";

function getEncryptionKey() {
  const encodedKey = process.env.WHOOP_TOKEN_ENCRYPTION_KEY;
  if (!encodedKey) throw new WhoopConfigurationError();

  const key = Buffer.from(encodedKey, "base64");
  if (key.length !== 32) throw new WhoopConfigurationError();
  return key;
}

export function encryptWhoopToken(token: string) {
  const initializationVector = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), initializationVector);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authenticationTag = cipher.getAuthTag();

  return [
    TOKEN_FORMAT_VERSION,
    initializationVector.toString("base64url"),
    authenticationTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptWhoopToken(encryptedToken: string) {
  const [version, encodedIv, encodedTag, encodedCiphertext, ...extra] = encryptedToken.split(".");
  if (
    version !== TOKEN_FORMAT_VERSION
    || !encodedIv
    || !encodedTag
    || !encodedCiphertext
    || extra.length > 0
  ) {
    throw new Error("Invalid encrypted WHOOP token");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(encodedIv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function getStateSigningKey() {
  return createHmac("sha256", getEncryptionKey())
    .update("inner-depths-whoop-oauth-state-v1")
    .digest();
}

export function signWhoopStatePayload(payload: string) {
  return createHmac("sha256", getStateSigningKey()).update(payload).digest("base64url");
}

export function signaturesMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
