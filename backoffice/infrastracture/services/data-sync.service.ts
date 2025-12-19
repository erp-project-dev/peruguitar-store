/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

import { Db } from "mongodb";
import { getDbInstance } from "../repositories/database";

const EXCLUDED_COLUMNS = ["email"];

export class DataSyncService {
  private readonly destinationDirectory = path.resolve(
    process.cwd(),
    "../frontoffice/app/db"
  );

  private readonly outputFile = "store.enc";
  private readonly secret = process.env.DATA_SYNC_SECRET as string;

  private readonly algorithm = "aes-256-cbc";
  private readonly ivLength = 16;

  async handle(): Promise<void> {
    const db = await getDbInstance();

    const collections = await this.getCollections(db);

    const result = {
      Merchants: this.normalize(collections.merchants),
      Catalog: this.normalize(collections.catalog),
      Brands: this.normalize(collections.brands),
      Types: this.normalize(collections.types),
      Settings: this.normalize(collections.settings),
    };

    await this.ensureDirectory();

    const encrypted = this.encrypt(JSON.stringify(result));

    await this.writeEncrypted(encrypted);
  }

  private async getCollections(db: Db) {
    const [catalog, merchants, brands, settings, types] = await Promise.all([
      db.collection("catalog").find({ is_enabled: true }).toArray(),
      db.collection("merchants").find().toArray(),
      db.collection("brands").find().toArray(),
      db.collection("settings").find().toArray(),
      db.collection("types").find().toArray(),
    ]);

    return { catalog, merchants, brands, settings, types };
  }

  private normalize(docs: any[]) {
    return docs.map((doc) => {
      const { _id, ...rest } = doc;

      const clean: any = { id: _id };

      for (const [key, value] of Object.entries(rest)) {
        if (!EXCLUDED_COLUMNS.includes(key)) {
          clean[key] = value;
        }
      }

      return clean;
    });
  }

  // -------------------------------------------
  // ENCRYPTION (INLINE)
  // -------------------------------------------
  private encrypt(plainText: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const key = crypto.createHash("sha256").update(this.secret).digest();

    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  // -------------------------------------------
  // FILE SYSTEM
  // -------------------------------------------
  private async ensureDirectory(): Promise<void> {
    await fs.mkdir(this.destinationDirectory, { recursive: true });
  }

  private async writeEncrypted(payload: string): Promise<void> {
    const filePath = path.join(this.destinationDirectory, this.outputFile);

    await fs.writeFile(filePath, payload, "utf8");
  }
}
