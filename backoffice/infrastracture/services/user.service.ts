import { User } from "../domain/user.entity";
import { MongoRepository } from "../repositories/mongo.repository";
import { UserSchema } from "../schema/user.schema";
import { getAuthUser } from "../helpers/auth.helper";

export class UserService {
  private repository = new MongoRepository<User>("users", UserSchema);

  async me(): Promise<User | null> {
    const userFromCookie = await getAuthUser();

    if (!userFromCookie) {
      return null;
    }

    return this.repository.findById(userFromCookie.id);
  }
}
