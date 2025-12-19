import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { Setting } from "../domain/setting.entity";
import { SettingSchema } from "../schema/setting.schema";
import { RELEASE_DATE_KEY, RELEASE_VERSION_KEY } from "../shared/constants";

export class SettingService {
  private repository = new MongoRepository<Setting>("settings", SettingSchema);

  async findById(id: string): Promise<Setting> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<Setting[]> {
    return this.repository.findAll({
      _id: { $nin: [RELEASE_DATE_KEY, RELEASE_VERSION_KEY] },
    });
  }

  async create(entry: Setting): Promise<Setting> {
    this.assertNotSystemKey(entry._id);
    await this.validateUniqueId(entry._id);

    return this.repository.create(entry);
  }

  async update(id: string, entry: Partial<Setting>): Promise<Setting> {
    this.assertNotSystemKey(id);

    return this.repository.update(id, entry);
  }

  async remove(id: string): Promise<void> {
    this.assertNotSystemKey(id);

    return this.repository.delete(id);
  }

  private assertNotSystemKey(id: string): void {
    if (this.isReleaseKey(id)) {
      throw new ApplicationError(
        "forbidden",
        "This setting is system-managed and cannot be modified"
      );
    }
  }

  private isReleaseKey(id: string): boolean {
    return id === RELEASE_DATE_KEY || id === RELEASE_VERSION_KEY;
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
