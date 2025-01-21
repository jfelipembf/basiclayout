import React from 'react';

const AchievementItem = ({ icon, title, description, isCompleted, progress }) => (
  <div className={`d-flex align-items-center p-3 border-bottom border-secondary border-opacity-25 ${isCompleted ? 'bg-success bg-opacity-10' : ''}`}>
    <div className={`me-3 ${isCompleted ? 'text-success' : 'text-white-50'}`}>
      <i className={`fas ${icon} fa-lg`}></i>
    </div>
    <div className="flex-grow-1">
      <div className="d-flex justify-content-between align-items-start mb-1">
        <h6 className={`mb-0 ${isCompleted ? 'text-success' : 'text-white'}`}>{title}</h6>
        {isCompleted && (
          <div className="bg-success bg-opacity-25 rounded-1 px-2 py-1">
            <small className="text-success">Concluído</small>
          </div>
        )}
      </div>
      <small className="text-white-50">{description}</small>
      {!isCompleted && progress && (
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-white-50">Progresso</small>
            <small className="text-primary">{progress.current}/{progress.total}</small>
          </div>
          <div className="progress bg-dark" style={{ height: '4px' }}>
            <div 
              className="progress-bar bg-primary" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const AchievementsCard = ({ achievements }) => {
  const completedAchievements = achievements.filter(a => a.isCompleted);
  const nextAchievements = achievements.filter(a => !a.isCompleted).slice(0, 3);

  return (
    <div className="bg-dark">
      <div className="card-body p-0">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-secondary border-opacity-25">
          <div>
            <h5 className="text-white mb-1">Conquistas</h5>
            <small className="text-white-50">{completedAchievements.length} de {achievements.length} concluídas</small>
          </div>
          <div className="bg-primary bg-opacity-10 rounded-circle p-2">
            <i className="fas fa-trophy text-primary"></i>
          </div>
        </div>

        {/* Completed Achievements */}
        <div className="border-bottom border-secondary border-opacity-25">
          <div className="px-4 py-3">
            <small className="text-white-50 text-uppercase fw-medium">Últimas Conquistas</small>
          </div>
          {completedAchievements.slice(-2).map((achievement, index) => (
            <AchievementItem key={index} {...achievement} />
          ))}
        </div>

        {/* Next Achievements */}
        <div>
          <div className="px-4 py-3">
            <small className="text-white-50 text-uppercase fw-medium">Próximas Conquistas</small>
          </div>
          {nextAchievements.map((achievement, index) => (
            <AchievementItem key={index} {...achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsCard;
