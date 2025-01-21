import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';
import './styles.css';

const Layout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark border-end border-secondary">
        <div className="sidebar-header border-bottom border-secondary p-3">
          <h3 className="text-white mb-0">TrBasic</h3>
        </div>
        <Nav className="flex-column p-3">
          <Nav.Item>
            <NavLink to="/" className="nav-link">
              <i className="fas fa-home me-2"></i>
              Dashboard
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/workouts" className="nav-link">
              <i className="fas fa-dumbbell me-2"></i>
              Treinos
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/events" className="nav-link">
              <i className="fas fa-calendar-alt me-2"></i>
              Eventos
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/students" className="nav-link">
              <i className="fas fa-users me-2"></i>
              Alunos
            </NavLink>
          </Nav.Item>
        </Nav>
      </div>

      {/* Main content */}
      <div className="main-content bg-dark">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
