import "dotenv/config";

import logger from "./worker-logger.js";
import { writeFileSync } from "fs";
import { MongoClient } from "mongodb";

const { MONGODB_URI, MONGODB_DB } = process.env;

const EXCLUDED_COLUMNS = ["email"];

const Collections = {
  MERCHANTS: "merchants",
  CATALOG: "catalog",
  BRANDS: "brands",
  TYPES: "types",
  SETTINGS: "settings",
};

// -------------------------------------------
// HELPERS
// -------------------------------------------
function stripExcludedFields(doc) {
  const clean = {};

  for (const [key, value] of Object.entries(doc)) {
    if (!EXCLUDED_COLUMNS.includes(key)) {
      clean[key] = value;
    }
  }

  return clean;
}

async function readCollection(db, name, filter = {}) {
  logger.info(`Reading collection: ${name}`);

  const docs = await db.collection(name).find(filter).toArray();

  return docs.map((doc) => {
    const { _id, ...rest } = doc;

    return stripExcludedFields({
      id: _id,
      ...rest,
    });
  });
}

// -------------------------------------------
// JSON WRITER
// -------------------------------------------
function createDataJson(result) {
  writeFileSync("data.json", JSON.stringify(result, null, 2), "utf8");
  logger.success("data.json created successfully");
}

// -------------------------------------------
// MAIN
// -------------------------------------------
(async () => {
  logger.start("DB Reader");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    logger.success("Connected to MongoDB");

    const db = client.db(MONGODB_DB);

    const result = {
      Merchants: await readCollection(db, Collections.MERCHANTS),
      Catalog: await readCollection(db, Collections.CATALOG, {
        is_enabled: true,
      }),
      Brands: await readCollection(db, Collections.BRANDS),
      Types: await readCollection(db, Collections.TYPES),
      Settings: await readCollection(db, Collections.SETTINGS),
    };

    createDataJson(result);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  } finally {
    await client.close();
  }

  logger.end("DB Reader");
})();
