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
import Progress from './pages/progress';
import Workouts from './pages/workouts';
import CreateWorkout from './pages/workouts/create';
import Events from './pages/events';
import CreateEvent from './pages/events/create';
import WorkoutSession from './pages/workout-session';
import Competitions from './pages/competitions';
import CreateCompetition from './pages/competitions/create';
import Students from './pages/students';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="app-wrapper bg-dark text-white">
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="progress" element={<Progress />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="workouts/create" element={<CreateWorkout />} />
            <Route path="events" element={<Events />} />
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="competitions" element={<Competitions />} />
            <Route path="competitions/create" element={<CreateCompetition />} />
            <Route path="students" element={<Students />} />
          </Route>

          {/* Workout Session Route */}
          <Route path="/workout-session" element={<WorkoutSession />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <ToastContainer position="top-right" theme="dark" />
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
