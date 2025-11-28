import { writeFileSync, existsSync, readFileSync } from "fs";
import path from "path";
import ora from "ora";
import { createCanvas, loadImage } from "canvas";

// Load DB
const db = JSON.parse(readFileSync("./data.json", "utf8"));
const Catalog = db.Catalog;

// Canvas config
const WIDTH = 1080;
const HEIGHT = 1920;
const BOX_HEIGHT = 520;
const MARGIN = 60;
const LINE_HEIGHT = 70;

// -------------------------------------------
// DRAW HELPERS
// -------------------------------------------

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

function drawPrice(ctx, price) {
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 80px sans-serif";

  const formatted = price.toLocaleString("es-PE", {
    currency: "PEN",
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

// -------------------------------------------
// CARD GENERATOR
// -------------------------------------------

async function generateCard(product) {
  const merchantId = product.merchant_id;

  const base = product.pic_1.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  const inputPath = `public/catalog/${merchantId}/${product.pic_1}`;
  const outputName = `${base}-card.jpg`;
  const outputPath = `public/catalog/${merchantId}/${outputName}`;

  const spinner = ora(`Generating card → ${product.id}`).start();

  try {
    if (!existsSync(inputPath)) {
      spinner.fail(`Image not found: ${inputPath}`);
      return;
    }

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    const img = await loadImage(path.resolve(inputPath));

    drawBackground(ctx, img);
    drawGradient(ctx);
    drawTitle(ctx, product.name);
    drawPrice(ctx, product.price);
    drawBrand(ctx);

    writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.9 }));

    // Save only filename
    product.card_pic = outputName;

    spinner.succeed(`Card regenerated: ${outputName}`);
  } catch (err) {
    spinner.fail(`Error generating card for ${product.id}`);
    console.error(err);
  }
}

// -------------------------------------------
// MAIN
// -------------------------------------------

(async () => {
  const items = Catalog.filter((p) => p.is_enabled);

  for (const product of items) {
    await generateCard(product);
  }

  writeFileSync("./data.json", JSON.stringify(db, null, 2));
  console.log("\n🎸 All cards regenerated and data.json updated.\n");
})();
