import { BaseEntity } from "./base.entity";

export interface Review extends BaseEntity {
  order_id: string;

  product_id: string;
  product_name: string;

  customer_id: string;
  customer_name: string;

  comment: string;
  rating: number;

  review_date: string;
}

export interface ProductReview {
  order_id: string;

  product_id: string;
  product_name: string;

  customer_id: string;
  customer_name: string;
}
