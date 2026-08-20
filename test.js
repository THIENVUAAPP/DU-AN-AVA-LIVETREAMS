import fs from 'fs';
const code = fs.readFileSync('src/components/genaidol/game/bandoGameEngine.js', 'utf-8');
console.log(code.includes('this.state.cellsById = { ...this.state.cellsById };'));
