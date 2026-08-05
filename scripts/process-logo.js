/**
 * Remove near-white/ivory background from logo → transparent PNG.
 * Also normalize logo brown toward brand espresso #3D2B22.
 */
const sharp = require("sharp");
const path = require("path");

const OUTPUT = path.join(__dirname, "../public/logo-transparent.png");
const BACKUP = path.join(__dirname, "../public/logo-original.png");
const INPUT_CANDIDATES = [
  path.join(__dirname, "../public/logo-original.png"),
  path.join(__dirname, "../public/logo.png"),
];


// Brand espresso
const TARGET = { r: 61, g: 43, b: 34 }; // #3D2B22

async function run() {
  const fs = require("fs");
  const INPUT = INPUT_CANDIDATES.find((p) => fs.existsSync(p));
  if (!INPUT) throw new Error("No logo input found");

  const image = sharp(INPUT);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (INPUT.endsWith("logo.png") && !fs.existsSync(BACKUP)) {
    await sharp(INPUT).toFile(BACKUP);
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Treat light/off-white pixels as background
    const brightness = (r + g + b) / 3;
    const isNearWhite = brightness > 230 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25;

    if (isNearWhite) {
      data[i + 3] = 0;
      continue;
    }

    // Soft edge: mid-light pixels get partial alpha
    if (brightness > 200) {
      const t = (brightness - 200) / 55;
      data[i + 3] = Math.round(255 * (1 - t));
    }

    // Recolor dark/brown logo ink toward espresso while keeping luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    if (luminance < 180 && data[i + 3] > 20) {
      // blend original toward espresso based on darkness
      const strength = Math.min(1, (180 - luminance) / 140);
      data[i] = Math.round(r * (1 - strength * 0.65) + TARGET.r * strength * 0.65);
      data[i + 1] = Math.round(g * (1 - strength * 0.65) + TARGET.g * strength * 0.65);
      data[i + 2] = Math.round(b * (1 - strength * 0.65) + TARGET.b * strength * 0.65);
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(OUTPUT);

  console.log("Logo processed → transparent + espresso-tuned:", OUTPUT);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
