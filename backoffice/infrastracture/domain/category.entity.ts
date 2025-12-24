import { BaseEntity } from "./base.entity";

export type CategoryId = "electric-guitar" | "book" | "lesson";

export interface Category extends BaseEntity {
  _id: CategoryId;
  parent_id: string | null;
  name: string;
  description: string;
}
