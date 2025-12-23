export type CategoryId = "electric-guitar" | "book" | "service";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}
