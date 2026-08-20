import bandoEngine from './src/components/genaidol/game/bandoGameEngine.js';

console.log("Initial cells:", Object.keys(bandoEngine.state.cellsById).length);

bandoEngine.processGift({
  giftId: 'rose',
  giftName: 'Rose',
  count: 1,
  diamondCount: 1,
  userId: 'test_user',
  username: 'Test User'
});

console.log("After gift cells:", Object.keys(bandoEngine.state.cellsById).length);
