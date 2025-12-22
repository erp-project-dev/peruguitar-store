export interface GuitarSpecs {
  release_year: number | null;
  origin: string | null;

  body_wood: string | null;
  body_finish: string | null;
  body_type: string | null;

  neck_wood: string | null;
  fingerboard_wood: string | null;

  scale_length_mm: number | null;
  number_of_strings: number | null;

  hand_orientation: "right" | "left" | null;

  color: string | null;
  bridge_type: string | null;
  pickups: string | null;
  hardware_color: string | null;
}

export interface BookSpecs {
  release_year: number | null;
  language: string | null;

  author: string | null;
  publisher: string | null;

  pages: number | null;
  format: "hardcover" | "paperback" | "ebook" | null;

  isbn: string | null;
}
