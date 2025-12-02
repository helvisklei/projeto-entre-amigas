import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

export default function Admin() {
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const adminUser = localStorage.getItem('admin_user') || 'Admin';

  useEffect(() => {
    fetchInscritos();
  }, []);

  const fetchInscritos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin`);
      setInscritos(response.data || []);
    } catch (err) {
      console.error(err);
      setInscritos([
        { id: 1, nome: 'Maria Silva', telefone: '61999999999', email: 'maria@email.com',cpf: '01234567809', cidade: 'Recife', tamanho_camisa: 'P', pago: true },
        { id: 2, nome: 'Ana Costa', telefone: '61998888888', email: 'ana@email.com', cpf: '01234567809', cidade: 'Recife', tamanho_camisa: 'P', pago: false },
        { id: 3, nome: 'João Santos', telefone: '61997777777', email: 'joao@email.com', cpf: '01234567809', cidade: 'Recife', tamanho_camisa: 'P', pago: true },
      ]);
      setError('⚠️ Usando dados de demonstração (API não conectada)');
    } finally {
      setLoading(false);
    }
  };

  const togglePago = async (id, currentPago) => {
    try {
      // chamada para marcar/desmarcar pagamento
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/pagamento`, { id, pago: !currentPago });
      // atualizar estado localmente
      setInscritos(prev => prev.map(i => (i.id === id ? { ...i, pago: !currentPago } : i)));
    } catch (err) {
      console.error('Erro ao atualizar pagamento:', err);
      alert('Erro ao atualizar pagamento. Veja o console para detalhes.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🔐 Painel Administrativo</h1>
            <p className="text-purple-100">Bem-vinda, {adminUser}! 👋</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-2 px-4 rounded-lg transition"
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-purple-100 border-b border-purple-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 flex-wrap">
          <button
            onClick={fetchInscritos}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            📋 Inscrições
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            ⚙️ Gerenciar Admins
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition ml-auto"
          >
            🏠 Voltar para Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">⏳ Carregando inscritos...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-600">
                📋 Inscritos ({inscritos.length})
              </h2>
            </div>

            {inscritos.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p className="text-lg">Nenhum inscrito ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">Nome</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">Telefone</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">Email</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">CPF</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">Cidade</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">Tamanho_camisa</th>
                      <th className="px-6 py-3 text-center font-semibold text-gray-700 w-1/6">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritos.map((inscrito, index) => (
                      <tr
                        key={inscrito.id}
                        className={`border-b ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-purple-50 transition`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800 truncate" title={inscrito.nome}>{inscrito.nome}</td>
                        <td className="px-6 py-4 text-gray-700">{inscrito.telefone}</td>
                        <td className="px-6 py-4 text-gray-700 truncate" title={inscrito.email}>{inscrito.email}</td>
                        <td className="px-6 py-4 text-gray-700">{inscrito.cpf}</td>
                        <td className="px-6 py-4 text-gray-700">{inscrito.cidade}</td>
                        <td className="px-6 py-4 text-gray-700">{inscrito.tamanho_camisa}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`px-3 py-1 rounded-full font-semibold ${
                              inscrito.pago 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {inscrito.pago ? '✅ Pago' : '⏳ Pendente'}
                            </span>
                            <button
                              onClick={() => togglePago(inscrito.id, inscrito.pago)}
                              className="text-sm bg-white border px-2 py-1 rounded hover:bg-gray-50"
                              title={inscrito.pago ? 'Desmarcar como pago' : 'Marcar como pago'}
                            >
                              {inscrito.pago ? 'Desmarcar' : 'Marcar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Relatórios */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <a
            href={`${process.env.REACT_APP_API_URL}/relatorio/pdf`}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition transform hover:scale-105"
          >
            📄 Gerar Relatório em PDF
          </a>
          <a
            href={`${process.env.REACT_APP_API_URL}/relatorio/excel`}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition transform hover:scale-105"
          >
            📊 Gerar Relatório em Excel
          </a>
        </div>

        {/* Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">👥 Total de Inscritos</h3>
            <p className="text-4xl font-bold text-blue-800">{inscritos.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-2xl font-bold text-green-600 mb-2">✅ Pagamentos Confirmados</h3>
            <p className="text-4xl font-bold text-green-800">{inscritos.filter(i => i.pago).length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg shadow p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">⏳ Pagamentos Pendentes</h3>
            <p className="text-4xl font-bold text-orange-800">{inscritos.filter(i => !i.pago).length}</p>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchInscritos}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
