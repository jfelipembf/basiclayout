import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

const Navbar = ({ onCloseSidebar }) => {
  const navigate = useNavigate();
  const { user, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    if (onCloseSidebar) onCloseSidebar();
    navigate('/auth/signin');
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
            <i className="fas fa-user text-primary"></i>
          </div>
          <div>
            <div className="text-white">{user?.email}</div>
            <small className="text-white-50">Usuário</small>
          </div>
        </div>
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
