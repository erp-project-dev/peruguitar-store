import "dotenv/config";
import logger from "./worker-logger.js";

import { google } from "googleapis";
import { writeFileSync } from "fs";

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SPREADSHEET_ID } = process.env;

const EXCLUDED_COLUMNS = ["email"];

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

// -------------------------------------------
// EXTRA DATA FOR CATALOG
// -------------------------------------------
function addExtraInformation(sheetName, data) {
  if (sheetName !== "Catalog") return data;

  return data.map((item) => {
    const pic = item.pic_1;

    if (!pic || typeof pic !== "string") {
      return { ...item, card_pic: "" };
    }

    const lastDot = pic.lastIndexOf(".");
    const base = lastDot > 0 ? pic.substring(0, lastDot) : pic;
    const ext = lastDot > 0 ? pic.substring(lastDot) : "";

    return { ...item, card_pic: `${base}-card${ext}` };
  });
}

// -------------------------------------------
// SHEET READER
// -------------------------------------------
async function _readSheet(sheetName) {
  let data;

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

      data = dataRows.map((row) =>
        Object.fromEntries(
          allowedHeaders.map(([header, colIndex]) => [
            header,
            normalizeValue(row[colIndex]),
          ])
        )
      );

      data = addExtraInformation(sheetName, data);

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
      Merchants: await _readSheet("Merchants"),
      Catalog: await _readSheet("Catalog"),
      Settings: await _readSheet("Settings"),
    };

    createDataJson(result);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }

  logger.end("Sheets Reader");
})();
