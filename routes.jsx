import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './src/layouts/AdminLayout';
import GuestGuard from './src/components/Auth/GuestGuard';
import AuthGuard from './src/components/Auth/AuthGuard';
import Dashboard from './src/pages/dashboard';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<div>Carregando...</div>}>
      <Component {...props} />
    </Suspense>
  );

const SignIn = Loadable(lazy(() => import('./src/pages/auth/signIn/index')));
const SignUp = Loadable(lazy(() => import('./src/pages/auth/signUp/index')));
const ResetPassword = Loadable(lazy(() => import('./src/pages/auth/reset-password/index')));

// ==============================|| ROTAS ||============================== //

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/auth',
    element: (
      <GuestGuard>
        <Outlet />
      </GuestGuard>
    ),
    children: [
      {
        path: 'signin',
        element: <SignIn />
      },
      {
        path: 'signup',
        element: <SignUp />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
];

export default routes;