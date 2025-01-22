import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import './styles.css';

const LevelCard = ({ levelInfo }) => {
  if (!levelInfo) {
    return (
      <Card className="bg-dark border border-secondary border-opacity-50">
        <Card.Body className="p-4">
          <div className="text-white-50">Carregando...</div>
        </Card.Body>
      </Card>
    );
  }

  const {
    rank,
    level,
    icon,
    color,
    currentPoints,
    pointsToNextLevel,
    nextLevelPoints,
    totalPointsInRank,
    stats
  } = levelInfo;

  // Calcular porcentagem de progresso dentro do nível atual
  const progress = nextLevelPoints
    ? ((currentPoints % 40) / 40) * 100
    : 100;

  // Calcular progresso total no rank atual
  const totalProgress = (currentPoints / totalPointsInRank) * 100;

  return (
    <Card className="bg-dark border border-secondary border-opacity-50">
      <Card.Body className="p-4">
        {/* Título e Ícone */}
        <div className="d-flex align-items-center mb-3">
          <div
            className="bg-primary bg-opacity-10 p-2 rounded-2 me-3"
            style={{ color: color }}
          >
            <i className={`fas ${icon} fs-4`}></i>
          </div>
          <div>
            <h5 className="text-white mb-0">
              {rank} {level}
            </h5>
            <small className="text-white-50">
              {Math.floor(totalProgress)}% do rank completo
            </small>
          </div>
        </div>

        {/* Pontuação atual */}
        <div className="text-white-50 mb-2">
          <small>
            Pontuação no rank: {currentPoints} / {totalPointsInRank} pontos
          </small>
        </div>

        {/* Barra de Progresso do Nível Atual */}
        <div className="mb-2">
          <div className="d-flex justify-content-between text-white-50 small mb-1">
            <span>Nível {level}</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <ProgressBar
            now={progress}
            variant="primary"
            className="bg-dark border border-secondary"
          />
        </div>

        {/* Informação do próximo nível */}
        {pointsToNextLevel > 0 ? (
          <div className="text-white-50 small mb-4">
            Faltam {pointsToNextLevel} pontos para {rank} {level + 1}
          </div>
        ) : (
          <div className="text-white-50 small mb-4">Nível máximo atingido!</div>
        )}

        {/* Estatísticas que geram pontos */}
        <div className="mt-4">
          <h6 className="text-white-50 mb-3">Pontuação por categoria:</h6>
          <div className="text-white-50 small">
            <div className="mb-1">
              <i className="fas fa-road me-2"></i>
              Distância: {(stats.distance * 3).toFixed(1)} pts ({stats.distance.toFixed(1)} km)
            </div>
            <div className="mb-1">
              <i className="fas fa-clock me-2"></i>
              Tempo: {(stats.time * 2).toFixed(1)} pts ({stats.time.toFixed(1)} h)
            </div>
            <div>
              <i className="fas fa-calendar me-2"></i>
              Frequência: {stats.frequency} pts ({stats.frequency} treinos)
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LevelCard;
