import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Badge, Button, Form, Alert, Collapse, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import { FaCheck, FaChevronDown, FaChevronUp, FaBullseye, FaClock, FaFire, FaVideo, FaEdit } from 'react-icons/fa';
import { useWorkout } from '../../hooks/useWorkout';
import { toast } from 'react-toastify';
import { useUser } from '../../hooks/useUser';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

registerLocale('pt-BR', ptBR);

const WorkoutPage = () => {
  const { loading, error, getWorkoutsByDate, updateWorkoutProgress, finishWorkout } = useWorkout();
  const { loading: loadingUser, user } = useUser();
  const [selectedDateRange, setSelectedDateRange] = useState([new Date(), null]);
  const [displayedWorkouts, setDisplayedWorkouts] = useState([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState(new Set());
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);

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

  // Função para lidar com a mudança de data
  const handleDateChange = (dates) => {
    setSelectedDateRange(dates);
  };

  // Função para formatar o texto do período
  const formatDateRangeText = useCallback(() => {
    if (!selectedDateRange[0]) return "Selecione um período";
    if (!selectedDateRange[1]) return format(selectedDateRange[0], 'dd/MM/yyyy');
    return `${format(selectedDateRange[0], 'dd/MM/yyyy')} - ${format(selectedDateRange[1], 'dd/MM/yyyy')}`;
  }, [selectedDateRange]);

  const handleExerciseComplete = (workoutId, exerciseIndex) => {
    setDisplayedWorkouts(prev => {
      return prev.map(w => {
        if (w.id !== workoutId) return w;

        const updatedExercises = w.exercises.map((exercise, index) => {
          if (index !== exerciseIndex) return exercise;

          const newCompleted = !exercise.completed;
          return {
            ...exercise,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : null
          };
        });

        // Atualizar no Firebase silenciosamente (sem toast)
        updateWorkoutProgress(workoutId, updatedExercises, w.status || 'in_progress', true);

        return {
          ...w,
          exercises: updatedExercises
        };
      });
    });
  };

  const handleFinishWorkout = async (workoutId) => {
    try {
      const workout = displayedWorkouts.find(w => w.id === workoutId);
      if (!workout) return;

      // Salvar o progresso com toast
      await updateWorkoutProgress(workoutId, workout.exercises, 'completed', false);
      
      // Atualizar estado local
      setDisplayedWorkouts(prev => prev.map(w => {
        if (w.id !== workoutId) return w;
        return { ...w, status: 'completed' };
      }));

      // Recarregar os treinos para atualizar a interface
      await loadWorkouts();
    } catch (err) {
      console.error('Error finishing workout:', err);
      toast.error('Erro ao salvar treino');
    }
  };

  const handleExpandToggle = (workoutId) => {
    setExpandedWorkouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  const handleEditToggle = (workoutId) => {
    setEditingWorkout(prev => prev === workoutId ? null : workoutId);
  };

  return (
    <Container className="py-4">
      <Row>
        {/* Coluna do calendário */}
        <Col xs={12} md={4} lg={3} className="mb-4">
          <Card className="bg-dark text-white">
            <Card.Header>
              <h5 className="mb-0">Período do Treino</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <DatePicker
                  selected={selectedDateRange[0]}
                  onChange={handleDateChange}
                  startDate={selectedDateRange[0]}
                  endDate={selectedDateRange[1]}
                  selectsRange={true}
                  locale="pt-BR"
                  dateFormat="dd/MM/yyyy"
                  calendarClassName="bg-dark"
                  className="form-control bg-dark text-white border-secondary"
                  monthsShown={1}
                  isClearable
                  showPopperArrow={false}
                  value={formatDateRangeText()}
                  autoComplete="off"
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna dos treinos */}
        <Col xs={12} md={8} lg={9}>
          {error && <Alert variant="danger">{error}</Alert>}

          {loadingWorkouts ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : displayedWorkouts.length === 0 ? (
            <Alert variant="info">Nenhum treino encontrado para o período selecionado.</Alert>
          ) : (
            <div className="workout-list">
              {displayedWorkouts.map(workout => (
                <Card 
                  key={workout.id} 
                  className="mb-4 bg-dark text-white workout-card"
                >
                  <Card.Header
                    className="d-flex justify-content-between align-items-start bg-dark text-white p-3 cursor-pointer"
                    onClick={() => handleExpandToggle(workout.id)}
                  >
                    <div className="d-flex flex-column flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <h5 className="mb-0 me-2">{workout.name}</h5>
                        <div className="d-flex gap-2">
                          {workout.sport && (
                            <Badge bg="primary">
                              {workout.sport}
                            </Badge>
                          )}
                          {workout.level && (
                            <Badge bg="info">
                              {workout.level}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <small className="text-light opacity-75">
                        {format(new Date(workout.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </small>
                    </div>
                    <div className="d-flex align-items-center ms-3">
                      {workout.status === 'completed' && (
                        <Badge bg="success" className="me-3">Concluído</Badge>
                      )}
                      {expandedWorkouts.has(workout.id) ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </Card.Header>
                  <Collapse in={expandedWorkouts.has(workout.id)}>
                    <div>
                      <Card.Body className="bg-dark text-white">
                        <div className="d-flex justify-content-end mb-3">
                          <Button 
                            variant="link" 
                            className="text-white p-0"
                            onClick={() => handleEditToggle(workout.id)}
                          >
                            <FaEdit size={18} />
                          </Button>
                        </div>

                        {/* Informações do treino */}
                        <div className="mb-4">
                          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                            <div className="mb-3 mb-md-0">
                              {workout.description && (
                                <p className="mb-2">{workout.description}</p>
                              )}
                              <div className="d-flex flex-wrap gap-2">
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
                            </div>
                          </div>
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
                                <div 
                                  className="me-3 mb-3 mb-md-0 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white exercise-number"
                                  style={{ width: '32px', height: '32px', minWidth: '32px' }}
                                >
                                  {index + 1}
                                </div>

                                {/* Detalhes do exercício */}
                                <div className="flex-grow-1">
                                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-2">
                                    <div className="mb-2 mb-md-0">
                                      <h6 className="mb-1 d-flex flex-wrap align-items-center gap-2">
                                        {exercise.name}
                                        {exercise.intensity && (
                                          <Badge 
                                            bg={
                                              exercise.intensity === 'intensa' ? 'danger' :
                                              exercise.intensity === 'moderada' ? 'warning' : 'info'
                                            }
                                          >
                                            <FaFire className="me-1" />
                                            {exercise.intensity}
                                          </Badge>
                                        )}
                                      </h6>
                                      <div className="text-white-50 small d-flex flex-wrap gap-2">
                                        {exercise.series && <span>Séries: {exercise.series}</span>}
                                        {exercise.repetitions && <span>Repetições: {exercise.repetitions}</span>}
                                        {exercise.distance && <span>Distância: {exercise.distance}m</span>}
                                        {exercise.material && <span>Material: {exercise.material}</span>}
                                      </div>
                                    </div>
                                    <Form.Check
                                      type="checkbox"
                                      checked={exercise.completed}
                                      onChange={() => handleExerciseComplete(workout.id, index)}
                                      disabled={workout.status === 'completed' && !editingWorkout}
                                      className="mt-2 mt-md-0"
                                    />
                                  </div>
                                  {exercise.description && (
                                    <p className="text-white-50 mb-2 small">
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
                                            ({format(new Date(exercise.completedAt), 'HH:mm')})
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
                            disabled={workout.status === 'completed' && !editingWorkout}
                          >
                            <FaCheck className="me-1" />
                            {editingWorkout === workout.id ? 'Salvar Alterações' : 'Finalizar Treino'}
                          </Button>
                        </div>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default WorkoutPage;
