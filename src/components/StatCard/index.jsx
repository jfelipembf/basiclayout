import React from 'react';

const StatCard = ({ title, value, previousValue, growth, icon }) => {
  const isPositiveGrowth = growth > 0;
  const growthColor = isPositiveGrowth ? 'text-success' : 'text-danger';
  const growthIcon = isPositiveGrowth ? 'fa-arrow-up' : 'fa-arrow-down';
  
  const getComparisonMessage = () => {
    if (growth === 0) return 'Sem alteração em relação ao mês anterior';
    
    const status = isPositiveGrowth ? 'melhor' : 'pior';
    return `${Math.abs(growth)}% ${status} que o mês anterior`;
  };

  return (
    <div className="bg-dark">
      <div className="card-body p-4">
        {/* Cabeçalho com título */}
        <div className="d-flex align-items-center mb-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded-2 me-3">
            <i className={`fas ${icon} text-primary fs-4`}></i>
          </div>
          <span className="text-white-50">{title}</span>
        </div>

        {/* Valor atual */}
        <h3 className="text-white mb-3">{value}</h3>

        {/* Comparativo com mensagem */}
        <div className="d-flex align-items-center">
          <div className={`${growthColor} d-flex align-items-center`}>
            {growth !== 0 && <i className={`fas ${growthIcon} me-2`}></i>}
            <span>{getComparisonMessage()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
