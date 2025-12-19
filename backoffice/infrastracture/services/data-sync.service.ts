/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

import { Db } from "mongodb";

import { getDbInstance } from "../repositories/database";
import { RELEASE_DATE_KEY, RELEASE_VERSION_KEY } from "../shared/constants";
import { Setting } from "../domain/setting.entity";
import { Product } from "../domain/product.entity";
import { Merchant } from "../domain/merchant.entity";
import { Brand } from "../domain/brand.entity";
import { ProductType } from "../domain/product-type.entity";

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
    const { releaseVersion, releaseDate } = this.getNextRelease(
      collections.settings
    );

    const payload = {
      meta: {
        release_version: releaseVersion,
        release_date: releaseDate,
      },
      Merchants: this.normalize(collections.merchants),
      Catalog: this.normalize(collections.catalog),
      Brands: this.normalize(collections.brands),
      Types: this.normalize(collections.types),
      Settings: this.normalizeSettings(collections.settings),
    };

    const encrypted = this.encrypt(JSON.stringify(payload));

    await this.ensureDirectory();
    await this.writeEncrypted(encrypted);

    await this.confirmRelease(db, releaseVersion, releaseDate);
  }

  private async getCollections(db: Db) {
    const [catalog, merchants, brands, settings, types] = await Promise.all([
      db.collection<Product>("catalog").find({ is_enabled: true }).toArray(),
      db.collection<Merchant>("merchants").find().toArray(),
      db.collection<Brand>("brands").find().toArray(),
      db.collection<Setting>("settings").find().toArray(),
      db.collection<ProductType>("types").find().toArray(),
    ]);

    return { catalog, merchants, brands, settings, types };
  }

  private getNextRelease(settings: Setting[]): {
    releaseVersion: string;
    releaseDate: string;
  } {
    const releaseVersion = this.getNextReleaseVersion(
      settings.find((s) => s._id === RELEASE_VERSION_KEY)?.value ?? "1.0.0"
    );

    const releaseDate =
      settings.find((s) => s._id === RELEASE_DATE_KEY)?.value ??
      new Date().toUTCString();

    return {
      releaseVersion,
      releaseDate,
    };
  }

  private getNextReleaseVersion(currentVersion: string) {
    const parts = currentVersion.split(".").map(Number);
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }

  private async confirmRelease(
    db: Db,
    newReleaseVersion: string,
    newReleaseDate: string
  ): Promise<void> {
    const collection = db.collection<Setting>("settings");

    await collection.updateOne(
      { _id: RELEASE_VERSION_KEY },
      { $set: { value: newReleaseVersion } },
      { upsert: true }
    );

    await collection.updateOne(
      { _id: RELEASE_DATE_KEY },
      { $set: { value: newReleaseDate } },
      { upsert: true }
    );
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

  private normalizeSettings(docs: any[]) {
    return docs
      .filter(
        (s) => s._id !== RELEASE_DATE_KEY && s._id !== RELEASE_VERSION_KEY
      )
      .map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }));
  }

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

  private async ensureDirectory(): Promise<void> {
    await fs.mkdir(this.destinationDirectory, { recursive: true });
  }

  private async writeEncrypted(payload: string): Promise<void> {
    const filePath = path.join(this.destinationDirectory, this.outputFile);
    await fs.writeFile(filePath, payload, "utf8");
  }
}
