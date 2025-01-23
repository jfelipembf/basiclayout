import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Dropdown } from 'react-bootstrap';
import { storage, db } from '../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/FirebaseContext';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications } from '../../../hooks/useNotifications';

const CreateCompetition = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addCompetitionNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [periodCompetitions, setPeriodCompetitions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    duration: '',
    distance: '',
    participants: '',
    image: null,
    imagePreview: null,
    registrationStartDate: '',
    registrationEndDate: '',
    isActive: true
  });

  useEffect(() => {
    if (selectedPeriod) {
      fetchCompetitionsForPeriod(selectedPeriod);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedCompetition) {
      setFormData({
        name: selectedCompetition.name || '',
        date: selectedCompetition.date || '',
        time: selectedCompetition.time || '',
        duration: selectedCompetition.duration?.toString() || '',
        distance: selectedCompetition.distance?.toString() || '',
        participants: selectedCompetition.participants?.toString() || '',
        image: null,
        imagePreview: selectedCompetition.imageUrl || null,
        registrationStartDate: selectedCompetition.registrationStartDate || '',
        registrationEndDate: selectedCompetition.registrationEndDate || '',
        isActive: selectedCompetition.isActive ?? true
      });
      setIsEditing(true);
    }
  }, [selectedCompetition]);

  const fetchCompetitionsForPeriod = async (date) => {
    try {
      const [year, month] = date.split('-');
      console.log('Buscando competições para:', year, month);
      
      const competitionsRef = collection(db, 'competitions');
      const snapshot = await getDocs(competitionsRef);
      
      const competitions = snapshot.docs
        .map(doc => {
          const data = doc.data();
          const competitionDate = new Date(data.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas datas
          
          return {
            id: doc.id,
            ...data,
            isExpired: competitionDate < today
          };
        })
        .filter(comp => {
          if (!comp.date) return false;
          const compDate = new Date(comp.date);
          return compDate.getFullYear() === parseInt(year) && 
                 compDate.getMonth() === parseInt(month) - 1;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log('Competições encontradas:', competitions);
      setPeriodCompetitions(competitions);
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
      toast.error('Erro ao buscar competições do período');
    }
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    console.log('Novo período selecionado:', newPeriod);
    setSelectedPeriod(newPeriod);
    if (newPeriod) {
      fetchCompetitionsForPeriod(newPeriod);
    } else {
      setPeriodCompetitions([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const uploadImage = async (file) => {
    if (!currentUser?.uid) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `competitions/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const competitionData = {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        distance: parseInt(formData.distance),
        participants: parseInt(formData.participants),
        isActive: formData.isActive
      };

      let savedCompetitionId;

      if (isEditing && selectedCompetition) {
        // Atualizar competição existente
        const competitionRef = doc(db, 'competitions', selectedCompetition.id);
        await updateDoc(competitionRef, competitionData);
        savedCompetitionId = selectedCompetition.id;

        // Verificar se a competição foi reativada
        if (!selectedCompetition.isActive && formData.isActive) {
          await addCompetitionNotification({
            id: savedCompetitionId,
            ...competitionData
          }, 'reactivated');
        }
      } else {
        // Criar nova competição
        competitionData.createdAt = new Date().toISOString();
        const competitionRef = await addDoc(collection(db, 'competitions'), competitionData);
        savedCompetitionId = competitionRef.id;

        // Criar notificação para nova competição
        await addCompetitionNotification({
          id: savedCompetitionId,
          ...competitionData
        }, 'created');
      }

      toast.success(isEditing ? 'Competição atualizada com sucesso!' : 'Competição criada com sucesso!');
      navigate('/competitions');
    } catch (error) {
      console.error('Erro ao salvar competição:', error);
      toast.error('Erro ao salvar competição');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      duration: '',
      distance: '',
      participants: '',
      image: null,
      imagePreview: null,
      registrationStartDate: '',
      registrationEndDate: '',
      isActive: true
    });
    setSelectedCompetition(null);
    setIsEditing(false);
  };

  return (
    <Container className="py-4">
      <Card className="bg-dark text-white mb-4">
        <Card.Body>
          <Row className="align-items-end mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Selecione o Período</Form.Label>
                <Form.Control
                  type="month"
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  className="bg-dark text-white"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Competições do Período</Form.Label>
                <Form.Select
                  className="bg-dark text-white"
                  value={selectedCompetition?.id || ''}
                  onChange={(e) => {
                    const competition = periodCompetitions.find(c => c.id === e.target.value);
                    console.log('Competição selecionada:', competition);
                    setSelectedCompetition(competition);
                  }}
                >
                  <option value="">Selecione uma competição</option>
                  {periodCompetitions.map((competition) => (
                    <option key={competition.id} value={competition.id}>
                      {competition.name} ({format(new Date(competition.date), 'dd/MM/yyyy')})
                      {competition.isExpired ? ' (Inativa)' : ''}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="outline-light" 
                onClick={resetForm}
                className="me-2"
              >
                <i className="fas fa-plus me-2"></i>
                Nova Competição
              </Button>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Nome da Competição</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Data da Competição</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Horário</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Início das Inscrições</Form.Label>
                  <Form.Control
                    type="date"
                    name="registrationStartDate"
                    value={formData.registrationStartDate}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Fim das Inscrições</Form.Label>
                  <Form.Control
                    type="date"
                    name="registrationEndDate"
                    value={formData.registrationEndDate}
                    onChange={handleInputChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Duração (em minutos)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Distância (em metros)</Form.Label>
                  <Form.Control
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    min="1"
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Número de Participantes</Form.Label>
                  <Form.Control
                    type="number"
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    min="1"
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Imagem</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.imagePreview && (
              <div className="mb-3">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                  className="mt-2 rounded"
                />
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Check 
                type="switch"
                id="isActive"
                name="isActive"
                label="Competição Ativa"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isActive: e.target.checked
                }))}
                className="text-white"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/competitions')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Salvando...' : isEditing ? 'Atualizar Competição' : 'Criar Competição'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateCompetition;
