import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Button, Form, Alert, Collapse } from 'react-bootstrap';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaDumbbell, FaCalendarAlt, FaClock, FaCheck, FaChevronDown, FaChevronUp, FaRunning, FaStar, FaBullseye, FaLayerGroup, FaRedo, FaRulerHorizontal, FaFire, FaVideo } from 'react-icons/fa';
import { useWorkout } from '../../hooks/useWorkout';
import { toast } from 'react-toastify';
import { useUser } from '../../hooks/useUser';

registerLocale('pt-BR', ptBR);

const WorkoutPage = () => {
  const { loading, error, getWorkoutsByDate, updateWorkoutProgress, finishWorkout } = useWorkout();
  const { user } = useUser();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [displayedWorkouts, setDisplayedWorkouts] = useState([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState(new Set());

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!startDate || !user) {
        setDisplayedWorkouts([]);
        return;
      }

      try {
        const endDateToUse = endDate || startDate;
        const workouts = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDateToUse) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          const dayWorkouts = await getWorkoutsByDate(dateStr);
          workouts.push(...dayWorkouts);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setDisplayedWorkouts(workouts);
      } catch (err) {
        console.error('Error loading workouts:', err);
        toast.error('Erro ao carregar treinos');
      }
    };

    loadWorkouts();
  }, [startDate, endDate, getWorkoutsByDate, user]);

  const handleExerciseComplete = (workoutId, exerciseIndex) => {
    setDisplayedWorkouts(prev => {
      return prev.map(workout => {
        if (workout.id !== workoutId) return workout;

        // Atualizar o exercício específico
        const updatedExercises = workout.exercises.map((exercise, index) => {
          if (index !== exerciseIndex) return exercise;

          return {
            ...exercise,
            completed: !exercise.completed,
            completedAt: !exercise.completed ? new Date().toISOString() : null
          };
        });

        return {
          ...workout,
          exercises: updatedExercises
        };
      });
    });
  };

  const handleFinishWorkout = async (workoutId) => {
    try {
      const workout = displayedWorkouts.find(w => w.id === workoutId);
      if (!workout) return;

      // Preparar os exercícios concluídos para salvar
      const completedExercises = workout.exercises
        .map((exercise, index) => ({
          index,
          completed: exercise.completed,
          completedAt: exercise.completedAt
        }))
        .filter(ex => ex.completed);

      // Finalizar o treino com os exercícios atuais
      await finishWorkout(workoutId, completedExercises);
      
      toast.success('Treino finalizado com sucesso!');

      // Atualizar o estado local após salvar
      setDisplayedWorkouts(prev => 
        prev.map(w => {
          if (w.id !== workoutId) return w;
          return {
            ...w,
            status: 'completed'
          };
        })
      );
    } catch (err) {
      console.error('Error finishing workout:', err);
      toast.error('Erro ao finalizar treino');
    }
  };

  const toggleWorkout = (workoutId) => {
    setExpandedWorkouts(prev => {
      const next = new Set(prev);
      if (next.has(workoutId)) {
        next.delete(workoutId);
      } else {
        next.add(workoutId);
      }
      return next;
    });
  };

  if (!user) {
    return (
      <Container className="py-4">
        <Card bg="dark" text="white" className="mb-4">
          <Card.Body className="text-center py-4">
            <Alert variant="warning" className="d-inline-block mb-0">
              Você precisa estar logado para ver seus treinos.
            </Alert>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Card do seletor de data */}
      <Card bg="dark" text="white" className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Filtrar Treinos</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label className="text-white-50">Período</Form.Label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              className="form-control bg-dark text-white border-secondary"
              placeholderText="Selecione um período"
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Card de mensagens e loader */}
      {(loading || error || (displayedWorkouts.length === 0 && startDate)) && (
        <Card bg="dark" text="white" className="mb-4">
          <Card.Body className="text-center py-4">
            {loading && (
              <div>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            )}

            {!loading && error && (
              <Alert variant="danger" className="d-inline-block mb-0">
                Erro ao carregar treinos: {error}
              </Alert>
            )}

            {!loading && !error && displayedWorkouts.length === 0 && startDate && (
              <Alert variant="info" className="d-inline-block mb-0">
                Nenhum treino encontrado para este período.
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Lista de treinos */}
      {displayedWorkouts.map(workout => (
        <Card 
          key={workout.id} 
          className="mb-4 bg-dark text-white"
        >
          <Card.Header 
            className="d-flex justify-content-between align-items-center cursor-pointer"
            onClick={() => toggleWorkout(workout.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center">
              <div className="me-3">
                {expandedWorkouts.has(workout.id) ? (
                  <FaChevronUp className="text-white-50" />
                ) : (
                  <FaChevronDown className="text-white-50" />
                )}
              </div>
              <div>
                <h5 className="mb-0">
                  <FaDumbbell className="me-2" />
                  {workout.name}
                </h5>
                {workout.status === 'completed' && (
                  <Badge bg="success" className="mt-2">
                    <FaCheck className="me-1" />
                    Treino Concluído
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <Badge bg="primary" className="me-2">
                <FaCalendarAlt className="me-1" />
                {format(new Date(workout.date), 'dd/MM/yyyy')}
              </Badge>
              {workout.duration && (
                <Badge bg="info">
                  <FaClock className="me-1" />
                  {workout.duration}min
                </Badge>
              )}
            </div>
          </Card.Header>

          <Collapse in={expandedWorkouts.has(workout.id)}>
            <div>
              <Card.Body>
                {/* Informações do treino */}
                <div className="mb-3">
                  {workout.sport && (
                    <Badge bg="secondary" className="me-2">
                      <FaRunning className="me-1" />
                      {workout.sport}
                    </Badge>
                  )}
                  {workout.level && (
                    <Badge bg="secondary" className="me-2">
                      <FaStar className="me-1" />
                      {workout.level}
                    </Badge>
                  )}
                  {workout.objective && (
                    <Badge bg="secondary" className="me-2">
                      <FaBullseye className="me-1" />
                      {workout.objective}
                    </Badge>
                  )}
                  {workout.duration && (
                    <Badge bg="info" className="me-2">
                      <FaClock className="me-1" />
                      {workout.duration}min
                    </Badge>
                  )}
                </div>

                {workout.description && (
                  <p className="text-white-50 mb-4">{workout.description}</p>
                )}

                {/* Lista de exercícios */}
                <div className="mb-4">
                  {workout.exercises.map((exercise, index) => (
                    <div 
                      key={exercise.id || index} 
                      className="mb-3 p-3 border border-secondary rounded bg-black"
                    >
                      <div className="d-flex">
                        {/* Número do exercício */}
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                          style={{ width: '32px', height: '32px', minWidth: '32px' }}
                        >
                          {index + 1}
                        </div>

                        {/* Detalhes do exercício */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-1">
                                {exercise.name}
                                {exercise.intensity && (
                                  <Badge 
                                    bg={
                                      exercise.intensity === 'intensa' ? 'danger' :
                                      exercise.intensity === 'moderada' ? 'warning' : 'info'
                                    } 
                                    className="ms-2"
                                  >
                                    <FaFire className="me-1" />
                                    {exercise.intensity}
                                  </Badge>
                                )}
                              </h6>
                              <div className="text-white-50 small">
                                {exercise.series && <span className="me-2">Séries: {exercise.series}</span>}
                                {exercise.repetitions && <span className="me-2">Repetições: {exercise.repetitions}</span>}
                                {exercise.distance && <span className="me-2">Distância: {exercise.distance}m</span>}
                                {exercise.material && <span className="me-2">Material: {exercise.material}</span>}
                              </div>
                              {exercise.description && (
                                <p className="text-white-50 mb-2 small mt-2">
                                  {exercise.description}
                                </p>
                              )}
                              {exercise.videoUrl && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 text-info mb-2"
                                  href={exercise.videoUrl}
                                  target="_blank"
                                >
                                  <FaVideo className="me-1" />
                                  Ver vídeo do exercício
                                </Button>
                              )}
                              {exercise.completed && (
                                <div className="text-success small">
                                  <FaCheck className="me-1" />
                                  Concluído
                                  {exercise.completedAt && (
                                    <span className="ms-1">
                                      ({format(new Date(exercise.completedAt), 'HH:mm')})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Form.Check
                              type="checkbox"
                              checked={exercise.completed}
                              onChange={() => handleExerciseComplete(workout.id, index)}
                              className="ms-3 mt-1"
                              disabled={workout.status === 'completed'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botões de ação */}
                <div className="mt-3 d-flex justify-content-end">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleFinishWorkout(workout.id)}
                    disabled={workout.savedStatus === 'completed'} // Usa o status salvo do banco
                  >
                    <FaCheck className="me-1" />
                    Finalizar Treino
                  </Button>
                </div>
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      ))}
    </Container>
  );
};

export default WorkoutPage;
