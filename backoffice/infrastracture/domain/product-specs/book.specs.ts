export interface BookSpecs {
  release_year: number | null;
  language: string | null;
  author: string | null;
  publisher: string | null;
  pages: number | null;
  format: "hardcover" | "paperback" | "ebook" | null;
  isbn: string | null;
}
