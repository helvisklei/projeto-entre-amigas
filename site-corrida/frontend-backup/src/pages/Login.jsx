import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ usuario: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Credenciais de demo para teste
  // Em produção, isso seria validado no backend
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'senha123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de requisição
    setTimeout(() => {
      if (credentials.usuario === ADMIN_USER && credentials.senha === ADMIN_PASS) {
        localStorage.setItem('auth_token', 'admin_token_' + Date.now());
        localStorage.setItem('admin_user', credentials.usuario);
        navigate('/admin');
      } else {
        setError('Usuário ou senha incorretos');
      }
      setLoading(false);
    }, 500);
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
          <p className="text-sm text-gray-600 font-semibold mb-2">📝 Credenciais de Teste:</p>
          <p className="text-sm text-gray-700"><strong>Usuário:</strong> admin</p>
          <p className="text-sm text-gray-700"><strong>Senha:</strong> senha123</p>
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
