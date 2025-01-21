import React, { useState, useEffect } from 'react';
import { useWorkout } from '../../hooks/useWorkout';
import AddWorkoutForm from '../../components/AddWorkoutForm';

const Workouts = () => {
  const { loading, error, getWorkouts } = useWorkout();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error('Erro ao carregar treinos:', err);
      }
    };

    loadWorkouts();
  }, [getWorkouts]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Erro ao carregar treinos: {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="text-white mb-0">Meus Treinos</h4>
            <button 
              className="btn btn-primary" 
              data-bs-toggle="modal" 
              data-bs-target="#addWorkoutModal"
            >
              <i className="fas fa-plus me-2"></i>
              Novo Treino
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="card-title text-white mb-1">{workout.exercise}</h5>
                    <p className="text-white-50 mb-0">
                      {new Date(workout.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge bg-primary">
                    {workout.type}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Séries</span>
                    <span className="text-white">{workout.sets}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Repetições</span>
                    <span className="text-white">{workout.reps}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-white-50">Peso</span>
                    <span className="text-white">{workout.weight}kg</span>
                  </div>
                </div>

                {workout.notes && (
                  <div className="mt-3">
                    <small className="text-white-50 d-block">Observações:</small>
                    <small className="text-white">{workout.notes}</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para adicionar novo treino */}
      <div 
        className="modal fade" 
        id="addWorkoutModal" 
        tabIndex="-1" 
        aria-labelledby="addWorkoutModalLabel" 
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content bg-dark">
            <div className="modal-header border-secondary">
              <h5 className="modal-title text-white" id="addWorkoutModalLabel">
                Novo Treino
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <AddWorkoutForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
