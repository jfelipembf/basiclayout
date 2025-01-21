import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './bootstrap';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Workouts from './pages/workouts';
import WorkoutSession from './pages/workout-session';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="app-wrapper bg-dark text-white">
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth">
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="workouts" element={<Workouts />} />
          </Route>

          {/* Workout Session Route - Fora do AdminLayout */}
          <Route path="workout-session" element={<WorkoutSession />} />
        </Routes>

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
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
