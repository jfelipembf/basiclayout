import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { RANKS, BONUS_MILESTONES, calculateBonusPoints, calculatePoints, calculateRank } from '../../utils/levels';
import './styles.css';

const AchievementsCard = ({ userInfo }) => {
  const [showAchieved, setShowAchieved] = useState(false);

  if (!userInfo) {
    console.log('⚠️ Nenhum dado de usuário recebido');
    return null;
  }

  // Converter distância para km (dividir por 1000) e tempo já está em minutos
  const totalDistance = Number(userInfo.totalDistance || 0) / 1000; // Convertendo metros para km
  const totalTime = Number(userInfo.totalTime || 0); // Já está em minutos
  const frequency = Number(userInfo.frequency || 0);

  // Logs para debug
  console.log('🏃 Dados do usuário:', {
    distância: `${totalDistance.toFixed(2)} km`,
    tempo: `${totalTime} minutos (${(totalTime / 60).toFixed(1)} horas)`,
    frequência: `${frequency} treinos`
  });

  const { bonusPoints } = calculateBonusPoints({
    totalDistance,
    totalTime,
    frequency
  });

  // Calcula pontos e rank
  const { totalPoints } = calculatePoints({
    totalDistance,
    totalTime,
    frequency
  });

  const rankInfo = calculateRank(totalPoints);
  
  console.log('🎮 Informações de progresso:', {
    pontos: totalPoints,
    rank: rankInfo.rank,
    nível: rankInfo.level,
    pontosParaPróximoNível: rankInfo.pointsToNextLevel
  });

  const getNextAchievement = (current, milestones) => {
    return milestones.find(m => current < m.amount) || null;
  };

  const getAchievedMilestones = (current, milestones) => {
    return milestones.filter(m => current >= m.amount).sort((a, b) => b.amount - a.amount);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatProgress = (current, target) => {
    const progress = (current / target) * 100;
    return Math.min(progress, 100).toFixed(0);
  };

  const formatTime = (minutes) => {
    return (minutes / 60).toFixed(1);
  };

  const categories = [
    {
      key: 'distance',
      name: 'Distância',
      icon: 'fa-road',
      color: '#2ecc71',
      unit: 'km',
      current: totalDistance,
      milestones: BONUS_MILESTONES.DISTANCE,
      format: (value) => Number(value).toFixed(1)
    },
    {
      key: 'time',
      name: 'Tempo',
      icon: 'fa-clock',
      color: '#3498db',
      unit: 'h',
      current: totalTime / 60, // Convertendo minutos para horas
      milestones: BONUS_MILESTONES.TIME,
      format: (value) => formatTime(value * 60) // Recebe horas, converte para minutos para formatação
    },
    {
      key: 'frequency',
      name: 'Frequência',
      icon: 'fa-calendar',
      color: '#e74c3c',
      unit: 'treinos',
      current: frequency,
      milestones: BONUS_MILESTONES.FREQUENCY,
      format: (value) => Math.round(value)
    }
  ];

  return (
    <div className="card h-100 bg-dark border-0" style={{
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)'
    }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <div className="icon-circle bg-warning bg-opacity-10 me-3" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-trophy text-warning" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <h5 className="mb-0 text-light">Conquistas</h5>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px 15px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'baseline'
          }}>
            <h3 className="mb-0 text-light">
              {totalPoints}
            </h3>
            <small className="text-light ms-2" style={{ fontSize: '0.8rem' }}>pontos</small>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="ms-2">
            <h5 className="mb-0 text-light">
              {RANKS[rankInfo.rank]?.name} {rankInfo.level}
            </h5>
            <div className="level-progress mt-3 mb-3" style={{ width: '300px', marginLeft: '-20px' }}>
              <div className="d-flex justify-content-between mb-2">
                <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                  {totalPoints} pontos
                </small>
                <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                  {totalPoints + rankInfo.pointsToNextLevel} pontos
                </small>
              </div>
              <ProgressBar 
                now={calculateProgress(totalPoints, totalPoints + rankInfo.pointsToNextLevel)}
                variant="info"
                style={{ 
                  height: '6px', 
                  width: '100%', 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px'
                }}
              />
              <div className="d-flex justify-content-end mt-2">
                <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                  Próximo: {RANKS[rankInfo.rank]?.name} {rankInfo.level + 1}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-4">
          <div className="achievement-selector">
            <button 
              className={!showAchieved ? 'active' : ''}
              onClick={() => setShowAchieved(false)}
            >
              Próximas
            </button>
            <button 
              className={showAchieved ? 'active' : ''}
              onClick={() => setShowAchieved(true)}
            >
              Conquistadas
            </button>
          </div>
        </div>

        <div className="achievements-list">
          {showAchieved ? (
            categories.map(category => {
              const achieved = getAchievedMilestones(category.current, category.milestones);
              return achieved.map((milestone, index) => (
                <div key={`${category.key}-${index}`} className="achievement-item">
                  <i className={`fas ${category.icon}`} style={{ color: category.color }}></i>
                  <div className="achievement-info">
                    <div className="achievement-main">
                      <span className="achievement-name">{category.name}</span>
                      <span className="achievement-value">
                        {category.format(milestone.amount)} {category.unit}
                      </span>
                    </div>
                  </div>
                  <div className="achievement-bonus">
                    +{milestone.bonus}
                  </div>
                </div>
              ));
            })
          ) : (
            categories.map(category => {
              const next = getNextAchievement(category.current, category.milestones);
              
              return (
                <div key={category.key} className="achievement-item">
                  <i className={`fas ${category.icon}`} style={{ color: category.color }}></i>
                  <div className="achievement-info">
                    <div className="achievement-main">
                      <span className="achievement-name">{category.name}</span>
                      <div className="achievement-progress-info">
                        {next ? (
                          <>
                            <span className="achievement-value">
                              {category.format(category.current)}/{category.format(next.amount)} {category.unit}
                            </span>
                            <span className="progress-percent">
                              {formatProgress(category.current, next.amount)}%
                            </span>
                          </>
                        ) : (
                          <span className="achievement-complete">Todas conquistas alcançadas!</span>
                        )}
                      </div>
                    </div>
                    {next && (
                      <ProgressBar 
                        now={calculateProgress(category.current, next.amount)}
                        variant="custom"
                        style={{ backgroundColor: `${category.color}20` }}
                        className="progress-mini"
                      />
                    )}
                  </div>
                  {next && (
                    <div className="achievement-bonus">
                      +{next.bonus}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsCard;
