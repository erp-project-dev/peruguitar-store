export interface GuitarSpecs {
  release_year: number;
  origin: string;

  body_wood: string;
  body_finish: string;
  body_type: string;

  neck_wood: string;
  fingerboard_wood: string;

  scale_length_mm: number;
  number_of_strings: number;

  hand_orientation: string;

  color: string | null;
  bridge_type: string | null;
  pickups: string | null;
  hardware_color: string | null;
}
