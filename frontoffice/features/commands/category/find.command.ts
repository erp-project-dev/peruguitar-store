import DATA from "@/app/store";
import { Category } from "@/features/types/category.type";

export class CategoryFindCommand {
  static handle(id: string): Category | null {
    const { Categories } = DATA;
    return Categories.find((c) => c.id === id) ?? null;
  }
}
