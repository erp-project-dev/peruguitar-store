import { BaseEntity } from "./base.entity";

type UserRole = "admin" | "editor";

export interface User extends BaseEntity {
  name: string;
  last_name: string;

  email: string;
  password: string;

  role: UserRole;

  enabled: boolean;

  last_login_at?: Date;
}
