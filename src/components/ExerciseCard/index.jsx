import React from 'react';

const ExerciseCard = ({ exercise, onToggleComplete }) => {
  const getIntensityColor = (intensity) => {
    switch (intensity.toLowerCase()) {
      case 'leve':
        return 'success';
      case 'moderada':
        return 'warning';
      case 'intensa':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="pe-3">
          <h5 className="text-white mb-1">{exercise.name}</h5>
          <p className="text-white-50 small mb-0">{exercise.description}</p>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={exercise.completed}
            onChange={() => onToggleComplete?.(exercise)}
            disabled={!onToggleComplete}
          />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2">
        {exercise.intensity && (
          <div className="d-flex align-items-center">
            <span className={`badge bg-${getIntensityColor(exercise.intensity)} me-2`}>
              <i className="fas fa-fire-alt"></i>
            </span>
            <small className="text-white-50">{exercise.intensity}</small>
          </div>
        )}

        {exercise.material && (
          <div className="d-flex align-items-center">
            <span className="badge bg-secondary me-2">
              <i className="fas fa-dumbbell"></i>
            </span>
            <small className="text-white-50 text-truncate" style={{ maxWidth: '120px' }}>{exercise.material}</small>
          </div>
        )}

        {exercise.series && (
          <div className="d-flex align-items-center">
            <span className="badge bg-secondary me-2">
              <i className="fas fa-layer-group"></i>
            </span>
            <small className="text-white-50">{exercise.series}x</small>
          </div>
        )}

        {exercise.distance && (
          <div className="d-flex align-items-center">
            <span className="badge bg-secondary me-2">
              <i className="fas fa-ruler"></i>
            </span>
            <small className="text-white-50">{exercise.distance}m</small>
          </div>
        )}

        {exercise.repetitions && (
          <div className="d-flex align-items-center">
            <span className="badge bg-secondary me-2">
              <i className="fas fa-redo"></i>
            </span>
            <small className="text-white-50">{exercise.repetitions} reps</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
