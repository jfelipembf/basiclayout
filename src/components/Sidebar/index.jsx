import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import './styles.css';

const Sidebar = ({ show, onClose }) => {
  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-chart-line', text: 'Dashboard' },
    { path: '/progress', icon: 'fas fa-trophy', text: 'Progresso' },
    { path: '/workouts', icon: 'fas fa-dumbbell', text: 'Treinos' },
    { path: '/events', icon: 'fas fa-calendar-alt', text: 'Eventos' },
    { path: '/students', icon: 'fas fa-users', text: 'Alunos' },
    { path: '/competitions', icon: 'fas fa-medal', text: 'Competições' }
  ];

  return (
    <div className={`sidebar bg-dark ${show ? 'show' : ''}`}>
      <div className="sidebar-header border-bottom border-secondary p-3">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="text-white mb-0">TrBasic</h3>
          <button
            className="btn btn-link text-white-50 d-md-none p-0"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <Nav className="flex-column p-3">
        {menuItems.map((item) => (
          <Nav.Item key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => onClose()}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.text}
            </NavLink>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
