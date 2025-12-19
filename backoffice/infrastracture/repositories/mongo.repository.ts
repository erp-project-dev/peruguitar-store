/* eslint-disable @typescript-eslint/no-explicit-any */
import { Db, Filter, Document } from "mongodb";
import { ZodError, ZodObject } from "zod";

import { getDbInstance } from "@/infrastracture/repositories/database";

import { ApplicationError } from "../shared/error";
import { getZodMessage } from "../helpers/zod.helper";

type CreateData<T> = Omit<T, "created_at" | "updated_at">;
type UpdateData<T> = Partial<Omit<T, "_id" | "created_at" | "updated_at">>;

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

  async findAll(filter: Filter<T> = {}): Promise<T[]> {
    const col = await this.collection();

    return col.find(filter).sort({ created_at: -1 }).toArray() as Promise<T[]>;
  }

  /**
   * CREATE
   * - created_at is set here
   */
  async create(data: CreateData<T>): Promise<T> {
    try {
      const entity = {
        ...data,
        created_at: new Date(),
      } as any;

      this.validator.parse(entity);

      const col = await this.collection();
      await col.insertOne(entity as any);

      return entity;
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ApplicationError("schema-invalid", getZodMessage(e));
      }
      throw e;
    }
  }

  /**
   * UPDATE
   * - updated_at is set here
   */
  async update(id: string, data: UpdateData<T>): Promise<T> {
    try {
      const payload = {
        ...data,
        updated_at: new Date(),
      };

      this.validator.partial().parse({ _id: id, ...payload });

      const col = await this.collection();
      const result = await col.updateOne({ _id: id } as Filter<T>, {
        $set: payload as any,
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
