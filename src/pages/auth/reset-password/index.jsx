import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../../../contexts/FirebaseContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess('Email de recuperação enviado. Verifique sua caixa de entrada.');
    } catch (err) {
      setError('Erro ao enviar email de recuperação. Verifique o endereço informado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 text-white">Recuperar Senha</h2>
        
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success text-center" role="alert">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white">Email</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Seu email"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enviando...
              </>
            ) : 'Enviar Email de Recuperação'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/auth/signin" className="d-block text-decoration-none text-white">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;