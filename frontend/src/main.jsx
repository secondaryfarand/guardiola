import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  const isProd = import.meta.env.PROD;
  const backendUrl = "https://guardiola-five.vercel.app/";

  const finalUrl = (isProd && typeof url === 'string' && url.startsWith('/api')) 
    ? `${backendUrl}${url}` 
    : url;

  return originalFetch(finalUrl, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
