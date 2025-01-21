import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const Navbar = ({ onCloseSidebar }) => {
  const navigate = useNavigate();
  const { user, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    if (onCloseSidebar) onCloseSidebar();
    navigate('/auth/signin');
  };

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-chart-line', text: 'Dashboard' },
    { path: '/progress', icon: 'fas fa-trophy', text: 'Progresso' },
    { path: '/workouts', icon: 'fas fa-dumbbell', text: 'Treinos' },
    { path: '/events', icon: 'fas fa-calendar-alt', text: 'Eventos' },
    { path: '/students', icon: 'fas fa-users', text: 'Alunos' },
    { path: '/competitions', icon: 'fas fa-medal', text: 'Competições' }
  ];

  return (
    <div className="p-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center" role="button" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2" style={{ width: '48px', height: '48px', overflow: 'hidden' }}>
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="rounded-circle" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <i className="fas fa-user text-primary"></i>
            )}
          </div>
          <div>
            <div className="text-white">{user?.displayName || user?.email}</div>
            <small className="text-white-50">Usuário</small>
          </div>
        </div>

        <Nav className="me-auto flex-column">
          {menuItems.map((item) => (
            <Nav.Item key={item.path}>
              <Link to={item.path} className="nav-link text-white">
                <i className={`${item.icon} me-2`}></i>
                {item.text}
              </Link>
            </Nav.Item>
          ))}
        </Nav>

        <button 
          onClick={handleLogout}
          className="btn btn-link text-white-50 p-0"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
