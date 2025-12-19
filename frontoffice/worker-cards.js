import { writeFileSync, existsSync, readFileSync } from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";
import logger from "./worker-logger.js";

// Load DB
const dbPath = "./app/db/store.json";
const db = JSON.parse(readFileSync(dbPath, "utf8"));
const Catalog = db.Catalog;

// Canvas config
const WIDTH = 1080;
const HEIGHT = 1920;
const BOX_HEIGHT = 520;
const MARGIN = 60;
const LINE_HEIGHT = 70;

// DRAW HELPERS
function drawBackground(ctx, img) {
  const aspectImg = img.width / img.height;
  const aspectCanvas = WIDTH / HEIGHT;
  let w = WIDTH,
    h = HEIGHT,
    x = 0,
    y = 0;

  if (aspectImg > aspectCanvas) {
    w = HEIGHT * aspectImg;
    x = (WIDTH - w) / 2;
  } else {
    h = WIDTH / aspectImg;
    y = (HEIGHT - h) / 2;
  }

  ctx.drawImage(img, x, y, w, h);
}

function drawGradient(ctx) {
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(0, HEIGHT - BOX_HEIGHT, WIDTH, BOX_HEIGHT);

  const fade = ctx.createLinearGradient(
    0,
    HEIGHT - BOX_HEIGHT,
    0,
    HEIGHT - BOX_HEIGHT - 200
  );

  fade.addColorStop(0, "rgba(0,0,0,0.65)");
  fade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fade;

  ctx.fillRect(0, HEIGHT - BOX_HEIGHT - 200, WIDTH, 200);
}

function drawTitle(ctx, text) {
  ctx.fillStyle = "white";
  ctx.font = "bold 60px sans-serif";

  const words = text.split(" ");
  const lines = [];
  let row = [];

  for (const w of words) {
    row.push(w);
    if (row.length === 4) {
      lines.push(row.join(" "));
      row = [];
    }
  }

  if (row.length) lines.push(row.join(" "));

  const startY = HEIGHT - 300;

  lines.forEach((line, i) =>
    ctx.fillText(line, MARGIN, startY + i * LINE_HEIGHT)
  );
}

function drawPrice(ctx, currency, price) {
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 80px sans-serif";

  const formatted = price.toLocaleString("es-PE", {
    currency,
    style: "currency",
    minimumFractionDigits: 0,
  });

  ctx.fillText(formatted, MARGIN, HEIGHT - 400);
}

function drawBrand(ctx) {
  ctx.textAlign = "right";
  ctx.fillStyle = "white";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("peruguitar.com", WIDTH - MARGIN, HEIGHT - 120);

  ctx.fillStyle = "rgba(230,230,230,0.92)";
  ctx.font = "italic 32px sans-serif";
  ctx.fillText(
    "Marketplace exclusivo de guitarras",
    WIDTH - MARGIN,
    HEIGHT - 75
  );

  ctx.textAlign = "left";
}

// CARD GENERATOR (always overwrites)
async function generateCard(product, stats) {
  const merchantId = product.merchant_id;
  const pic = product.images[0];

  const inputPath = path.join("public/catalog", merchantId, pic);
  const lastDot = pic.lastIndexOf(".");
  const base = lastDot > 0 ? pic.slice(0, lastDot) : pic;
  const ext = lastDot > 0 ? pic.slice(lastDot) : "";

  const outputName = `${base}-card${ext}`;
  const outputPath = path.join("public/catalog", merchantId, outputName);

  const nameCol = outputName.padEnd(60, " ");

  try {
    if (!existsSync(inputPath)) {
      logger.error(`${nameCol} ERROR (image not found)`);
      stats.errors++;
      return;
    }

    // Always generate → overwrite
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");
    const img = await loadImage(path.resolve(inputPath));

    drawBackground(ctx, img);
    drawGradient(ctx);
    drawTitle(ctx, product.name);
    drawPrice(ctx, product.currency, product.price);
    drawBrand(ctx);

    writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.9 }));

    // Update product card pic in DB
    product.card_pic = outputName;

    logger.success(`${nameCol} CREATED`);
    stats.created++;
  } catch (err) {
    logger.error(`${nameCol} ERROR (${err.message})`);
    stats.errors++;
  }
}

// MAIN EXECUTION
(async () => {
  logger.start("Cards Generator");

  const grouped = {};
  const globalStats = { created: 0, errors: 0 };

  // Group products by merchant
  for (const product of Catalog) {
    if (!product.is_enabled) continue;
    const m = product.merchant_id;
    if (!grouped[m]) grouped[m] = [];
    grouped[m].push(product);
  }

  for (const merchantId of Object.keys(grouped)) {
    const merchantStats = { created: 0, errors: 0 };

    await logger.asyncBlock(merchantId, async () => {
      for (const product of grouped[merchantId]) {
        await generateCard(product, merchantStats);
      }

      logger.info(
        `Summary → created: ${merchantStats.created}, errors: ${merchantStats.errors}`
      );

      globalStats.created += merchantStats.created;
      globalStats.errors += merchantStats.errors;
    });
  }

  writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");

  logger.block("Summary", () => {
    logger.info(`Total created: ${globalStats.created}`);
    logger.info(`Total errors: ${globalStats.errors}`);
  });

  logger.end("Cards Generator");
})();
