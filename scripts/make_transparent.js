import sharp from 'sharp';
import fs from 'fs';

async function processImage(inputPath, outputPath, blackThreshold = 18, softRange = 25) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const maxVal = Math.max(r, g, b);

    let alpha = 255;
    if (maxVal <= blackThreshold) {
      alpha = 0;
    } else if (maxVal < blackThreshold + softRange) {
      alpha = Math.floor(((maxVal - blackThreshold) / softRange) * 255);
    }

    const outIdx = (i / channels) * 4;
    outputBuffer[outIdx] = r;
    outputBuffer[outIdx + 1] = g;
    outputBuffer[outIdx + 2] = b;
    outputBuffer[outIdx + 3] = alpha;
  }

  // Trim transparent edges and save as PNG
  await sharp(outputBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .trim()
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Saved transparent sprite to ${outputPath}`);
}

async function main() {
  const maleInput = '/Users/nguyenthien/.gemini/antigravity-ide/brain/c55312d8-0642-4cdd-abef-9d2185aea852/male_warrior_3d_1786713897076.jpg';
  const femaleInput = '/Users/nguyenthien/.gemini/antigravity-ide/brain/c55312d8-0642-4cdd-abef-9d2185aea852/female_warrior_3d_1786713942455.jpg';

  const maleOutput = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/public/game-battle/models/male_warrior_transparent.png';
  const femaleOutput = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/public/game-battle/models/female_warrior_transparent.png';

  await processImage(maleInput, maleOutput, 15, 20);
  await processImage(femaleInput, femaleOutput, 15, 20);
  console.log('Finished generating transparent 3D sprites!');
}

main().catch(console.error);
