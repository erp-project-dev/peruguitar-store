import fs from "fs";
import path from "path";

import logger from "./worker-logger.js";

const sourceFile = path.resolve("./app/db/store.json");
const outputFile = path.resolve("./public/.meta/catalog.csv");

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

    const { Catalog = [], Brands = [] } = store;

    if (!Array.isArray(Catalog)) {
      throw new Error("Invalid catalog structure");
    }

    const brandMap = Object.fromEntries(Brands.map((b) => [b.id, b.name]));

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

    const rows = Catalog.filter((p) => p.status === "available" && p.price).map(
      ({
        id,
        name,
        description,
        condition,
        price,
        currency,
        images,
        brand_id,
      }) => {
        const row = {
          id,
          title: name,
          description,
          availability: "in stock",
          condition: conditionMap[condition] || "used",
          price: `${price.toFixed(2)} ${currency}`,
          link: `https://peruguitar.com/${id}`,
          image_link: `https://peruguitar.com/catalog/${images[0]}`,
          brand: brandMap[brand_id] || "",
        };

        return headers.map((h) => escapeCSV(row[h])).join(",");
      }
    );

    const csv = [headers.join(","), ...rows].join("\n");

    fs.writeFileSync(outputFile, csv, "utf8");

    logger.success("catalog.csv generated successfully");
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }

  logger.end("Generate Catalog CSV");
})();
