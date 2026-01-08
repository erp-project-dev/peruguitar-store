import { BaseSpecs } from "./base.specs";

export interface DigitalPedalboardSpecs extends BaseSpecs {
  processing_type: string | null;
  effects_count: number | null;
  amp_models: boolean | null;
  inputs: number | null;
  outputs: number | null;
  midi: boolean | null;
  expression_pedal: boolean | null;
  connectivity: string | null;
  power_type: string | null;
}
