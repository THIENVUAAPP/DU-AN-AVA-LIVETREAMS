import React from 'react';
import { renderToString } from 'react-dom/server';
import WorkspaceTacVu from './src/components/genaidol/WorkspaceTacVu.jsx';

try {
  console.log(renderToString(<WorkspaceTacVu defaultEventId="welcome" />));
} catch (e) {
  console.error("CRASH:", e);
}
