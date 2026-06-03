import { getAdminInscritos, resendEmail } from "../services/adminService";
import { useEffect, useState } from "react";

import AnalyticsSection from "../components/analytics/AnalyticsSection";
import AnalyticsSkeleton from "../components/analytics/AnalyticsSkeleton";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import Footer from "../components/Footer";
//import { exportExcel } from "../services/reportService";
import { getAnalytics } from "../services/analyticsService";
import { getDashboardData } from "../services/dashboardService";
import { updateInscrito } from "../services/adminUpdateService";
import { useNavigate } from "react-router-dom";

//import axios from "axios";

export default function Admin() {
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [analytics, setAnalytics] = useState(null);

  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const navigate = useNavigate();
  const adminUser = localStorage.getItem("admin_user") || "Admin";

  useEffect(() => {
    fetchInscritos();
    loadDashboard();
    loadAnalytics();
  }, []);

  const fetchInscritos = async () => {
    try {
      setLoading(true);

      setError("");

      const inscritos = await getAdminInscritos();

      setInscritos(inscritos);
    } catch (err) {
      console.error(err);

      setError("Erro ao carregar inscritos.");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);

      const data = await getAnalytics();

      setAnalytics(data);
    } catch (error) {
      console.error("Erro analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoadingDashboard(true);

      const data = await getDashboardData();

      setDashboard(data);
    } catch (error) {
      console.error("Erro dashboard:", error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleResendEmail = async (inscrito) => {
    try {
      await resendEmail(inscrito.row);

      alert("E-mail reenviado com sucesso.");
    } catch (error) {
      alert(error.message);
    }
  };

  /*   const togglePago = async (id, currentPago) => {
    try {
      // chamada para marcar/desmarcar pagamento
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/pagamento`, {
        id,
        pago: !currentPago,
      });
      // atualizar estado localmente
      setInscritos((prev) =>
        prev.map((i) => (i.id === id ? { ...i, pago: !currentPago } : i)),
      );
    } catch (err) {
      console.error("Erro ao atualizar pagamento:", err);
      alert("Erro ao atualizar pagamento. Veja o console para detalhes.");
    }
  }; */

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const handleUpdateInscrito = async (inscrito, field, value) => {
    try {
      await updateInscrito(
        inscrito.row,

        {
          [field]: value,
        },
      );

      /*
      ========================================
      UPDATE LOCAL
      ========================================
      */

      setInscritos((prev) =>
        prev.map((item) => {
          if (item.id !== inscrito.id) {
            return item;
          }

          return {
            ...item,

            [field]: value,
          };
        }),
      );

      /*
      ========================================
      REFRESH ANALYTICS
      ========================================
      */

      loadAnalytics();

      loadDashboard();
    } catch (error) {
      alert(error.message || "Erro ao atualizar.");
    }
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
            onClick={() => navigate("/admin/settings")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            ⚙️ Gerenciar Admins
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition ml-auto"
          >
            🏠 Voltar para Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard */}

        {loadingDashboard ? (
          <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
            <p className="text-gray-600 text-lg">📊 Carregando dashboard...</p>
          </div>
        ) : (
          <DashboardGrid dashboard={dashboard} />
        )}
        {error && (
          <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loadingAnalytics ? (
          <AnalyticsSkeleton />
        ) : (
          <AnalyticsSection analytics={analytics} />
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
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
                        CPF
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
                        Cidade
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
                        Tamanho_camisa
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-gray-700 w-1/6">
                        Operações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritos.map((inscrito, index) => (
                      <tr
                        key={inscrito.id}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-purple-50 transition`}
                      >
                        <td
                          className="px-6 py-4 font-semibold text-gray-800 truncate"
                          title={inscrito.nome}
                        >
                          {inscrito.nome}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {inscrito.telefone}
                        </td>
                        <td
                          className="px-6 py-4 text-gray-700 truncate"
                          title={inscrito.email}
                        >
                          {inscrito.email}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {inscrito.cpf}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {inscrito.cidade}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {inscrito.tamanho_camisa}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {/* STATUS PAGAMENTO */}

                            <select
                              value={inscrito.status_pagamento || "PENDENTE"}
                              className="
                                border
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-green-500
                              "
                              onChange={(e) => {
                                //console.log("Novo status:", e.target.value);
                                handleUpdateInscrito(
                                  inscrito,
                                  "status_pagamento",
                                  e.target.value,
                                );
                              }}
                            >
                              <option value="PENDENTE">⏳ PENDENTE</option>

                              <option value="PAGO">✅ PAGO</option>
                            </select>

                            {/* TIPO INSCRIÇÃO */}

                            <select
                              value={inscrito.tipo_inscricao || "NORMAL"}
                              className="
                                border
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-purple-500
                              "
                              onChange={(e) => {
                                //console.log("Novo tipo:", e.target.value);
                                handleUpdateInscrito(
                                  inscrito,
                                  "tipo_inscricao",
                                  e.target.value,
                                );
                              }}
                            >
                              <option value="NORMAL">NORMAL</option>

                              <option value="EQUIPE">EQUIPE</option>

                              <option value="PARCERIA">PARCERIA</option>

                              <option value="DIVULGACAO">DIVULGAÇÃO</option>

                              <option value="CORTESIA">CORTESIA</option>
                            </select>

                            {/* DISTÂNCIA */}

                            <select
                              value={inscrito.distancia || "0 KM"}
                              className="
                                border
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                              "
                              onChange={(e) => {
                                //console.log("Nova distância:", e.target.value);
                                handleUpdateInscrito(
                                  inscrito,
                                  "distancia",
                                  e.target.value,
                                );
                              }}
                            >
                              <option value="0 KM">0 KM</option>

                              {/* <option value="3 KM">3 KM</option> */}

                              <option value="5 KM">5 KM</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleResendEmail(inscrito)}
                            className="
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                              "
                          >
                            📧 Reenviar E-mail
                          </button>
                        </td>

                        {/*                         <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                inscrito.pago
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {inscrito.pago ? "✅ Pago" : "⏳ Pendente"}
                            </span>
                            <button
                              onClick={() =>
                                // togglePago(inscrito.id, inscrito.pago)
                                alert("ETAPA 4.4 - integração pagamento admin")
                              }
                              className="text-sm bg-white border px-2 py-1 rounded hover:bg-gray-50"
                              title={
                                inscrito.pago
                                  ? "Desmarcar como pago"
                                  : "Marcar como pago"
                              }
                            >
                              {inscrito.pago ? "Desmarcar" : "Marcar"}
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
