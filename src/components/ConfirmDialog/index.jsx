import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmDialog = ({ show, onClose, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onClose} centered className="modal-dark">
      <div className="modal-content bg-dark text-white">
        <Modal.Header closeButton className="border-secondary">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">{message}</p>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirmar
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
