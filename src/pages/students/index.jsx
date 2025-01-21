import React, { useState } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';

const Students = () => {
  const [students] = useState([
    {
      id: 1,
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      birthDate: '1990-05-15',
      status: 'active'
    },
    {
      id: 2,
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      birthDate: '1988-10-20',
      status: 'inactive'
    },
    {
      id: 3,
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      birthDate: '1995-03-25',
      status: 'active'
    }
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Ativo</Badge>;
      case 'inactive':
        return <Badge bg="danger">Inativo</Badge>;
      default:
        return <Badge bg="secondary">Indefinido</Badge>;
    }
  };

  const handleEdit = (id) => {
    console.log('Editar aluno:', id);
  };

  const handleView = (id) => {
    console.log('Visualizar aluno:', id);
  };

  const handleDelete = (id) => {
    console.log('Excluir aluno:', id);
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white mb-0">Alunos</h2>
        <Button variant="primary">
          <i className="fas fa-plus me-2"></i>
          Novo Aluno
        </Button>
      </div>

      <div className="bg-dark rounded border border-secondary">
        <Table responsive hover variant="dark" className="mb-0">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th style={{ width: '60px' }}>Foto</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Data de Nascimento</th>
              <th>Status</th>
              <th style={{ width: '150px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                </td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{new Date(student.birthDate).toLocaleDateString('pt-BR')}</td>
                <td>{getStatusBadge(student.status)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleView(student.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(student.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(student.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Students;
