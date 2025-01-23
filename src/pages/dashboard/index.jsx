import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import AchievementsCard from '../../components/AchievementsCard';
import AlertCard from '../../components/AlertCard';
import { Row, Col, Container, Card, ListGroup, Spinner, Button } from 'react-bootstrap';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { useLevel } from '../../hooks/useLevel';
import { useNotifications } from '../../hooks/useNotifications';
import { format } from 'date-fns';
import './styles.css';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState({ current: null, previous: null });
  const auth = getAuth();
  const { levelInfo, loading } = useLevel();
  const { notifications, loading: loadingNotifications, deleteNotification } = useNotifications();

  const formatNotificationDate = (timestamp) => {
    if (!timestamp) return 'Agora';
    try {
      // Se for um timestamp do Firestore
      if (timestamp.toDate) {
        return format(timestamp.toDate(), 'dd/MM/yyyy HH:mm');
      }
      // Se for uma string de data
      if (typeof timestamp === 'string') {
        return format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
      }
      // Se for um objeto Date
      if (timestamp instanceof Date) {
        return format(timestamp, 'dd/MM/yyyy HH:mm');
      }
      return 'Data inválida';
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      toast.success('Notificação removida');
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      toast.error('Erro ao remover notificação');
    }
  };

  const isNewNotification = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return false;
    const notificationDate = timestamp.toDate();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return notificationDate > twoDaysAgo;
  };

  useEffect(() => {
    console.log('Dashboard - Notificações recebidas:', notifications);
  }, [notifications]);

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

  // Função para gerar alertas baseados nos dados do usuário
  const generateAlerts = () => {
    const alerts = [];
    
    if (!userInfo) return alerts;

    // Alerta de frequência
    if (userInfo.frequency < 2) {
      alerts.push({
        type: 'warning',
        message: 'Sua frequência está baixa. Tente treinar pelo menos 2 vezes por semana!',
        icon: 'fa-exclamation-triangle'
      });
    }

    // Alerta de progresso
    if (userInfo.level > 0 && monthlyStats.current && monthlyStats.previous) {
      const progressDiff = monthlyStats.current.totalDistance - monthlyStats.previous.totalDistance;
      if (progressDiff <= 0) {
        alerts.push({
          type: 'info',
          message: 'Que tal superar sua distância do mês anterior?',
          icon: 'fa-chart-line'
        });
      }
    }

    // Alerta de conquista próxima
    if (userInfo.level > 0) {
      alerts.push({
        type: 'success',
        message: 'Continue treinando! Você está próximo de uma nova conquista.',
        icon: 'fa-trophy'
      });
    }

    return alerts;
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      <Row className="g-4">
        {/* Card de Notificações */}
        <Col xs={12} md={12}>
          <div className="card h-100 bg-dark border-0" style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)'
          }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle bg-primary bg-opacity-10 me-3" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-bell text-primary" style={{ fontSize: '1.2rem' }}></i>
                </div>
                <h5 className="mb-0 text-white-50">Notificações</h5>
              </div>
              {notifications.map((notification, index) => (
                <div key={notification.id} className="notification-item position-relative px-3 py-2 border-bottom border-secondary">
                  {/* Badge "Novo" */}
                  {isNewNotification(notification.createdAt) && (
                    <div className="position-absolute" style={{ 
                      right: '8px', 
                      top: '8px',
                      zIndex: 2
                    }}>
                      <span className="badge" style={{ 
                        backgroundColor: '#ff8c00',
                        fontSize: '0.6rem', 
                        padding: '2px 6px',
                        fontWeight: 'normal',
                        opacity: 0.9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        novo
                      </span>
                    </div>
                  )}
                  {/* Número e ícone */}
                  <div className="d-flex align-items-center mb-1">
                    <small className="text-light opacity-100 me-2" style={{ fontSize: '0.7rem', color: 'white' }}>
                      {String(index + 1).padStart(2, '0')}
                    </small>
                    <div className={`notification-icon ${
                      notification.type === 'competition' 
                        ? notification.action === 'created' ? 'text-success' : 'text-warning'
                        : notification.type === 'training' 
                          ? 'text-info' 
                          : 'text-primary'
                    }`}>
                      <i className={`fas fa-${
                        notification.type === 'competition'
                          ? notification.action === 'created' ? 'trophy' : 'sync'
                          : notification.type === 'training'
                            ? 'dumbbell'
                            : 'calendar-plus'
                      }`} style={{ fontSize: '0.7rem', color: 'white' }}></i>
                    </div>
                    <small className="ms-2 text-light" style={{ fontSize: '0.6rem' }}>
                      {notification.createdAt && format(notification.createdAt.toDate(), 'dd/MM/yyyy HH:mm')}
                    </small>
                  </div>
                  {/* Mensagem */}
                  <div className="mb-1 pe-4" style={{ fontSize: '0.8rem', lineHeight: '1.3', color: 'white' }}>
                    {notification.message}
                  </div>
                  {/* Botão de excluir */}
                  <Button
                    variant="link"
                    className="notification-delete p-0 position-absolute"
                    onClick={() => handleDeleteNotification(notification.id)}
                    style={{ 
                      right: '8px', 
                      bottom: '8px',
                      fontSize: '0.7rem',
                      opacity: 0,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <i className="fas fa-times text-danger"></i>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Col>
        {/* Card de Conquistas */}
        <Col xs={12} md={12}>
          <AchievementsCard userInfo={userInfo} />
        </Col>
        {/* Cards Menores - Estatísticas */}
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
            icon="fa-calendar-check"
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
