import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { LoaderProvider } from './contexts/LoaderContext';
import AppRoutes from './routes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <LoaderProvider>
        <AppRoutes />
      </LoaderProvider>
    </FirebaseProvider>
  </React.StrictMode>
);
