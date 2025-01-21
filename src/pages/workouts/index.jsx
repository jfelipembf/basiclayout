import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ExerciseCard from '../../components/ExerciseCard';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css';

const WorkoutPage = () => {
  // Dados fictícios de treinos
  const mockWorkouts = [
    {
      id: 1,
      createdAt: "2025-01-16T21:40:40-03:00",
      date: "2025-01-16",
      duration: "45",
      exercises: [
        {
          id: 1,
          completed: true,
          description: "Aquecimento com foco na técnica",
          distance: "200",
          intensity: "leve",
          material: "",
          name: "Aquecimento Livre",
          repetitions: "",
          series: "1",
          videoUrl: ""
        },
        {
          id: 2,
          completed: true,
          description: "2x lentas 2x médias intensidades 2x Intensas",
          distance: "36",
          intensity: "intensa",
          material: "Pullboll",
          name: "Braçada de crawl",
          repetitions: "",
          series: "6",
          videoUrl: ""
        },
        {
          id: 3,
          completed: false,
          description: "Golginhada até precisar respirar, so faz braçada quando for respirar",
          distance: "36",
          intensity: "moderada",
          material: "",
          name: "Borboleta",
          repetitions: "",
          series: "5",
          videoUrl: ""
        }
      ],
      level: "iniciante",
      name: "Preparatório para 360m",
      objective: "Resistencia anaeróbica",
      sport: "Natação",
      status: "in_progress"
    },
    {
      id: 2,
      createdAt: "2025-01-17T21:40:40-03:00",
      date: "2025-01-17",
      duration: "60",
      exercises: [
        {
          id: 4,
          completed: true,
          description: "Foco na técnica e respiração",
          distance: "50",
          intensity: "moderada",
          material: "Prancha",
          name: "Pernada de crawl",
          repetitions: "",
          series: "4",
          videoUrl: ""
        },
        {
          id: 5,
          completed: true,
          description: "Manter ritmo constante",
          distance: "100",
          intensity: "leve",
          material: "",
          name: "Nado livre completo",
          repetitions: "",
          series: "3",
          videoUrl: ""
        },
        {
          id: 6,
          completed: false,
          description: "Foco na respiração bilateral",
          distance: "25",
          intensity: "moderada",
          material: "Snorkel",
          name: "Crawl com snorkel",
          repetitions: "",
          series: "4",
          videoUrl: ""
        }
      ],
      level: "iniciante",
      name: "Treino de resistência",
      objective: "Resistência aeróbica",
      sport: "Natação",
      status: "in_progress"
    },
    {
      id: 3,
      createdAt: "2025-01-18T21:40:40-03:00",
      date: "2025-01-18",
      duration: "75",
      exercises: [
        {
          id: 7,
          completed: true,
          description: "Aquecimento progressivo",
          distance: "300",
          intensity: "leve",
          material: "",
          name: "Aquecimento Progressivo",
          repetitions: "",
          series: "1",
          videoUrl: ""
        },
        {
          id: 8,
          completed: true,
          description: "Sprint máximo com recuperação completa",
          distance: "25",
          intensity: "intensa",
          material: "Palmar",
          name: "Sprint Crawl",
          repetitions: "",
          series: "8",
          videoUrl: ""
        },
        {
          id: 9,
          completed: true,
          description: "Trabalho de pernada forte",
          distance: "50",
          intensity: "moderada",
          material: "Prancha e Nadadeiras",
          name: "Pernada Crawl",
          repetitions: "",
          series: "4",
          videoUrl: ""
        },
        {
          id: 10,
          completed: false,
          description: "Volta à calma com técnica",
          distance: "200",
          intensity: "leve",
          material: "",
          name: "Soltura",
          repetitions: "",
          series: "1",
          videoUrl: ""
        }
      ],
      level: "intermediário",
      name: "Treino de velocidade",
      objective: "Velocidade e potência",
      sport: "Natação",
      status: "in_progress"
    },
    {
      id: 4,
      createdAt: "2025-01-19T21:40:40-03:00",
      date: "2025-01-19",
      duration: "90",
      exercises: [
        {
          id: 11,
          completed: false,
          description: "Foco na técnica de respiração",
          distance: "400",
          intensity: "leve",
          material: "",
          name: "Aquecimento Técnico",
          repetitions: "",
          series: "1",
          videoUrl: ""
        },
        {
          id: 12,
          completed: false,
          description: "Alternar 50m forte / 50m moderado",
          distance: "100",
          intensity: "intensa",
          material: "",
          name: "Séries Progressivas",
          repetitions: "",
          series: "6",
          videoUrl: ""
        },
        {
          id: 13,
          completed: false,
          description: "Trabalho específico de braçada",
          distance: "50",
          intensity: "moderada",
          material: "Palmar e Pullboll",
          name: "Braçada Técnica",
          repetitions: "",
          series: "6",
          videoUrl: ""
        },
        {
          id: 14,
          completed: false,
          description: "Trabalho de coordenação",
          distance: "25",
          intensity: "moderada",
          material: "Snorkel",
          name: "Coordenação 3T",
          repetitions: "",
          series: "8",
          videoUrl: ""
        },
        {
          id: 15,
          completed: false,
          description: "Soltura e alongamento na água",
          distance: "200",
          intensity: "leve",
          material: "",
          name: "Regenerativo",
          repetitions: "",
          series: "1",
          videoUrl: ""
        }
      ],
      level: "intermediário",
      name: "Treino técnico avançado",
      objective: "Aperfeiçoamento técnico",
      sport: "Natação",
      status: "pending"
    }
  ];

  const [selectedDate, setSelectedDate] = useState(mockWorkouts[0].date);
  const [workouts, setWorkouts] = useState(mockWorkouts);
  const selectedWorkout = workouts.find(workout => workout.date === selectedDate) || workouts[0];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleToggleExercise = (toggledExercise) => {
    if (selectedWorkout.status === 'completed') return;

    setWorkouts(currentWorkouts => 
      currentWorkouts.map(workout => {
        if (workout.date === selectedDate) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => 
              exercise.id === toggledExercise.id
                ? { ...exercise, completed: !exercise.completed }
                : exercise
            )
          };
        }
        return workout;
      })
    );
  };

  const handleFinishWorkout = async () => {
    const allExercisesCompleted = selectedWorkout.exercises.every(exercise => exercise.completed);

    if (!allExercisesCompleted) {
      const result = await Swal.fire({
        title: 'Atenção',
        text: 'Alguns exercícios ainda não foram concluídos. Deseja finalizar o treino mesmo assim?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, finalizar',
        cancelButtonText: 'Não, voltar',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545'
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    setWorkouts(currentWorkouts =>
      currentWorkouts.map(workout =>
        workout.date === selectedDate
          ? { ...workout, status: 'completed' }
          : workout
      )
    );

    toast.success('Treino finalizado com sucesso!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="container-fluid py-4">
      <Row className="mb-4">
        <Col xs={12} className="mb-4">
          <div className="d-flex justify-content-end">
            <input
              type="date"
              className="form-control bg-dark text-white border-secondary"
              style={{ width: '200px' }}
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </Col>
        <Col xs={12}>
          <div className="bg-dark border border-secondary border-opacity-50 rounded p-4">
            <div>
              <h4 className="text-white mb-3">{selectedWorkout.name}</h4>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <span className="text-white-50">
                  <i className="fas fa-stopwatch me-2"></i>
                  {selectedWorkout.duration} min
                </span>
                <span className="text-white-50">
                  <i className="fas fa-signal me-2"></i>
                  {selectedWorkout.level}
                </span>
                <span className="text-white-50">
                  <i className="fas fa-bullseye me-2"></i>
                  {selectedWorkout.objective}
                </span>
                <span className="text-white-50">
                  <i className="fas fa-running me-2"></i>
                  {selectedWorkout.sport}
                </span>
              </div>
              <span className={`badge ${
                selectedWorkout.status === 'completed' ? 'bg-success' : 
                selectedWorkout.status === 'in_progress' ? 'bg-warning' : 
                'bg-secondary'
              }`}>
                {selectedWorkout.status === 'completed' ? 'Concluído' : 
                 selectedWorkout.status === 'in_progress' ? 'Em andamento' : 
                 'Pendente'}
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {selectedWorkout.exercises.map((exercise, index) => (
          <Col key={index} xs={12} sm={6} lg={4}>
            <div className="bg-dark border border-secondary border-opacity-50 rounded h-100">
              <ExerciseCard 
                exercise={exercise} 
                onToggleComplete={handleToggleExercise}
              />
            </div>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col className="d-flex justify-content-end">
          <button
            className="btn btn-success"
            onClick={handleFinishWorkout}
            disabled={selectedWorkout.status === 'completed'}
          >
            <i className="fas fa-check me-2"></i>
            Finalizar Treino
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default WorkoutPage;
