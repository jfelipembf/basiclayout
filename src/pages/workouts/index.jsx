// src/pages/WorkoutPage/index.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Card,
  Badge,
  Button,
  Form,
  Alert,
  Collapse,
  Row,
  Col,
} from 'react-bootstrap';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaBullseye,
  FaClock,
  FaFire,
  FaVideo,
} from 'react-icons/fa';
import { useWorkout } from '../../hooks/useWorkout';
import { toast } from 'react-toastify';
import { useUser } from '../../hooks/useUser';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
import ConfirmDialog from '../../components/ConfirmDialog';

// Registrando a localização pt-BR para o DatePicker
registerLocale('pt-BR', ptBR);

const WorkoutPage = () => {
  const {
    loading,
    error,
    getWorkoutsByDate,
    updateWorkoutProgress,
    completeWorkout,
  } = useWorkout();
  const { loading: loadingUser, user } = useUser();
  const [selectedDateRange, setSelectedDateRange] = useState([
    new Date(),
    null,
  ]);
  const [displayedWorkouts, setDisplayedWorkouts] = useState([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState(new Set());
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [workoutToFinish, setWorkoutToFinish] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Função para carregar os treinos
  const loadWorkouts = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingWorkouts(true);
      const workouts = [];

      // Criar um loop para buscar treinos de cada dia no período
      const [start, end] = selectedDateRange;
      const currentDate = new Date(start);
      const endDate = end || start;

      while (currentDate <= endDate) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const dayWorkouts = await getWorkoutsByDate(dateStr);
        workouts.push(...dayWorkouts);

        // Avançar para o próximo dia
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDisplayedWorkouts(workouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
      toast.error('Erro ao carregar treinos');
    } finally {
      setLoadingWorkouts(false);
    }
  }, [selectedDateRange, getWorkoutsByDate, user]);

  // Carregar treinos quando a página montar ou quando as datas mudarem
  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Função para formatar o texto do período
  const formatDateRangeText = useCallback(() => {
    if (!selectedDateRange[0]) return 'Selecione um período';
    if (!selectedDateRange[1])
      return format(selectedDateRange[0], 'dd/MM/yyyy');
    return `${format(selectedDateRange[0], 'dd/MM/yyyy')} - ${format(
      selectedDateRange[1],
      'dd/MM/yyyy'
    )}`;
  }, [selectedDateRange]);

  // Manipular a conclusão de um exercício
  const handleExerciseComplete = (workoutId, exerciseIndex) => {
    setDisplayedWorkouts((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;

        const updatedExercises = w.exercises.map((exercise, index) => {
          if (index !== exerciseIndex) return exercise;

          const newCompleted = !exercise.completed;
          return {
            ...exercise,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : null,
          };
        });

        // Atualizar no backend silenciosamente
        updateWorkoutProgress(
          workoutId,
          updatedExercises,
          w.status || 'in_progress',
          true
        );

        return {
          ...w,
          exercises: updatedExercises,
        };
      })
    );
  };

  // Manipular a finalização do treino
  const handleFinishWorkout = async (workoutId) => {
    const workout = displayedWorkouts.find((w) => w.id === workoutId);
    if (!workout) return;

    // Verificar se todos os exercícios foram completados
    const hasUncompletedExercises = workout.exercises.some(
      (exercise) => !exercise.completed
    );

    if (hasUncompletedExercises) {
      setWorkoutToFinish(workout);
      setShowConfirmDialog(true);
      return;
    }

    await finishWorkoutProgress(workout);
  };

  // Finalizar o treino após confirmação
  const finishWorkoutProgress = async (workout) => {
    try {
      await completeWorkout(workout.id, workout, workout.exercises);
      loadWorkouts();
      setShowConfirmDialog(false);
      setWorkoutToFinish(null);
      toast.success('Treino finalizado com sucesso!');
    } catch (error) {
      console.error('Error finishing workout:', error);
      toast.error('Erro ao finalizar treino');
    }
  };

  // Confirmar a finalização do treino
  const handleConfirmFinishWorkout = () => {
    if (workoutToFinish) {
      finishWorkoutProgress(workoutToFinish);
    }
  };

  // Alternar a expansão do card do treino
  const handleExpandToggle = (workoutId) => {
    setExpandedWorkouts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  // Função para abrir o datepicker
  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  // Função para fechar o datepicker
  const handleCloseDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  // Função para lidar com a mudança de data
  const handleDateChange = (dates) => {
    setSelectedDateRange(dates);
    if (dates[1] !== null) {
      handleCloseDatePicker();
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
            <Form.Group className="flex-grow-1" style={{ maxWidth: '300px' }}>
              <DatePicker
                selected={selectedDateRange[0]}
                onChange={handleDateChange}
                startDate={selectedDateRange[0]}
                endDate={selectedDateRange[1]}
                selectsRange
                locale="pt-BR"
                className="form-control bg-dark text-white border-secondary"
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione um período"
                onCalendarOpen={handleOpenDatePicker}
                onCalendarClose={handleCloseDatePicker}
                shouldCloseOnSelect={false}
                calendarClassName="custom-datepicker"
                popperClassName="custom-datepicker-popper"
                popperPlacement="bottom"
                popperProps={{
                  strategy: "fixed"
                }}
              />
            </Form.Group>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loadingWorkouts ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
            aria-hidden="true"
          ></div>
          <span className="visually-hidden">Carregando...</span>
        </div>
      ) : displayedWorkouts.length === 0 ? (
        <Alert variant="info">
          Nenhum treino encontrado para o período selecionado.
        </Alert>
      ) : (
        <Row className="workout-list">
          {displayedWorkouts.map((workout) => (
            <Col xs={12} key={workout.id}>
              <Card
                className="mb-4 bg-dark text-white workout-card shadow-sm"
              >
                <Card.Header
                  className="d-flex justify-content-between align-items-start p-3 cursor-pointer"
                  onClick={() => handleExpandToggle(workout.id)}
                >
                  <div className="flex-grow-1">
                    <h5 className="mb-1 workout-title">{workout.name}</h5>
                    <small className="text-light opacity-75 mb-2">
                      {format(new Date(workout.date), "EEEE, dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </small>
                    <div className="d-flex gap-2">
                      {workout.sport && (
                        <Badge bg="primary">{workout.sport}</Badge>
                      )}
                      {workout.level && (
                        <Badge bg="info">{workout.level}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center ms-3">
                    {workout.status === 'completed' && (
                      <Badge bg="success" className="me-3">
                        Concluído
                      </Badge>
                    )}
                    {expandedWorkouts.has(workout.id) ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </Card.Header>
                <Collapse in={expandedWorkouts.has(workout.id)}>
                  <div>
                    <Card.Body>
                      {/* Informações do treino */}
                      {workout.description && (
                        <p className="workout-description mb-2">
                          {workout.description}
                        </p>
                      )}
                      <div className="d-flex flex-wrap gap-2 mb-4 workout-details">
                        {workout.objective && (
                          <Badge bg="secondary">
                            <FaBullseye className="me-1" />
                            {workout.objective}
                          </Badge>
                        )}
                        {workout.duration && (
                          <Badge bg="secondary">
                            <FaClock className="me-1" />
                            {workout.duration}min
                          </Badge>
                        )}
                      </div>

                      {/* Lista de exercícios */}
                      <div className="mb-3">
                        {workout.exercises.map((exercise, index) => (
                          <div
                            key={exercise.id || index}
                            className="exercise-item"
                          >
                            <div className="d-flex align-items-start">
                              {/* Número do exercício */}
                              <div className="exercise-number">
                                {index + 1}
                              </div>

                              {/* Detalhes do exercício */}
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div className="pe-4">
                                    <h6 className="exercise-title mb-0">
                                      {exercise.name}
                                    </h6>
                                    {exercise.intensity && (
                                      <Badge
                                        bg={
                                          exercise.intensity === 'intensa'
                                            ? 'danger'
                                            : exercise.intensity === 'moderada'
                                            ? 'warning'
                                            : 'info'
                                        }
                                        className="mt-1"
                                      >
                                        <FaFire className="me-1" />
                                        {exercise.intensity}
                                      </Badge>
                                    )}
                                  </div>
                                  <Form.Check
                                    type="checkbox"
                                    checked={exercise.completed}
                                    onChange={() =>
                                      handleExerciseComplete(workout.id, index)
                                    }
                                    disabled={workout.status === 'completed'}
                                  />
                                </div>

                                <div className="exercise-details d-flex flex-wrap gap-2 mb-2">
                                  {console.log('Exercise:', exercise)}
                                  {console.log('Repetitions value:', exercise.repetitions)}
                                  {console.log('Repetitions type:', typeof exercise.repetitions)}
                                  
                                  {exercise.series && exercise.series !== "" && (
                                    <span className="text-light">
                                      <i className="fas fa-redo-alt me-2"></i>
                                      {exercise.series} {parseInt(exercise.series) === 1 ? 'série' : 'séries'}
                                    </span>
                                  )}
                                  {Number(exercise.repetitions) > 0 && (
                                    <span className="text-light">
                                      <i className="fas fa-repeat me-2"></i>
                                      {exercise.repetitions} rep
                                    </span>
                                  )}
                                  {exercise.distance && exercise.distance !== "" && (
                                    <span className="text-light">
                                      <i className="fas fa-ruler me-2"></i>
                                      {exercise.distance}m
                                    </span>
                                  )}
                                  {exercise.timePerSeries && exercise.timePerSeries !== "" && (
                                    <span className="text-light">
                                      <i className="fas fa-stopwatch me-2"></i>
                                      {exercise.timePerSeries} por série
                                    </span>
                                  )}
                                  {exercise.restTime && exercise.restTime !== "" && (
                                    <span className="text-light">
                                      <i className="fas fa-hourglass-half me-2"></i>
                                      {exercise.restTime} descanso
                                    </span>
                                  )}
                                  {exercise.material && exercise.material !== "" && (
                                    <span className="text-light">
                                      <i className="fas fa-dumbbell me-2"></i>
                                      {exercise.material}
                                    </span>
                                  )}
                                  {exercise.intensity && exercise.intensity !== "" && (
                                    <span className="text-light">
                                      <i className="fas fa-tachometer-alt me-2"></i>
                                      {exercise.intensity}
                                    </span>
                                  )}
                                  {exercise.technique && exercise.technique !== "" && (
                                    <span className="text-light">
                                      <i className="fas fa-graduation-cap me-2"></i>
                                      Técnica: {exercise.technique}
                                    </span>
                                  )}
                                </div>

                                {exercise.description && exercise.description !== "" && (
                                  <p className="exercise-description text-light mb-2">
                                    <i className="fas fa-info-circle me-2"></i>
                                    {exercise.description}
                                  </p>
                                )}

                                {exercise.notes && exercise.notes !== "" && (
                                  <p className="exercise-notes text-light">
                                    <i className="fas fa-comment-alt me-2"></i>
                                    {exercise.notes}
                                  </p>
                                )}

                                {exercise.videoUrl && exercise.videoUrl !== "" && (
                                  <div className="mt-2">
                                    <a href={exercise.videoUrl} 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       className="text-light text-decoration-none">
                                      <i className="fas fa-video me-2"></i>
                                      Ver vídeo
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Botões de ação */}
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleFinishWorkout(workout.id)}
                          disabled={workout.status === 'completed'}
                        >
                          <FaCheck className="me-1" />
                          Finalizar Treino
                        </Button>
                      </div>
                    </Card.Body>
                  </div>
                </Collapse>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal de Confirmação */}
      <ConfirmDialog
        show={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmFinishWorkout}
        title="Confirmar Finalização"
        message="Tem certeza que deseja finalizar este treino? Esta ação não pode ser desfeita."
      />
    </Container>
  );
};

export default WorkoutPage;
