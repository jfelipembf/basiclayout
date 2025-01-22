import React, { useState } from 'react';
import { ProgressBar, Nav } from 'react-bootstrap';
import { formatAchievementValue } from '../../utils/achievements';

const AchievementsCard = ({ achievements, currentLevel, nextLevel }) => {
  const [activeTab, setActiveTab] = useState('pending');

  // Separar conquistas completadas e pendentes
  const completedAchievements = achievements.filter(a => a.isCompleted)
    .sort((a, b) => b.requirement - a.requirement);
  
  const pendingAchievements = achievements.filter(a => !a.isCompleted)
    .sort((a, b) => b.progress - a.progress);

  // Cores e ícones para cada tipo
  const typeStyles = {
    distance: { color: '#0d6efd', icon: 'fa-road' },
    time: { color: '#198754', icon: 'fa-clock' },
    frequency: { color: '#ffc107', icon: 'fa-calendar-check' },
    streak: { color: '#dc3545', icon: 'fa-fire' }
  };

  // Estilo personalizado para os pills
  const pillStyle = {
    fontSize: '0.8rem',
    padding: '0.2rem 0.2rem',
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'all 0.2s ease',
    minWidth: '70px',
    margin: '0',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1'
  };

  const activePillStyle = {
    ...pillStyle,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.15)'
  };

  return (
    <div className="achievements-container p-3 rounded-3" style={{ background: 'linear-gradient(145deg, rgba(33,37,41,1) 0%, rgba(45,50,55,1) 100%)' }}>
      {/* Nível Atual */}
      <div className="level-section mb-3">
        <div className="d-flex align-items-center p-3 rounded-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div 
            className="p-2 rounded-circle me-3"
            style={{ backgroundColor: currentLevel?.color, boxShadow: `0 0 15px ${currentLevel?.color}40` }}
          >
            <i className={`fas ${currentLevel?.icon || 'fa-trophy'} text-dark fs-4`}></i>
          </div>
          <div>
            <h5 className="text-white mb-1">Nível {currentLevel?.name}</h5>
            <p className="text-white-50 small mb-0">{currentLevel?.description}</p>
            {nextLevel && (
              <div className="mt-1">
                <small className="text-white-50">
                  Próximo nível: {nextLevel.name}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegação em Pills */}
      <Nav 
        variant="pills" 
        className="mb-3 d-flex justify-content-center"
        style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '1.5rem', 
          padding: '0.15rem',
          width: '100%',           // Permite que o Nav ocupe toda a largura disponível
          maxWidth: '300px',      // Define uma largura máxima para telas maiores
          margin: '0 auto 1rem auto',
          gap: '2px'
        }}
      >
        <Nav.Item style={{ flex: 1 }}>
          <Nav.Link
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            className="rounded-pill"
            style={activeTab === 'pending' ? activePillStyle : pillStyle}
          >
            <i className="fas fa-list-check me-1"></i>
            <span style={{ fontSize: '0.75rem' }}>Pendentes</span>
            <span className="ms-1 badge" style={{ 
              backgroundColor: activeTab === 'pending' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', 
              fontSize: '0.65rem',
              padding: '0.2em 0.2em',
              minWidth: '1.2rem'
            }}>
              {pendingAchievements.length}
            </span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item style={{ flex: 1 }}>
          <Nav.Link
            active={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
            className="rounded-pill"
            style={activeTab === 'completed' ? activePillStyle : pillStyle}
          >
            <i className="fas fa-trophy me-1"></i>
            <span style={{ fontSize: '0.75rem' }}>Conquistas</span>
            <span className="ms-1 badge" style={{ 
              backgroundColor: activeTab === 'completed' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', 
              fontSize: '0.65rem',
              padding: '0.2em 0.2em',
              minWidth: '1.2rem'
            }}>
              {completedAchievements.length}
            </span>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Lista de Conquistas */}
      <div className="achievements-list">
        {(activeTab === 'completed' ? completedAchievements : pendingAchievements).map((achievement) => (
          <div 
            key={achievement.id} 
            className="achievement-item mb-2 p-2 rounded-3 position-relative overflow-hidden" 
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              borderLeft: `3px solid ${activeTab === 'completed' ? '#198754' : typeStyles[achievement.type].color}`
            }}
          >
            {activeTab === 'completed' && (
              <div 
                className="position-absolute" 
                style={{ 
                  top: 0, 
                  right: 0, 
                  background: '#198754',
                  padding: '0.15rem 0.4rem',
                  borderBottomLeftRadius: '0.5rem',
                  fontSize: '0.7rem'
                }}
              >
                <small className="text-white">
                  <i className="fas fa-check me-1"></i>
                  Conquistado
                </small>
              </div>
            )}

            <div className="d-flex align-items-center">
              {/* Ícone */}
              <div 
                className="p-2 rounded-circle me-2"
                style={{ 
                  background: `${activeTab === 'completed' ? '#19875420' : `${typeStyles[achievement.type].color}20`}`,
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i 
                  className={`fas ${typeStyles[achievement.type].icon}`}
                  style={{ 
                    color: activeTab === 'completed' ? '#198754' : typeStyles[achievement.type].color,
                    fontSize: '0.9rem'
                  }}
                ></i>
              </div>

              {/* Conteúdo */}
              <div className="flex-grow-1">
                <h6 className="text-white mb-0" style={{ fontSize: '0.9rem' }}>{achievement.title}</h6>
                <p className="text-white-50 small mb-1" style={{ fontSize: '0.8rem' }}>{achievement.description}</p>
                
                {activeTab === 'pending' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                        {formatAchievementValue[achievement.type](achievement.currentValue)} / 
                        {formatAchievementValue[achievement.type](achievement.targetValue)}
                      </small>
                      <small style={{ 
                        color: typeStyles[achievement.type].color,
                        fontSize: '0.75rem'
                      }}>
                        {achievement.progress.toFixed(0)}%
                      </small>
                    </div>
                    <ProgressBar 
                      now={achievement.progress} 
                      variant={achievement.type === 'distance' ? 'primary' : 
                              achievement.type === 'time' ? 'success' :
                              achievement.type === 'frequency' ? 'warning' : 'danger'}
                      className="bg-dark"
                      style={{ height: "3px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Mensagem quando não há conquistas */}
        {((activeTab === 'completed' && completedAchievements.length === 0) || 
          (activeTab === 'pending' && pendingAchievements.length === 0)) && (
          <div className="text-center py-3">
            <i className="fas fa-trophy text-white-50 fs-4 mb-2 d-block"></i>
            <p className="text-white-50 mb-0" style={{ fontSize: '0.85rem' }}>
              {activeTab === 'completed'
                ? 'Você ainda não tem conquistas alcançadas. Continue se esforçando!' 
                : 'Parabéns! Você completou todas as conquistas disponíveis!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsCard;
