import React from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useMonthlyStats from '../../hooks/useMonthlyStats';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const { stats, loading, error } = useMonthlyStats(6); // Buscar últimos 6 meses

  // Configurações comuns dos gráficos
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  // Dados para o gráfico de distância
  const distanceData = {
    labels: stats.labels,
    datasets: [
      {
        label: 'Distância (km)',
        data: stats.distance,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4
      }
    ]
  };

  // Dados para o gráfico de tempo
  const timeData = {
    labels: stats.labels,
    datasets: [
      {
        label: 'Tempo (horas)',
        data: stats.time,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.4
      }
    ]
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger" role="alert">
          Erro ao carregar dados: {error}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col xs={12}>
          <h4 className="text-white mb-4">Progresso Mensal</h4>
        </Col>
      </Row>
      
      <Row>
        {/* Gráfico de Distância */}
        <Col xs={12} lg={6} className="mb-4">
          <Card className="bg-dark border-0 shadow h-100">
            <Card.Body>
              <Card.Title className="text-white mb-4">Distância por Mês</Card.Title>
              <div style={{ height: '300px' }}>
                <Line options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    title: {
                      display: true,
                      text: 'Distância Total (km)',
                      color: '#fff'
                    }
                  }
                }} data={distanceData} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Gráfico de Tempo */}
        <Col xs={12} lg={6} className="mb-4">
          <Card className="bg-dark border-0 shadow h-100">
            <Card.Body>
              <Card.Title className="text-white mb-4">Tempo por Mês</Card.Title>
              <div style={{ height: '300px' }}>
                <Line options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    title: {
                      display: true,
                      text: 'Tempo Total (horas)',
                      color: '#fff'
                    }
                  }
                }} data={timeData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Progress;
