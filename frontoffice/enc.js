import fs from "fs";
import crypto from "crypto";

// ===== CONFIG (PRUEBA) =====
const INPUT_FILE = "data.json";
const ENC_FILE = "data.enc";
const PASSWORD = "peruguitar-test-key-1234567890";

// ===== 1. Leer JSON =====
const rawJson = fs.readFileSync(INPUT_FILE, "utf8");

// ===== 2. Minificar =====
const minifiedJson = JSON.stringify(JSON.parse(rawJson));

// ===== 3. Derivar clave =====
const salt = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync(PASSWORD, salt, 100000, 32, "sha256");

// ===== 4. Encriptar =====
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

const encrypted = Buffer.concat([
  cipher.update(minifiedJson, "utf8"),
  cipher.final(),
]);

const authTag = cipher.getAuthTag();

// formato: salt | iv | authTag | encrypted
const payload = Buffer.concat([salt, iv, authTag, encrypted]);
fs.writeFileSync(ENC_FILE, payload);

// ===== INFO =====
console.log("🔐 Encriptado OK");
console.log("📦 Original:", Buffer.byteLength(rawJson), "bytes");
console.log("📦 Minificado:", Buffer.byteLength(minifiedJson), "bytes");
console.log("📦 Encriptado:", payload.length, "bytes");

// ===== 5. DESENCRIPTAR =====
const data = fs.readFileSync(ENC_FILE);

const salt2 = data.subarray(0, 16);
const iv2 = data.subarray(16, 28);
const authTag2 = data.subarray(28, 44);
const encrypted2 = data.subarray(44);

const key2 = crypto.pbkdf2Sync(PASSWORD, salt2, 100000, 32, "sha256");

const decipher = crypto.createDecipheriv("aes-256-gcm", key2, iv2);
decipher.setAuthTag(authTag2);

const decrypted = Buffer.concat([
  decipher.update(encrypted2),
  decipher.final(),
]).toString("utf8");

// ===== 6. VALIDAR + IMPRIMIR =====
console.log("\n🔓 Desencriptado OK");
console.log("📄 JSON desencriptado:\n");

const parsed = JSON.parse(decrypted); // valida que sea JSON real
console.log(JSON.stringify(parsed, null, 2)); // pretty print
