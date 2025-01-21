import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/FirebaseContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const { currentUser: user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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

  return (
    <div className="container-fluid p-4">
      <Row className="g-4">
        {/* Informações Pessoais */}
        <Col lg={6}>
          <div className="card bg-dark border border-secondary border-opacity-50 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-subtitle text-white-50 fw-medium mb-0">
                  <i className="fas fa-user-circle me-2"></i>
                  Informações Pessoais
                </h5>
                <Button 
                  variant="link" 
                  className="text-white p-0"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
                </Button>
              </div>

              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  {isEditing ? (
                    <Form.Label className="cursor-pointer mb-0">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleImageUpload}
                      />
                      <div className="position-relative d-inline-block">
                        <img
                          src={profileData.profileImage || 'https://via.placeholder.com/150'}
                          alt="Profile"
                          className="rounded-circle border border-2 border-secondary"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <div 
                          className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="fas fa-camera text-white small"></i>
                        </div>
                      </div>
                    </Form.Label>
                  ) : (
                    <img
                      src={profileData.profileImage || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="rounded-circle border border-2 border-secondary"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                  )}
                </div>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Nome</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.name}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Email</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="email"
                        className="bg-dark text-white border-secondary"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.email}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Telefone</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="tel"
                        className="bg-dark text-white border-secondary"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.phone}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Gênero</Form.Label>
                    {isEditing ? (
                      <Form.Select
                        className="bg-dark text-white border-secondary"
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                      </Form.Select>
                    ) : (
                      <p className="text-white mb-3">{profileData.gender}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Endereço */}
        <Col lg={6}>
          <div className="card bg-dark border border-secondary border-opacity-50 h-100">
            <div className="card-body p-4">
              <h5 className="card-subtitle text-white-50 fw-medium mb-4">
                <i className="fas fa-map-marker-alt me-2"></i>
                Endereço
              </h5>

              <Row className="g-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Rua</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="street"
                        value={profileData.street}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.street}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Número</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="number"
                        value={profileData.number}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.number}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Complemento</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="complement"
                        value={profileData.complement}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.complement}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Bairro</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="neighborhood"
                        value={profileData.neighborhood}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.neighborhood}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Cidade</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.city}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">Estado</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.state}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="text-white-50 small">CEP</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        className="bg-dark text-white border-secondary"
                        name="zipCode"
                        value={profileData.zipCode}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-white mb-3">{profileData.zipCode}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Botões de Ação */}
        {isEditing && (
          <Col xs={12}>
            <div className="card bg-dark border border-secondary border-opacity-50">
              <div className="card-body p-3">
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="outline-light"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleSave}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Profile;
