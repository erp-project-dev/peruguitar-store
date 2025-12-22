import { BaseEntity } from "./base.entity";
import { CategoryId } from "./category.entity";

export interface ProductType extends BaseEntity {
  name: string;
  description: string;
  category_id: CategoryId;
}
