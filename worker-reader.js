import "dotenv/config";
import logger from "./worker-logger.js";

import { google } from "googleapis";
import { writeFileSync } from "fs";

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SPREADSHEET_ID } = process.env;

const EXCLUDED_COLUMNS = ["email"];

import { z } from "zod";

const SHEET_NAMES = {
  MERCHANTS: "Merchants",
  CATALOG: "Catalog",
  BRANDS: "Brands",
  SETTINGS: "Settings",
};

const SCHEMA = {
  [SHEET_NAMES.MERCHANTS]: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    last_name: z.string().min(1),
    country: z.string().min(1),
    state: z.string().min(1),
    city: z.string().min(1),
    whatsapp: z.number().int().min(100000000).max(999999999),
    instagram: z.string().url().optional().or(z.literal("")),
  }),

  [SHEET_NAMES.BRANDS]: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
  }),

  [SHEET_NAMES.CATALOG]: z.object({
    id: z.string().min(1),
    category: z.string().min(1),
    name: z.string().min(1),
    brand: z.string().min(1),
    model: z.string().min(1),
    status: z.string().min(1),
    status_score: z.number().int().min(1).max(5),
    description: z.string().min(1),
    specs: z.object({
      release_year: z.number().int().nullable(),
      origin: z.string().nullable(),
      body_wood: z.string().nullable(),
      body_finish: z.string().nullable(),
      body_type: z.string().nullable(),
      neck_wood: z.string().nullable(),
      fingerboard_wood: z.string().nullable(),
      scale_length_mm: z.number().nullable(),
      number_of_strings: z.number().int().nullable(),
      hand_orientation: z.string().nullable(),
      color: z.string().nullable(),
      bridge_type: z.string().nullable(),
      pickups: z.string().nullable(),
      hardware_color: z.string().nullable(),
    }),

    pic_1: z.string().optional(),
    pic_2: z.string().optional(),
    pic_3: z.string().optional(),
    pic_4: z.string().optional(),
    pic_5: z.string().optional(),
    pic_6: z.string().optional(),
    currency: z.enum(["PEN", "USD"]),
    price: z.number().positive(),
    priceType: z.enum(["fixed", "negotiable"]),
    publish_date: z.string().min(1),
    is_pinned: z.boolean(),
    is_enabled: z.boolean(),
    merchant_id: z.string().min(1),
  }),

  [SHEET_NAMES.SETTINGS]: z.object({
    id: z.string().min(1),
    value: z.union([z.string(), z.number(), z.boolean()]),
    comment: z.string().optional(),
  }),
};

const SCHEMA_UNIQUES = {
  [SHEET_NAMES.MERCHANTS]: ["id", "whatsapp"],
  [SHEET_NAMES.BRANDS]: ["id"],
  [SHEET_NAMES.CATALOG]: ["id"],
  [SHEET_NAMES.SETTINGS]: ["id"],
};

// -------------------------------------------
// GOOGLE AUTH
// -------------------------------------------
function _getAuth() {
  return new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

// -------------------------------------------
// NORMALIZACIÓN
// -------------------------------------------
function tryParseDate(value) {
  const [year, month, day] = value.split("/").map(Number);
  const utcDate = Date.UTC(year, month - 1, day, 5, 0, 0);
  return new Date(utcDate).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function tryParseJson(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();

  const isJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"));

  if (!isJson) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function normalizeValue(value) {
  if (value === undefined || value === "") return "";

  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(value)) return tryParseDate(value);
  if (!isNaN(Number(value))) return Number(value);

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }

  const parsed = tryParseJson(value);
  return parsed !== value ? parsed : value;
}

function validateEntry(schema, entry) {
  const result = SCHEMA[schema].safeParse(entry);

  if (!result.success) {
    logger.error(`Invalid entry in sheet ${schema}`, result.error.issues);
    process.exit(1);
  }
}

const _UNIQUES = Object.fromEntries(
  Object.entries(SCHEMA_UNIQUES).map(([sheet, fields]) => [
    sheet,
    Object.fromEntries(fields.map((field) => [field, new Set()])),
  ])
);

function validateUnique(schema, field, value) {
  const set = _UNIQUES[schema]?.[field];

  if (!set) return;

  if (set.has(value)) {
    logger.error(`Duplicate entry for ${schema}.${field}: ${value}`);
    process.exit(1);
  }

  set.add(value);
}

// -------------------------------------------
// SHEET READER
// -------------------------------------------
async function _readSheet(sheetName) {
  const data = [];

  await logger.asyncBlock(sheetName, async () => {
    const sheets = google.sheets({ version: "v4", auth: _getAuth() });

    try {
      logger.info(`Reading sheet...`);

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!B2:Z`,
      });

      const rows = res.data.values || [];

      const rawHeaders = rows[0] || [];
      const dataRows = rows.slice(1);
      const recordCount = dataRows.length;

      logger.info(`Headers detected: ${rawHeaders.length}`);
      logger.info(`Raw rows loaded: ${recordCount}`);

      if (recordCount === 0) {
        logger.warn(`No data found`);
        return [];
      }

      const allowedHeaders = rawHeaders
        .map((h, i) => [h, i])
        .filter(([header]) => !EXCLUDED_COLUMNS.includes(header.toLowerCase()));

      for (const row of dataRows) {
        const entry = Object.fromEntries(
          allowedHeaders.map(([header, colIndex]) => [
            header,
            normalizeValue(row[colIndex]),
          ])
        );

        validateEntry(sheetName, entry);

        SCHEMA_UNIQUES[sheetName].forEach((uniqueField) => {
          validateUnique(sheetName, uniqueField, entry[uniqueField], data);
        });

        data.push(entry);
      }

      logger.success(`Loaded ${data.length} records`);
    } catch (err) {
      logger.error(`Error loading: ${err.message}`);
      throw err;
    }
  });

  return data ?? [];
}

// -------------------------------------------
// JSON WRITER
// -------------------------------------------
function createDataJson(result) {
  writeFileSync("data.json", JSON.stringify(result, null, 2));
  logger.success("data.json created successfully");
}

// -------------------------------------------
// MAIN
// -------------------------------------------
(async () => {
  logger.start("Sheets Reader");

  try {
    const result = {
      Merchants: await _readSheet(SHEET_NAMES.MERCHANTS),
      Catalog: await _readSheet(SHEET_NAMES.CATALOG),
      Brands: await _readSheet(SHEET_NAMES.BRANDS),
      Settings: await _readSheet(SHEET_NAMES.SETTINGS),
    };

    createDataJson(result);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }

  logger.end("Sheets Reader");
})();
