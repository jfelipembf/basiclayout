import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const CreateWorkout = () => {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    date: '',
    sport: '',
    level: 'iniciante',
    objective: '',
    description: '',
    duration: '',
    createdBy: '',
    status: 'in_progress'
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

  const [exercises, setExercises] = useState([]);

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
    if (currentExercise.name) {
      setExercises([...exercises, { ...currentExercise, id: Date.now() }]);
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
    }
  };

  return (
    <Container fluid className="p-4">
      <h1 className="h3 mb-4 text-white">Criar Treino</h1>
      
      {/* Card de Informações do Treino */}
      <Card className="card-workout mb-4 bg-dark border border-secondary border-opacity-50">
        <Card.Body className="p-4">
          <Form>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Nome do Treino *</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="name"
                    value={workoutData.name}
                    onChange={handleWorkoutChange}
                    placeholder="Ex: Treino de força"
                    required
                  />
                  <Form.Text className="text-light opacity-75">
                    Digite um nome descritivo para o treino
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Esporte *</Form.Label>
                  <Form.Select
                    className="bg-dark text-white border-secondary"
                    name="sport"
                    value={workoutData.sport}
                    onChange={handleWorkoutChange}
                    required
                  >
                    <option value="">Selecione um esporte</option>
                    <option value="natacao">Natação</option>
                    <option value="musculacao">Musculação</option>
                    <option value="corrida">Corrida</option>
                    <option value="ciclismo">Ciclismo</option>
                    <option value="crossfit">CrossFit</option>
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                    <option value="outro">Outro</option>
                  </Form.Select>
                  <Form.Text className="text-light opacity-75">
                    Selecione o esporte relacionado ao treino
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Nível *</Form.Label>
                  <Form.Select
                    className="bg-dark text-white border-secondary"
                    name="level"
                    value={workoutData.level}
                    onChange={handleWorkoutChange}
                    required
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </Form.Select>
                  <Form.Text className="text-light opacity-75">
                    Nível de dificuldade do treino
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Objetivo *</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="objective"
                    value={workoutData.objective}
                    onChange={handleWorkoutChange}
                    placeholder="Ex: Resistência anaeróbica"
                    required
                  />
                  <Form.Text className="text-light opacity-75">
                    Objetivo principal do treino
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Duração (minutos) *</Form.Label>
                  <Form.Control
                    type="number"
                    className="bg-dark text-white border-secondary"
                    name="duration"
                    value={workoutData.duration}
                    onChange={handleWorkoutChange}
                    placeholder="Ex: 45"
                    required
                  />
                  <Form.Text className="text-light opacity-75">
                    Tempo estimado do treino
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Card de Exercícios */}
      <Card className="card-exercises bg-dark border border-secondary border-opacity-50">
        <Card.Body className="p-4">
          <h4 className="text-white mb-4">Adicionar Exercícios</h4>
          <Form>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Nome do Exercício *</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="name"
                    value={currentExercise.name}
                    onChange={handleExerciseChange}
                    placeholder="Ex: Braçada de crawl"
                    required
                  />
                  <Form.Text className="text-light opacity-75">
                    Digite um nome descritivo para o exercício
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={3}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Séries *</Form.Label>
                  <Form.Control
                    type="number"
                    className="bg-dark text-white border-secondary"
                    name="series"
                    value={currentExercise.series}
                    onChange={handleExerciseChange}
                    placeholder="Ex: 6"
                    required
                  />
                  <Form.Text className="text-light opacity-75">
                    Número de séries
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Distância (m) *</Form.Label>
                  <Form.Control
                    type="number"
                    className="bg-dark text-white border-secondary"
                    name="distance"
                    value={currentExercise.distance}
                    onChange={handleExerciseChange}
                    placeholder="Ex: 36"
                    required
                  />
                  <Form.Text className="text-light opacity-75">
                    Distância em metros
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Tempo por Série</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="timePerSeries"
                    value={currentExercise.timePerSeries}
                    onChange={handleExerciseChange}
                    placeholder="Ex: 45s"
                  />
                  <Form.Text className="text-light opacity-75">
                    Tempo estimado por série
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Tempo de Descanso</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="restTime"
                    value={currentExercise.restTime}
                    onChange={handleExerciseChange}
                    placeholder="Ex: 30s"
                  />
                  <Form.Text className="text-light opacity-75">
                    Tempo de descanso entre séries
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Intensidade *</Form.Label>
                  <Form.Select
                    className="bg-dark text-white border-secondary"
                    name="intensity"
                    value={currentExercise.intensity}
                    onChange={handleExerciseChange}
                    required
                  >
                    <option value="leve">Leve</option>
                    <option value="moderada">Moderada</option>
                    <option value="intensa">Intensa</option>
                  </Form.Select>
                  <Form.Text className="text-light opacity-75">
                    Nível de intensidade do exercício
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Material Necessário</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="material"
                    value={currentExercise.material}
                    onChange={handleExerciseChange}
                    placeholder="Ex: Pullbuoy, prancha"
                  />
                  <Form.Text className="text-light opacity-75">
                    Equipamentos necessários
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    className="bg-dark text-white border-secondary"
                    rows={2}
                    name="notes"
                    value={currentExercise.notes}
                    onChange={handleExerciseChange}
                    placeholder="Ex: Manter ritmo constante, focar na técnica"
                  />
                  <Form.Text className="text-light opacity-75">
                    Observações adicionais
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="border-top border-secondary pt-4">
              <Button
                variant="primary"
                type="button"
                className="w-100 py-2"
                onClick={handleAddExercise}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Adicionar Exercício
              </Button>
            </div>

            {exercises.length > 0 && (
              <div className="mt-4">
                <h5 className="text-white mb-3">Exercícios Adicionados</h5>
                {exercises.map((exercise, index) => (
                  <Card key={exercise.id} className="mb-3 bg-dark">
                    <Card.Body>
                      <h6 className="text-white">{exercise.name}</h6>
                      <p className="text-white-50 mb-2">{exercise.description}</p>
                      <small className="text-white-50">
                        {exercise.series} séries | {exercise.distance}m | Intensidade: {exercise.intensity}
                      </small>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateWorkout;
