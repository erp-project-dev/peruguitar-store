import { BaseSpecs } from "./base.specs";

export interface GuitarSpecs extends BaseSpecs {
  body_wood: string | null;
  body_finish: string | null;
  body_type: string | null;
  neck_wood: string | null;
  fingerboard_wood: string | null;
  scale_length_mm: number | null;
  number_of_strings: number | null;
  hand_orientation: "right" | "left" | null;
  bridge_type: string | null;
  pickups: string | null;
  hardware_color: string | null;
}
