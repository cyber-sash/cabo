import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DesignGallery } from './ebbe/screens/DesignGallery';
import './index.css';

// Ebbe-Designgalerie unter /ebbe/design, sonst das Spiel
const isDesignGallery = window.location.pathname.startsWith('/ebbe/design');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isDesignGallery ? <DesignGallery /> : <App />}</React.StrictMode>
);
