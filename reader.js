import "dotenv/config";

import { google } from "googleapis";
import { writeFileSync } from "fs";
import ora from "ora";

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SPREADSHEET_ID } = process.env;

const EXCLUDED_COLUMNS = ["email"];

function _getAuth() {
  return new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

function tryParseDate(value) {
  const [year, month, day] = value.split("/").map(Number);

  const utcDate = Date.UTC(year, month - 1, day, 5, 0, 0);

  return new Date(utcDate).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function tryParseJson(value) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  const looksLikeJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"));

  if (!looksLikeJson) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function normalizeValue(value) {
  if (value === undefined || value === "") return "";

  const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;

  if (dateRegex.test(value)) return tryParseDate(value);
  if (!isNaN(Number(value))) return Number(value);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;

  const jsonParsed = tryParseJson(value);
  if (jsonParsed !== value) return jsonParsed;

  return value;
}

async function _readSheet(sheetName) {
  const spinner = ora(`Fetching sheet: ${sheetName}`).start();
  const sheets = google.sheets({ version: "v4", auth: _getAuth() });

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!B2:Z`,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      spinner.warn(`No data in ${sheetName}`);
      return [];
    }

    const rawHeaders = rows[0];
    const allowedHeaders = rawHeaders
      .map((h, i) => [h, i])
      .filter(([header]) => !EXCLUDED_COLUMNS.includes(header.toLowerCase()));

    const data = rows.slice(1).map((row) =>
      Object.fromEntries(
        allowedHeaders.map(([header, colIndex]) => {
          const value = row[colIndex];
          const normalized = normalizeValue(value);
          return [header, normalized];
        })
      )
    );

    spinner.succeed(`Done: ${sheetName}`);
    return data;
  } catch (err) {
    spinner.fail(`Error fetching ${sheetName}`);
    throw err;
  }
}

function createDataJson(result) {
  writeFileSync("data.json", JSON.stringify(result, null, 2));
}

(async () => {
  try {
    const result = {
      Merchants: await _readSheet("Merchants"),
      Catalog: await _readSheet("Catalog"),
      Settings: await _readSheet("Settings"),
    };

    createDataJson(result);
    console.log("📁 data.json created successfully.");
  } catch (err) {
    console.error("❌ Error reading sheet:", err.message);
    process.exit(1);
  }
})();
