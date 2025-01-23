import React from 'react';
import PropTypes from 'prop-types';

const AlertCard = ({ alerts = [] }) => {
  // Se não houver alertas, mostra uma mensagem padrão
  if (!alerts || alerts.length === 0) {
    alerts = [{
      type: 'info',
      message: 'Tudo em ordem! Continue com seus treinos.',
      icon: 'fa-check-circle'
    }];
  }

  // Mapeia os tipos de alerta para cores do Bootstrap
  const getAlertColor = (type) => {
    const colors = {
      success: 'success',
      warning: 'warning',
      danger: 'danger',
      info: 'info'
    };
    return colors[type] || 'info';
  };

  return (
    <div className="h-100">
      <div className="card h-100 bg-dark border-0 shadow">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <div className="icon-container me-3 bg-primary bg-opacity-10 rounded-3" style={{ width: '48px', height: '48px' }}>
              <i className="fas fa-bell text-primary fs-4"></i>
            </div>
            <h5 className="text-white mb-0">Avisos & Lembretes</h5>
          </div>

          {/* Lista de Alertas */}
          <div className="alerts-container">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`alert alert-${getAlertColor(alert.type)} d-flex align-items-center mb-2`}
                role="alert"
              >
                <i className={`fas ${alert.icon || 'fa-info-circle'} me-2`}></i>
                <div>{alert.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

AlertCard.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['success', 'warning', 'danger', 'info']),
      message: PropTypes.string.isRequired,
      icon: PropTypes.string
    })
  )
};

export default AlertCard;
