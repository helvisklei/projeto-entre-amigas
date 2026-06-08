import { getAdminInscritos, resendEmail } from "../services/adminService";
import { useEffect, useState } from "react";

import AnalyticsSection from "../components/analytics/AnalyticsSection";
import AnalyticsSkeleton from "../components/analytics/AnalyticsSkeleton";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import Footer from "../components/Footer";
import KitRetiradaDashboard from "../components/dashboard/KitRetiradaDashboard";
import SeguroAtletaDashboard from "../components/dashboard/SeguroAtletaDashboard";
import { getAnalytics } from "../services/analyticsService";
import { getDashboardData } from "../services/dashboardService";
import { updateInscrito } from "../services/adminUpdateService";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // ESTADOS PARA FILTRO E ORDENAÇÃO
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc', 'none'

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

      const data = await getAdminInscritos();

      // console.log(data[0]);
      // console.log(Object.keys(data[0]));

      // ============================================================
      // MAPEAMENTO DE SEGURANÇA (Garante propriedades minúsculas)
      // Resolve conflito se o backend mandar NOME ou nome
      // ============================================================
      const dadosMapeados = data.map((item) => ({
        // Usamos 'row' (minúsculo) como ID para o frontend
        row: item.row || item.ROW,

        // Mapeia as propriedades maiúsculas para as minúsculas que o filtro usa
        nome: item.NOME || item.nome || "",
        cpf: item.CPF || item.cpf || "",
        telefone: item.TELEFONE || item.telefone || "",
        email: item.EMAIL || item.email || "",
        cidade: item.CIDADE || item.cidade || "",
        tamanho_camisa: item.TAMANHO_CAMISA || item.tamanho_camisa || "",

        // Mapeia os status das operações
        status_pagamento:
          item.STATUS_PAGAMENTO || item.status_pagamento || "PENDENTE",
        status_documentacao:
          item.STATUS_DOCUMENTACAO || item.status_documentacao || "", //NAO_APLICAVEL
        tipo_inscricao: item.TIPO_INSCRICAO || item.tipo_inscricao || "NORMAL",
        distancia: item.DISTANCIA || item.distancia || "0 KM",
        kit_retirado: item.KIT_RETIRADO || item.kit_retirado || "NÃO",
      }));

      setInscritos(dadosMapeados);
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

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const handleUpdateInscrito = async (inscrito, field, value) => {
    try {
      // Usamos 'inscrito.row' (que é o ID da linha no backend)
      await updateInscrito(inscrito.row, { [field]: value });

      setInscritos((prev) =>
        prev.map((item) => {
          // Atualiza localmente comparando pela 'row'
          if (item.row !== inscrito.row) return item;
          return { ...item, [field]: value };
        }),
      );

      loadAnalytics();
      loadDashboard();
    } catch (error) {
      alert(error.message || "Erro ao atualizar.");
    }
  };

  const handleConfirmarKit = async (inscrito) => {
    try {
      await updateInscrito(inscrito.row, { kit_retirado: "SIM" });
      await fetchInscritos();
      await loadDashboard();
      await loadAnalytics();
      alert("Kit entregue com sucesso.");
    } catch (error) {
      alert(error.message || "Erro ao confirmar kit.");
    }
  };

  /* ========================================================
     LÓGICA DE FILTRAGEM E ORDENAÇÃO (CORRIGIDA)
     ======================================================== */
  const inscritosFiltradosEOrdenados = [...inscritos]
    .filter((inscrito) => {
      // 1. Se não há termo de busca, mostra tudo
      if (!searchTerm) return true;

      // 2. Função de normalização (remove acentos e deixa minúsculo)
      const normalizar = (texto = "") =>
        texto
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .toLowerCase();

      // 3. Normaliza o termo de busca UMA VEZ
      const termNormalizado = normalizar(searchTerm);

      // --- CORREÇÃO AQUI ---

      // Busca por NOME: normaliza o nome do inscrito e compara com o termo normalizado
      const nomeMatch = normalizar(inscrito.nome).includes(termNormalizado);

      // Busca por CPF: remove tudo que não for dígito do CPF e do termo original
      const cpfLimpoTermo = searchTerm.replace(/\D/g, "");

      const cpfMatch =
        cpfLimpoTermo.length >= 3 && inscrito.cpf
          ? inscrito.cpf.replace(/\D/g, "").includes(cpfLimpoTermo)
          : false;

      return nomeMatch || cpfMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "none") return 0; // Mantém a ordem original

      const nomeA = a.nome?.toLowerCase() || "";
      const nomeB = b.nome?.toLowerCase() || "";

      if (sortOrder === "asc") {
        return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
      } else {
        return nomeB.localeCompare(nomeA, "pt-BR", { sensitivity: "base" });
      }
    });

  /*   console.log("Busca:", searchTerm);

  console.log("Total inscritos:", inscritos.length);

  console.log("Resultado filtro:", inscritosFiltradosEOrdenados.length); */

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
          <>
            <AnalyticsSection analytics={analytics} />
            <SeguroAtletaDashboard analytics={analytics} />
            <KitRetiradaDashboard analytics={analytics} />
          </>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">⏳ Carregando inscritos...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header da Tabela + Inputs de Controle */}
            <div className="p-6 border-b-2 border-purple-200 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-600">
                  📋 Inscritos ({inscritosFiltradosEOrdenados.length})
                </h2>
                {searchTerm && (
                  <p className="text-xs text-gray-500 mt-1">
                    Filtrado de um total de {inscritos.length} registros
                  </p>
                )}
              </div>

              {/* BLOCO DE BUSCA E ORDENAÇÃO (ESTILO PREMIUM ENTERPRISE) */}
              <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto">
                {/* Campo de Pesquisa Otimizado */}
                <div className="relative flex-1 sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-base">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Nome completo ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition duration-150"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                      title="Limpar busca"
                    >
                      <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        ×
                      </span>
                    </button>
                  )}
                </div>

                {/* Seletor de Ordenação Otimizado */}
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full sm:w-auto border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-[13px] font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 cursor-pointer text-gray-900 transition duration-150 appearance-none"
                  >
                    <option value="none">⏳ Inscrição Original</option>
                    <option value="asc">🔤 Alfabética (A-Z)</option>
                    <option value="desc">🔤 Alfabética (Z-A)</option>
                  </select>
                  {/* Ícone de seta customizado para o select */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* BLOCO DE BUSCA E ORDENAÇÃO */}
              {/* <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"> */}
              {/* Campo de Pesquisa */}
              {/*                 <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por Nome ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div> */}

              {/* Seletor de Ordenação */}
              {/*                 <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="none">⏳ Ordem de Inscrição</option>
                  <option value="asc">🔤 Ordem Alfabética (A-Z)</option>
                  <option value="desc">🔤 Ordem Alfabética (Z-A)</option>
                </select>
              </div> */}
            </div>

            {inscritosFiltradosEOrdenados.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p className="text-lg">
                  Nenhum inscrito corresponde aos critérios.
                </p>
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
                    {/* USANDO A ARRAY TRATADA E FILTRADA */}
                    {inscritosFiltradosEOrdenados.map((inscrito, index) => (
                      <tr
                        // Usamos 'row' como key
                        key={inscrito.row}
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

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex flex-col gap-3 min-w-[200px]">
                            <div className="grid grid-cols-1 gap-2">
                              {/* STATUS PAGAMENTO */}
                              <select
                                value={inscrito.status_pagamento || "PENDENTE"}
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                onChange={(e) => {
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

                              {/* STATUS DA DOCUMENTAÇÃO */}

                              {/* STATUS DA DOCUMENTAÇÃO COM PLACEHOLDER TRATADO */}
                              <select
                                // Se o status vier vazio ou nulo, ele assume string vazia "" para ativar o placeholder
                                value={inscrito.status_documentacao || ""}
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer text-gray-700"
                                onChange={(e) =>
                                  handleUpdateInscrito(
                                    inscrito,
                                    "status_documentacao",
                                    e.target.value,
                                  )
                                }
                              >
                                {/* Opção usada como Placeholder */}
                                <option value="" disabled hidden>
                                  📄 Status Documento
                                </option>

                                {/* Opções Reais */}
                                <option value="PENDENTE">📄 PENDENTE</option>
                                <option value="APROVADO">✅ APROVADO</option>
                                <option value="REPROVADO">❌ REPROVADO</option>
                                <option value="NAO_APLICAVEL">➖ N/A</option>
                              </select>

                              {/*                               <select
                                value={
                                  inscrito.status_documentacao ||
                                  "NAO_APLICAVEL"
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                onChange={(e) =>
                                  handleUpdateInscrito(
                                    inscrito,
                                    "status_documentacao",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="PENDENTE">📄 PENDENTE</option>
                                <option value="APROVADO">✅ APROVADO</option>
                                <option value="REPROVADO">❌ REPROVADO</option>
                                <option value="NAO_APLICAVEL">➖ N/A</option>
                              </select> */}

                              {/* TIPO INSCRIÇÃO E DISTÂNCIA */}
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                  value={inscrito.tipo_inscricao || "NORMAL"}
                                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                  onChange={(e) => {
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

                                <select
                                  value={inscrito.distancia || "0 KM"}
                                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                  onChange={(e) => {
                                    handleUpdateInscrito(
                                      inscrito,
                                      "distancia",
                                      e.target.value,
                                    );
                                  }}
                                >
                                  <option value="0 KM">0 KM</option>
                                  <option value="5 KM">5 KM</option>
                                </select>
                              </div>
                            </div>

                            <div className="border-t border-gray-100 my-0.5"></div>

                            {/* Bloco de Botões Inferior */}
                            <div className="flex flex-col gap-2">
                              <button
                                disabled={inscrito.kit_retirado === "SIM"}
                                onClick={() => handleConfirmarKit(inscrito)}
                                className={
                                  inscrito.kit_retirado === "SIM"
                                    ? "w-full bg-gray-400 text-white font-semibold rounded-lg py-2 px-3 text-xs cursor-not-allowed"
                                    : "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2 px-3 text-xs"
                                }
                              >
                                {inscrito.kit_retirado === "SIM"
                                  ? "✅ Kit Entregue"
                                  : "🎽 Confirmar Kit"}
                              </button>

                              <button
                                onClick={() => handleResendEmail(inscrito)}
                                className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-lg py-2 px-3 text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5"
                              >
                                <span>📧</span> Reenviar E-mail
                              </button>
                            </div>
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

// import { getAdminInscritos, resendEmail } from "../services/adminService";
// import { useEffect, useState } from "react";

// import AnalyticsSection from "../components/analytics/AnalyticsSection";
// import AnalyticsSkeleton from "../components/analytics/AnalyticsSkeleton";
// import DashboardGrid from "../components/dashboard/DashboardGrid";
// import Footer from "../components/Footer";
// import KitRetiradaDashboard from "../components/dashboard/KitRetiradaDashboard";
// import SeguroAtletaDashboard from "../components/dashboard/SeguroAtletaDashboard";
// import { getAnalytics } from "../services/analyticsService";
// import { getDashboardData } from "../services/dashboardService";
// import { updateInscrito } from "../services/adminUpdateService";
// import { useNavigate } from "react-router-dom";

// //import { exportExcel } from "../services/reportService";

// //import axios from "axios";

// export default function Admin() {
//   const [inscritos, setInscritos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [dashboard, setDashboard] = useState(null);
//   const [loadingDashboard, setLoadingDashboard] = useState(true);

//   const [analytics, setAnalytics] = useState(null);

//   const [loadingAnalytics, setLoadingAnalytics] = useState(true);

//   const navigate = useNavigate();
//   const adminUser = localStorage.getItem("admin_user") || "Admin";

//   useEffect(() => {
//     fetchInscritos();
//     loadDashboard();
//     loadAnalytics();
//   }, []);

//   const fetchInscritos = async () => {
//     try {
//       setLoading(true);

//       setError("");

//       const inscritos = await getAdminInscritos();

//       setInscritos(inscritos);
//     } catch (err) {
//       console.error(err);

//       setError("Erro ao carregar inscritos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       setLoadingAnalytics(true);

//       const data = await getAnalytics();

//       setAnalytics(data);
//     } catch (error) {
//       console.error("Erro analytics:", error);
//     } finally {
//       setLoadingAnalytics(false);
//     }
//   };

//   const loadDashboard = async () => {
//     try {
//       setLoadingDashboard(true);

//       const data = await getDashboardData();

//       setDashboard(data);
//     } catch (error) {
//       console.error("Erro dashboard:", error);
//     } finally {
//       setLoadingDashboard(false);
//     }
//   };

//   const handleResendEmail = async (inscrito) => {
//     try {
//       await resendEmail(inscrito.row);

//       alert("E-mail reenviado com sucesso.");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   /*   const togglePago = async (id, currentPago) => {
//     try {
//       // chamada para marcar/desmarcar pagamento
//       await axios.post(`${process.env.REACT_APP_API_URL}/admin/pagamento`, {
//         id,
//         pago: !currentPago,
//       });
//       // atualizar estado localmente
//       setInscritos((prev) =>
//         prev.map((i) => (i.id === id ? { ...i, pago: !currentPago } : i)),
//       );
//     } catch (err) {
//       console.error("Erro ao atualizar pagamento:", err);
//       alert("Erro ao atualizar pagamento. Veja o console para detalhes.");
//     }
//   }; */

//   const handleLogout = () => {
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("admin_user");
//     navigate("/login");
//   };

//   const handleUpdateInscrito = async (inscrito, field, value) => {
//     try {
//       await updateInscrito(
//         inscrito.row,

//         {
//           [field]: value,
//         },
//       );

//       /*
//       ========================================
//       UPDATE LOCAL
//       ========================================
//       */

//       setInscritos((prev) =>
//         prev.map((item) => {
//           if (item.id !== inscrito.id) {
//             return item;
//           }

//           return {
//             ...item,

//             [field]: value,
//           };
//         }),
//       );

//       /*
//       ========================================
//       REFRESH ANALYTICS
//       ========================================
//       */

//       loadAnalytics();

//       loadDashboard();
//     } catch (error) {
//       alert(error.message || "Erro ao atualizar.");
//     }
//   };

//   const handleConfirmarKit = async (inscrito) => {
//     try {
//       await updateInscrito(inscrito.row, {
//         kit_retirado: "SIM",
//       });

//       await fetchInscritos();

//       await loadDashboard();

//       await loadAnalytics();

//       alert("Kit entregue com sucesso.");
//     } catch (error) {
//       alert(error.message || "Erro ao confirmar kit.");
//     }
//   };

//   /*   const handleConfirmarKit = async (inscrito) => {
//     try {
//       await confirmarRetiradaKit(inscrito.row);

//       await fetchInscritos();

//       loadDashboard();

//       loadAnalytics();

//       alert("Kit entregue com sucesso.");
//     } catch (error) {
//       alert(error.message);
//     }
//   }; */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
//         <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">🔐 Painel Administrativo</h1>
//             <p className="text-purple-100">Bem-vinda, {adminUser}! 👋</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-2 px-4 rounded-lg transition"
//           >
//             🚪 Sair
//           </button>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-purple-100 border-b border-purple-300">
//         <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 flex-wrap">
//           <button
//             onClick={fetchInscritos}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
//           >
//             📋 Inscrições
//           </button>
//           <button
//             onClick={() => navigate("/admin/settings")}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
//           >
//             ⚙️ Gerenciar Admins
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition ml-auto"
//           >
//             🏠 Voltar para Home
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Dashboard */}

//         {loadingDashboard ? (
//           <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
//             <p className="text-gray-600 text-lg">📊 Carregando dashboard...</p>
//           </div>
//         ) : (
//           <DashboardGrid dashboard={dashboard} />
//         )}
//         {error && (
//           <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         {loadingAnalytics ? (
//           <AnalyticsSkeleton />
//         ) : (
//           <>
//             <AnalyticsSection analytics={analytics} />

//             <SeguroAtletaDashboard analytics={analytics} />

//             <KitRetiradaDashboard analytics={analytics} />
//           </>
//         )}

//         {loading ? (
//           <div className="text-center py-12">
//             <p className="text-xl text-gray-600">⏳ Carregando inscritos...</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="p-6 border-b-2 border-purple-200">
//               <h2 className="text-2xl font-bold text-purple-600">
//                 📋 Inscritos ({inscritos.length})
//               </h2>
//             </div>

//             {inscritos.length === 0 ? (
//               <div className="p-8 text-center text-gray-600">
//                 <p className="text-lg">Nenhum inscrito ainda.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-100 border-b-2 border-gray-300">
//                     <tr>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Nome
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Telefone
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Email
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         CPF
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Cidade
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Tamanho_camisa
//                       </th>
//                       <th className="px-6 py-3 text-center font-semibold text-gray-700 w-1/6">
//                         Operações
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {inscritos.map((inscrito, index) => (
//                       <tr
//                         key={inscrito.id}
//                         className={`border-b ${
//                           index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                         } hover:bg-purple-50 transition`}
//                       >
//                         <td
//                           className="px-6 py-4 font-semibold text-gray-800 truncate"
//                           title={inscrito.nome}
//                         >
//                           {inscrito.nome}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.telefone}
//                         </td>
//                         <td
//                           className="px-6 py-4 text-gray-700 truncate"
//                           title={inscrito.email}
//                         >
//                           {inscrito.email}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.cpf}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.cidade}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.tamanho_camisa}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <div className="flex flex-col gap-3 min-w-[200px]">
//                             {/* Bloco de Selects Superior */}
//                             <div className="grid grid-cols-1 gap-2">
//                               {/* STATUS PAGAMENTO */}
//                               <select
//                                 value={inscrito.status_pagamento || "PENDENTE"}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                                 onChange={(e) => {
//                                   handleUpdateInscrito(
//                                     inscrito,
//                                     "status_pagamento",
//                                     e.target.value,
//                                   );
//                                 }}
//                               >
//                                 <option value="PENDENTE">⏳ PENDENTE</option>
//                                 <option value="PAGO">✅ PAGO</option>
//                               </select>

//                               {/* STATUS DA DOCUMENTAÇÃO (ADICIONADO AQUI) */}
//                               <select
//                                 value={
//                                   inscrito.status_documentacao ||
//                                   "NAO_APLICAVEL"
//                                 }
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                                 onChange={(e) =>
//                                   handleUpdateInscrito(
//                                     inscrito,
//                                     "status_documentacao",
//                                     e.target.value,
//                                   )
//                                 }
//                               >
//                                 <option value="PENDENTE">📄 PENDENTE</option>
//                                 <option value="APROVADO">✅ APROVADO</option>
//                                 <option value="REPROVADO">❌ REPROVADO</option>
//                                 <option value="NAO_APLICAVEL">➖ N/A</option>
//                               </select>

//                               {/* TIPO INSCRIÇÃO E DISTÂNCIA JUNTOS NA MESMA LINHA */}
//                               <div className="grid grid-cols-2 gap-2">
//                                 <select
//                                   value={inscrito.tipo_inscricao || "NORMAL"}
//                                   className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                                   onChange={(e) => {
//                                     handleUpdateInscrito(
//                                       inscrito,
//                                       "tipo_inscricao",
//                                       e.target.value,
//                                     );
//                                   }}
//                                 >
//                                   <option value="NORMAL">NORMAL</option>
//                                   <option value="EQUIPE">EQUIPE</option>
//                                   <option value="PARCERIA">PARCERIA</option>
//                                   <option value="DIVULGACAO">DIVULGAÇÃO</option>
//                                   <option value="CORTESIA">CORTESIA</option>
//                                 </select>

//                                 <select
//                                   value={inscrito.distancia || "0 KM"}
//                                   className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                                   onChange={(e) => {
//                                     handleUpdateInscrito(
//                                       inscrito,
//                                       "distancia",
//                                       e.target.value,
//                                     );
//                                   }}
//                                 >
//                                   <option value="0 KM">0 KM</option>
//                                   <option value="5 KM">5 KM</option>
//                                 </select>
//                               </div>
//                             </div>

//                             {/* Divisor Sutil Interno */}
//                             <div className="border-t border-gray-100 my-0.5"></div>

//                             {/* Bloco de Botões Inferior */}
//                             <div className="flex flex-col gap-2">
//                               <button
//                                 disabled={inscrito.kit_retirado === "SIM"}
//                                 onClick={() => handleConfirmarKit(inscrito)}
//                                 className={
//                                   inscrito.kit_retirado === "SIM"
//                                     ? "w-full bg-gray-400 text-white font-semibold rounded-lg py-2 px-3 text-xs cursor-not-allowed"
//                                     : "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2 px-3 text-xs"
//                                 }
//                               >
//                                 {inscrito.kit_retirado === "SIM"
//                                   ? "✅ Kit Entregue"
//                                   : "🎽 Confirmar Kit"}
//                               </button>

//                               <button
//                                 onClick={() => handleResendEmail(inscrito)}
//                                 className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-lg py-2 px-3 text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5"
//                               >
//                                 <span>📧</span> Reenviar E-mail
//                               </button>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Refresh Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={fetchInscritos}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
//           >
//             🔄 Atualizar
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// import { getAdminInscritos, resendEmail } from "../services/adminService";
// import { useEffect, useState } from "react";

// import AnalyticsSection from "../components/analytics/AnalyticsSection";
// import AnalyticsSkeleton from "../components/analytics/AnalyticsSkeleton";
// import DashboardGrid from "../components/dashboard/DashboardGrid";
// import Footer from "../components/Footer";
// import KitRetiradaDashboard from "../components/dashboard/KitRetiradaDashboard";
// import SeguroAtletaDashboard from "../components/dashboard/SeguroAtletaDashboard";
// import { getAnalytics } from "../services/analyticsService";
// import { getDashboardData } from "../services/dashboardService";
// import { updateInscrito } from "../services/adminUpdateService";
// import { useNavigate } from "react-router-dom";

// //import { exportExcel } from "../services/reportService";

// //import axios from "axios";

// export default function Admin() {
//   const [inscritos, setInscritos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [dashboard, setDashboard] = useState(null);
//   const [loadingDashboard, setLoadingDashboard] = useState(true);

//   const [analytics, setAnalytics] = useState(null);

//   const [loadingAnalytics, setLoadingAnalytics] = useState(true);

//   const navigate = useNavigate();
//   const adminUser = localStorage.getItem("admin_user") || "Admin";

//   useEffect(() => {
//     fetchInscritos();
//     loadDashboard();
//     loadAnalytics();
//   }, []);

//   const fetchInscritos = async () => {
//     try {
//       setLoading(true);

//       setError("");

//       const inscritos = await getAdminInscritos();

//       setInscritos(inscritos);
//     } catch (err) {
//       console.error(err);

//       setError("Erro ao carregar inscritos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       setLoadingAnalytics(true);

//       const data = await getAnalytics();

//       setAnalytics(data);
//     } catch (error) {
//       console.error("Erro analytics:", error);
//     } finally {
//       setLoadingAnalytics(false);
//     }
//   };

//   const loadDashboard = async () => {
//     try {
//       setLoadingDashboard(true);

//       const data = await getDashboardData();

//       setDashboard(data);
//     } catch (error) {
//       console.error("Erro dashboard:", error);
//     } finally {
//       setLoadingDashboard(false);
//     }
//   };

//   const handleResendEmail = async (inscrito) => {
//     try {
//       await resendEmail(inscrito.row);

//       alert("E-mail reenviado com sucesso.");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("admin_user");
//     navigate("/login");
//   };

//   const handleUpdateInscrito = async (inscrito, field, value) => {
//     try {
//       await updateInscrito(
//         inscrito.row,

//         {
//           [field]: value,
//         },
//       );

//       /*
//       ========================================
//       UPDATE LOCAL
//       ========================================
//       */

//       setInscritos((prev) =>
//         prev.map((item) => {
//           if (item.id !== inscrito.id) {
//             return item;
//           }

//           return {
//             ...item,

//             [field]: value,
//           };
//         }),
//       );

//       /*
//       ========================================
//       REFRESH ANALYTICS
//       ========================================
//       */

//       loadAnalytics();

//       loadDashboard();
//     } catch (error) {
//       alert(error.message || "Erro ao atualizar.");
//     }
//   };

//   const handleConfirmarKit = async (inscrito) => {
//     try {
//       await updateInscrito(inscrito.row, {
//         kit_retirado: "SIM",
//       });

//       await fetchInscritos();

//       await loadDashboard();

//       await loadAnalytics();

//       alert("Kit entregue com sucesso.");
//     } catch (error) {
//       alert(error.message || "Erro ao confirmar kit.");
//     }
//   };

//   /*   const handleConfirmarKit = async (inscrito) => {
//     try {
//       await confirmarRetiradaKit(inscrito.row);

//       await fetchInscritos();

//       loadDashboard();

//       loadAnalytics();

//       alert("Kit entregue com sucesso.");
//     } catch (error) {
//       alert(error.message);
//     }
//   }; */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
//         <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">🔐 Painel Administrativo</h1>
//             <p className="text-purple-100">Bem-vinda, {adminUser}! 👋</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-2 px-4 rounded-lg transition"
//           >
//             🚪 Sair
//           </button>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-purple-100 border-b border-purple-300">
//         <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 flex-wrap">
//           <button
//             onClick={fetchInscritos}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
//           >
//             📋 Inscrições
//           </button>
//           <button
//             onClick={() => navigate("/admin/settings")}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
//           >
//             ⚙️ Gerenciar Admins
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition ml-auto"
//           >
//             🏠 Voltar para Home
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Dashboard */}

//         {loadingDashboard ? (
//           <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
//             <p className="text-gray-600 text-lg">📊 Carregando dashboard...</p>
//           </div>
//         ) : (
//           <DashboardGrid dashboard={dashboard} />
//         )}
//         {error && (
//           <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         {loadingAnalytics ? (
//           <AnalyticsSkeleton />
//         ) : (
//           <>
//             <AnalyticsSection analytics={analytics} />

//             <SeguroAtletaDashboard analytics={analytics} />

//             <KitRetiradaDashboard analytics={analytics} />
//           </>
//         )}

//         {loading ? (
//           <div className="text-center py-12">
//             <p className="text-xl text-gray-600">⏳ Carregando inscritos...</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="p-6 border-b-2 border-purple-200">
//               <h2 className="text-2xl font-bold text-purple-600">
//                 📋 Inscritos ({inscritos.length})
//               </h2>
//             </div>

//             {inscritos.length === 0 ? (
//               <div className="p-8 text-center text-gray-600">
//                 <p className="text-lg">Nenhum inscrito ainda.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-100 border-b-2 border-gray-300">
//                     <tr>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Nome
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Telefone
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Email
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         CPF
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Cidade
//                       </th>
//                       <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/6">
//                         Tamanho_camisa
//                       </th>
//                       <th className="px-6 py-3 text-center font-semibold text-gray-700 w-1/6">
//                         Operações
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {inscritos.map((inscrito, index) => (
//                       <tr
//                         key={inscrito.id}
//                         className={`border-b ${
//                           index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                         } hover:bg-purple-50 transition`}
//                       >
//                         <td
//                           className="px-6 py-4 font-semibold text-gray-800 truncate"
//                           title={inscrito.nome}
//                         >
//                           {inscrito.nome}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.telefone}
//                         </td>
//                         <td
//                           className="px-6 py-4 text-gray-700 truncate"
//                           title={inscrito.email}
//                         >
//                           {inscrito.email}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.cpf}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.cidade}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {inscrito.tamanho_camisa}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <div className="flex flex-col gap-3 min-w-[200px]">
//                             {/* Bloco de Selects Superior */}
//                             <div className="grid grid-cols-1 gap-2">
//                               {/* STATUS PAGAMENTO */}
//                               <select
//                                 value={inscrito.status_pagamento || "PENDENTE"}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                                 onChange={(e) => {
//                                   handleUpdateInscrito(
//                                     inscrito,
//                                     "status_pagamento",
//                                     e.target.value,
//                                   );
//                                 }}
//                               >
//                                 <option value="PENDENTE">⏳ PENDENTE</option>
//                                 <option value="PAGO">✅ PAGO</option>
//                               </select>

//                               {/* TIPO INSCRIÇÃO E DISTÂNCIA JUNTOS NA MESMA LINHA */}
//                               <div className="grid grid-cols-2 gap-2">
//                                 <select
//                                   value={inscrito.tipo_inscricao || "NORMAL"}
//                                   className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                                   onChange={(e) => {
//                                     handleUpdateInscrito(
//                                       inscrito,
//                                       "tipo_inscricao",
//                                       e.target.value,
//                                     );
//                                   }}
//                                 >
//                                   <option value="NORMAL">NORMAL</option>
//                                   <option value="EQUIPE">EQUIPE</option>
//                                   <option value="PARCERIA">PARCERIA</option>
//                                   <option value="DIVULGACAO">DIVULGAÇÃO</option>
//                                   <option value="CORTESIA">CORTESIA</option>
//                                 </select>

//                                 <select
//                                   value={inscrito.distancia || "0 KM"}
//                                   className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                                   onChange={(e) => {
//                                     handleUpdateInscrito(
//                                       inscrito,
//                                       "distancia",
//                                       e.target.value,
//                                     );
//                                   }}
//                                 >
//                                   <option value="0 KM">0 KM</option>
//                                   <option value="5 KM">5 KM</option>
//                                 </select>
//                               </div>
//                             </div>

//                             {/* Divisor Sutil Interno */}
//                             <div className="border-t border-gray-100 my-0.5"></div>

//                             {/* Bloco de Botões Inferior (Refatorados e Modernos) */}
//                             <div className="flex flex-col gap-2">
//                               <button
//                                 disabled={inscrito.kit_retirado === "SIM"}
//                                 onClick={() => handleConfirmarKit(inscrito)}
//                                 className={
//                                   inscrito.kit_retirado === "SIM"
//                                     ? "w-full bg-gray-400 text-white font-semibold rounded-lg py-2 px-3 text-xs cursor-not-allowed"
//                                     : "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2 px-3 text-xs"
//                                 }
//                               >
//                                 {inscrito.kit_retirado === "SIM"
//                                   ? "✅ Kit Entregue"
//                                   : "🎽 Confirmar Kit"}
//                               </button>

//                               {/*  <button
//                                 onClick={() => handleConfirmarKit(inscrito)}
//                                 className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg py-2 px-3 text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5"
//                               >
//                                 <span>🎽</span> Confirmar Kit
//                               </button> */}

//                               <button
//                                 onClick={() => handleResendEmail(inscrito)}
//                                 className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-lg py-2 px-3 text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5"
//                               >
//                                 <span>📧</span> Reenviar E-mail
//                               </button>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Refresh Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={fetchInscritos}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
//           >
//             🔄 Atualizar
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
