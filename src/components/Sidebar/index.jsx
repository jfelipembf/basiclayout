import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import './styles.css';

const Sidebar = ({ show, onClose }) => {
  // Menu principal
  const mainMenuItems = [
    { path: '/dashboard', icon: 'fas fa-chart-line', text: 'Dashboard' },
    { path: '/progress', icon: 'fas fa-trophy', text: 'Progresso' },
    { path: '/workouts', icon: 'fas fa-dumbbell', text: 'Treinos' },
    { path: '/events', icon: 'fas fa-calendar-alt', text: 'Eventos' },
  ];

  // Submenus
  const subMenus = {
    workouts: [
      { path: '/workouts/create', icon: 'fas fa-plus', text: 'Novo Treino' }
    ],
    events: [
      { path: '/events/create', icon: 'fas fa-plus', text: 'Novo Evento' }
    ],
    competitions: [
      { path: '/competitions/create', icon: 'fas fa-plus', text: 'Nova Competição' }
    ]
  };

  // Itens adicionais do menu
  const additionalMenuItems = [
    { path: '/competitions', icon: 'fas fa-medal', text: 'Competições' },
    { path: '/students', icon: 'fas fa-users', text: 'Alunos' }
  ];

  const handleClick = () => {
    if (onClose) onClose();
  };

  // Função para renderizar um item do menu
  const renderMenuItem = (item, isSubmenu = false) => (
    <Nav.Item key={item.path}>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `nav-link ${isActive ? 'active' : ''} text-white ${isSubmenu ? 'ps-4' : ''}`
        }
        onClick={handleClick}
      >
        <i className={`${item.icon} me-2`}></i>
        {item.text}
      </NavLink>
    </Nav.Item>
  );

  return (
    <div className={`sidebar bg-dark ${show ? 'show' : ''}`}>
      <div className="sidebar-header border-bottom border-secondary p-3">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="text-white mb-0">TrBasic</h3>
          <button
            className="btn btn-link text-white-50 d-md-none p-0"
            onClick={handleClick}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <Nav className="flex-column p-3">
        {/* Menu Principal */}
        {mainMenuItems.map(item => renderMenuItem(item))}

        {/* Competições */}
        {renderMenuItem(additionalMenuItems[0])}
        {subMenus.competitions.map(item => renderMenuItem(item, true))}

        {/* Alunos */}
        {renderMenuItem(additionalMenuItems[1])}
      </Nav>
    </div>
  );
};

export default Sidebar;
