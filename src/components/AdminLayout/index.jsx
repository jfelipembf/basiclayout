import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import './styles.css';

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="admin-layout">
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
      
      <div className={`main-content ${showSidebar ? 'with-sidebar' : ''}`}>
        <Navbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />
        
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
