import sharp from 'sharp';

async function chromaKeyToPng(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < data.length; i += channels) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Green screen detection
    // Pure green is high G, and G significantly larger than R and B
    const maxRB = Math.max(r, b);
    const greenDiff = g - maxRB;

    let alpha = 255;
    if (g > 100 && greenDiff > 35) {
      if (greenDiff > 65) {
        alpha = 0; // completely transparent background
      } else {
        // Soft edge
        alpha = Math.floor((1 - (greenDiff - 35) / 30) * 255);
      }
    }

    // Green despill on soft edges: clamp G to maxRB if alpha < 255
    if (alpha < 255 && g > maxRB) {
      g = maxRB;
    }

    const outIdx = (i / channels) * 4;
    out[outIdx] = r;
    out[outIdx + 1] = g;
    out[outIdx + 2] = b;
    out[outIdx + 3] = alpha;
  }

  await sharp(out, {
    raw: { width, height, channels: 4 }
  })
  .trim()
  .png({ quality: 100 })
  .toFile(outputPath);

  console.log(`Saved pristine transparent PNG to ${outputPath}`);
}

async function main() {
  const maleGreen = '/Users/nguyenthien/.gemini/antigravity-ide/brain/c55312d8-0642-4cdd-abef-9d2185aea852/male_warrior_green_1786714294661.jpg';
  const femaleGreen = '/Users/nguyenthien/.gemini/antigravity-ide/brain/c55312d8-0642-4cdd-abef-9d2185aea852/female_warrior_green_1786714368736.jpg';

  const maleOut = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/public/game-battle/models/male_warrior_transparent.png';
  const femaleOut = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/public/game-battle/models/female_warrior_transparent.png';

  await chromaKeyToPng(maleGreen, maleOut);
  await chromaKeyToPng(femaleGreen, femaleOut);
  console.log('Finished creating transparent 3D sprites!');
}

main().catch(console.error);
