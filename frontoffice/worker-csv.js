import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import logger from "./worker-logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.resolve(__dirname, "./app/db/store.json");
const metaDir = path.resolve(__dirname, "./public/.meta");
const outputFile = path.join(metaDir, "catalog.csv");

function escapeCSV(value = "") {
  return `"${String(value).replace(/"/g, '""')}"`;
}

(async () => {
  logger.start("Generate Catalog CSV");

  try {
    if (!fs.existsSync(sourceFile)) {
      throw new Error("store.json not found");
    }

    const storeRaw = fs.readFileSync(sourceFile, "utf8");
    const store = JSON.parse(storeRaw);

    const Catalog = Array.isArray(store.Catalog) ? store.Catalog : [];
    const Brands = Array.isArray(store.Brands) ? store.Brands : [];

    const brandMap = Object.fromEntries(
      Brands.map((b) => [b.id, b.name]).filter(([id]) => id)
    );

    const headers = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand",
    ];

    const conditionMap = {
      new: "new",
      like_new: "used",
    };

    const rows = Catalog.filter(
      (p) => p?.status === "available" && p?.price
    ).map((p) => {
      const image =
        Array.isArray(p.images) && p.images.length > 0
          ? `https://peruguitar.com/catalog/${p.images[0]}`
          : "";

      const row = {
        id: p.id,
        title: p.name || "",
        description: p.description || "",
        availability: "in stock",
        condition: conditionMap[p.condition] || "used",
        price: `${Number(p.price).toFixed(2)} ${p.currency || ""}`,
        link: `https://peruguitar.com/${p.id}`,
        image_link: image,
        brand: brandMap[p.brand_id] || "",
      };

      return headers.map((h) => escapeCSV(row[h])).join(",");
    });

    if (!fs.existsSync(metaDir)) {
      fs.mkdirSync(metaDir, { recursive: true });
    }

    const csv = [headers.join(","), ...rows].join("\n");
    fs.writeFileSync(outputFile, csv, "utf8");

    logger.success("catalog.csv generated successfully");
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }

  logger.end("Generate Catalog CSV");
})();
