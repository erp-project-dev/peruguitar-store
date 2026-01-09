/* eslint-disable @typescript-eslint/no-explicit-any */
import { Customer } from "../domain/customer.entity";
import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { CustomerSchema } from "../schema/customer.schema";
import { ObjectId } from "mongodb";

type FindAllProps = {
  name?: string;
};

export class CustomerService {
  private repository = new MongoRepository<Customer>(
    "customers",
    CustomerSchema
  );

  async findById(id: string): Promise<Customer> {
    return this.repository.findById(id);
  }

  async findAll(query?: FindAllProps): Promise<Customer[]> {
    const filter: any = {};

    if (query) {
      filter.name = { $regex: query.name, $options: "i" };
    }

    return this.repository.findAll(filter);
  }

  async create(entry: Omit<Customer, "_id">): Promise<Customer> {
    const id = new ObjectId().toString();

    await this.validateUniqueTaxId(entry.tax_id);

    return this.repository.create({
      ...entry,
      _id: id,
    });
  }

  async update(id: string, entry: Partial<Customer>): Promise<Customer> {
    await this.validateUniqueTaxId(entry.tax_id, id);

    return this.repository.update(id, entry);
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private async validateUniqueTaxId(
    taxId?: string,
    ignoreId?: string
  ): Promise<void> {
    if (!taxId) return;

    const isUnique = await this.repository.isUnique("tax_id", taxId, ignoreId);

    if (!isUnique) {
      throw new ApplicationError("taken", "Tax ID is already registered");
    }
  }
}
