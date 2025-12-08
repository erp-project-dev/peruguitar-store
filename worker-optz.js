import fs from "fs";
import path from "path";
import sharp from "sharp";
import logger from "./worker-logger.js";

const ROOT = "./public/catalog";
const OPTZ_RATIO = 0.05;
const SUPPORTED_EXT = ["jpg", "jpeg", "png"];

// -------------------------------
// HELPERS
// -------------------------------

function getExt(file) {
  return path.extname(file).toLowerCase().replace(".", "");
}

function isSupportedImage(file) {
  return SUPPORTED_EXT.includes(getExt(file));
}

function isCardVersion(file) {
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  return base.toLowerCase().endsWith("-card");
}

// -------------------------------
// OPTIMIZE ONE MERCHANT
// -------------------------------

async function optimizeMerchant(merchantPath, globalStats) {
  const merchant = path.basename(merchantPath);

  await logger.asyncBlock(merchant, async () => {
    const optimizedJsonPath = path.join(merchantPath, "optimized.json");

    let optimized = fs.existsSync(optimizedJsonPath)
      ? JSON.parse(fs.readFileSync(optimizedJsonPath, "utf8"))
      : [];

    const merchantStats = { optimized: 0, skipped: 0, errors: 0 };

    const files = fs.readdirSync(merchantPath);

    const targets = files.filter((file) => {
      const full = path.join(merchantPath, file);

      if (fs.statSync(full).isDirectory()) return false;
      if (!isSupportedImage(file)) return false;
      if (isCardVersion(file)) return false;
      if (optimized.includes(file)) return false;

      return true;
    });

    if (targets.length === 0) {
      logger.info("No images to optimize.");
      return;
    }

    for (const file of targets) {
      await optimizeImage(
        path.join(merchantPath, file),
        file,
        optimized,
        merchantStats
      );
    }

    fs.writeFileSync(
      optimizedJsonPath,
      JSON.stringify(optimized, null, 2),
      "utf8"
    );

    logger.info(
      `Summary → optimized: ${merchantStats.optimized}, skipped: ${merchantStats.skipped}, errors: ${merchantStats.errors}`
    );

    globalStats.optimized += merchantStats.optimized;
    globalStats.skipped += merchantStats.skipped;
    globalStats.errors += merchantStats.errors;
  });
}

// -------------------------------
// OPTIMIZE ONE IMAGE
// -------------------------------

async function optimizeImage(fullPath, fileName, optimizedList, stats) {
  try {
    const original = fs.readFileSync(fullPath);
    const originalSize = original.length;

    const ext = getExt(fileName);
    const compressor =
      ext === "png"
        ? sharp(original).png({ compressionLevel: 9 })
        : sharp(original).jpeg({ quality: 80, mozjpeg: true });

    const compressed = await compressor.toBuffer();
    const optimizedSize = compressed.length;

    const ratio = (originalSize - optimizedSize) / originalSize;
    const gain = (ratio * 100).toFixed(2) + "%";

    const nameCol = fileName.padEnd(42, " ");
    const gainCol = gain.padStart(7, " ");

    if (ratio < OPTZ_RATIO) {
      logger.info(`${nameCol}  SKIPPED    ${gainCol}`);
      stats.skipped++;
      return;
    }

    fs.writeFileSync(fullPath, compressed);
    optimizedList.push(fileName);

    logger.success(`${nameCol}  OPTIMIZED  ${gainCol}`);
    stats.optimized++;
  } catch (err) {
    logger.error(`Error optimizing ${fileName}: ${err.message}`);
    stats.errors++;
  }
}

// -------------------------------
// MAIN
// -------------------------------

(async () => {
  logger.start("Image Optimizer");

  const globalStats = { optimized: 0, skipped: 0, errors: 0 };
  const merchants = fs.readdirSync(ROOT);

  for (const merchant of merchants) {
    const merchantPath = path.join(ROOT, merchant);
    if (fs.statSync(merchantPath).isDirectory()) {
      await optimizeMerchant(merchantPath, globalStats);
    }
  }

  logger.block("Summary", () => {
    logger.info(`Total optimized: ${globalStats.optimized}`);
    logger.info(`Total skipped:   ${globalStats.skipped}`);
    logger.info(`Total errors:    ${globalStats.errors}`);
  });

  logger.end("Image Optimizer");
})();
