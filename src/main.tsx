import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { NavigationProvider } from './contexts/NavigationContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
