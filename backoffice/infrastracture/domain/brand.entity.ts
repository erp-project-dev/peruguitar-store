import { BaseEntity } from "./base.entity";
import { CategoryId } from "./category.entity";

export interface Brand extends BaseEntity {
  name: string;
  categories: CategoryId[];
}
