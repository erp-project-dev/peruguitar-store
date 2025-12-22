import { BaseEntity } from "./base.entity";

export type CategoryId = "electric-guitar" | "book";

export interface Category extends BaseEntity {
  _id: CategoryId;
  name: string;
  description: string;
}
