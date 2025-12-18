import { BaseEntity } from "./base.entity";

export interface ProductType extends BaseEntity {
  name: string;
  description: string;
}
