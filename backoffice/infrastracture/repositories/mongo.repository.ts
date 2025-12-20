/* eslint-disable @typescript-eslint/no-explicit-any */
import { Db, Filter, Document } from "mongodb";
import { ZodError, ZodObject } from "zod";

import { getDbInstance } from "@/infrastracture/repositories/database";

import { ApplicationError } from "../shared/error";
import { getZodMessage } from "../helpers/zod.helper";
import { BaseEntity } from "../domain/base.entity";
import { getAuthUser } from "../helpers/auth.helper";

type CreateData<T> = Omit<T, "created_at" | "updated_at">;
type UpdateData<T> = Partial<Omit<T, "_id" | "created_at" | "updated_at">>;

export class MongoRepository<T extends Document> {
  constructor(
    private readonly collectionName: string,
    private readonly validator: ZodObject
  ) {}

  private async collection() {
    const db: Db = await getDbInstance();
    return db.collection<T>(this.collectionName);
  }

  async findById(id: string): Promise<T> {
    const col = await this.collection();
    const entity = (await col.findOne({
      _id: id,
    } as Filter<T>)) as T | null;

    if (!entity) {
      throw new ApplicationError(
        "not-found",
        `${this.collectionName} with id '${id}' could not be found`
      );
    }

    return entity;
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    const col = await this.collection();
    const results = (await col.find(filter).limit(2).toArray()) as T[];

    if (results.length > 1) {
      throw new ApplicationError(
        "conflict",
        `${this.collectionName} query returned more than one result`
      );
    }

    return results[0] ?? null;
  }

  async findAll(filter: Filter<T> = {}): Promise<T[]> {
    const col = await this.collection();

    return col.find(filter).sort({ created_at: -1 }).toArray() as Promise<T[]>;
  }

  async create(data: CreateData<T>): Promise<T> {
    try {
      const entry = await this.prepareEntry(data, "insert");
      this.validator.parse(entry);

      const col = await this.collection();
      await col.insertOne(entry as any);

      return entry as T;
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ApplicationError("schema-invalid", getZodMessage(e));
      }

      throw e;
    }
  }

  async update(id: string, data: UpdateData<T>): Promise<T> {
    try {
      const entry = await this.prepareEntry({ ...data, _id: id }, "update");
      this.validator.partial().parse(entry);

      const col = await this.collection();
      const result = await col.updateOne({ _id: id } as Filter<T>, {
        $set: entry as any,
      });

      if (result.matchedCount === 0) {
        throw new ApplicationError(
          "not-found",
          `${this.collectionName} with id '${id}' could not be found`
        );
      }

      return this.findById(id);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ApplicationError("schema-invalid", getZodMessage(e));
      }
      throw e;
    }
  }

  async delete(id: string): Promise<void> {
    const col = await this.collection();
    const result = await col.deleteOne({ _id: id } as any);

    if (result.deletedCount === 0) {
      throw new ApplicationError(
        "not-found",
        `${this.collectionName} with id '${id}' could not be found`
      );
    }
  }

  async isUnique<K extends keyof T>(
    field: K,
    value: T[K],
    ignoreId?: string
  ): Promise<boolean> {
    const col = await this.collection();

    const filter: any = {
      [field]: value,
    };

    if (ignoreId) {
      filter._id = { $ne: ignoreId };
    }

    const exists = await col.findOne(filter, {
      projection: { _id: 1 },
    });

    return !exists;
  }

  private async prepareEntry(
    entry: Partial<BaseEntity>,
    type: "insert" | "update"
  ) {
    const newEntry = { ...entry };
    const currentUser = await getAuthUser();
    const actor = currentUser?.id ?? "system";

    if (type === "insert") {
      newEntry.created_at = new Date();
      newEntry.created_by = actor;
    }

    if (type === "update") {
      newEntry.updated_at = new Date();
      newEntry.updated_by = actor;

      delete newEntry.created_at;
      delete newEntry.created_by;
    }

    return newEntry;
  }
}
