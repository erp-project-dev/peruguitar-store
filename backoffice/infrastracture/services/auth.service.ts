import crypto from "crypto";

import { User } from "../domain/user.entity";
import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { UserSchema } from "../schema/user.schema";

export class AuthService {
  private repository = new MongoRepository<User>("users", UserSchema);

  /**
   * ⚠️ DO NOT MODIFY THESE VALUES
   * These constants are part of the authentication and password hashing strategy.
   * Changing any of them WILL BREAK password verification
   * and will effectively invalidate all existing user passwords.
   */
  private readonly SCRYPT_KEYLEN = 64;
  private readonly SCRYPT_SALT_BYTES = 16;

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.repository.findOne({ email });

    if (!user || !user.enabled) {
      throw new ApplicationError("unauthorized", "Invalid credentials");
    }

    const isValid = this.comparePassword(password, user.password);

    if (!isValid) {
      throw new ApplicationError("unauthorized", "Invalid credentials");
    }

    return user;
  }

  private encryptPassword(password: string): string {
    const salt = crypto.randomBytes(this.SCRYPT_SALT_BYTES).toString("hex");

    const hash = crypto
      .scryptSync(password, salt, this.SCRYPT_KEYLEN)
      .toString("hex");

    return `${salt}:${hash}`;
  }

  private comparePassword(
    plainPassword: string,
    storedPassword: string
  ): boolean {
    const [salt, originalHash] = storedPassword.split(":");

    const hash = crypto
      .scryptSync(plainPassword, salt, this.SCRYPT_KEYLEN)
      .toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(originalHash, "hex")
    );
  }
}
