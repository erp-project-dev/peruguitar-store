import fs from "fs";
import path from "path";
import sharp from "sharp";
import ora from "ora";

const ROOT = "./public/catalog";
const OPTZ_RATIO = 0.05;

async function optimizeMerchant(merchantPath) {
  const merchant = path.basename(merchantPath);
  console.log(`\n📁 Optimizing images for ${merchant}...\n`);

  const optimizedJsonPath = path.join(merchantPath, "optimized.json");
  let optimized = fs.existsSync(optimizedJsonPath)
    ? JSON.parse(fs.readFileSync(optimizedJsonPath, "utf8"))
    : {};

  const files = fs.readdirSync(merchantPath);

  for (const file of files) {
    const full = path.join(merchantPath, file);

    if (fs.statSync(full).isDirectory()) continue;
    if (!/\.jpe?g$/i.test(file)) continue;
    if (file.toLowerCase().endsWith("-card.jpg")) continue;
    if (optimized[file]) continue;

    await optimizeImage(full, file, optimized);
  }

  fs.writeFileSync(optimizedJsonPath, JSON.stringify(optimized, null, 2));
}

async function optimizeImage(fullPath, fileName, optimizedStore) {
  const spinner = ora(`Processing: ${fileName}`).start();

  try {
    const original = fs.readFileSync(fullPath);
    const originalSize = original.length;

    const optimized = await sharp(original)
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    const optimizedSize = optimized.length;
    const ratio = (originalSize - optimizedSize) / originalSize;

    if (ratio < OPTZ_RATIO) {
      spinner.info(`${fileName} → Skipped (${(ratio * 100).toFixed(2)}% gain)`);
      return;
    }

    fs.writeFileSync(fullPath, optimized);
    optimizedStore[fileName] = true;

    spinner.succeed(
      `${fileName} optimized → ${(ratio * 100).toFixed(2)}% smaller`
    );
  } catch (err) {
    spinner.fail(`ERROR: ${fileName}`);
    console.error(err);
  }
}

(async () => {
  console.log("\n🎸 Starting Image Optimizer...\n");

  const merchants = fs.readdirSync(ROOT);

  for (const merchant of merchants) {
    const merchantPath = path.join(ROOT, merchant);
    if (fs.statSync(merchantPath).isDirectory()) {
      await optimizeMerchant(merchantPath);
    }
  }

  console.log("\n✅ Optimization finished.\n");
})();
