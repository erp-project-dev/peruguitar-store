import "dotenv/config";

import fs from "fs";
import path from "path";
import crypto from "crypto";

import logger from "./worker-logger.js";

const { DATA_SYNC_SECRET } = process.env;

if (!DATA_SYNC_SECRET) {
  throw new Error("DATA_SYNC_SECRET is not defined");
}

const sourceFile = path.resolve("./app/db/store.enc");
const destinationFile = path.resolve("./app/db/store.json");

const algorithm = "aes-256-cbc";
const ivLength = 16;

// -------------------------------------------
// DECRYPT (MATCHES YOUR ENCRYPT LOGIC)
// -------------------------------------------
function decrypt(payload) {
  const [ivHex, encryptedHex] = payload.split(":");

  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted file format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  if (iv.length !== ivLength) {
    throw new Error("Invalid IV length");
  }

  const key = crypto.createHash("sha256").update(DATA_SYNC_SECRET).digest();

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");

  return JSON.parse(decrypted);
}

// -------------------------------------------
// MAIN
// -------------------------------------------
(async () => {
  logger.start("Data Sync");

  try {
    if (!fs.existsSync(sourceFile)) {
      throw new Error("store.enc not found");
    }

    const encryptedPayload = fs.readFileSync(sourceFile, "utf8");
    const store = decrypt(encryptedPayload);

    fs.writeFileSync(destinationFile, JSON.stringify(store, null, 2), "utf8");

    logger.success("store.json generated successfully");
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }

  logger.end("Data Sync");
})();
