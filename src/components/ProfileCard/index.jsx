import React from 'react';

const ProfileCard = ({ userData }) => {
  const { 
    name, email, phone, birthDate, gender,
    address: { street, number, complement, neighborhood, city, state, zipCode }
  } = userData;

  return (
    <div className="card bg-dark border border-secondary border-opacity-50">
      {/* Header */}
      <div className="card-header border-bottom border-secondary border-opacity-25 p-4">
        <div className="d-flex align-items-center">
          <div className="position-relative me-3">
            <div className="bg-primary bg-opacity-10 rounded-circle" style={{ width: '64px', height: '64px' }}>
              <i className="fas fa-user text-primary position-absolute top-50 start-50 translate-middle fs-3"></i>
            </div>
          </div>
          <div>
            <h4 className="text-white mb-1">{name}</h4>
            <div className="text-white-50">{email}</div>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {/* Informações Pessoais */}
        <div className="border-bottom border-secondary border-opacity-25">
          <div className="px-4 py-3">
            <h6 className="text-white-50 text-uppercase fw-medium small mb-0">Informações Pessoais</h6>
          </div>
          <div className="px-4 pb-3">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-phone text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">Telefone</small>
                    <div className="text-white">{phone}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-calendar text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">Data de Nascimento</small>
                    <div className="text-white">{birthDate}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-venus-mars text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">Gênero</small>
                    <div className="text-white">{gender}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <div className="px-4 py-3">
            <h6 className="text-white-50 text-uppercase fw-medium small mb-0">Endereço</h6>
          </div>
          <div className="px-4 pb-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center">
                  <i className="fas fa-road text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">Rua</small>
                    <div className="text-white">{street}, {number}</div>
                    {complement && <small className="text-white-50">{complement}</small>}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center">
                  <i className="fas fa-map text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">Bairro</small>
                    <div className="text-white">{neighborhood}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-city text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">Cidade</small>
                    <div className="text-white">{city}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-marked-alt text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">Estado</small>
                    <div className="text-white">{state}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-location-dot text-primary me-2"></i>
                  <div>
                    <small className="text-white-50 d-block">CEP</small>
                    <div className="text-white">{zipCode}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
