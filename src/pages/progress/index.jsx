import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Dropdown, Table } from 'react-bootstrap';
import { useAuth } from '../../contexts/FirebaseContext';
import { Line } from 'react-chartjs-2';
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

// Registrar os componentes do Chart.js
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
  const { currentUser: user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventResults, setEventResults] = useState([]);

  // Lista de provas disponíveis
  const events = [
    { id: '50m', name: '50m Livre' },
    { id: '100m', name: '100m Livre' },
    { id: '200m', name: '200m Livre' }
  ];

  // Dados de exemplo para as provas
  const eventData = {
    '50m': [
      { date: '15/01/2025', time: '00:32:45', distance: 50 },
      { date: '10/01/2025', time: '00:33:12', distance: 50 },
      { date: '05/01/2025', time: '00:31:58', distance: 50 },
      { date: '01/01/2025', time: '00:33:45', distance: 50 },
    ],
    '100m': [
      { date: '14/01/2025', time: '01:15:23', distance: 100 },
      { date: '09/01/2025', time: '01:14:45', distance: 100 },
      { date: '04/01/2025', time: '01:16:12', distance: 100 },
      { date: '30/12/2024', time: '01:15:56', distance: 100 },
    ],
    '200m': [
      { date: '13/01/2025', time: '02:45:34', distance: 200 },
      { date: '08/01/2025', time: '02:43:21', distance: 200 },
      { date: '03/01/2025', time: '02:44:56', distance: 200 },
      { date: '29/12/2024', time: '02:46:12', distance: 200 },
    ]
  };

  // Função para formatar o tempo em segundos para exibição no gráfico
  const timeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Configurações do gráfico de resultados
  const getEventChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Evolução dos Tempos',
        color: '#fff'
      }
    },
    scales: {
      y: {
        ticks: { 
          color: '#fff',
          callback: (value) => {
            const minutes = Math.floor(value / 60);
            const seconds = Math.floor(value % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { 
          color: '#fff',
          maxRotation: 45,
          minRotation: 45
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  });

  const getEventChartData = (eventId) => {
    if (!eventId || !eventData[eventId]) return null;

    const data = eventData[eventId];
    return {
      labels: data.map(r => r.date),
      datasets: [
        {
          label: 'Tempo',
          data: data.map(r => timeToSeconds(r.time)),
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          tension: 0.4
        }
      ]
    };
  };

  // Atualiza os resultados quando uma prova é selecionada
  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
    setEventResults(eventData[eventId] || []);
  };

  // Função para formatar a data
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Gerar datas para os últimos 7 dias
  const generateLastSevenDays = () => {
    const dates = [];
    const distances = [];
    const times = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(formatDate(date));
      
      // Dados de exemplo - aqui você conectaria com dados reais do Firebase
      distances.push(Math.floor(Math.random() * (2500 - 1500) + 1500));
      times.push(Math.floor(Math.random() * (70 - 40) + 40));
    }
    
    return { dates, distances, times };
  };

  const [workoutData, setWorkoutData] = useState(() => {
    const { dates, distances, times } = generateLastSevenDays();
    return {
      labels: dates,
      distances: distances,
      times: times
    };
  });

  const motivationalQuotes = [
    {
      quote: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
      author: "Robert Collier"
    },
    {
      quote: "A disciplina é a ponte entre metas e realizações.",
      author: "Jim Rohn"
    },
    {
      quote: "O único lugar onde o sucesso vem antes do trabalho é no dicionário.",
      author: "Vidal Sassoon"
    },
    {
      quote: "Não espere por circunstâncias ideais. Crie-as.",
      author: "George Bernard Shaw"
    },
    {
      quote: "A persistência é o caminho do êxito.",
      author: "Charles Chaplin"
    },
    {
      quote: "O que você faz hoje pode melhorar todos os seus amanhãs.",
      author: "Ralph Marston"
    },
    {
      quote: "Todo progresso acontece fora da zona de conforto.",
      author: "Michael John Bobak"
    },
    {
      quote: "Sua única limitação é aquela que você impõe em sua própria mente.",
      author: "Napoleon Hill"
    },
    {
      quote: "O corpo alcança o que a mente acredita.",
      author: "Jim Evans"
    },
    {
      quote: "Não conte os dias, faça os dias contarem.",
      author: "Muhammad Ali"
    }
  ];

  useEffect(() => {
    // Seleciona uma frase aleatória quando a página carrega
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  // Configurações do gráfico de distância
  const distanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Distância Percorrida (metros)',
        color: '#fff'
      }
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { 
          color: '#fff',
          maxRotation: 45,
          minRotation: 45
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const distanceChartData = {
    labels: workoutData.labels,
    datasets: [
      {
        label: 'Distância',
        data: workoutData.distances,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4
      }
    ]
  };

  // Configurações do gráfico de tempo
  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Tempo de Treino (minutos)',
        color: '#fff'
      }
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { 
          color: '#fff',
          maxRotation: 45,
          minRotation: 45
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const timeChartData = {
    labels: workoutData.labels,
    datasets: [
      {
        label: 'Tempo',
        data: workoutData.times,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="container-fluid p-4">
      <Row className="g-4">
        {/* Card do Usuário */}
        <Col xs={12}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col xs="auto">
                  <div 
                    className="position-relative d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--bs-secondary)',
                      backgroundColor: '#2a2a2a'
                    }}
                  >
                    <img
                      src={user?.photoURL || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="ps-3">
                    <h4 className="text-white mb-2">
                      {user?.displayName || 'Usuário'}
                    </h4>
                    <blockquote className="blockquote mb-0">
                      <p className="text-white-50 mb-1 fst-italic">
                        "{currentQuote.quote}"
                      </p>
                      <footer className="blockquote-footer mt-1">
                        {currentQuote.author}
                      </footer>
                    </blockquote>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Gráficos de Progresso Geral */}
        <Col md={6}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <div style={{ height: '400px' }}>
                <Line options={distanceChartOptions} data={distanceChartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <div style={{ height: '400px' }}>
                <Line options={timeChartOptions} data={timeChartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Seção de Resultados por Prova */}
        <Col xs={12}>
          <Card className="bg-dark border border-secondary border-opacity-50">
            <Card.Body>
              <h5 className="text-white mb-4">Resultados por Prova</h5>
              
              {/* Dropdown de seleção da prova */}
              <Dropdown className="mb-4">
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  className="w-100 text-start bg-dark text-white border-secondary form-control-lg d-flex align-items-center justify-content-between"
                >
                  {selectedEvent ? events.find(e => e.id === selectedEvent)?.name : 'Selecione uma prova'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100 bg-dark border-secondary">
                  {events.map(event => (
                    <Dropdown.Item 
                      key={event.id}
                      className="text-white py-2 px-3"
                      onClick={() => handleEventSelect(event.id)}
                    >
                      <i className="fas fa-swimming-pool me-2"></i>
                      {event.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* Gráfico de resultados */}
              {selectedEvent && (
                <div className="mb-4" style={{ height: '300px' }}>
                  <Line options={getEventChartOptions()} data={getEventChartData(selectedEvent)} />
                </div>
              )}

              {/* Lista de resultados */}
              {selectedEvent && eventResults.length > 0 && (
                <div className="table-responsive">
                  <Table className="table-dark table-hover">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Distância</th>
                        <th>Tempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventResults.map((result, index) => (
                        <tr key={index}>
                          <td>{result.date}</td>
                          <td>{result.distance}m</td>
                          <td>{result.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Progress;
