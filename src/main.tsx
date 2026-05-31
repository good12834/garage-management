// Safeguard for restricted window.fetch in iframe/sandbox environments
try {
  const originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return originalFetch;
    },
    set(val) {
      console.warn('Gracefully ignored attempt to overwrite window.fetch inside main.tsx:', val);
    },
    configurable: true,
    enumerable: true
  });
} catch (e) {
  console.warn('Failed to configure window.fetch setter in main.tsx:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
