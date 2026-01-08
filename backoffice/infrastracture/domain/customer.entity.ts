import { BaseEntity } from "./base.entity";

export type CustomerType = "individual" | "company";
export type TaxType = "dni" | "ruc" | "passport";

export interface Customer extends BaseEntity {
  type: CustomerType;

  tax_id?: string;
  tax_id_type?: TaxType;

  name: string;
  last_name?: string;

  country: string;
  state?: string;
  city?: string;

  phone?: string;
  email: string;
}
