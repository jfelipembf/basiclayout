import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import LevelCard from '../../components/LevelCard';
import AchievementsCard from '../../components/AchievementsCard';
import { Row, Col, Card } from 'react-bootstrap';
import './styles.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Dados fictícios para o LevelCard
  const levelData = {
    currentPoints: 2750,
    currentLevel: 'Intermediário',
    nextLevel: 'Avançado',
    pointsToNextLevel: 250
  };

  // Dados fictícios para o AchievementsCard
  const achievementsData = [
    {
      icon: 'fa-fire',
      title: 'Primeira Sequência',
      description: 'Complete 3 treinos em dias consecutivos',
      isCompleted: true
    },
    {
      icon: 'fa-dumbbell',
      title: 'Iniciante Dedicado',
      description: 'Complete 10 treinos no total',
      isCompleted: true
    },
    {
      icon: 'fa-clock',
      title: 'Maratonista',
      description: 'Acumule 5 horas de treino',
      isCompleted: false,
      progress: {
        current: 4.2,
        total: 5
      }
    },
    {
      icon: 'fa-road',
      title: 'Corredor de Longa Distância',
      description: 'Corra 50km no total',
      isCompleted: false,
      progress: {
        current: 42.5,
        total: 50
      }
    },
    {
      icon: 'fa-calendar-check',
      title: 'Consistência é Tudo',
      description: 'Complete 20 treinos em um mês',
      isCompleted: false,
      progress: {
        current: 12,
        total: 20
      }
    }
  ];

  return (
    <div className="container-fluid">
      <Row className="g-4">
        {/* Botão Iniciar Treino */}
        <Col lg={12}>
          <div className="d-grid">
            <button 
              className="btn btn-primary btn-lg py-3 rounded-3"
              onClick={() => navigate('/workout-session')}
            >
              <i className="fas fa-play-circle me-2"></i>
              Iniciar Treino
            </button>
          </div>
        </Col>

        {/* Level Card */}
        <Col lg={12}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <LevelCard {...levelData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Stat Cards */}
        <Col lg={4} sm={6}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <StatCard
                title="Distância Total"
                value="42.5 km"
                previousValue={35.2}
                growth={20.7}
                icon="fa-road"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} sm={6}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <StatCard
                title="Tempo Total"
                value="280 min"
                previousValue={320}
                growth={-12.5}
                icon="fa-clock"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} sm={6}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <StatCard
                title="Frequência Mensal"
                value="12 treinos"
                previousValue={8}
                growth={50}
                icon="fa-calendar-check"
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Achievements Card */}
        <Col lg={12}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <AchievementsCard achievements={achievementsData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
