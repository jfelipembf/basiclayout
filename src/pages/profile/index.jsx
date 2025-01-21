import React, { useState, useEffect, memo } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { useUser } from '../../hooks/useUser';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente do formulário de edição
const ProfileForm = memo(({ formData, onInputChange, onSubmit, onCancel, onPhotoUpload, uploading }) => (
  <Form onSubmit={onSubmit} className="p-4">
    {/* Foto do Perfil */}
    <div className="text-center mb-4">
      <div className="position-relative d-inline-block">
        <div 
          className="rounded-circle overflow-hidden mb-3"
          style={{
            width: '150px',
            height: '150px',
            border: '3px solid var(--bs-primary)',
            backgroundColor: '#2a2a2a'
          }}
        >
          {formData.photoURL ? (
            <img
              src={formData.photoURL}
              alt="Profile"
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <i className="fas fa-user fa-3x text-white-50"></i>
            </div>
          )}
        </div>
        <div>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => document.getElementById('photoUpload').click()}
            disabled={uploading}
          >
            <i className="fas fa-camera me-2"></i>
            {uploading ? 'Enviando...' : 'Alterar foto'}
          </Button>
          <Form.Control
            type="file"
            id="photoUpload"
            className="d-none"
            accept="image/*"
            onChange={onPhotoUpload}
            disabled={uploading}
          />
        </div>
      </div>
    </div>

    {/* Dados Pessoais */}
    <div className="mb-4">
      <h6 className="text-white-50 border-bottom border-secondary pb-2 mb-3">
        <i className="fas fa-info-circle me-2"></i>
        Dados Pessoais
      </h6>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Telefone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Gênero</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            >
              <option value="">Selecione</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>

    {/* Endereço */}
    <div className="mb-4">
      <h6 className="text-white-50 border-bottom border-secondary pb-2 mb-3">
        <i className="fas fa-map-marker-alt me-2"></i>
        Endereço
      </h6>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Rua</Form.Label>
            <Form.Control
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={2} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Número</Form.Label>
            <Form.Control
              type="text"
              name="address.number"
              value={formData.address.number}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Complemento</Form.Label>
            <Form.Control
              type="text"
              name="address.complement"
              value={formData.address.complement}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Bairro</Form.Label>
            <Form.Control
              type="text"
              name="address.neighborhood"
              value={formData.address.neighborhood}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Cidade</Form.Label>
            <Form.Control
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={2} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">Estado</Form.Label>
            <Form.Control
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
        <Col md={2} className="mb-3">
          <Form.Group>
            <Form.Label className="text-white-50">CEP</Form.Label>
            <Form.Control
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={onInputChange}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>

    {/* Botões */}
    <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary">
      <Button
        variant="outline-light"
        onClick={onCancel}
        type="button"
      >
        Cancelar
      </Button>
      <Button variant="primary" type="submit" style={{ width: '150px' }}>
        Salvar 
      </Button>
    </div>
  </Form>
));

// Componente principal do Profile
const Profile = () => {
  const { user, updateProfile, updateAddress } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    photoURL: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        photoURL: user.photoURL || '',
        address: {
          street: user.address?.street || '',
          number: user.address?.number || '',
          complement: user.address?.complement || '',
          neighborhood: user.address?.neighborhood || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const storage = getStorage();
      const photoRef = ref(storage, `profile-photos/${user.uid}/${file.name}`);
      
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);
      
      await updateProfile({ photoURL });
      setFormData(prev => ({ ...prev, photoURL }));
      toast.success('Foto atualizada com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      toast.error('Erro ao atualizar foto', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { address, ...profileData } = formData;
      
      await updateProfile(profileData);
      await updateAddress(address);
      
      toast.success('Perfil atualizado com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Erro ao atualizar perfil: ' + error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        photoURL: user.photoURL || '',
        address: {
          street: user.address?.street || '',
          number: user.address?.number || '',
          complement: user.address?.complement || '',
          neighborhood: user.address?.neighborhood || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
        },
      });
    }
  };

  // Modo de Visualização
  const ViewMode = () => (
    <div className="p-4">
      {/* Cabeçalho com Foto */}
      <div className="text-center mb-4">
        <div className="position-relative d-inline-block mb-3">
          <div 
            className="rounded-circle overflow-hidden"
            style={{
              width: '150px',
              height: '150px',
              border: '3px solid var(--bs-primary)',
              backgroundColor: '#2a2a2a'
            }}
          >
            {formData.photoURL ? (
              <img
                src={formData.photoURL}
                alt="Profile"
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <i className="fas fa-user fa-3x text-white-50"></i>
              </div>
            )}
          </div>
        </div>
        <h4 className="text-white mb-1">{formData.name || 'Sem nome'}</h4>
        <p className="text-white-50 mb-0">{formData.email}</p>
      </div>

      {/* Dados Pessoais */}
      <div className="mb-4">
        <h6 className="text-white-50 border-bottom border-secondary pb-2 mb-3">
          <i className="fas fa-info-circle me-2"></i>
          Dados Pessoais
        </h6>
        <Row className="g-3">
          <Col md={6}>
            <div className="text-white-50 small mb-1">Telefone</div>
            <div className="text-white">{formData.phone || 'Não informado'}</div>
          </Col>
          <Col md={6}>
            <div className="text-white-50 small mb-1">Gênero</div>
            <div className="text-white">
              {formData.gender === 'male' ? 'Masculino' : 
               formData.gender === 'female' ? 'Feminino' : 
               formData.gender === 'other' ? 'Outro' : 'Não informado'}
            </div>
          </Col>
        </Row>
      </div>

      {/* Endereço */}
      <div>
        <h6 className="text-white-50 border-bottom border-secondary pb-2 mb-3">
          <i className="fas fa-map-marker-alt me-2"></i>
          Endereço
        </h6>
        <Row className="g-3">
          <Col xs={12}>
            <div className="text-white">
              {formData.address.street && formData.address.number ? 
                `${formData.address.street}, ${formData.address.number}` : 
                'Endereço não informado'}
              {formData.address.complement && ` - ${formData.address.complement}`}
            </div>
          </Col>
          {(formData.address.neighborhood || formData.address.city || formData.address.state) && (
            <Col xs={12}>
              <div className="text-white">
                {[
                  formData.address.neighborhood,
                  formData.address.city,
                  formData.address.state
                ].filter(Boolean).join(', ')}
              </div>
            </Col>
          )}
          {formData.address.zipCode && (
            <Col xs={12}>
              <div className="text-white">CEP: {formData.address.zipCode}</div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-4">
      <Card className="bg-dark border-secondary">
        <Card.Body className="p-0">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-secondary">
            <h5 className="card-title text-white mb-0">
              <i className="fas fa-user-circle me-2"></i>
              Perfil do Usuário
            </h5>
            <Button
              variant="link"
              className="text-white p-0"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className={`fas fa-${isEditing ? 'times' : 'edit'} me-2`}></i>
              {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
            </Button>
          </div>

          {/* Conteúdo */}
          {isEditing ? (
            <ProfileForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onPhotoUpload={handlePhotoUpload}
              uploading={uploading}
            />
          ) : (
            <ViewMode />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
