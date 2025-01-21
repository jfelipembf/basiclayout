import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/FirebaseContext';
import { db } from '../../contexts/FirebaseContext';
import { useLoader } from '../../contexts/LoaderContext';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const Competitions = () => {
  const { currentUser: user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [competitions, setCompetitions] = useState([]);

  // Função para adicionar dados de exemplo
  const addExampleData = async () => {
    if (!user?.uid) return;

    const exampleCompetitions = [
      {
        userId: user.uid,
        name: 'Campeonato Estadual de Natação 2025',
        date: '15/03/2025',
        image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1470&h=850',
        participants: 120,
        position: 3,
        location: 'São Paulo, SP',
        category: '100m Livre',
        time: '00:58:23'
      },
      {
        userId: user.uid,
        name: 'Copa Regional de Natação',
        date: '28/02/2025',
        image: 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?q=80&w=1473&h=850',
        participants: 85,
        position: 1,
        location: 'Rio de Janeiro, RJ',
        category: '50m Livre',
        time: '00:27:45'
      },
      {
        userId: user.uid,
        name: 'Torneio Inverno de Natação',
        date: '10/02/2025',
        image: 'https://images.unsplash.com/photo-1622629797619-c100d3e2f841?q=80&w=1546&h=850',
        participants: 150,
        position: 5,
        location: 'Belo Horizonte, MG',
        category: '200m Livre',
        time: '02:15:12'
      }
    ];

    try {
      const competitionsRef = collection(db, 'competitions');
      for (const competition of exampleCompetitions) {
        await addDoc(competitionsRef, competition);
      }
      console.log('Dados de exemplo adicionados com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar dados de exemplo:', error);
    }
  };

  const fetchCompetitions = useCallback(async () => {
    if (!user?.uid) return;
    
    showLoader();
    try {
      const competitionsRef = collection(db, 'competitions');
      const q = query(competitionsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const competitionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (competitionsData.length === 0) {
        // Se não houver dados, adiciona os exemplos
        await addExampleData();
        // Busca novamente após adicionar
        const newSnapshot = await getDocs(q);
        setCompetitions(newSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } else {
        setCompetitions(competitionsData);
      }
    } catch (error) {
      console.error('Erro ao carregar competições:', error);
    } finally {
      hideLoader();
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  return (
    <div className="container-fluid p-4">
      <Row className="g-4">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-white mb-0">
              <i className="fas fa-trophy me-2"></i>
              Minhas Competições
            </h4>
            <Badge bg="primary" className="px-3 py-2">
              <i className="fas fa-award me-2"></i>
              {competitions.length} Participações
            </Badge>
          </div>
        </Col>

        {competitions.map(competition => (
          <Col key={competition.id} lg={4} md={6}>
            <Card className="bg-dark h-100 border border-secondary border-opacity-50">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={competition.image}
                  style={{ 
                    height: '180px',
                    objectFit: 'cover'
                  }}
                />
                <Badge 
                  bg={competition.position === 1 ? 'warning' : 
                      competition.position === 2 ? 'light' :
                      competition.position === 3 ? 'danger' : 'secondary'}
                  className="position-absolute top-0 end-0 m-3 px-3 py-2"
                >
                  <i className={`fas fa-${competition.position === 1 ? 'trophy' : 
                                        competition.position <= 3 ? 'medal' : 
                                        'flag-checkered'} me-2`}></i>
                  {competition.position === 1 ? 'Campeão' :
                   competition.position === 2 ? 'Vice-campeão' :
                   competition.position === 3 ? '3º Lugar' :
                   `${competition.position}º Lugar`}
                </Badge>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-white h5 mb-3">
                  {competition.name}
                </Card.Title>
                
                <Row className="g-2 mb-3">
                  <Col xs={6}>
                    <div className="rounded p-2 h-100">
                      <div className="text-white-50 small mb-1">
                        <i className="fas fa-swimming-pool me-2"></i>
                        Categoria
                      </div>
                      <div className="text-white">{competition.category}</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="rounded p-2 h-100">
                      <div className="text-white-50 small mb-1">
                        <i className="fas fa-stopwatch me-2"></i>
                        Tempo
                      </div>
                      <div className="text-white">{competition.time}</div>
                    </div>
                  </Col>
                </Row>

                <div className="mt-auto">
                  <div className="d-flex justify-content-between text-white-50 small mb-2">
                    <div>
                      <i className="fas fa-calendar-alt me-2"></i>
                      {competition.date}
                    </div>
                    <div>
                      <i className="fas fa-users me-2"></i>
                      {competition.participants} atletas
                    </div>
                  </div>
                  <div className="text-white-50 small">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {competition.location}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Competitions;
