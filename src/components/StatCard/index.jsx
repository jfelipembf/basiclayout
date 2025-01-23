import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ 
  title, 
  value = 0, 
  unit = '', 
  icon = 'fa-chart-line',
  color = 'primary',
  change = null,
  currentMonthValue = null,
  previousMonthValue = null,
  decimals = 1 
}) => {
  // Função auxiliar para formatar números
  const formatNumber = (num, forceDecimals = true) => {
    if (num === undefined || num === null) return '0';
    const number = Number(num);
    if (isNaN(number)) return '0';
    
    // Se o número for inteiro e não forçarmos decimais, retorna sem casas decimais
    if (Number.isInteger(number) && !forceDecimals) {
      return number.toString();
    }
    
    return number.toFixed(decimals);
  };

  // Função para determinar a mensagem de comparação
  const getComparisonMessage = () => {
    if (change === null || change === undefined) return null;
    
    const changeValue = parseFloat(change);
    if (isNaN(changeValue) || changeValue === 0) return null;

    const isPositive = changeValue > 0;
    return {
      value: Math.abs(changeValue),
      status: isPositive ? 'melhor' : 'pior',
      isPositive
    };
  };

  const comparison = getComparisonMessage();

  return (
    <div className="h-100">
      <div className="card h-100 bg-dark border-0 shadow">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div 
                className={`icon-container me-3 bg-${color} bg-opacity-10 rounded-3`}
                style={{ width: '48px', height: '48px' }}
              >
                <i className={`fas ${icon} text-${color} fs-4`}></i>
              </div>
              <div>
                <h6 className="text-white-50 mb-0">{title}</h6>
                <h3 className="text-white mb-0">
                  {formatNumber(value, unit !== 'treinos')} {unit}
                </h3>
              </div>
            </div>
          </div>

          {/* Valores mensais */}
          {(currentMonthValue !== null || previousMonthValue !== null) && (
            <div className="mb-3">
              {currentMonthValue !== null && (
                <div className="text-white-50 small">
                  <span>Mês atual: {formatNumber(currentMonthValue)}{unit}</span>
                </div>
              )}
              {previousMonthValue !== null && (
                <div className="text-white-50 small">
                  <span>Mês anterior: {formatNumber(previousMonthValue)}{unit}</span>
                </div>
              )}
            </div>
          )}

          {/* Comparação */}
          {comparison && (
            <div className="mt-3">
              <div className={`d-flex align-items-center text-${comparison.isPositive ? 'success' : 'danger'}`}>
                <i className={`fas fa-arrow-${comparison.isPositive ? 'up' : 'down'} me-2`}></i>
                <small>
                  {formatNumber(comparison.value)}% {comparison.status} que o mês anterior
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  unit: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  change: PropTypes.number,
  currentMonthValue: PropTypes.number,
  previousMonthValue: PropTypes.number,
  decimals: PropTypes.number
};

export default StatCard;
