import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutSession = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRest, setIsRest] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [showModal, setShowModal] = useState(false);

  // Formata o tempo em HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Efeito para o cronômetro principal
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Efeito para o contador regressivo de descanso
  useEffect(() => {
    let interval = null;
    if (isRest && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((time) => {
          if (time <= 1) {
            setIsRest(false);
            setCurrentRound(r => r + 1);
            return 60;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRest, restTime]);

  const handleStartWorkout = () => {
    setIsRunning(true);
  };

  const handleFinishWorkout = () => {
    navigate('/dashboard');
  };

  return (
    <div className="vh-100 bg-dark d-flex flex-column position-relative overflow-hidden">
      {/* Botão Fechar */}
      <button 
        className="btn btn-link text-white position-absolute top-0 end-0 p-4"
        onClick={() => setShowModal(true)}
        style={{ fontSize: '1.5rem', zIndex: 1030 }}
      >
        <i className="fas fa-times"></i>
      </button>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-white">Finalizar Treino</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-white-50 mb-0">Tem certeza que deseja finalizar o treino atual?</p>
              </div>
              <div className="modal-footer border-secondary">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleFinishWorkout}
                >
                  Finalizar Treino
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área do Cronômetro (50%) */}
      <div className="d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <div className="display-1 fw-bold text-white mb-3" style={{ fontSize: '6rem' }}>
            {formatTime(time)}
          </div>
          {isRunning && (
            <div className="d-flex justify-content-center align-items-center gap-4">
              <div className="text-center">
                <div className="text-white-50 small mb-1">Rodada</div>
                <div className="fs-4 fw-semibold text-white">{currentRound}</div>
              </div>
              {isRest && (
                <div className="text-center">
                  <div className="text-white-50 small mb-1">Descanso</div>
                  <div className="fs-4 fw-semibold text-primary">{restTime}s</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Área dos Botões (50%) */}
      <div className="bg-dark border-top border-secondary border-opacity-25 d-flex align-items-center" style={{ height: '50vh' }}>
        <div className="container h-75 py-4">
          <div className="d-grid h-100">
            {!isRunning ? (
              <button 
                className="btn btn-primary btn-lg rounded-3 fw-semibold h-100"
                onClick={handleStartWorkout}
                style={{ fontSize: '1.5rem' }}
              >
                <i className="fas fa-play-circle me-2"></i>
                INICIAR
              </button>
            ) : (
              !isRest && (
                <button 
                  className="btn btn-primary btn-lg rounded-3 fw-semibold h-100"
                  onClick={() => setIsRest(true)}
                >
                  <i className="fas fa-check-circle me-2"></i>
                  Finalizar Rodada
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;
