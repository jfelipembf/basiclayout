import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useWorkout } from '../../hooks/useWorkout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../hooks/useUser';

const CreateWorkout = () => {
  const { addWorkout, loading, sanitizeExercise } = useWorkout();
  const { user } = useUser();
  const navigate = useNavigate();

  const [workoutData, setWorkoutData] = useState({
    name: '',
    date: '',
    sport: '',
    level: 'iniciante',
    objective: '',
    description: '',
    duration: '',
    createdBy: user?.uid || '',
    status: 'in_progress',
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    description: '',
    series: '',
    repetitions: '',
    distance: '',
    intensity: 'moderada',
    material: '',
    videoUrl: '',
    restTime: '',
    notes: '',
    completed: false,
    timePerSeries: ''
  });

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExercise = () => {
    if (currentExercise.name && currentExercise.series && currentExercise.distance) {
      // Usar sanitizeExercise para converter campos numéricos
      const sanitizedExercise = sanitizeExercise({
        ...currentExercise,
        id: Date.now()
      });

      setWorkoutData(prev => ({
        ...prev,
        exercises: [...prev.exercises, sanitizedExercise]
      }));

      setCurrentExercise({
        name: '',
        description: '',
        series: '',
        repetitions: '',
        distance: '',
        intensity: 'moderada',
        material: '',
        videoUrl: '',
        technique: '',
        restTime: '',
        notes: '',
        completed: false,
        timePerSeries: ''
      });
      
      toast.success('Exercício adicionado com sucesso!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error('Preencha os campos obrigatórios do exercício', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleRemoveExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((exercise, i) => i !== index)
    }));
    toast.info('Exercício removido', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workoutData.name || !workoutData.date || workoutData.exercises.length === 0) {
      toast.error('Preencha todos os campos obrigatórios e adicione pelo menos um exercício', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    try {
      // Ajustar a data para considerar o timezone local
      const date = new Date(workoutData.date + 'T12:00:00');
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];

      const workoutWithExercises = {
        ...workoutData,
        date: adjustedDate,
        duration: Number(workoutData.duration) || 0,
        exercises: workoutData.exercises.map(exercise => sanitizeExercise(exercise)),
        createdAt: new Date().toISOString(),
      };

      await addWorkout(workoutWithExercises);
      
      toast.success('Treino criado com sucesso!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      
      navigate('/workouts');
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      toast.error('Erro ao criar treino. Tente novamente.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="bg-dark text-white border-secondary">
            <Card.Header className="border-secondary">
              <h4 className="mb-0">Criar Novo Treino</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Informações do Treino */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome do Treino*</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={workoutData.name}
                        onChange={handleWorkoutChange}
                        className="bg-dark text-light border-secondary"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Data*</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={workoutData.date}
                        onChange={handleWorkoutChange}
                        className="bg-dark text-light border-secondary"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Esporte</Form.Label>
                      <Form.Control
                        type="text"
                        name="sport"
                        value={workoutData.sport}
                        onChange={handleWorkoutChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nível</Form.Label>
                      <Form.Select
                        name="level"
                        value={workoutData.level}
                        onChange={handleWorkoutChange}
                        className="bg-dark text-light border-secondary"
                      >
                        <option value="iniciante">Iniciante</option>
                        <option value="intermediario">Intermediário</option>
                        <option value="avancado">Avançado</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Objetivo</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="objective"
                        value={workoutData.objective}
                        onChange={handleWorkoutChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={workoutData.description}
                        onChange={handleWorkoutChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duração (minutos)</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={workoutData.duration}
                        onChange={handleWorkoutChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Formulário de Exercício */}
                <Card className="mb-4 bg-dark text-white border-secondary">
                  <Card.Header className="border-secondary">
                    <h6 className="mb-0">Adicionar Exercício</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nome do Exercício*</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={currentExercise.name}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Séries*</Form.Label>
                          <Form.Control
                            type="number"
                            name="series"
                            value={currentExercise.series}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Repetições</Form.Label>
                          <Form.Control
                            type="number"
                            name="repetitions"
                            value={currentExercise.repetitions}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Distância (metros)*</Form.Label>
                          <Form.Control
                            type="number"
                            name="distance"
                            value={currentExercise.distance}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Intensidade</Form.Label>
                          <Form.Select
                            name="intensity"
                            value={currentExercise.intensity}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          >
                            <option value="leve">Leve</option>
                            <option value="moderada">Moderada</option>
                            <option value="intensa">Intensa</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Material</Form.Label>
                          <Form.Control
                            type="text"
                            name="material"
                            value={currentExercise.material}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Descrição do Exercício</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={currentExercise.description}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>URL do Vídeo</Form.Label>
                          <Form.Control
                            type="url"
                            name="videoUrl"
                            value={currentExercise.videoUrl}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tempo de Descanso (segundos)</Form.Label>
                          <Form.Control
                            type="number"
                            name="restTime"
                            value={currentExercise.restTime}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Observações</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="notes"
                            value={currentExercise.notes}
                            onChange={handleExerciseChange}
                            className="bg-dark text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      variant="success"
                      onClick={handleAddExercise}
                      className="w-100"
                    >
                      Adicionar Exercício
                    </Button>
                  </Card.Body>
                </Card>

                {/* Lista de Exercícios */}
                {workoutData.exercises.length > 0 && (
                  <Card className="mb-4 bg-dark text-white border-secondary">
                    <Card.Header className="border-secondary">
                      <h6 className="mb-0">Exercícios Configurados</h6>
                    </Card.Header>
                    <Card.Body>
                      {workoutData.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="border border-secondary rounded p-3 mb-3"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">{exercise.name}</h6>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemoveExercise(index)}
                            >
                              Remover
                            </Button>
                          </div>
                          <Row>
                            <Col md={4}>
                              <p className="mb-1">
                                <strong>Séries:</strong> {exercise.series}
                              </p>
                            </Col>
                            <Col md={4}>
                              <p className="mb-1">
                                <strong>Repetições:</strong>{" "}
                                {exercise.repetitions || "N/A"}
                              </p>
                            </Col>
                            <Col md={4}>
                              <p className="mb-1">
                                <strong>Distância:</strong>{" "}
                                {exercise.distance ? `${exercise.distance}m` : "N/A"}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <p className="mb-1">
                                <strong>Intensidade:</strong>{" "}
                                {exercise.intensity || "N/A"}
                              </p>
                            </Col>
                            <Col md={4}>
                              <p className="mb-1">
                                <strong>Material:</strong>{" "}
                                {exercise.material || "N/A"}
                              </p>
                            </Col>
                            <Col md={4}>
                              <p className="mb-1">
                                <strong>Descanso:</strong>{" "}
                                {exercise.restTime
                                  ? `${exercise.restTime}s`
                                  : "N/A"}
                              </p>
                            </Col>
                          </Row>
                          {exercise.description && (
                            <p className="mb-1">
                              <strong>Descrição:</strong> {exercise.description}
                            </p>
                          )}
                          {exercise.notes && (
                            <p className="mb-1">
                              <strong>Observações:</strong> {exercise.notes}
                            </p>
                          )}
                          {exercise.videoUrl && (
                            <p className="mb-0">
                              <strong>Vídeo:</strong>{" "}
                              <a
                                href={exercise.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-info"
                              >
                                Link
                              </a>
                            </p>
                          )}
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                )}

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(-1)}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                  >
                    Salvar Treino
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateWorkout;
