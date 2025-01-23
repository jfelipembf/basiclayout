import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import 'bootstrap/dist/css/bootstrap.min.css';
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

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-chart-line', text: 'Dashboard' },
    { path: '/progress', icon: 'fas fa-trophy', text: 'Progresso' },
    { path: '/workouts', icon: 'fas fa-list', text: 'Lista de Treinos' },
    { path: '/workouts/create', icon: 'fas fa-plus-circle', text: 'Criar Treino' },
    { path: '/events', icon: 'fas fa-calendar', text: 'Lista de Eventos' },
    { path: '/events/create', icon: 'fas fa-calendar-plus', text: 'Criar Evento' },
    { path: '/competitions', icon: 'fas fa-medal', text: 'Lista de Competições' },
    { path: '/competitions/create', icon: 'fas fa-trophy', text: 'Criar Competição' },
    { path: '/students', icon: 'fas fa-users', text: 'Alunos' },
    { path: '/profile', icon: 'fas fa-user', text: 'Perfil' }
  ];

  return (
    <div className="min-vh-100 bg-dark">
      {/* Header */}
      <header className="header position-fixed w-100 bg-dark">
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
              <h5 className="mb-0 text-white">TrBasic</h5>
            </div>

            {/* User Profile */}
            <div className="d-flex align-items-center">
              <div className="me-3 text-end d-none d-sm-block">
                <div className="text-white">{user?.displayName || user?.email}</div>
                <small className="text-white-50">Usuário</small>
              </div>
              <div className="user-avatar d-flex align-items-center justify-content-center">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <i className="fas fa-user text-white-50"></i>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="overlay position-fixed top-0 start-0 w-100 h-100" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <nav className={`sidebar position-fixed h-100 ${sidebarOpen ? 'open' : ''}`}>
        <div className="d-flex flex-column h-100">
          {/* Navigation Links */}
          <div className="flex-grow-1 py-2 overflow-auto">
            <div className="menu-items">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`menu-item ${isLinkActive(item.path) ? 'active' : ''}`}
                  onClick={() => {
                    if (window.innerWidth < 992) {
                      toggleSidebar();
                    }
                  }}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.text}
                </Link>
              ))}
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="menu-item text-danger border-0 bg-transparent w-100 text-start mt-4"
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;