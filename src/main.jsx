import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Suspense fallback={<main className="loading">Loading guide...</main>}>
          <App />
        </Suspense>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
