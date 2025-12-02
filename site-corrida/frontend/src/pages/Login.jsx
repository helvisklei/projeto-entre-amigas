import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fallback credentials para quando o backend não está disponível
// Apenas o admin padrão do sistema funciona
const FALLBACK_CREDENTIALS = {
  'admin': ['HVK1080hvk@@']
};

export default function Login() {
  const [credentials, setCredentials] = useState({ usuario: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Tentar conectar ao backend real
      try {
        const response = await axios.post(`${API_URL}/login`, 
          {
            usuario: credentials.usuario,
            senha: credentials.senha
          },
          { timeout: 5000 }
        );

        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('admin_user', response.data.usuario);
          localStorage.setItem('admin_id', response.data.id);
          localStorage.setItem('admin_email', response.data.email);
          localStorage.setItem('login_type', 'database');
          navigate('/admin');
          return;
        }
      } catch (backendErr) {
        console.warn('Backend indisponível, tentando fallback local:', backendErr.message);
        
        // Fallback local quando backend está indisponível
        const validPasswords = FALLBACK_CREDENTIALS[credentials.usuario];
        if (validPasswords && validPasswords.includes(credentials.senha)) {
          const token = 'fallback_token_' + Date.now();
          localStorage.setItem('auth_token', token);
          localStorage.setItem('admin_user', credentials.usuario);
          localStorage.setItem('admin_id', '1');
          localStorage.setItem('admin_email', 'admin@local');
          localStorage.setItem('login_type', 'fallback');
          
          console.log('✅ Login via fallback (modo offline)');
          navigate('/admin');
          return;
        }
        
        // Se fallback também falhar, mostrar erro
        throw new Error('Usuário ou senha inválidos. Backend indisponível também.');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erro desconhecido ao fazer login';
      setError(message);
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">🔐 Painel Admin</h1>
          <p className="text-gray-600">Entre Amigas - Corrida 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Usuário</label>
            <input
              type="text"
              placeholder="Digite o usuário"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              value={credentials.usuario}
              onChange={(e) => setCredentials({ ...credentials, usuario: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Senha</label>
            <input
              type="password"
              placeholder="Digite a senha"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              value={credentials.senha}
              onChange={(e) => setCredentials({ ...credentials, senha: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg transition ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-pink-700'
            }`}
            disabled={loading}
          >
            {loading ? '🔄 Entrando...' : '✨ Entrar'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 font-semibold mb-2">🔒 Acesso ao Painel:</p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Administrador Padrão:</strong> admin / HVK1080hvk@@
          </p>
          <p className="text-sm text-gray-600">
            Admins cadastrados na tabela usam suas credenciais próprias (usuário e senha cadastrados).
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-purple-600 hover:text-purple-800 font-semibold">
            ← Voltar para Home
          </a>
        </div>
      </div>
    </div>
  );
}
