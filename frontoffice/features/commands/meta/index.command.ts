import DATA from "@/app/store";

import { Meta } from "@/features/types/meta.type";

export class MetalGetCommand {
  static handle(): Meta {
    return DATA.meta;
  }
}
