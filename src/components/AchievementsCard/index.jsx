import React, { useState } from 'react';
import { ProgressBar, Nav } from 'react-bootstrap';
import { RANKS, BONUS_MILESTONES, calculateBonusPoints } from '../../utils/levels';

const AchievementsCard = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState('pending');
  
  if (!userInfo) {
    console.log('⚠️ Nenhum dado de usuário recebido');
    return null;
  }

  // Calcular bônus e marcos alcançados
  const { bonusPoints, milestones } = calculateBonusPoints({
    totalDistance: userInfo.totalDistance,
    totalTime: userInfo.totalTime,
    frequency: userInfo.frequency
  });

  console.log('🎁 Bônus calculados:', {
    totalBonus: bonusPoints,
    marcosAlcancados: milestones
  });

  // Criar lista de conquistas baseada nos marcos
  const createMilestoneAchievements = () => {
    const achievements = [];
    
    // Marcos de frequência
    BONUS_MILESTONES.FREQUENCY.forEach(milestone => {
      achievements.push({
        icon: 'fa-calendar',
        title: milestone.description,
        description: `+${milestone.bonus} pontos bônus`,
        isCompleted: userInfo.frequency >= milestone.amount,
        progress: {
          current: Math.min(userInfo.frequency, milestone.amount),
          total: milestone.amount
        },
        color: '#e74c3c'
      });
    });

    // Marcos de tempo
    BONUS_MILESTONES.TIME.forEach(milestone => {
      achievements.push({
        icon: 'fa-clock',
        title: milestone.description,
        description: `+${milestone.bonus} pontos bônus`,
        isCompleted: userInfo.totalTime >= milestone.amount,
        progress: {
          current: Math.min(userInfo.totalTime, milestone.amount),
          total: milestone.amount
        },
        color: '#3498db'
      });
    });

    // Marcos de distância
    BONUS_MILESTONES.DISTANCE.forEach(milestone => {
      achievements.push({
        icon: 'fa-road',
        title: milestone.description,
        description: `+${milestone.bonus} pontos bônus`,
        isCompleted: userInfo.totalDistance >= milestone.amount,
        progress: {
          current: Math.min(userInfo.totalDistance, milestone.amount),
          total: milestone.amount
        },
        color: '#2ecc71'
      });
    });

    return achievements;
  };

  const achievements = createMilestoneAchievements();
  const completedAchievements = achievements.filter(achievement => achievement.isCompleted);
  const pendingAchievements = achievements.filter(achievement => !achievement.isCompleted);

  const calculateProgress = (achievement) => {
    if (!achievement.progress) return 0;
    return (achievement.progress.current / achievement.progress.total) * 100;
  };

  return (
    <div className="achievements-container p-3 rounded-3" style={{ background: 'linear-gradient(145deg, rgba(33,37,41,1) 0%, rgba(45,50,55,1) 100%)' }}>
      {/* Cabeçalho com Total de Bônus */}
      <div className="level-section mb-3">
        <div className="d-flex align-items-center p-3 rounded-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div 
            className="icon-container p-2 rounded-circle me-3"
            style={{ 
              background: 'rgba(13,110,253,0.2)',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fas fa-star text-warning"></i>
          </div>
          <div>
            <h5 className="mb-1 text-white">Pontos Bônus: {bonusPoints}</h5>
            <p className="mb-0 text-white-50" style={{ fontSize: '0.875rem' }}>
              {completedAchievements.length} marcos alcançados
            </p>
          </div>
        </div>
      </div>

      {/* Navegação em Pills */}
      <Nav 
        variant="pills" 
        className="mb-3 d-flex justify-content-center"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Nav.Item>
          <Nav.Link 
            eventKey="pending"
            className={`d-flex align-items-center px-3 py-2 ${activeTab === 'pending' ? 'active' : ''}`}
            style={{
              background: activeTab === 'pending' ? 'var(--bs-primary)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50rem',
              color: activeTab === 'pending' ? 'white' : 'rgba(255,255,255,0.75)',
              fontSize: '0.875rem',
              margin: '0 0.5rem'
            }}
          >
            <i className="fas fa-clock me-2"></i>
            Pendentes
            <span 
              className="ms-2 px-2 py-1 rounded-pill" 
              style={{ 
                background: activeTab === 'pending' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                fontSize: '0.75rem'
              }}
            >
              {pendingAchievements.length}
            </span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            eventKey="completed"
            className={`d-flex align-items-center px-3 py-2 ${activeTab === 'completed' ? 'active' : ''}`}
            style={{
              background: activeTab === 'completed' ? 'var(--bs-primary)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50rem',
              color: activeTab === 'completed' ? 'white' : 'rgba(255,255,255,0.75)',
              fontSize: '0.875rem',
              margin: '0 0.5rem'
            }}
          >
            <i className="fas fa-check-circle me-2"></i>
            Completadas
            <span 
              className="ms-2 px-2 py-1 rounded-pill" 
              style={{ 
                background: activeTab === 'completed' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                fontSize: '0.75rem'
              }}
            >
              {completedAchievements.length}
            </span>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Lista de Conquistas */}
      <div className="achievements-list">
        {(activeTab === 'completed' ? completedAchievements : pendingAchievements).map((achievement, index) => (
          <div 
            key={`${achievement.title}-${index}`}
            className="achievement-item p-3 mb-2 rounded-3"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {achievement.progress && !achievement.isCompleted && (
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-white-50">
                    {achievement.progress.current.toFixed(1)} / {achievement.progress.total.toFixed(1)}
                  </small>
                  <small className="text-white-50">
                    {calculateProgress(achievement).toFixed(0)}%
                  </small>
                </div>
                <ProgressBar 
                  now={calculateProgress(achievement)} 
                  style={{ 
                    height: '4px',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }}
                />
              </div>
            )}

            <div className="d-flex align-items-center">
              {/* Ícone */}
              <div 
                className="p-2 rounded-circle me-2"
                style={{ 
                  background: achievement.isCompleted ? 'rgba(25,135,84,0.2)' : 'rgba(13,110,253,0.2)',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i 
                  className={`fas ${achievement.icon}`}
                  style={{ 
                    color: achievement.color,
                    fontSize: '1.25rem'
                  }}
                ></i>
              </div>

              {/* Conteúdo */}
              <div className="flex-grow-1">
                <h6 className="text-white mb-0" style={{ fontSize: '0.9rem' }}>{achievement.title}</h6>
                <p className="text-white-50 small mb-1" style={{ fontSize: '0.8rem' }}>{achievement.description}</p>
                
                {achievement.isCompleted && (
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle text-success me-1" style={{ fontSize: '0.75rem' }}></i>
                    <span className="text-success" style={{ fontSize: '0.75rem' }}>Completado</span>
                  </div>
                )}
              </div>

              {achievement.isCompleted && (
                <div 
                  className="ms-2 p-2 rounded-circle"
                  style={{ 
                    background: 'rgba(25,135,84,0.2)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fas fa-check text-success"></i>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Mensagem quando não há conquistas */}
        {((activeTab === 'completed' && completedAchievements.length === 0) || 
          (activeTab === 'pending' && pendingAchievements.length === 0)) && (
          <div className="text-center py-3">
            <i className="fas fa-trophy text-white-50 mb-2" style={{ fontSize: '2rem' }}></i>
            <p className="text-white-50 mb-0">
              {activeTab === 'completed' 
                ? 'Você ainda não completou nenhuma conquista.' 
                : 'Não há conquistas pendentes.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsCard;