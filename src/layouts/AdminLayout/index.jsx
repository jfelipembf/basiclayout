import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import './styles.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/signin');
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = () => {
    // Fecha o sidenav em todas as telas
    setSidebarOpen(false);
  };

  return (
    <div className="min-vh-100 bg-dark">
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50" 
          style={{ zIndex: 1040 }}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Header */}
      <header className={`header position-fixed w-100 bg-dark ${sidebarOpen ? 'shifted' : ''}`} style={{ zIndex: 1030 }}>
        <div className="container-fluid px-3 py-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-link text-white p-0 me-3"
                style={{ width: '32px', height: '32px' }}
                onClick={toggleSidebar}
              >
                <i className="fas fa-bars fs-5"></i>
              </button>
              <h5 className="text-white mb-0 fw-semibold">TRBasic</h5>
            </div>
            
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <div className="user-avatar d-flex align-items-center justify-content-center me-2">
                  <i className="fas fa-user"></i>
                </div>
                <div className="d-none d-sm-block">
                  <div className="text-white small fw-medium">{user?.email}</div>
                  <small className="text-white-50">Usuário</small>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-link text-white-50 p-1"
                title="Sair"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar position-fixed h-100 bg-dark ${sidebarOpen ? 'open' : ''}`}>
        <div className="d-flex flex-column h-100 pt-5">
          {/* Navigation */}
          <div className="p-3">
            <div className="nav flex-column">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isLinkActive('/dashboard') ? 'active' : ''}`}
                onClick={handleNavigation}
              >
                <i className="fas fa-chart-line me-2"></i>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/workouts" 
                className={`nav-link ${isLinkActive('/workouts') ? 'active' : ''}`}
                onClick={handleNavigation}
              >
                <i className="fas fa-dumbbell me-2"></i>
                <span>Treinos</span>
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isLinkActive('/profile') ? 'active' : ''}`}
                onClick={handleNavigation}
              >
                <i className="fas fa-user me-2"></i>
                <span>Perfil</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`main-content bg-dark ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="container-fluid p-3 p-md-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;