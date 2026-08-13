import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import DesktopAppUI from './components/genaidol/DesktopAppUI.jsx';
import './index.css';

const isDesktopMode = window.location.pathname === '/desktop';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isDesktopMode ? <DesktopAppUI /> : <App />}
  </React.StrictMode>,
);
