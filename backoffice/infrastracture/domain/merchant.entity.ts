import { BaseEntity } from "./base.entity";

export interface Merchant extends BaseEntity {
  email: string;
  name: string;
  country: string;
  state: string;
  city: string;
  whatsapp: string;
  instagram?: string;
}
