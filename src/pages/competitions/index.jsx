import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, addDoc, getDoc, doc, setDoc, where, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/FirebaseContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';

const Competitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [attemptCounts, setAttemptCounts] = useState({});

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        const competitionsRef = collection(db, 'competitions');
        const q = query(competitionsRef);
        const querySnapshot = await getDocs(q);
        
        let fetchedCompetitions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Ordenar competições: ativas primeiro, depois por data
        fetchedCompetitions.sort((a, b) => {
          // Primeiro critério: status ativo
          if (a.isActive && !b.isActive) return -1;
          if (!a.isActive && b.isActive) return 1;
          
          // Segundo critério: data da competição
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        console.log('Competições ordenadas:', fetchedCompetitions);
        setCompetitions(fetchedCompetitions);
      } catch (error) {
        console.error('Erro ao buscar competições:', error);
        toast.error('Erro ao carregar competições');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const handleParticipate = async (competitionId) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para participar');
      return;
    }

    setRegistering(true);
    try {
      const now = new Date();
      const yearMonth = format(now, 'yyyy-MM');
      
      // Verificar se a competição existe
      const competitionRef = doc(db, 'competitions', competitionId);
      const competitionDoc = await getDoc(competitionRef);
      
      if (!competitionDoc.exists()) {
        toast.error('Competição não encontrada');
        return;
      }

      const competitionData = competitionDoc.data();

      // Referência ao documento do usuário na competição
      const registrationRef = doc(
        db, 
        'competitions', 
        competitionId, 
        'registrations', 
        yearMonth, 
        'participants', 
        currentUser.uid
      );

      // Verificar se já existe um documento para este usuário
      const existingRegistration = await getDoc(registrationRef);
      
      let attempts = [];
      if (existingRegistration.exists()) {
        attempts = existingRegistration.data().attempts || [];
      }

      // Criar nova tentativa
      const newAttempt = {
        attemptNumber: attempts.length + 1,
        registrationDate: new Date().toISOString(),
        targetTime: null,     // Tempo que o usuário fez
        targetDistance: null, // Distância que o usuário fez
        status: 'registered'
      };

      // Adicionar nova tentativa ao array
      attempts.push(newAttempt);

      // Dados atualizados do registro
      const registrationData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        attempts,
        lastUpdated: new Date().toISOString(),
        competition: {
          id: competitionId,
          name: competitionData.name,
          date: competitionData.date,
          time: competitionData.time || '',
          duration: competitionData.duration,
          distance: competitionData.distance
        }
      };

      // Salvar na subcoleção da competição
      await setDoc(registrationRef, registrationData);

      // Referência ao documento do usuário
      const userCompetitionRef = doc(
        db, 
        'users', 
        currentUser.uid, 
        'competitions', 
        yearMonth,
        'registered',
        competitionId
      );

      // Verificar se já existe um documento para esta competição
      const existingUserCompetition = await getDoc(userCompetitionRef);
      
      let userAttempts = [];
      if (existingUserCompetition.exists()) {
        userAttempts = existingUserCompetition.data().attempts || [];
      }

      // Criar nova tentativa para o usuário (mesma estrutura)
      const newUserAttempt = {
        attemptNumber: userAttempts.length + 1,
        registrationDate: new Date().toISOString(),
        targetTime: null,     // Tempo que o usuário fez
        targetDistance: null, // Distância que o usuário fez
        status: 'registered'
      };

      // Adicionar nova tentativa ao array
      userAttempts.push(newUserAttempt);

      // Dados atualizados da competição do usuário
      const userCompetitionData = {
        attempts: userAttempts,
        lastUpdated: new Date().toISOString(),
        competition: {
          id: competitionId,
          name: competitionData.name,
          date: competitionData.date,
          time: competitionData.time || '',
          duration: competitionData.duration,
          distance: competitionData.distance
        }
      };

      await setDoc(userCompetitionRef, userCompetitionData);

      toast.success(`Tentativa #${newAttempt.attemptNumber} registrada com sucesso!`);
      
      // Atualizar o contador de tentativas localmente
      setAttemptCounts(prev => ({
        ...prev,
        [competitionId]: newAttempt.attemptNumber + 1
      }));

    } catch (error) {
      console.error('Erro ao participar:', error);
      toast.error('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setRegistering(false);
    }
  };

  const isRegistrationOpen = (competition) => {
    if (!competition.isActive) return false;
    
    const now = new Date();
    const startDate = competition.registrationStartDate ? new Date(competition.registrationStartDate) : null;
    const endDate = competition.registrationEndDate ? new Date(competition.registrationEndDate) : null;

    if (!startDate || !endDate) return true;
    return now >= startDate && now <= endDate;
  };

  const getCompetitionStatus = (competition) => {
    if (!competition.isActive) {
      return {
        text: 'Inativa',
        variant: 'danger',
        icon: 'times-circle'
      };
    }

    if (!competition.registrationStartDate || !competition.registrationEndDate) {
      return {
        text: 'Inscrições Abertas',
        variant: 'success',
        icon: 'check-circle'
      };
    }

    const now = new Date();
    const startDate = new Date(competition.registrationStartDate);
    const endDate = new Date(competition.registrationEndDate);

    if (now < startDate) {
      return {
        text: `Inscrições iniciam em ${formatDate(competition.registrationStartDate)}`,
        variant: 'warning',
        icon: 'clock'
      };
    }

    if (now > endDate) {
      return {
        text: 'Inscrições encerradas',
        variant: 'danger',
        icon: 'times-circle'
      };
    }

    return {
      text: `Inscrições até ${formatDate(competition.registrationEndDate)}`,
      variant: 'success',
      icon: 'check-circle'
    };
  };

  useEffect(() => {
    const loadAttemptCounts = async () => {
      if (!currentUser) return;

      const yearMonth = format(new Date(), 'yyyy-MM');
      const counts = {};

      for (const competition of competitions) {
        try {
          const userCompetitionRef = doc(
            db, 
            'users', 
            currentUser.uid, 
            'competitions', 
            yearMonth,
            'registered',
            competition.id
          );
          
          const snapshot = await getDoc(userCompetitionRef);
          
          if (snapshot.exists()) {
            const attempts = snapshot.data().attempts || [];
            counts[competition.id] = attempts.length + 1;
          } else {
            counts[competition.id] = 1;
          }
        } catch (error) {
          console.error('Erro ao carregar tentativas:', error);
          counts[competition.id] = 1;
        }
      }

      setAttemptCounts(counts);
    };

    loadAttemptCounts();
  }, [competitions, currentUser]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const [day, month, year] = dateString.split('/');
        return `${day}/${month}/${year}`;
      }
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white mb-0">Competições</h2>
        <Button 
          variant="primary"
          onClick={() => navigate('/competitions/create')}
        >
          <i className="fas fa-plus me-2"></i>
          Nova Competição
        </Button>
      </div>

      {competitions.length === 0 ? (
        <Card className="bg-dark text-white">
          <Card.Body className="text-center py-5">
            <i className="fas fa-trophy fa-3x mb-3 text-muted"></i>
            <h5>Nenhuma competição encontrada</h5>
            <p className="text-muted">
              Clique no botão "Nova Competição" para criar sua primeira competição.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {competitions.map((competition) => (
            <Col key={competition.id}>
              <Card 
                style={{ 
                  height: '100%',
                  opacity: competition.isActive ? 1 : 0.6,
                  transition: 'opacity 0.3s ease'
                }}
                className="h-100 bg-dark text-white"
              >
                {competition.imageUrl && (
                  <div className="position-relative" style={{ height: '200px' }}>
                    <Card.Img
                      variant="top"
                      src={competition.imageUrl}
                      alt={competition.name}
                      style={{
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <Card.Body>
                  <Card.Title className="h5 mb-3 text-light">{competition.name || 'Sem nome'}</Card.Title>
                  
                  <div className="mb-3">
                    <div className={`text-${getCompetitionStatus(competition).variant} mb-3`}>
                      <i className={`fas fa-${getCompetitionStatus(competition).icon} me-2`}></i>
                      {getCompetitionStatus(competition).text}
                    </div>

                    {competition.date && (
                      <div className="text-light mb-2">
                        <i className="fas fa-calendar-alt me-2 text-light"></i>
                        Data: {formatDate(competition.date)}
                      </div>
                    )}
                    {competition.time && (
                      <div className="text-light mb-2">
                        <i className="fas fa-clock me-2 text-light"></i>
                        Horário: {competition.time}
                      </div>
                    )}
                    {competition.duration && (
                      <div className="text-light mb-2">
                        <i className="fas fa-hourglass-half me-2 text-light"></i>
                        Duração: {competition.duration} minutos
                      </div>
                    )}
                    {competition.distance && (
                      <div className="text-light mb-2">
                        <i className="fas fa-route me-2 text-light"></i>
                        Distância: {competition.distance} metros
                      </div>
                    )}
                    {competition.participants && (
                      <div className="text-light mb-2">
                        <i className="fas fa-users me-2 text-light"></i>
                        Participantes: {competition.participants}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline-light"
                    className="w-100"
                    onClick={() => handleParticipate(competition.id)}
                    disabled={registering || !competition.isActive}
                  >
                    {registering ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Inscrevendo...
                      </>
                    ) : !competition.isActive ? (
                      <>
                        <i className="fas fa-lock me-2"></i>
                        Inscrições Indisponíveis
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Participar {attemptCounts[competition.id] > 1 ? `(Tentativa #${attemptCounts[competition.id]})` : ''}
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Competitions;
