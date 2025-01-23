import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout } from '../../hooks/useWorkout';
import { toast } from 'react-toastify';

const WorkoutSession = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { completeWorkout } = useWorkout();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRest, setIsRest] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [showModal, setShowModal] = useState(false);
  const [workout, setWorkout] = useState(null);

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

  const handleFinishWorkout = async () => {
    try {
      if (workout) {
        await completeWorkout(workoutId, workout, workout.exercises);
        toast.success('Treino finalizado com sucesso!');
      }
      navigate('/workouts');
    } catch (error) {
      console.error('Error finishing workout:', error);
      toast.error('Erro ao finalizar treino');
    }
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

      {/* Conteúdo Principal */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-white">
        {/* Cronômetro */}
        <div className="display-1 mb-4 font-monospace">
          {formatTime(time)}
        </div>

        {/* Controles */}
        <div className="d-flex gap-3 mb-4">
          <button 
            className={`btn ${isRunning ? 'btn-danger' : 'btn-success'} btn-lg`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <><i className="fas fa-pause me-2"></i>Pausar</>
            ) : (
              <><i className="fas fa-play me-2"></i>Iniciar</>
            )}
          </button>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => {
              setIsRest(true);
              setIsRunning(false);
            }}
            disabled={isRest}
          >
            <i className="fas fa-hourglass-start me-2"></i>
            Descanso
          </button>
        </div>

        {/* Contador de Rounds */}
        <div className="text-center">
          <div className="h4 mb-0">Round</div>
          <div className="display-4">{currentRound}</div>
        </div>
      </div>

      {/* Overlay de Descanso */}
      {isRest && (
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1020 }}
        >
          <div className="display-1 text-warning mb-3">
            {restTime}
          </div>
          <h2 className="text-white mb-4">Tempo de Descanso</h2>
          <button 
            className="btn btn-outline-light btn-lg"
            onClick={() => {
              setIsRest(false);
              setRestTime(60);
              setCurrentRound(r => r + 1);
            }}
          >
            Pular Descanso
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutSession;
