import React, { useState } from 'react';
import { Card, Form, Row, Col, Button, Modal, Nav, Dropdown, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../contexts/FirebaseContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const { currentUser: user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showNewMarkModal, setShowNewMarkModal] = useState(false);
  const [markType, setMarkType] = useState('competition');
  const [markData, setMarkData] = useState({
    type: 'competition',
    category: '',
    time: '',
    distance: ''
  });

  const [profileData, setProfileData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '(11) 99999-9999',
    birthDate: '1990-01-01',
    gender: 'Masculino',
    street: 'Rua Exemplo',
    number: '123',
    complement: 'Apto 456',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    profileImage: user?.photoURL || null
  });

  const handleCloseModal = () => {
    setShowNewMarkModal(false);
    setMarkData({
      type: 'competition',
      category: '',
      time: '',
      distance: ''
    });
  };

  const handleMarkInputChange = (e) => {
    const { name, value } = e.target;
    setMarkData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkTypeChange = (type) => {
    setMarkType(type);
    setMarkData(prev => ({
      ...prev,
      type: type
    }));
  };

  const handleSaveMark = () => {
    // Aqui você pode adicionar a lógica para salvar a marca
    console.log('Marca salva:', markData);
    toast.success('Marca adicionada com sucesso!');
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  const renderField = (label, value, name, type = 'text') => {
    return (
      <Form.Group className="mb-0">
        <Form.Label className="text-white-50 small mb-1">{label}</Form.Label>
        {isEditing ? (
          type === 'select' ? (
            <Form.Select
              className="bg-dark text-white border-secondary"
              name={name}
              value={value}
              onChange={handleInputChange}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </Form.Select>
          ) : (
            <Form.Control
              type={type}
              className="bg-dark text-white border-secondary"
              name={name}
              value={value}
              onChange={handleInputChange}
            />
          )
        ) : (
          <p className="text-white mb-0">{value}</p>
        )}
      </Form.Group>
    );
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="primary"
          size="lg"
          onClick={() => setShowNewMarkModal(true)}
        >
          <i className="fas fa-plus-circle me-2"></i>
          Nova marca
        </Button>
      </div>

      <Row className="g-4">
        {/* Card Principal */}
        <Col xs={12}>
          <div className="card bg-dark border border-secondary border-opacity-50">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-subtitle text-white-50 fw-medium mb-0">
                  <i className="fas fa-user-circle me-2"></i>
                  Perfil do Usuário
                </h5>
                <Button 
                  variant="link" 
                  className="text-white p-0"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
                </Button>
              </div>

              <Row>
                {/* Coluna da Foto */}
                <Col md={3} className="text-center border-end border-secondary">
                  <div className="position-relative d-inline-block">
                    <div 
                      className="position-relative d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid var(--bs-secondary)',
                        backgroundColor: '#2a2a2a'
                      }}
                    >
                      <img
                        src={profileData.profileImage || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    {isEditing && (
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex flex-column align-items-center gap-2">
                          <Button
                            variant="outline-primary"
                            className="px-4"
                            onClick={() => document.getElementById('photoUpload').click()}
                          >
                            <i className="fas fa-camera me-2"></i>
                            Alterar foto
                          </Button>
                          <Form.Control
                            type="file"
                            id="photoUpload"
                            className="d-none"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <small className="text-white-50">
                            JPG ou PNG, máximo 5MB
                          </small>
                        </Form.Label>
                      </Form.Group>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="mt-3">
                      <h4 className="text-white mb-1">{profileData.name}</h4>
                      <p className="text-white-50 mb-0">{profileData.email}</p>
                    </div>
                  )}
                </Col>

                {/* Coluna dos Dados */}
                <Col md={9}>
                  <Row className="g-4">
                    <Col xs={12}>
                    
                      <Row className="g-3">
                        <Col md={6}>{renderField('Nome', profileData.name, 'name')}</Col>
                        <Col md={6}>{renderField('Email', profileData.email, 'email', 'email')}</Col>
                        <Col md={4}>{renderField('Telefone', profileData.phone, 'phone', 'tel')}</Col>
                        <Col md={4}>{renderField('Data de Nascimento', profileData.birthDate, 'birthDate', 'date')}</Col>
                        <Col md={4}>{renderField('Gênero', profileData.gender, 'gender', 'select')}</Col>
                      </Row>
                    </Col>

                    <Col xs={12}>
                      <h6 className="text-white-50 mb-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Endereço
                      </h6>
                      <Row className="g-3">
                        <Col md={6}>{renderField('Rua', profileData.street, 'street')}</Col>
                        <Col md={2}>{renderField('Número', profileData.number, 'number')}</Col>
                        <Col md={4}>{renderField('Complemento', profileData.complement, 'complement')}</Col>
                        <Col md={4}>{renderField('Bairro', profileData.neighborhood, 'neighborhood')}</Col>
                        <Col md={4}>{renderField('Cidade', profileData.city, 'city')}</Col>
                        <Col md={2}>{renderField('Estado', profileData.state, 'state')}</Col>
                        <Col md={2}>{renderField('CEP', profileData.zipCode, 'zipCode')}</Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Botões de Ação */}
              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4 pt-4 border-top border-secondary">
                  <Button 
                    variant="outline-light"
                    className="px-4"
                    onClick={() => setIsEditing(false)}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary"
                    className="px-4"
                    onClick={handleSave}
                  >
                    <i className="fas fa-check me-2"></i>
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Modal Nova Marca */}
      <Modal
        show={showNewMarkModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        backdrop="static"
        className="modal-dark"
      >
        <Modal.Header className="bg-dark border-secondary">
          <Modal.Title className="text-white">
            <i className="fas fa-trophy me-2"></i>
            Nova marca
          </Modal.Title>
          <Button 
            variant="link" 
            className="text-white p-0 border-0 ms-auto"
            onClick={handleCloseModal}
          >
            <i className="fas fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body className="bg-dark border-secondary p-4">
          <Form>
            {/* Dropdown de Categorias */}
            <Form.Group className="mb-4">
              <Form.Label className="text-white-50 mb-2">
                <i className="fas fa-layer-group me-2"></i>
                Categoria
              </Form.Label>
              <Dropdown className="w-100">
                <div className="position-relative">
                  <Dropdown.Toggle 
                    variant="outline-secondary" 
                    className="w-100 text-start bg-dark text-white border-secondary form-control-lg d-flex align-items-center justify-content-between"
                  >
                    {markData.category || 'Selecione uma categoria'}
                  </Dropdown.Toggle>
                </div>
                <Dropdown.Menu className="w-100 bg-dark border-secondary">
                  <Dropdown.Item 
                    className="text-white py-2 px-3" 
                    onClick={() => handleMarkInputChange({ target: { name: 'category', value: '50m Livre' } })}
                  >
                    <i className="fas fa-swimming-pool me-2"></i>
                    50m Livre
                  </Dropdown.Item>
                  <Dropdown.Item 
                    className="text-white py-2 px-3"
                    onClick={() => handleMarkInputChange({ target: { name: 'category', value: '100m Livre' } })}
                  >
                    <i className="fas fa-swimming-pool me-2"></i>
                    100m Livre
                  </Dropdown.Item>
                  <Dropdown.Item 
                    className="text-white py-2 px-3"
                    onClick={() => handleMarkInputChange({ target: { name: 'category', value: '200m Livre' } })}
                  >
                    <i className="fas fa-swimming-pool me-2"></i>
                    200m Livre
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            {/* Pills de Tipo */}
            <Form.Group className="mb-4">
              <Form.Label className="text-white-50 mb-2">
                <i className="fas fa-tag me-2"></i>
                Tipo da Marca
              </Form.Label>
              <Nav 
                variant="pills" 
                className="nav-fill"
                activeKey={markType}
                onSelect={handleMarkTypeChange}
              >
                <Nav.Item>
                  <Nav.Link 
                    eventKey="competition"
                    className={`rounded-3 ${markType === 'competition' ? 'active bg-primary' : 'text-white'}`}
                  >
                    <i className="fas fa-medal me-2"></i>
                    Competição
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="free"
                    className={`rounded-3 ${markType === 'free' ? 'active bg-primary' : 'text-white'}`}
                  >
                    <i className="fas fa-stopwatch me-2"></i>
                    Marca Livre
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Form.Group>

            <Row className="g-4">
              {/* Campo de Tempo */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-white-50 mb-2">
                    <i className="fas fa-clock me-2"></i>
                    Tempo
                  </Form.Label>
                  <Form.Control
                    type="time"
                    step="0.01"
                    className="bg-dark text-white border-secondary form-control-lg"
                    name="time"
                    value={markData.time}
                    onChange={handleMarkInputChange}
                  />
                  <Form.Text className="text-white-50">
                    Formato: minutos:segundos.centésimos
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Campo de Distância */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-white-50 mb-2">
                    <i className="fas fa-ruler-horizontal me-2"></i>
                    Distância
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      className="bg-dark text-white border-secondary form-control-lg"
                      name="distance"
                      value={markData.distance}
                      onChange={handleMarkInputChange}
                      placeholder="Ex: 50"
                    />
                    <InputGroup.Text className="bg-dark text-white-50 border-secondary">
                      metros
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary p-3">
          <Button 
            variant="outline-light" 
            className="px-4 py-2"
            onClick={handleCloseModal}
          >
            <i className="fas fa-times me-2"></i>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            className="px-4 py-2"
            onClick={handleSaveMark}
          >
            <i className="fas fa-check me-2"></i>
            Salvar Marca
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
