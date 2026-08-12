const React = require('react');
const ReactDOMServer = require('react-dom/server');
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, 'src/components/genaidol/WorkspaceTacVu.jsx'), 'utf-8');

const transpiled = babel.transformSync(code, {
  presets: ['@babel/preset-react'],
  filename: 'WorkspaceTacVu.jsx'
});

fs.writeFileSync('temp_test.js', transpiled.code.replace(/import .*/g, '').replace(/export default function/g, 'function'));
