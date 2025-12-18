/* eslint-disable @typescript-eslint/no-explicit-any */
import { Db, Filter, Document } from "mongodb";
import { ZodError, ZodObject } from "zod";
import { getDbInstance } from "@/infrastracture/repositories/database";
import { ApplicationError } from "../shared/error";

function getZodMessage(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid entry";
  return `${issue.path}: ${issue.message}`;
}

export class MongoRepository<T extends Document> {
  constructor(
    private readonly collectionName: string,
    private readonly validator: ZodObject
  ) {}

  async collection() {
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

  async findAll(): Promise<T[]> {
    const col = await this.collection();
    return col.find({} as Filter<T>).toArray() as Promise<T[]>;
  }

  async create(data: T & { _id: string }): Promise<T> {
    try {
      this.validator.parse(data);

      const col = await this.collection();
      await col.insertOne(data as any);

      return data;
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ApplicationError("schema-invalid", getZodMessage(e));
      }
      throw e;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      this.validator.partial().parse({ _id: id, ...(data as any) });

      const col = await this.collection();
      const result = await col.updateOne({ _id: id } as Filter<T>, {
        $set: data,
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
}
