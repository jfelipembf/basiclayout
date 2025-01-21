import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';

const Events = () => {
  const navigate = useNavigate();
  const [events] = useState([
    {
      id: 1,
      name: 'Maratona Aquática',
      date: '2024-02-15',
      time: '08:00',
      location: 'Praia de Copacabana',
      sport: 'Natação',
      distance: '5km',
      price: 'R$ 150,00',
      registeredParticipants: 75,
      maxParticipants: 100,
      type: 'competition',
      status: 'open',
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=2070'
    },
    {
      id: 2,
      name: 'Workshop de Técnicas',
      date: '2024-02-20',
      time: '14:00',
      location: 'Academia Central',
      sport: 'Natação',
      price: 'R$ 80,00',
      registeredParticipants: 30,
      maxParticipants: 30,
      type: 'workshop',
      status: 'full',
      image: 'https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?auto=format&fit=crop&q=80&w=2070'
    }
  ]);

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'competition':
        return 'fa-trophy';
      case 'workshop':
        return 'fa-chalkboard-teacher';
      case 'training':
        return 'fa-running';
      case 'championship':
        return 'fa-medal';
      case 'seminar':
        return 'fa-microphone';
      default:
        return 'fa-calendar-alt';
    }
  };

  const getStatusBadge = (event) => {
    if (event.status === 'full') {
      return <Badge bg="danger">Lotado</Badge>;
    }
    return <Badge bg="success">Inscrições Abertas</Badge>;
  };

  const handleRegister = (eventId) => {
    // Implementar lógica de inscrição
    console.log('Registrando para o evento:', eventId);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Eventos</h2>
        <Button 
          variant="primary"
          onClick={() => navigate('/events/create')}
        >
          <i className="fas fa-plus me-2"></i>
          Criar Evento
        </Button>
      </div>

      <Row>
        {events.map(event => (
          <Col key={event.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 bg-dark border-secondary">
              {event.image && (
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={event.image}
                    style={{
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <div 
                    className="position-absolute w-100 h-100 top-0"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              )}
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary bg-opacity-10 rounded p-2">
                    <i className={`fas ${getEventTypeIcon(event.type)} text-primary fs-4`}></i>
                  </div>
                  {getStatusBadge(event)}
                </div>

                <h4 className="text-white">{event.name}</h4>
                
                <div className="mb-3">
                  <div className="mb-2">
                    <i className="fas fa-calendar-alt text-primary me-2"></i>
                    <span className="text-secondary">
                      {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                    </span>
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    <span className="text-secondary">{event.location}</span>
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-running text-primary me-2"></i>
                    <span className="text-secondary">{event.sport}</span>
                  </div>
                  {event.distance && (
                    <div className="mb-2">
                      <i className="fas fa-route text-primary me-2"></i>
                      <span className="text-secondary">{event.distance}</span>
                    </div>
                  )}
                  <div className="mb-2">
                    <i className="fas fa-dollar-sign text-primary me-2"></i>
                    <span className="text-secondary">{event.price}</span>
                  </div>
                  <div>
                    <i className="fas fa-users text-primary me-2"></i>
                    <span className="text-secondary">
                      {event.registeredParticipants} / {event.maxParticipants} participantes
                    </span>
                  </div>
                </div>

                <div className="d-grid">
                  <Button
                    variant={event.status === "full" ? "secondary" : "primary"}
                    onClick={() => handleRegister(event.id)}
                    disabled={event.status === "full"}
                  >
                    {event.status === "full" ? 'Evento Lotado' : 'Inscrever-se'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Events;
