import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { FirebaseProvider } from './contexts/FirebaseContext';
import AppRoutes from './routes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <AppRoutes />
    </FirebaseProvider>
  </React.StrictMode>
);
