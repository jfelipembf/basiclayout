import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import AchievementsCard from '../../components/AchievementsCard';
import { Row, Col, Container } from 'react-bootstrap';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { useLevel } from '../../hooks/useLevel';
import './styles.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState({ current: null, previous: null });
  const auth = getAuth();
  const { levelInfo, loading } = useLevel();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          // Buscar informações gerais do usuário
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data().info || {};
            // Garantir que os campos sejam numéricos
            const parsedUserData = {
              level: Number(userData.level) || 0,
              totalDistance: Number(userData.totalDistance) || 0,
              totalTime: Number(userData.totalTime) || 0,
              frequency: Number(userData.frequency) || 0,
              // Adicione outros campos conforme necessário
            };
            setUserInfo(parsedUserData);
            console.log('🏃‍♂️ Dados do usuário:', parsedUserData);
          }

          // Buscar estatísticas mensais
          const monthlyStatsRef = collection(db, 'users', auth.currentUser.uid, 'monthlyStats');
          const q = query(monthlyStatsRef, orderBy('monthId', 'desc'), limit(2));
          const querySnapshot = await getDocs(q);
          
          const stats = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              ...data,
              level: Number(data.level) || 0,
              totalDistance: Number(data.totalDistance) || 0,
              totalTime: Number(data.totalTime) || 0,
              frequency: Number(data.frequency) || 0,
              // Adicione outros campos conforme necessário
            };
          });
          console.log('📊 Estatísticas mensais:', stats);

          if (stats.length > 0) {
            setMonthlyStats({
              current: stats[0],
              previous: stats[1] || { level: 0, totalDistance: 0, totalTime: 0, frequency: 0 },
            });
          }
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
      }
    };

    fetchUserData();
  }, [auth.currentUser]);

  // Função para calcular a variação percentual
  const calculateChange = (metric) => {
    if (!monthlyStats.current || !monthlyStats.previous) return 0;
    
    const current = Number(monthlyStats.current[metric]) || 0;
    const previous = Number(monthlyStats.previous[metric]) || 0;
    
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Função auxiliar para limitar casas decimais mantendo o tipo number
  const toFixedNumber = (num, digits) => {
    return Number(Number(num).toFixed(digits));
  };

  return (
    <Container fluid className="py-4">
      {/* Card Principal - Level */}
      <Row className="mb-4">
        <Col xs={12} md={12} className="mb-3">
          <StatCard
            title="Level"
            value={Number(userInfo?.level) || 0}
            unit="level"
            icon="fa-star"
            color="warning"
            change={calculateChange('level')}
            currentMonthValue={Number(monthlyStats.current?.level) || 0}
            previousMonthValue={Number(monthlyStats.previous?.level) || 0}
          />
        </Col>
      </Row>

      {/* Card de Conquistas */}
      <Row className="mb-4">
        <Col xs={12} md={12}>
          <AchievementsCard userInfo={userInfo} />
        </Col>
      </Row>

      {/* Cards Menores - Estatísticas */}
      <Row className="mb-4">
        <Col xs={12} md={4} className="mb-3">
          <StatCard
            title="Distância Total"
            value={toFixedNumber((userInfo?.totalDistance || 0) / 1000, 1)}
            unit="km"
            icon="fa-road"
            color="info"
            change={calculateChange('totalDistance')}
            currentMonthValue={
              monthlyStats.current?.totalDistance
                ? toFixedNumber(monthlyStats.current.totalDistance / 1000, 1)
                : 0
            }
            previousMonthValue={
              monthlyStats.previous?.totalDistance
                ? toFixedNumber(monthlyStats.previous.totalDistance / 1000, 1)
                : 0
            }
          />
        </Col>
        <Col xs={12} md={4} className="mb-3">
          <StatCard
            title="Tempo Total"
            value={userInfo?.totalTime ? toFixedNumber(userInfo.totalTime / 60, 1) : 0}
            unit="h"
            icon="fa-clock"
            color="success"
            change={calculateChange('totalTime')}
            currentMonthValue={
              monthlyStats.current?.totalTime
                ? toFixedNumber(monthlyStats.current.totalTime / 60, 1)
                : 0
            }
            previousMonthValue={
              monthlyStats.previous?.totalTime
                ? toFixedNumber(monthlyStats.previous.totalTime / 60, 1)
                : 0
            }
          />
        </Col>
        <Col xs={12} md={4} className="mb-3">
          <StatCard
            title="Frequência"
            value={Number(userInfo?.frequency || 0)}
            unit="treinos"
            icon="fa-dumbbell"
            color="primary"
            change={calculateChange('frequency')}
            currentMonthValue={Number(monthlyStats.current?.frequency || 0)}
            previousMonthValue={Number(monthlyStats.previous?.frequency || 0)}
            decimals={0}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
