import React from 'react';
import { Spinner } from 'react-bootstrap';
import './styles.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="d-flex flex-column align-items-center gap-3">
        <Spinner 
          animation="border" 
          variant="primary" 
          style={{ width: '3rem', height: '3rem' }}
        />
        <div className="text-white">Carregando...</div>
      </div>
    </div>
  );
};

export default Loader;
