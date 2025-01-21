import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useWorkout } from '../../hooks/useWorkout';

const AddWorkoutForm = ({ onSuccess }) => {
  const { addWorkout, loading } = useWorkout();
  const [formData, setFormData] = useState({
    type: '',
    distance: '',
    time: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Converte os valores para número
      const workoutData = {
        ...formData,
        distance: parseFloat(formData.distance),
        time: parseInt(formData.time)
      };

      await addWorkout(workoutData);
      toast.success('Treino adicionado com sucesso!');
      
      // Limpa o formulário
      setFormData({
        type: '',
        distance: '',
        time: '',
        notes: ''
      });

      // Chama o callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Erro ao adicionar treino');
      console.error('Erro ao adicionar treino:', error);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4 text-white">Adicionar Novo Treino</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="type" className="form-label text-white">Tipo de Treino</label>
            <select
              id="type"
              name="type"
              className="form-select bg-dark text-white border-secondary"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="" className="text-white">Selecione o tipo</option>
              <option value="corrida" className="text-white">Corrida</option>
              <option value="caminhada" className="text-white">Caminhada</option>
              <option value="ciclismo" className="text-white">Ciclismo</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="distance" className="form-label text-white">Distância (km)</label>
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="time" className="form-label text-white">Tempo (minutos)</label>
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label text-white">Observações</label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              'Adicionar Treino'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutForm;
