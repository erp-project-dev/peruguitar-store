export interface Review {
  id: string;

  order_id: string;

  product_id: string;
  product_name: string;

  customer_id: string;
  customer_name: string;

  comment: string;
  rating: number;

  review_date: string;
}
