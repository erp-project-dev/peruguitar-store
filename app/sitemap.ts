export const dynamic = "force-static";

import type { MetadataRoute } from "next";

import { CatalogGetCommand } from "./commands/catalog/index.command";
import { getBasePath } from "./helpers/path.helper";

export default function sitemap(): MetadataRoute.Sitemap {
  const { items } = CatalogGetCommand.handle({ sort: "latest" });

  return items.map((item) => ({
    url: getBasePath(item.id),
    lastModified: item.publishDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
