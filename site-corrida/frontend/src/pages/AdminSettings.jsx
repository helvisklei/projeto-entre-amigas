import { useEffect, useState } from "react";

import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    usuario: "",
    senha: "",
    email: "",
  });
  const navigate = useNavigate();
  const adminUser = localStorage.getItem("admin_user") || "Admin";

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admins`,
      );
      setAdmins(response.data || []);
    } catch (err) {
      console.error(err);
      setError("⚠️ Erro ao carregar admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!formData.usuario || !formData.senha) {
      alert("Usuário e senha são obrigatórios!");
      return;
    }

    try {
      if (editingId) {
        // Atualizar
        await axios.put(
          `${process.env.REACT_APP_API_URL}/admins/${editingId}`,
          formData,
        );
        alert("Admin atualizado com sucesso!");
        setEditingId(null);
      } else {
        // Criar novo
        await axios.post(`${process.env.REACT_APP_API_URL}/admins`, formData);
        alert("Admin criado com sucesso!");
      }
      setFormData({ usuario: "", senha: "", email: "" });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      alert(`Erro: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleToggleAdmin = async (id, currentStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/admins/${id}/toggle`, {
        ativo: !currentStatus,
      });
      fetchAdmins();
      alert(`Admin ${!currentStatus ? "ativado" : "inativado"} com sucesso!`);
    } catch (err) {
      alert(`Erro: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este admin?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admins/${id}`);
      fetchAdmins();
      alert("Admin deletado com sucesso!");
    } catch (err) {
      alert(`Erro: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditAdmin = (admin) => {
    setFormData({
      usuario: admin.usuario,
      email: admin.email || "",
      senha: "",
    });
    setEditingId(admin.id);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setFormData({ usuario: "", senha: "", email: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">⚙️ Gerenciar Admins</h1>
            <p className="text-purple-100">Bem-vinda, {adminUser}! 👋</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">
                {editingId ? "✏️ Editar Admin" : "➕ Criar Novo Admin"}
              </h2>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <input
                  type="text"
                  placeholder="Usuário"
                  value={formData.usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, usuario: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={editingId ? true : false}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    {editingId ? "💾 Atualizar" : "✅ Criar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Button to show/hide form */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                ➕ Novo Admin
              </button>
            </div>
          )}

          {/* Admin List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">⏳ Carregando admins...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b-2 border-purple-200">
                <h2 className="text-2xl font-bold text-purple-600">
                  👥 Admins ({admins.length})
                </h2>
              </div>

              {admins.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  <p className="text-lg">Nenhum admin cadastrado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-3 text-center font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center font-semibold text-gray-700">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin, index) => (
                        <tr
                          key={admin.id}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-purple-50 transition`}
                        >
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {admin.usuario}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {admin.email || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                admin.ativo
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {admin.ativo ? "✅ Ativo" : "❌ Inativo"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditAdmin(admin)}
                                className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition"
                                title="Editar"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleAdmin(admin.id, admin.ativo)
                                }
                                className={`text-sm py-1 px-3 rounded transition text-white font-semibold ${
                                  admin.ativo
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
                                title={admin.ativo ? "Inativar" : "Ativar"}
                              >
                                {admin.ativo ? "🔒 Inativar" : "🔓 Ativar"}
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                                title="Deletar"
                              >
                                🗑️ Deletar
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

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/admin")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              ← Voltar para Painel
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
