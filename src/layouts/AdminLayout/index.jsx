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
    { 
      text: 'Treinos',
      icon: 'fas fa-dumbbell',
      submenu: [
        { path: '/workouts', icon: 'fas fa-list', text: 'Lista de Treinos' },
        { path: '/workouts/create', icon: 'fas fa-plus', text: 'Criar Treino' }
      ]
    },
    { 
      text: 'Eventos',
      icon: 'fas fa-calendar-alt',
      submenu: [
        { path: '/events', icon: 'fas fa-list', text: 'Lista de Eventos' },
        { path: '/events/create', icon: 'fas fa-plus', text: 'Criar Evento' }
      ]
    },
    { path: '/students', icon: 'fas fa-users', text: 'Alunos' },
    { path: '/competitions', icon: 'fas fa-medal', text: 'Competições' },
    { path: '/profile', icon: 'fas fa-user', text: 'Perfil' }
  ];

  return (
    <div className="min-vh-100 bg-dark">
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Header */}
      <header className={`header position-fixed w-100 bg-dark border-bottom border-secondary ${sidebarOpen ? 'shifted' : ''}`}>
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
              <div className="me-3 text-end">
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

      {/* Sidebar */}
      <nav className={`sidebar position-fixed h-100 bg-dark ${sidebarOpen ? 'open' : ''}`}>
        <div className="d-flex flex-column h-100">
          {/* Sidebar Header */}
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0 text-white">Menu</h5>
              <button 
                className="btn btn-link text-white-50 d-lg-none p-0"
                onClick={toggleSidebar}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-grow-1 py-2 overflow-auto">
            <nav className="nav flex-column">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-1">
                  {item.submenu ? (
                    <div className="nav-item">
                      <div className="nav-link text-white-50">
                        <i className={`${item.icon} me-2`}></i>
                        {item.text}
                      </div>
                      <div className="submenu">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`nav-link ${isLinkActive(subItem.path) ? 'active' : ''}`}
                            onClick={() => {
                              if (window.innerWidth < 992) {
                                toggleSidebar();
                              }
                            }}
                          >
                            <i className={`${subItem.icon} me-2`}></i>
                            {subItem.text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`nav-link ${isLinkActive(item.path) ? 'active' : ''}`}
                      onClick={() => {
                        if (window.innerWidth < 992) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <i className={`${item.icon} me-2`}></i>
                      {item.text}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-top border-secondary mt-auto">
            <button 
              onClick={handleLogout}
              className="btn btn-link text-white-50 w-100 text-start p-0"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;