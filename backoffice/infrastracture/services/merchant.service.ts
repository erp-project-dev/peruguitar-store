import { Service } from "./interfaces/service.interface";
import { Merchant } from "../domain/merchant.entity";
import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { toSlug } from "../helpers/slug.helper";
import { MerchantSchema } from "../schema/merchant.schema";

export class MerchantService implements Service {
  private repository = new MongoRepository<Merchant>(
    "merchants",
    MerchantSchema
  );

  async findById(id: string): Promise<Merchant> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<Merchant[]> {
    return this.repository.findAll();
  }

  async create(entry: Omit<Merchant, "_id">): Promise<Merchant> {
    const id = toSlug(entry.name, entry.last_name);

    await this.validateUniqueId(id);
    await this.validateUniqueWhatsapp(entry.whatsapp);
    await this.validateUniqueEmail(entry.email);

    return this.repository.create({
      ...entry,
      _id: id,
    });
  }

  async update(id: string, entry: Partial<Merchant>): Promise<Merchant> {
    await this.validateUniqueWhatsapp(entry.whatsapp, id);
    await this.validateUniqueEmail(entry.email, id);

    return this.repository.update(id, entry);
  }

  private async validateUniqueId(id: string): Promise<void> {
    const isUnique = await this.repository.isUnique("_id", id);

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "A merchant with the same name already exists"
      );
    }
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private async validateUniqueWhatsapp(
    whatsapp?: string,
    ignoreId?: string
  ): Promise<void> {
    if (!whatsapp) return;

    const isUnique = await this.repository.isUnique(
      "whatsapp",
      whatsapp,
      ignoreId
    );

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "WhatsApp number is already registered"
      );
    }
  }

  private async validateUniqueEmail(
    email?: string,
    ignoreId?: string
  ): Promise<void> {
    if (!email) return;

    const isUnique = await this.repository.isUnique("email", email, ignoreId);

    if (!isUnique) {
      throw new ApplicationError("taken", "Email is already registered");
    }
  }
}
