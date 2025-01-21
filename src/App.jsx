import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import routes from './routes';

const App = () => {
  const content = useRoutes(routes);

  return content;
};

const WrappedApp = () => {
  return (
    <FirebaseProvider>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </FirebaseProvider>
  );
};

export default WrappedApp;