import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';

const AuthGuard = ({ children }) => {
  const { currentUser, loading } = useFirebase();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
