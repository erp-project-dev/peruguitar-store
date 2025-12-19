import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { Setting } from "../domain/setting.entity";
import { SettingSchema } from "../schema/setting.schema";

export class SettingService {
  private repository = new MongoRepository<Setting>("settings", SettingSchema);

  async findById(id: string): Promise<Setting> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<Setting[]> {
    return this.repository.findAll({
      isPrivate: { $eq: false },
    });
  }

  async create(entry: Setting): Promise<Setting> {
    await this.validateUniqueId(entry._id);

    return this.repository.create({ ...entry, isPrivate: false });
  }

  async update(id: string, entry: Partial<Setting>): Promise<Setting> {
    return this.repository.update(id, { ...entry });
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private async validateUniqueId(id: string): Promise<void> {
    const isUnique = await this.repository.isUnique("_id", id);

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "A setting with the same name already exists"
      );
    }
  }
}
