export type CategoryId = "electric-guitar" | "book";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}
