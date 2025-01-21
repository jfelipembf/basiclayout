import React from 'react';

const StatCard = ({ title, value, previousValue, icon }) => {
  const growth = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = growth >= 0;

  return (
    <div className="card bg-dark border border-secondary border-opacity-50 h-100">
      <div className="card-body p-3">
        <div className="d-flex flex-column h-100">
          <h6 className="card-subtitle text-white-50 fw-medium mb-2">{title}</h6>
          <h4 className="card-title text-white fw-semibold mb-3">{value}</h4>
          <div className={`mt-auto d-flex align-items-center ${isPositive ? 'text-success' : 'text-danger'}`}>
            <i className={`fas fa-arrow-${isPositive ? 'up' : 'down'} me-2`}></i>
            <small className="fw-medium">{Math.abs(growth).toFixed(1)}% vs mês anterior</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
