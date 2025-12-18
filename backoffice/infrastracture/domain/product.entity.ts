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

export interface Product {
  _id: string;

  category: string;

  brand_id: string;
  merchant_id: string;
  type_id: string;

  condition: string;
  condition_score: number;

  publish_date: string;

  name: string;
  model: string;
  description: string;

  currency: string;
  price: number;
  priceType: string;

  specs: GuitarSpecs;

  images: string[];

  is_enabled: boolean;
  is_pinned: boolean;
}
