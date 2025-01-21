import React from 'react';

const LevelCard = ({ currentPoints, currentLevel, nextLevel, pointsToNextLevel }) => {
  const progressPercentage = (currentPoints / (currentPoints + pointsToNextLevel)) * 100;

  return (
    <div className="bg-dark">
      <div className="card-body p-4">
        <div className="row align-items-center">
          <div className="col-md-3">
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2" style={{ width: '48px', height: '48px' }}>
                  <i className="fas fa-star text-primary position-absolute top-50 start-50 translate-middle"></i>
                </div>
              </div>
              <div>
                <small className="text-white-50 d-block mb-1">Nível</small>
                <h4 className="text-white mb-0 fw-semibold">{currentLevel}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-6 my-3 my-md-0">
            <div className="px-md-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-white-50">Progresso para {nextLevel}</small>
                <small className="text-primary fw-medium">{currentPoints} / {currentPoints + pointsToNextLevel} pts</small>
              </div>
              <div className="progress bg-dark border border-secondary border-opacity-25" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar" 
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>

          <div className="col-md-3 text-md-end">
            <div>
              <small className="text-white-50 d-block mb-1">Próximo Nível</small>
              <div className="d-flex align-items-center justify-content-md-end">
                <h4 className="text-white mb-0 me-2 fw-semibold">{nextLevel}</h4>
                <div className="bg-primary bg-opacity-10 rounded-2 px-2 py-1">
                  <small className="text-primary fw-medium">
                    {pointsToNextLevel} pts
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCard;
