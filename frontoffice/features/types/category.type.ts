export type CategoryId = "electric-guitar" | "book" | "service";

export interface Category {
  id: CategoryId;
  parent_id: string | null;
  name: string;
  description: string;
}
