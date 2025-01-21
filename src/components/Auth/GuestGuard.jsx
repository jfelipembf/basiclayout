import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { currentUser, loading } = useFirebase();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  return children;
};

export default GuestGuard;
