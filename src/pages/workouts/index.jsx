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
    finishWorkout,
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
      const success = await finishWorkout(workout.id, workout.exercises);
      if (success) {
        loadWorkouts();
        setShowConfirmDialog(false);
        setWorkoutToFinish(null);
        toast.success('Treino finalizado com sucesso!');
      }
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
          <Col lg={6} className="mx-auto">
            {displayedWorkouts.map((workout) => (
              <Card
                key={workout.id}
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
                      <div className="mb-4">
                        {workout.exercises.map((exercise, index) => (
                          <div
                            key={exercise.id || index}
                            className="mb-3 p-3 border border-secondary rounded bg-black exercise-item"
                          >
                            <div className="d-flex flex-column flex-md-row">
                              {/* Número do exercício */}
                              <div className="exercise-number">
                                {index + 1}
                              </div>

                              {/* Detalhes do exercício */}
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2 exercise-header">
                                  <div>
                                    <h6 className="d-inline-flex align-items-center gap-2 exercise-title mb-1">
                                      {exercise.name}
                                      {exercise.intensity && (
                                        <Badge
                                          bg={
                                            exercise.intensity === 'intensa'
                                              ? 'danger'
                                              : exercise.intensity === 'moderada'
                                              ? 'warning'
                                              : 'info'
                                          }
                                        >
                                          <FaFire className="me-1" />
                                          {exercise.intensity}
                                        </Badge>
                                      )}
                                    </h6>
                                    <div className="text-white-50 small d-flex flex-wrap gap-2 exercise-details">
                                      {exercise.series && (
                                        <span>Séries: {exercise.series}</span>
                                      )}
                                      {exercise.repetitions && (
                                        <span>
                                          Repetições: {exercise.repetitions}
                                        </span>
                                      )}
                                      {exercise.distance && (
                                        <span>
                                          Distância: {exercise.distance}m
                                        </span>
                                      )}
                                      {exercise.material && (
                                        <span>
                                          Material: {exercise.material}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Form.Check
                                    type="checkbox"
                                    checked={exercise.completed}
                                    onChange={() =>
                                      handleExerciseComplete(workout.id, index)
                                    }
                                    disabled={workout.status === 'completed'}
                                    className="mt-2 mt-md-0"
                                  />
                                </div>
                                {exercise.description && (
                                  <p className="text-white-50 mb-2 small exercise-description">
                                    {exercise.description}
                                  </p>
                                )}
                                <div className="d-flex flex-wrap gap-3 align-items-center">
                                  {exercise.videoUrl && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="p-0 text-info"
                                      href={exercise.videoUrl}
                                      target="_blank"
                                    >
                                      <FaVideo className="me-1" />
                                      Ver vídeo
                                    </Button>
                                  )}
                                  {exercise.completed && (
                                    <div className="text-success small">
                                      <FaCheck className="me-1" />
                                      Concluído
                                      {exercise.completedAt && (
                                        <span className="ms-1">
                                          (
                                          {format(
                                            new Date(exercise.completedAt),
                                            'HH:mm'
                                          )}
                                          )
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
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
            ))}
          </Col>
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
