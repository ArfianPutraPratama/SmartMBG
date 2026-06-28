import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global fetch override to inject ngrok-skip-browser-warning header
const originalFetch = window.fetch;
window.fetch = async function () {
  let [resource, config] = arguments;
  
  if (typeof resource === 'string' && resource.includes('ngrok-free.app')) {
    config = config || {};
    config.headers = config.headers || {};
    config.headers['ngrok-skip-browser-warning'] = '69420';
    arguments[1] = config;
  }
  
  return originalFetch.apply(this, arguments);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
