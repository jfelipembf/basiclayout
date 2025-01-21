import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../../../contexts/FirebaseContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useFirebase();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 text-white">Criar Conta</h2>
        
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
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

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white">Senha</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Sua senha"
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
                Criando conta...
              </>
            ) : 'Criar Conta'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/auth/signin" className="d-block text-decoration-none text-white">
            Já tem uma conta? Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;