import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card, Form, Alert, Badge, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useWorkout } from '../../hooks/useWorkout';
import { FaCalendarAlt, FaClock, FaDumbbell, FaRunning, FaTrophy, FaSwimmer, FaCheck, FaVideo } from 'react-icons/fa';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-dark.css";
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

registerLocale('pt-BR', ptBR);

const WorkoutPage = () => {
  const { loading, error, getWorkoutsByDate } = useWorkout();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [completedExercises, setCompletedExercises] = useState({});
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!startDate) return;

      try {
        setSelectedWorkouts([]);
        setSelectedWorkoutId(null);
        const endDateToUse = endDate || startDate;
        const currentDate = new Date(startDate);
        const workouts = [];

        while (currentDate <= endDateToUse) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          const dayWorkouts = await getWorkoutsByDate(dateStr);
          console.log('Workouts loaded:', dayWorkouts); // Debug
          workouts.push(...dayWorkouts);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setSelectedWorkouts(workouts);
      } catch (err) {
        toast.error('Erro ao carregar treinos: ' + err.message);
      }
    };

    loadWorkouts();
  }, [startDate, endDate, getWorkoutsByDate]);

  const handleExerciseComplete = (workoutId, exerciseId) => {
    setCompletedExercises(prev => ({
      ...prev,
      [`${workoutId}_${exerciseId}`]: !prev[`${workoutId}_${exerciseId}`]
    }));
  };

  const handleFinishWorkout = (workoutId) => {
    toast.success('Treino finalizado com sucesso!');
  };

  const handleWorkoutClick = (workoutId) => {
    console.log('Workout clicked:', workoutId); // Debug
    setSelectedWorkoutId(selectedWorkoutId === workoutId ? null : workoutId);
  };

  const displayedWorkouts = selectedWorkoutId 
    ? selectedWorkouts.filter(w => w.id === selectedWorkoutId)
    : selectedWorkouts;

  console.log('Displayed workouts:', displayedWorkouts); // Debug

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Card bg="dark" text="light">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Treinos</h5>
              {selectedWorkoutId && (
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => setSelectedWorkoutId(null)}
                >
                  Mostrar Todos
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label className="text-white-50">Período do Treino</Form.Label>
                <div>
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
                    className="form-control bg-light text-light"
                    placeholderText="Selecione um período"
                    customInput={
                      <Form.Control
                        className="bg-dark text-dark border-secondary"
                        style={{ cursor: 'pointer' }}
                      />
                    }
                  />
                </div>
              </Form.Group>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : error ? (
                <Alert variant="danger">
                  Erro ao carregar treinos: {error}
                </Alert>
              ) : selectedWorkouts.length === 0 && startDate ? (
                <Alert variant="info">
                  Nenhum treino encontrado para este período.
                </Alert>
              ) : (
                displayedWorkouts.map((workout) => (
                  <Card 
                    key={workout.id} 
                    className="mb-3 bg-dark border-secondary text-light"
                    onClick={() => handleWorkoutClick(workout.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-0 text-light">
                            <FaDumbbell className="me-2" />
                            {workout.name}
                          </h5>
                          <div className="text-white-50 small mt-1">
                            {workout.sport && <span className="me-2">{workout.sport}</span>}
                            {workout.level && (
                              <Badge bg="secondary" className="me-2">
                                {workout.level}
                              </Badge>
                            )}
                            {workout.objective && <span>{workout.objective}</span>}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <Badge bg="primary" className="me-2">
                            <FaCalendarAlt className="me-1" />
                            {format(new Date(workout.date), 'dd/MM/yyyy')}
                          </Badge>
                          {workout.duration && (
                            <Badge bg="info" className="me-2">
                              <FaClock className="me-1" />
                              {workout.duration}min
                            </Badge>
                          )}
                          {workout.status && (
                            <Badge bg={workout.status === 'completed' ? 'success' : 'warning'}>
                              {workout.status === 'completed' ? 'Concluído' : 'Em andamento'}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {workout.description && (
                        <p className="text-white-50 mb-3">{workout.description}</p>
                      )}

                      {(workout.exercises || []).map((exercise, index) => (
                        <div 
                          key={exercise.id || index} 
                          className={`mb-3 p-3 border border-secondary rounded bg-black text-white`}
                        >
                          <div className="d-flex align-items-center">
                            <div 
                              className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                              style={{ width: '30px', height: '30px', minWidth: '30px' }}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center flex-wrap">
                                  <h6 className="mb-0 text-white me-2">{exercise.name}</h6>
                                  {exercise.intensity && (
                                    <Badge 
                                      bg={
                                        exercise.intensity === 'intensa' ? 'danger' :
                                        exercise.intensity === 'moderada' ? 'warning' : 'info'
                                      } 
                                      className="me-2"
                                    >
                                      {exercise.intensity}
                                    </Badge>
                                  )}
                                  {exercise.material && (
                                    <Badge bg="secondary" className="me-2">
                                      {exercise.material}
                                    </Badge>
                                  )}
                                </div>
                                <Form.Check
                                  type="checkbox"
                                  checked={exercise.completed}
                                  onChange={() => handleExerciseComplete(workout.id, exercise.id)}
                                  className="ms-3"
                                />
                              </div>
                              
                              <div className="mt-3">
                                <Row className="g-3">
                                  {exercise.series && (
                                    <Col md={2} className="mb-2">
                                      <div className="text-white">
                                        <strong>Séries:</strong>{' '}
                                        <span className="text-light">{exercise.series}</span>
                                      </div>
                                    </Col>
                                  )}
                                  {exercise.repetitions && (
                                    <Col md={2} className="mb-2">
                                      <div className="text-white">
                                        <strong>Repetições:</strong>{' '}
                                        <span className="text-light">{exercise.repetitions}</span>
                                      </div>
                                    </Col>
                                  )}
                                  {exercise.timePerSeries && (
                                    <Col md={2} className="mb-2">
                                      <div className="text-white">
                                        <strong>Tempo/Série:</strong>{' '}
                                        <span className="text-light">{exercise.timePerSeries}s</span>
                                      </div>
                                    </Col>
                                  )}
                                  {exercise.distance && (
                                    <Col md={2} className="mb-2">
                                      <div className="text-white">
                                        <strong>Distância:</strong>{' '}
                                        <span className="text-light">{exercise.distance}m</span>
                                      </div>
                                    </Col>
                                  )}
                                  {exercise.restTime && exercise.restTime !== '-1' && (
                                    <Col md={2} className="mb-2">
                                      <div className="text-white">
                                        <strong>Descanso:</strong>{' '}
                                        <span className="text-light">{exercise.restTime}s</span>
                                      </div>
                                    </Col>
                                  )}
                                </Row>
                                
                                {(exercise.description || exercise.notes || exercise.technique) && (
                                  <div className="mt-3">
                                    {exercise.description && (
                                      <p className="mb-2 text-white">
                                        <strong>Descrição:</strong>{' '}
                                        <span className="text-light">{exercise.description}</span>
                                      </p>
                                    )}
                                    {exercise.technique && (
                                      <p className="mb-2 text-white">
                                        <strong>Técnica:</strong>{' '}
                                        <span className="text-light">{exercise.technique}</span>
                                      </p>
                                    )}
                                    {exercise.notes && (
                                      <p className="mb-0 text-white">
                                        <strong>Observações:</strong>{' '}
                                        <span className="text-light">{exercise.notes}</span>
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="text-end mt-3">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFinishWorkout(workout.id);
                          }}
                        >
                          <FaCheck className="me-1" />
                          Finalizar Treino
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkoutPage;
