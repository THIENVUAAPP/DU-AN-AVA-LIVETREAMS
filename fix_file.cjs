const fs = require('fs');
let content = fs.readFileSync('src/lib/danceFloorData.js', 'utf8');

// Remove "...EXTENDED_SOUND_SUGGESTIONS,"
content = content.replace('  ...EXTENDED_SOUND_SUGGESTIONS,\n', '');

// Extract EXTENDED_SOUND_SUGGESTIONS block
const blockMatch = content.match(/export const EXTENDED_SOUND_SUGGESTIONS = \{([\s\S]*?)\};\n/);
if (blockMatch) {
  const blockContent = blockMatch[1];
  // Remove it from the bottom
  content = content.replace(blockMatch[0], '');
  // Insert it inside SOUND_DANCE_SUGGESTIONS
  content = content.replace('export const SOUND_DANCE_SUGGESTIONS = {\n', 'export const SOUND_DANCE_SUGGESTIONS = {\n' + blockContent);
}

fs.writeFileSync('src/lib/danceFloorData.js', content);
