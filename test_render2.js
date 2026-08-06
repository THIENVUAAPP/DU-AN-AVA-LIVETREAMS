import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

global.self = global;
global.window = global;
global.localStorage = { getItem: () => null, setItem: () => {} };

try {
  const html = renderToString(<App />);
  console.log("Render successful! Length:", html.length);
} catch (err) {
  console.error("RENDER ERROR:", err);
}
