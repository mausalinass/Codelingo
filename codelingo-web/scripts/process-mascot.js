import sharp from "sharp";
import path from "path";

async function processMascot() {
  const inputPath = path.resolve("./public/louis.jpg");
  const publicDir = path.resolve("./public");
  const assetsDir = path.resolve("./src/assets");

  // Read raw image buffer
  const image = sharp(inputPath);
  const { width, height, channels } = await image.metadata();

  console.log(`Original image dimensions: ${width}x${height}, channels: ${channels}`);

  // Get raw RGBA buffer
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  const outputData = Buffer.from(data);

  // Background teal color reference from (10, 10)
  const refR = data[0];
  const refG = data[1];
  const refB = data[2];

  console.log(`Sampled background color at (0,0): RGB(${refR}, ${refG}, ${refB})`);

  // Target teal color range:
  // Teal has high G and B relative to R (R is low ~19, G is ~159, B is ~143)
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Distance in color space to background teal
    const dr = r - refR;
    const dg = g - refG;
    const db = b - refB;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    // Also check if pixel is predominantly teal (G > 100, B > 90, R < 70)
    const isTealHue = g > 90 && b > 80 && r < 90 && g > r * 1.5;

    if (dist < 45 || isTealHue) {
      if (dist < 25) {
        outputData[idx + 3] = 0; // completely transparent
      } else {
        // smooth feathering edge
        const alpha = Math.min(255, Math.max(0, Math.round(((dist - 25) / 20) * 255)));
        outputData[idx + 3] = alpha;
      }
    }
  }

  // Save transparent mascot PNG
  await sharp(outputData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(path.join(publicDir, "louis-transparent.png"));

  await sharp(outputData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(path.join(assetsDir, "louis-transparent.png"));

  console.log("Saved louis-transparent.png!");

  // Create square App Logo (circular cropped headshot)
  await sharp(inputPath)
    .extract({ left: 300, top: 120, width: 480, height: 480 })
    .resize(256, 256)
    .png()
    .toFile(path.join(publicDir, "logo.png"));

  await sharp(inputPath)
    .extract({ left: 300, top: 120, width: 480, height: 480 })
    .resize(256, 256)
    .png()
    .toFile(path.join(assetsDir, "logo.png"));

  console.log("Saved logo.png!");
}

processMascot().catch(console.error);
