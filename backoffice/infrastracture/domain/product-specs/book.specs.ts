import { BaseSpecs } from "./base.specs";

export interface BookSpecs extends BaseSpecs {
  language: string | null;
  author: string | null;
  publisher: string | null;
  pages: number | null;
  format: "hardcover" | "paperback" | "ebook" | null;
  isbn: string | null;
}
