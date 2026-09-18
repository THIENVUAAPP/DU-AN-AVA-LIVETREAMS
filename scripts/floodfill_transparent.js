import sharp from 'sharp';

async function removeBackgroundFloodFill(inputPath, outputPath, tolerance = 28) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Visited array
  const visited = new Uint8Array(width * height);
  const isBg = new Uint8Array(width * height);

  // BFS Queue
  const queue = [];

  // Helper to get index
  const getIdx = (x, y) => y * width + x;

  // Check if pixel is background (near black)
  const isBlackPixel = (x, y) => {
    const pIdx = (y * width + x) * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];
    return Math.max(r, g, b) <= tolerance;
  };

  // Push all border pixels that are black
  for (let x = 0; x < width; x++) {
    if (isBlackPixel(x, 0)) { queue.push([x, 0]); visited[getIdx(x, 0)] = 1; isBg[getIdx(x, 0)] = 1; }
    if (isBlackPixel(x, height - 1)) { queue.push([x, height - 1]); visited[getIdx(x, height - 1)] = 1; isBg[getIdx(x, height - 1)] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isBlackPixel(0, y)) { queue.push([0, y]); visited[getIdx(0, y)] = 1; isBg[getIdx(0, y)] = 1; }
    if (isBlackPixel(width - 1, y)) { queue.push([width - 1, y]); visited[getIdx(width - 1, y)] = 1; isBg[getIdx(width - 1, y)] = 1; }
  }

  // BFS to fill all connected background from outside edges
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = getIdx(nx, ny);
        if (!visited[nIdx]) {
          visited[nIdx] = 1;
          if (isBlackPixel(nx, ny)) {
            isBg[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Build output buffer
  const outBuffer = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIdx(x, y);
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      outBuffer[dstIdx] = data[srcIdx];
      outBuffer[dstIdx + 1] = data[srcIdx + 1];
      outBuffer[dstIdx + 2] = data[srcIdx + 2];

      if (isBg[idx]) {
        outBuffer[dstIdx + 3] = 0; // Transparent
      } else {
        outBuffer[dstIdx + 3] = 255; // Solid inside character
      }
    }
  }

  await sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  })
  .trim()
  .png({ quality: 100 })
  .toFile(outputPath);

  console.log(`Successfully generated floodfill transparent sprite: ${outputPath}`);
}

async function run() {
  const maleInput = '/Users/nguyenthien/.gemini/antigravity-ide/brain/c55312d8-0642-4cdd-abef-9d2185aea852/male_warrior_3d_1786713897076.jpg';
  const femaleInput = '/Users/nguyenthien/.gemini/antigravity-ide/brain/c55312d8-0642-4cdd-abef-9d2185aea852/female_warrior_3d_1786713942455.jpg';

  const maleOutput = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/public/game-battle/models/male_warrior_transparent.png';
  const femaleOutput = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/public/game-battle/models/female_warrior_transparent.png';

  await removeBackgroundFloodFill(maleInput, maleOutput, 30);
  await removeBackgroundFloodFill(femaleInput, femaleOutput, 30);
}

run().catch(console.error);
