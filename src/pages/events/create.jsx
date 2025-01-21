import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    type: '',
    date: '',
    time: '',
    location: '',
    sport: '',
    distance: '',
    price: '',
    maxParticipants: '',
    description: '',
    requirements: '',
    image: null,
    imagePreview: null,
    status: 'open'
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('O arquivo deve ser uma imagem');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setEventData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventData.name) {
      toast.error('O nome do evento é obrigatório');
      return;
    }
    setShowPreview(true);
  };

  const handleConfirm = () => {
    // Aqui você implementaria a lógica para salvar o evento
    toast.success('Evento criado com sucesso!');
    navigate('/events');
  };

  return (
    <Container fluid className="p-4">
      <h1 className="h3 mb-4 text-white">Criar Evento</h1>
      
      <Card className="card-event mb-4 bg-dark border border-secondary border-opacity-50">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Nome do Evento *</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="name"
                    value={eventData.name}
                    onChange={handleChange}
                    placeholder="Ex: Campeonato Regional"
                    required
                  />
                  <Form.Text className="text-light opacity-75">
                    Digite um nome descritivo para o evento
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Tipo de Evento</Form.Label>
                  <Form.Select
                    className="bg-dark text-white border-secondary"
                    name="type"
                    value={eventData.type}
                    onChange={handleChange}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="competition">Competição</option>
                    <option value="workshop">Workshop</option>
                    <option value="training">Treino Especial</option>
                    <option value="championship">Campeonato</option>
                    <option value="seminar">Seminário</option>
                  </Form.Select>
                  <Form.Text className="text-light opacity-75">
                    Selecione o tipo do evento
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Data</Form.Label>
                  <Form.Control
                    type="date"
                    className="bg-dark text-white border-secondary"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-light opacity-75">
                    Data de realização
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Horário</Form.Label>
                  <Form.Control
                    type="time"
                    className="bg-dark text-white border-secondary"
                    name="time"
                    value={eventData.time}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-light opacity-75">
                    Horário de início
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Modalidade</Form.Label>
                  <Form.Select
                    className="bg-dark text-white border-secondary"
                    name="sport"
                    value={eventData.sport}
                    onChange={handleChange}
                  >
                    <option value="">Selecione uma modalidade</option>
                    <option value="natacao">Natação</option>
                    <option value="musculacao">Musculação</option>
                    <option value="corrida">Corrida</option>
                    <option value="ciclismo">Ciclismo</option>
                    <option value="crossfit">CrossFit</option>
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                    <option value="outro">Outro</option>
                  </Form.Select>
                  <Form.Text className="text-light opacity-75">
                    Selecione a modalidade do evento
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Local</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    placeholder="Ex: Rua Example, 123 - Cidade"
                  />
                  <Form.Text className="text-light opacity-75">
                    Endereço completo do evento
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Distância</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="distance"
                    value={eventData.distance}
                    onChange={handleChange}
                    placeholder="Ex: 5km"
                  />
                  <Form.Text className="text-light opacity-75">
                    Distância do percurso (se aplicável)
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Preço</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-dark text-white border-secondary"
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    placeholder="Ex: R$ 150,00"
                  />
                  <Form.Text className="text-light opacity-75">
                    Valor da inscrição
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Vagas</Form.Label>
                  <Form.Control
                    type="number"
                    className="bg-dark text-white border-secondary"
                    name="maxParticipants"
                    value={eventData.maxParticipants}
                    onChange={handleChange}
                    placeholder="Ex: 100"
                  />
                  <Form.Text className="text-light opacity-75">
                    Número máximo de participantes
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Imagem do Evento</Form.Label>
                  <div 
                    className="image-upload-container bg-dark text-white border border-secondary rounded p-3"
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    
                    {eventData.imagePreview ? (
                      <div className="position-relative">
                        <img
                          src={eventData.imagePreview}
                          alt="Preview"
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px', width: 'auto' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="text-center py-5"
                        onClick={handleImageClick}
                      >
                        <i className="fas fa-cloud-upload-alt fs-1 mb-2"></i>
                        <p className="mb-0">Clique para fazer upload da imagem</p>
                        <small className="text-muted">
                          Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                        </small>
                      </div>
                    )}
                  </div>
                  <Form.Text className="text-light opacity-75">
                    Adicione uma imagem para o evento
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group className="mb-3 bg-dark">
                  <Form.Label className="text-white">Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    className="bg-dark text-white border-secondary"
                    rows={3}
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    placeholder="Descreva os detalhes do evento..."
                  />
                  <Form.Text className="text-light opacity-75">
                    Informações gerais sobre o evento
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-light" onClick={() => navigate('/events')}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Visualizar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal de Prévia */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
        className="preview-modal"
      >
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Prévia do Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Card className="h-100 bg-dark border-secondary">
            {eventData.imagePreview && (
              <Card.Img
                variant="top"
                src={eventData.imagePreview}
                style={{ height: '200px', objectFit: 'cover' }}
              />
            )}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-primary bg-opacity-10 rounded p-2">
                  <i className={`fas ${getEventTypeIcon(eventData.type)} text-primary fs-4`}></i>
                </div>
                <Badge bg="success">Inscrições Abertas</Badge>
              </div>

              <h4 className="text-white">{eventData.name || 'Sem nome'}</h4>
              
              <div className="mb-3">
                {eventData.date && (
                  <div className="mb-2">
                    <i className="fas fa-calendar-alt text-primary me-2"></i>
                    <span className="text-secondary">
                      {new Date(eventData.date).toLocaleDateString('pt-BR')}
                      {eventData.time ? ` às ${eventData.time}` : ''}
                    </span>
                  </div>
                )}
                {eventData.location && (
                  <div className="mb-2">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    <span className="text-secondary">{eventData.location}</span>
                  </div>
                )}
                {eventData.sport && (
                  <div className="mb-2">
                    <i className="fas fa-running text-primary me-2"></i>
                    <span className="text-secondary">{eventData.sport}</span>
                  </div>
                )}
                {eventData.distance && (
                  <div className="mb-2">
                    <i className="fas fa-route text-primary me-2"></i>
                    <span className="text-secondary">{eventData.distance}</span>
                  </div>
                )}
                {eventData.price && (
                  <div className="mb-2">
                    <i className="fas fa-dollar-sign text-primary me-2"></i>
                    <span className="text-secondary">{eventData.price}</span>
                  </div>
                )}
                {eventData.maxParticipants && (
                  <div className="mb-2">
                    <i className="fas fa-users text-primary me-2"></i>
                    <span className="text-secondary">0 / {eventData.maxParticipants} participantes</span>
                  </div>
                )}
              </div>

              {eventData.description && (
                <div className="mb-3">
                  <h6 className="text-white">Descrição</h6>
                  <p className="text-secondary mb-0">{eventData.description}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="outline-light" onClick={() => setShowPreview(false)}>
            Voltar e Editar
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirmar e Criar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateEvent;
