import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import LevelCard from '../../components/LevelCard';
import AchievementsCard from '../../components/AchievementsCard';
import { Row, Col, Card } from 'react-bootstrap';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import './styles.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState({ current: null, previous: null });
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        // Buscar informações gerais do usuário
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data().info;
          setUserInfo(userData);
          console.log('🏃‍♂️ Dados Gerais do Usuário:', {
            frequency: userData.frequency,
            totalDistance: userData.totalDistance + 'm',
            totalTime: userData.totalTime + 'min'
          });
        }

        // Buscar estatísticas mensais
        const monthlyStatsRef = collection(db, 'users', auth.currentUser.uid, 'monthlyStats');
        const q = query(monthlyStatsRef, orderBy('monthId', 'desc'), limit(2));
        const querySnapshot = await getDocs(q);
        
        console.log('🔍 Documentos encontrados:', querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })));

        const stats = [];
        querySnapshot.forEach((doc) => {
          stats.push(doc.data());
        });

        console.log('📝 Stats brutos:', stats);
        
        const monthlyData = {
          current: stats.length > 0 ? stats[0] : null,
          previous: stats.length > 1 ? stats[1] : null
        };
        
        setMonthlyStats(monthlyData);
        
        console.log('📊 Dados Mensais:', {
          mesAtual: monthlyData.current ? {
            mes: monthlyData.current.monthId,
            frequency: monthlyData.current.frequency + ' treinos',
            distance: monthlyData.current.totalDistance + 'm',
            time: monthlyData.current.totalTime + 'min'
          } : 'Sem dados',
          mesAnterior: monthlyData.previous ? {
            mes: monthlyData.previous.monthId,
            frequency: monthlyData.previous.frequency + ' treinos',
            distance: monthlyData.previous.totalDistance + 'm',
            time: monthlyData.previous.totalTime + 'min'
          } : 'Sem dados'
        });

        // Adicionar log para debug da query
        console.log('🔎 Query Debug:', {
          path: `users/${auth.currentUser.uid}/monthlyStats`,
          orderBy: 'monthId desc',
          limit: 2,
          resultCount: querySnapshot.size
        });

        // Calcular e mostrar as variações percentuais
        if (monthlyData.current && monthlyData.previous) {
          console.log('📈 Variações Percentuais:', {
            frequency: `${calculateGrowth(monthlyData.current.frequency, monthlyData.previous.frequency).toFixed(1)}%`,
            distance: `${calculateGrowth(monthlyData.current.totalDistance, monthlyData.previous.totalDistance).toFixed(1)}%`,
            time: `${calculateGrowth(monthlyData.current.totalTime, monthlyData.previous.totalTime).toFixed(1)}%`
          });
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  // Calcular a variação percentual
  const calculateGrowth = (current, previous) => {
    if (!previous || !current) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Converter metros para quilômetros
  const formatDistance = (meters) => {
    if (!meters && meters !== 0) return '-';
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  // Converter minutos para horas
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return '-';
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  };

  // Formatar número de treinos
  const formatWorkouts = (frequency) => {
    if (!frequency && frequency !== 0) return '-';
    return `${frequency} treinos`;
  };

  // Dados fictícios para o LevelCard
  const levelData = {
    currentPoints: 2750,
    currentLevel: 'Intermediário',
    nextLevel: 'Avançado',
    pointsToNextLevel: 250
  };

  // Dados fictícios para o nextLevel
  const nextLevel = {
    name: 'Avançado',
    minPoints: 3000
  };

  // Dados fictícios para o userStats
  const userStats = {
    totalDistance: userInfo ? userInfo.totalDistance : 0,
    totalTime: userInfo ? userInfo.totalTime : 0,
    totalWorkouts: userInfo ? userInfo.frequency : 0
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
    <div className="dashboard p-4">
      <Row className="g-4 mb-4">
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
              <LevelCard userStats={userStats} currentLevel={levelData.currentLevel} nextLevel={nextLevel} />
            </Card.Body>
          </Card>
        </Col>

        {/* Stat Cards */}
        <Col md={4}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <StatCard
                title="Frequência"
                value={userInfo ? formatWorkouts(userInfo.frequency) : '-'}
                currentMonthValue={monthlyStats.current ? formatWorkouts(monthlyStats.current.frequency) : '-'}
                previousMonthValue={monthlyStats.previous ? formatWorkouts(monthlyStats.previous.frequency) : '-'}
                growth={calculateGrowth(
                  monthlyStats.current?.frequency,
                  monthlyStats.previous?.frequency
                )}
                icon="fa-calendar"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <StatCard
                title="Tempo Total"
                value={userInfo ? formatTime(userInfo.totalTime) : '-'}
                currentMonthValue={monthlyStats.current ? formatTime(monthlyStats.current.totalTime) : '-'}
                previousMonthValue={monthlyStats.previous ? formatTime(monthlyStats.previous.totalTime) : '-'}
                growth={calculateGrowth(
                  monthlyStats.current?.totalTime,
                  monthlyStats.previous?.totalTime
                )}
                icon="fa-clock"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <StatCard
                title="Distância Total"
                value={userInfo ? formatDistance(userInfo.totalDistance) : '-'}
                currentMonthValue={monthlyStats.current ? formatDistance(monthlyStats.current.totalDistance) : '-'}
                previousMonthValue={monthlyStats.previous ? formatDistance(monthlyStats.previous.totalDistance) : '-'}
                growth={calculateGrowth(
                  monthlyStats.current?.totalDistance,
                  monthlyStats.previous?.totalDistance
                )}
                icon="fa-road"
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Achievements Card */}
        <Col md={6}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <AchievementsCard achievements={achievementsData} userStats={userStats} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
