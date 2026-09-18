const fs = require('fs');

// Generate 100 diverse characters
const archetypes = [
  { prefix: 'dj', name: 'DJ', avatar: 'avataaars', gradient: 'from-purple-500 to-indigo-600' },
  { prefix: 'dancer', name: 'Dancer', avatar: 'micah', gradient: 'from-pink-500 to-rose-500' },
  { prefix: 'street', name: 'Street', avatar: 'croodles', gradient: 'from-yellow-400 to-orange-500' },
  { prefix: 'cyber', name: 'Cyber', avatar: 'bottts', gradient: 'from-cyan-400 to-blue-500' },
  { prefix: 'animal', name: 'Animal', avatar: 'fun-emoji', gradient: 'from-green-400 to-emerald-600' },
  { prefix: 'vip', name: 'VIP', avatar: 'adventurer', gradient: 'from-amber-300 to-yellow-600' },
  { prefix: 'idol', name: 'Idol', avatar: 'lorelei', gradient: 'from-fuchsia-400 to-pink-600' },
  { prefix: 'rapper', name: 'Rapper', avatar: 'avataaars', gradient: 'from-red-500 to-orange-600' },
  { prefix: 'magic', name: 'Magic', avatar: 'pixel-art', gradient: 'from-violet-500 to-purple-700' },
  { prefix: 'ninja', name: 'Ninja', avatar: 'adventurer-neutral', gradient: 'from-slate-600 to-black' },
];

const characters = [];
for (let i = 1; i <= 100; i++) {
  const arch = archetypes[i % archetypes.length];
  const charId = `${arch.prefix}_${i}`;
  const name = `${arch.name} ${i}`;
  characters.push(`  {
    id: "${charId}", name: "${name}", callNames: ["${arch.name.toLowerCase()}", "bot ${i}"],
    avatar: "https://api.dicebear.com/7.x/${arch.avatar}/svg?seed=${charId}",
    isSessionOnly: false, tier: "${i % 15 === 0 ? 'vip' : 'normal'}",
    gradient: "${arch.gradient}",
  }`);
}

// Generate 100 Dances
const dancePrefixes = ['Vinahouse', 'Hiphop', 'Bar Club', 'Pop', 'Breakdance', 'Salsa', 'Tiktok Trend', 'Shuffle', 'Kpop', 'DJ Remix'];
const danceMoves = ['Quẩy', 'Lắc Hông', 'Xoay Vòng', 'Nhún Nhảy', 'Popping', 'Locking', 'Moonwalk', 'Vẫy Tay', 'Nhảy Cao', 'Trượt'];

const dances = [];
for (let i = 1; i <= 100; i++) {
  const prefix = dancePrefixes[i % dancePrefixes.length];
  const move = danceMoves[Math.floor(i / 10) % danceMoves.length];
  const name = `${prefix} ${move} ${i}`;
  // Map to one of the 14 base CSS animations for 2D, but we'll also have 100 cases in 3D.
  // Actually, we'll assign unique IDs like "dance_auto_1" to "dance_auto_100".
  const baseClasses = ['animate-dance-bounce', 'animate-dance-groove', 'animate-dance-spin', 'animate-dance-jump', 'animate-dance-wave', 'animate-dance-shuffle', 'animate-dance-floss', 'animate-dance-lock', 'animate-dance-salsa', 'animate-dance-breakdance', 'animate-dance-moonwalk', 'animate-dance-clap', 'animate-dance-wavearms'];
  const animClass = baseClasses[i % baseClasses.length];
  dances.push(`  { id: "dance_auto_${i}", name: "${name}", animationClass: "${animClass}", durationSeconds: ${6 + (i % 6)} }`);
}

// Generate 50 Music Genres
const genreNames = ['Vinahouse', 'EDM', 'Kpop', 'Vpop', 'USUK', 'Bolero Remix', 'Lofi Chill', 'Deep House', 'Trance', 'Dubstep', 'Trap', 'Hip Hop', 'RnB', 'Reggaeton', 'Salsa', 'Tango', 'Bachata', 'Mambo', 'Cha Cha Cha', 'Rumba', 'Jive', 'Paso Doble', 'Samba', 'Quickstep', 'Waltz', 'Viennese Waltz', 'Foxtrot', 'Tango', 'Disco', 'Funk', 'Soul', 'Jazz', 'Blues', 'Rock', 'Metal', 'Punk', 'Pop', 'Indie', 'Folk', 'Country', 'Reggae', 'Ska', 'Dancehall', 'Afrobeat', 'Zouk', 'Kizomba', 'Semba', 'Kuduro', 'Tarraxinha', 'Ghetto Zouk'];

const genresCode = genreNames.map((g, i) => {
  return `  genre_${i}: ["dance_auto_${(i*2)%100 + 1}", "dance_auto_${(i*2 + 1)%100 + 1}", "dance_auto_${(i*2 + 2)%100 + 1}"], // ${g}`;
});

const output = `
export const DEFAULT_CHARACTERS = [
${characters.join(',\n')}
];

export const EXTENDED_DANCE_STYLES = [
${dances.join(',\n')}
];

export const EXTENDED_SOUND_SUGGESTIONS = {
${genresCode.join('\n')}
};
`;

fs.writeFileSync('generated_dance_data.js', output);
console.log('Generated successfully!');
