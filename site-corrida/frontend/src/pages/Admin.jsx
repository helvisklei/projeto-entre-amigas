import { getAdminInscritos, resendEmail } from "../services/adminService";
import { useCallback, useEffect, useState } from "react";

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
  const [successMessage, setSuccessMessage] = useState("");

  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedRow, setExpandedRow] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const navigate = useNavigate();
  const adminUser = localStorage.getItem("admin_user") || "Admin";

  // Helpers de Notificação
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  };

  // 1. CORREÇÃO DO ESLINT WARNING: Funções envolvidas em useCallback
  const fetchInscritos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminInscritos();

      const dadosMapeados = data.map((item) => ({
        row: item.row || item.ROW,
        nome: item.NOME || item.nome || "",
        cpf: item.CPF || item.cpf || "",
        telefone: item.TELEFONE || item.telefone || "",
        email: item.EMAIL || item.email || "",
        cidade: item.CIDADE || item.cidade || "",
        tamanho_camisa: item.TAMANHO_CAMISA || item.tamanho_camisa || "",
        status_pagamento:
          item.STATUS_PAGAMENTO || item.status_pagamento || "PENDENTE",
        status_documentacao:
          item.STATUS_DOCUMENTACAO || item.status_documentacao || "",
        tipo_inscricao: item.TIPO_INSCRICAO || item.tipo_inscricao || "NORMAL",
        distancia: item.DISTANCIA || item.distancia || "0 KM",
        kit_retirado: item.KIT_RETIRADO || item.kit_retirado || "NÃO",
      }));

      setInscritos(dadosMapeados);
    } catch (err) {
      console.error(err);
      showError("Erro ao carregar a lista de inscritos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Erro analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const data = await getDashboardData();
      setDashboard(data);
    } catch (error) {
      console.error("Erro dashboard:", error);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    fetchInscritos();
    loadDashboard();
    loadAnalytics();
  }, [fetchInscritos, loadDashboard, loadAnalytics]); // Dependências declaradas corretamente!

  const handleResendEmail = async (inscrito) => {
    try {
      setProcessingId({ id: inscrito.row, action: "email" });
      await resendEmail(inscrito.row);
      showSuccess(`E-mail enviado para ${inscrito.nome}!`);
    } catch (error) {
      showError(error.message || "Erro ao reenviar e-mail.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const handleUpdateInscrito = async (inscrito, field, value) => {
    try {
      setProcessingId({ id: inscrito.row, action: field });
      await updateInscrito(inscrito.row, { [field]: value });

      setInscritos((prev) =>
        prev.map((item) => {
          if (item.row !== inscrito.row) return item;
          return { ...item, [field]: value };
        }),
      );

      loadAnalytics();
      loadDashboard();
      showSuccess("Registro atualizado.");
    } catch (error) {
      showError(error.message || "Erro ao atualizar.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmarKit = async (inscrito) => {
    try {
      setProcessingId({ id: inscrito.row, action: "kit" });
      await updateInscrito(inscrito.row, { kit_retirado: "SIM" });
      await fetchInscritos();
      await loadDashboard();
      await loadAnalytics();
      showSuccess("Entrega do kit confirmada!");
    } catch (error) {
      showError(error.message || "Erro ao confirmar kit.");
    } finally {
      setProcessingId(null);
    }
  };

  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const inscritosFiltradosEOrdenados = [...inscritos]
    .filter((inscrito) => {
      if (!searchTerm) return true;

      const normalizar = (texto = "") =>
        texto
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      const termNormalizado = normalizar(searchTerm);
      const nomeMatch = normalizar(inscrito.nome).includes(termNormalizado);
      const cpfLimpoTermo = searchTerm.replace(/\D/g, "");

      const cpfMatch =
        cpfLimpoTermo.length >= 3 && inscrito.cpf
          ? inscrito.cpf.replace(/\D/g, "").includes(cpfLimpoTermo)
          : false;

      return nomeMatch || cpfMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "none") return 0;
      const nomeA = a.nome?.toLowerCase() || "";
      const nomeB = b.nome?.toLowerCase() || "";
      return sortOrder === "asc"
        ? nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" })
        : nomeB.localeCompare(nomeA, "pt-BR", { sensitivity: "base" });
    });

  const renderPaymentBadge = (status) => {
    const isPaid = status === "PAGO";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
          isPaid
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`}
        ></span>
        {status || "PENDENTE"}
      </span>
    );
  };

  const renderDocBadge = (status) => {
    // Limpa espaços em branco e joga tudo para MAIÚSCULO para evitar falhas de digitação na planilha
    const statusNormalizado = String(status || "")
      .trim()
      .toUpperCase();

    switch (statusNormalizado) {
      case "APROVADO":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            Aprovado
          </span>
        );
      case "REPROVADO":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            Reprovado
          </span>
        );
      case "PENDENTE":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
            Pendente
          </span>
        );
      case "NAO_APLICAVEL":
      case "N/A":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium">
            N/A
          </span>
        );
    }
  };

  /*   const renderDocBadge = (status) => {
    switch (status) {
      case "APROVADO":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            Aprovado
          </span>
        );
      case "REPROVADO":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            Reprovado
          </span>
        );
      case "PENDENTE":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
            Pendente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium">
            N/A
          </span>
        );
    }
  }; */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Toast Notificações */}
      {(error || successMessage) && (
        <div className="fixed top-5 right-5 z-50 max-w-md animate-fade-in">
          {error && (
            <div className="bg-red-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium border border-slate-800">
              ✓ {successMessage}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              <img
                src="/logoEntreAmigas.webp"
                alt="Entre Amigas Run"
                className="
                  w-10
                  h-10
                  object-contain
                "
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                Painel Administrativo
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Operador: {adminUser}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Menu Sub-Nav */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex gap-2 overflow-x-auto whitespace-nowrap">
          <button
            onClick={fetchInscritos}
            className="bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-slate-50 transition"
          >
            📋 Inscrições
          </button>
          <button
            onClick={() => navigate("/admin/settings")}
            className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-1.5 rounded-lg transition"
          >
            ⚙️ Gerenciar Admins
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-1.5 rounded-lg transition ml-auto"
          >
            🏠 Voltar para Home
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* CARDS SECTIONS (Melhorados visualmente em grid expansivo) */}
        <div className="space-y-6">
          {loadingDashboard ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
              Carregando indicadores...
            </div>
          ) : (
            <DashboardGrid dashboard={dashboard} />
          )}

          {loadingAnalytics ? (
            <AnalyticsSkeleton />
          ) : (
            <div className="space-y-6">
              <AnalyticsSection analytics={analytics} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                  <SeguroAtletaDashboard analytics={analytics} />
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                  <KitRetiradaDashboard analytics={analytics} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MÓDULO DA TABELA DE INSCRITOS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="p-6 border-b border-slate-200 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Lista de Inscritos
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  {inscritosFiltradosEOrdenados.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Selecione uma linha para gerenciar ou atualizar dados adicionais
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none"
                >
                  <option value="none"> Ordem Padrão</option>
                  <option value="asc">🔤 Alfabética (A-Z)</option>
                  <option value="desc">🔤 Alfabética (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Renderização Estruturada da Tabela */}
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm font-medium">
              Carregando dados dos inscritos...
            </div>
          ) : inscritosFiltradosEOrdenados.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Nenhum registro encontrado.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 w-[35%]">Atleta</th>
                    <th className="px-6 py-3 w-[15%]">CPF</th>
                    <th className="px-6 py-3 w-[26%]">E-mail</th>
                    <th className="px-6 py-3 w-[12%]">Pagamento</th>
                    <th className="px-6 py-3 w-[12%]">Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {inscritosFiltradosEOrdenados.map((inscrito) => {
                    const isExpanded = expandedRow === inscrito.row;
                    return (
                      <tr key={inscrito.row} className="group transition-all">
                        <td colSpan={5} className="p-0">
                          {/* 2. ALINHAMENTO CORRIGIDO: Cada item dentro da sua respectiva célula virtual (larguras fixas) */}
                          <div
                            onClick={() => toggleRow(inscrito.row)}
                            className={`flex w-full items-center px-6 py-3.5 cursor-pointer transition ${
                              isExpanded
                                ? "bg-indigo-50/50"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="w-[35%] font-semibold text-slate-900 truncate pr-4 flex items-center gap-2">
                              <span
                                className={`text-[9px] text-slate-400 transition-transform ${isExpanded ? "rotate-90 text-indigo-600" : ""}`}
                              >
                                ▶
                              </span>
                              {inscrito.nome}
                            </div>
                            <div className="w-[15%] text-slate-600 font-mono truncate pr-2">
                              {inscrito.cpf}
                            </div>
                            <div className="w-[26%] text-slate-600 truncate pr-4">
                              {inscrito.email}
                            </div>
                            <div className="w-[12%] text-left">
                              {renderPaymentBadge(inscrito.status_pagamento)}
                            </div>
                            <div className="w-[12%] text-left">
                              {renderDocBadge(inscrito.status_documentacao)}
                            </div>
                          </div>

                          {/* Gaveta interna de Ações */}
                          {isExpanded && (
                            <div className="px-12 py-5 bg-slate-50/80 border-t border-b border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 animate-fade-in">
                              <div className="space-y-1.5">
                                <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                                  Informações de Contato
                                </h4>
                                <p>
                                  <strong className="text-slate-500 font-medium">
                                    Cidade:
                                  </strong>{" "}
                                  {inscrito.cidade || "Não informada"}
                                </p>
                                <p>
                                  <strong className="text-slate-500 font-medium">
                                    Telefone:
                                  </strong>{" "}
                                  {inscrito.telefone}
                                </p>
                                <p>
                                  <strong className="text-slate-500 font-medium">
                                    Linha Ref:
                                  </strong>{" "}
                                  {inscrito.row}
                                </p>
                              </div>

                              <div className="space-y-3">
                                <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                  Dados Técnicos
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] text-slate-400 font-bold mb-1">
                                      TIPO
                                    </label>
                                    <select
                                      value={
                                        inscrito.tipo_inscricao || "NORMAL"
                                      }
                                      disabled={
                                        processingId?.id === inscrito.row
                                      }
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                      onChange={(e) =>
                                        handleUpdateInscrito(
                                          inscrito,
                                          "tipo_inscricao",
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="NORMAL">NORMAL</option>
                                      <option value="EQUIPE">EQUIPE</option>
                                      <option value="PARCERIA">PARCERIA</option>
                                      <option value="DIVULGACAO">
                                        DIVULGAÇÃO
                                      </option>
                                      <option value="CORTESIA">CORTESIA</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-slate-400 font-bold mb-1">
                                      DISTÂNCIA
                                    </label>
                                    <select
                                      value={inscrito.distancia || "0 KM"}
                                      disabled={
                                        processingId?.id === inscrito.row
                                      }
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                      onChange={(e) =>
                                        handleUpdateInscrito(
                                          inscrito,
                                          "distancia",
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="0 KM">0 KM</option>
                                      <option value="5 KM">5 KM</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] text-slate-400 font-bold mb-1">
                                      PAGAMENTO
                                    </label>
                                    <select
                                      value={
                                        inscrito.status_pagamento || "PENDENTE"
                                      }
                                      disabled={
                                        processingId?.id === inscrito.row
                                      }
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                      onChange={(e) =>
                                        handleUpdateInscrito(
                                          inscrito,
                                          "status_pagamento",
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="PENDENTE">
                                        ⏳ PENDENTE
                                      </option>
                                      <option value="PAGO">✅ PAGO</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[9px] text-slate-400 font-bold mb-1">
                                      DOCUMENTAÇÃO
                                    </label>
                                    <select
                                      value={
                                        inscrito.status_documentacao ||
                                        "NAO_APLICAVEL"
                                      } // Garante o fallback idêntico ao Apps Script
                                      disabled={
                                        processingId?.id === inscrito.row
                                      }
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                      onChange={(e) =>
                                        handleUpdateInscrito(
                                          inscrito,
                                          "status_documentacao",
                                          e.target.value,
                                        )
                                      }
                                    >
                                      {/* Incluindo todas as chaves possíveis mapeadas no sistema */}
                                      <option value="PENDENTE">
                                        📄 PENDENTE
                                      </option>
                                      <option value="APROVADO">
                                        ✅ APROVADO
                                      </option>
                                      <option value="REPROVADO">
                                        ❌ REPROVADO
                                      </option>
                                      <option value="NAO_APLICAVEL">
                                        ➖ NÃO SE APLICA
                                      </option>
                                    </select>
                                  </div>

                                  {/*                                   <div>
                                    <label className="block text-[9px] text-slate-400 font-bold mb-1">
                                      DOCUMENTAÇÃO
                                    </label>
                                    <select
                                      value={inscrito.status_documentacao || ""}
                                      disabled={
                                        processingId?.id === inscrito.row
                                      }
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                      onChange={(e) =>
                                        handleUpdateInscrito(
                                          inscrito,
                                          "status_documentacao",
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="" disabled hidden>
                                        Selecione
                                      </option>
                                      <option value="PENDENTE">
                                        📄 PENDENTE
                                      </option>
                                      <option value="APROVADO">
                                        ✅ APROVADO
                                      </option>
                                      <option value="REPROVADO">
                                        ❌ REPROVADO
                                      </option>
                                      <option value="NAO_APLICAVEL">
                                        ➖ N/A
                                      </option>
                                    </select>
                                  </div> */}
                                </div>
                              </div>

                              <div className="space-y-3 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                                    Logística
                                  </h4>
                                  <p>
                                    <strong className="text-slate-500 font-medium">
                                      Camisa:
                                    </strong>{" "}
                                    <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-bold ml-1">
                                      {inscrito.tamanho_camisa || "N/A"}
                                    </span>
                                  </p>
                                </div>

                                <div className="space-y-2 pt-2">
                                  <button
                                    disabled={
                                      inscrito.kit_retirado === "SIM" ||
                                      processingId?.id === inscrito.row
                                    }
                                    onClick={() => handleConfirmarKit(inscrito)}
                                    className={`w-full font-semibold rounded-lg py-2 px-3 text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                                      inscrito.kit_retirado === "SIM"
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                                    }`}
                                  >
                                    {processingId?.id === inscrito.row &&
                                    processingId?.action === "kit"
                                      ? "Processando..."
                                      : inscrito.kit_retirado === "SIM"
                                        ? "✓ Kit já Retirado"
                                        : "🎽 Entregar Kit"}
                                  </button>

                                  <button
                                    disabled={processingId?.id === inscrito.row}
                                    onClick={() => handleResendEmail(inscrito)}
                                    className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-semibold rounded-lg py-2 px-3 text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                                  >
                                    📧{" "}
                                    {processingId?.id === inscrito.row &&
                                    processingId?.action === "email"
                                      ? "Enviando..."
                                      : "Reenviar E-mail"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sync Button */}
        <div className="text-center pt-2">
          <button
            onClick={fetchInscritos}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow transition"
          >
            🔄 Sincronizar Base de Dados
          </button>
        </div>
      </main>
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

// export default function Admin() {
//   const [inscritos, setInscritos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const [dashboard, setDashboard] = useState(null);
//   const [loadingDashboard, setLoadingDashboard] = useState(true);

//   const [analytics, setAnalytics] = useState(null);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(true);

//   // ESTADOS PARA FILTRO E ORDENAÇÃO
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");

//   // ESTADO DE EXPANSÃO DE LINHAS (Para ver detalhes sem scroll lateral)
//   const [expandedRow, setExpandedRow] = useState(null);

//   // ESTADO DE BUSY PARA BOTÕES (Evita cliques duplos e indica carregamento)
//   const [processingId, setProcessingId] = useState(null);

//   const navigate = useNavigate();
//   const adminUser = localStorage.getItem("admin_user") || "Admin";

//   useEffect(() => {
//     fetchInscritos();
//     loadDashboard();
//     loadAnalytics();
//   }, []);

//   // Helpers para notificações temporárias
//   const showSuccess = (msg) => {
//     setSuccessMessage(msg);
//     setTimeout(() => setSuccessMessage(""), 4000);
//   };

//   const showError = (msg) => {
//     setError(msg);
//     setTimeout(() => setError(""), 5000);
//   };

//   const fetchInscritos = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const data = await getAdminInscritos();

//       const dadosMapeados = data.map((item) => ({
//         row: item.row || item.ROW,
//         nome: item.NOME || item.nome || "",
//         cpf: item.CPF || item.cpf || "",
//         telefone: item.TELEFONE || item.telefone || "",
//         email: item.EMAIL || item.email || "",
//         cidade: item.CIDADE || item.cidade || "",
//         tamanho_camisa: item.TAMANHO_CAMISA || item.tamanho_camisa || "",
//         status_pagamento:
//           item.STATUS_PAGAMENTO || item.status_pagamento || "PENDENTE",
//         status_documentacao:
//           item.STATUS_DOCUMENTACAO || item.status_documentacao || "",
//         tipo_inscricao: item.TIPO_INSCRICAO || item.tipo_inscricao || "NORMAL",
//         distancia: item.DISTANCIA || item.distancia || "0 KM",
//         kit_retirado: item.KIT_RETIRADO || item.kit_retirado || "NÃO",
//       }));

//       setInscritos(dadosMapeados);
//     } catch (err) {
//       console.error(err);
//       showError("Erro ao carregar a lista de inscritos.");
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
//       setProcessingId({ id: inscrito.row, action: "email" });
//       await resendEmail(inscrito.row);
//       showSuccess(`E-mail reenviado com sucesso para ${inscrito.nome}!`);
//     } catch (error) {
//       showError(error.message || "Erro ao reenviar e-mail.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("admin_user");
//     navigate("/login");
//   };

//   const handleUpdateInscrito = async (inscrito, field, value) => {
//     try {
//       setProcessingId({ id: inscrito.row, action: field });
//       await updateInscrito(inscrito.row, { [field]: value });

//       setInscritos((prev) =>
//         prev.map((item) => {
//           if (item.row !== inscrito.row) return item;
//           return { ...item, [field]: value };
//         }),
//       );

//       loadAnalytics();
//       loadDashboard();
//       showSuccess("Registro atualizado com sucesso.");
//     } catch (error) {
//       showError(error.message || "Erro ao atualizar registro.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const handleConfirmarKit = async (inscrito) => {
//     try {
//       setProcessingId({ id: inscrito.row, action: "kit" });
//       await updateInscrito(inscrito.row, { kit_retirado: "SIM" });
//       await fetchInscritos();
//       await loadDashboard();
//       await loadAnalytics();
//       showSuccess("Entrega do kit confirmada!");
//     } catch (error) {
//       showError(error.message || "Erro ao confirmar entrega do kit.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const toggleRow = (rowId) => {
//     setExpandedRow(expandedRow === rowId ? null : rowId);
//   };

//   /* LÓGICA DE FILTRAGEM E ORDENAÇÃO */
//   const inscritosFiltradosEOrdenados = [...inscritos]
//     .filter((inscrito) => {
//       if (!searchTerm) return true;

//       const normalizar = (texto = "") =>
//         texto
//           .toString()
//           .normalize("NFD")
//           .replace(/[\u0300-\u036f]/g, "")
//           .toLowerCase();

//       const termNormalizado = normalizar(searchTerm);
//       const nomeMatch = normalizar(inscrito.nome).includes(termNormalizado);
//       const cpfLimpoTermo = searchTerm.replace(/\D/g, "");

//       const cpfMatch =
//         cpfLimpoTermo.length >= 3 && inscrito.cpf
//           ? inscrito.cpf.replace(/\D/g, "").includes(cpfLimpoTermo)
//           : false;

//       return nomeMatch || cpfMatch;
//     })
//     .sort((a, b) => {
//       if (sortOrder === "none") return 0;

//       const nomeA = a.nome?.toLowerCase() || "";
//       const nomeB = b.nome?.toLowerCase() || "";

//       if (sortOrder === "asc") {
//         return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
//       } else {
//         return nomeB.localeCompare(nomeA, "pt-BR", { sensitivity: "base" });
//       }
//     });

//   // Renderizadores de Badge Estilizados (Enterprise Style)
//   const renderPaymentBadge = (status) => {
//     const isPaid = status === "PAGO";
//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
//           isPaid
//             ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//             : "bg-amber-50 text-amber-700 border border-amber-200"
//         }`}
//       >
//         <span
//           className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`}
//         ></span>
//         {status || "PENDENTE"}
//       </span>
//     );
//   };

//   const renderDocBadge = (status) => {
//     switch (status) {
//       case "APROVADO":
//         return (
//           <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
//             Aprovado
//           </span>
//         );
//       case "REPROVADO":
//         return (
//           <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
//             Reprovado
//           </span>
//         );
//       case "PENDENTE":
//         return (
//           <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
//             Pendente
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-200 text-xs font-medium">
//             N/A
//           </span>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
//       {/* Toast Centralizado Enterprise */}
//       {(error || successMessage) && (
//         <div className="fixed top-5 right-5 z-50 max-w-md animate-fade-in">
//           {error && (
//             <div className="bg-red-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium">
//               <span>⚠️</span> {error}
//             </div>
//           )}
//           {successMessage && (
//             <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium border border-slate-800">
//               <span className="text-emerald-400">✓</span> {successMessage}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Header Corporativo Moderno */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
//               HQ
//             </div>
//             <div>
//               <h1 className="text-base font-bold text-slate-900">
//                 Painel de Controle
//               </h1>
//               <p className="text-xs text-slate-500 font-medium">
//                 Operador: {adminUser}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 transition"
//           >
//             Sair
//           </button>
//         </div>
//       </header>

//       {/* Sub-Navegação Tática */}
//       <div className="bg-slate-100 border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex gap-2 overflow-x-auto whitespace-nowrap">
//           <button
//             onClick={fetchInscritos}
//             className="bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-slate-50 transition"
//           >
//             📋 Inscrições
//           </button>
//           <button
//             onClick={() => navigate("/admin/settings")}
//             className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-1.5 rounded-lg transition"
//           >
//             ⚙️ Gerenciar Admins
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-1.5 rounded-lg transition ml-auto"
//           >
//             🏠 Voltar para Home
//           </button>
//         </div>
//       </div>

//       {/* Grid Principal do Conteúdo */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//         {/* Dashboards e Analytics */}
//         {loadingDashboard ? (
//           <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
//             <div className="animate-pulse space-y-2">
//               <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto"></div>
//               <div className="h-3 bg-slate-100 rounded w-1/3 mx-auto"></div>
//             </div>
//           </div>
//         ) : (
//           <DashboardGrid dashboard={dashboard} />
//         )}

//         {loadingAnalytics ? (
//           <AnalyticsSkeleton />
//         ) : (
//           <div className="space-y-6">
//             <AnalyticsSection analytics={analytics} />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <SeguroAtletaDashboard analytics={analytics} />
//               <KitRetiradaDashboard analytics={analytics} />
//             </div>
//           </div>
//         )}

//         {/* Módulo Principal de Dados */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           {/* Top Bar da Tabela de Inscritos */}
//           <div className="p-6 border-b border-slate-200 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             <div>
//               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
//                 Lista de Inscritos
//                 <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
//                   {inscritosFiltradosEOrdenados.length}
//                 </span>
//               </h2>
//               <p className="text-xs text-slate-500 mt-0.5">
//                 {searchTerm
//                   ? `Resultados filtrados de ${inscritos.length} totais`
//                   : "Selecione uma linha para gerenciar ou atualizar dados adicionais"}
//               </p>
//             </div>

//             {/* Inputs Compactos */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
//                   🔍
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="Nome ou CPF..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>

//               <div className="relative">
//                 <select
//                   value={sortOrder}
//                   onChange={(e) => setSortOrder(e.target.value)}
//                   className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none"
//                 >
//                   <option value="none"> Ordem Padrão</option>
//                   <option value="asc">🔤 Alfabética (A-Z)</option>
//                   <option value="desc">🔤 Alfabética (Z-A)</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
//                   <svg
//                     className="w-3 h-3"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Estado Vazio ou Tabela Otimizada */}
//           {loading ? (
//             <div className="text-center py-16 text-slate-500 text-sm font-medium animate-pulse">
//               Carregando dados dos inscritos...
//             </div>
//           ) : inscritosFiltradosEOrdenados.length === 0 ? (
//             <div className="p-12 text-center text-slate-500 text-sm">
//               Nenhum registro encontrado para os critérios informados.
//             </div>
//           ) : (
//             <div className="w-full overflow-x-auto lg:overflow-x-visible">
//               <table className="w-full text-left border-collapse table-fixed lg:table-auto">
//                 <thead>
//                   <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
//                     <th className="px-6 py-3.5 w-[30%]">Atleta</th>
//                     <th className="px-6 py-3.5 w-[20%]">CPF</th>
//                     <th className="px-6 py-3.5 w-[20%]">Contato</th>
//                     <th className="px-6 py-3.5 w-[15%]">Pagamento</th>
//                     <th className="px-6 py-3.5 w-[15%]">Documento</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 text-xs">
//                   {inscritosFiltradosEOrdenados.map((inscrito) => {
//                     const isExpanded = expandedRow === inscrito.row;
//                     return (
//                       <tr key={inscrito.row} className="group transition-all">
//                         <td colSpan={5} className="p-0">
//                           {/* Linha Principal (Sempre Visível) */}
//                           <div
//                             onClick={() => toggleRow(inscrito.row)}
//                             className={`flex lg:table-row items-center justify-between px-6 py-3.5 cursor-pointer transition ${
//                               isExpanded
//                                 ? "bg-indigo-50/40"
//                                 : "hover:bg-slate-50"
//                             }`}
//                           >
//                             <div className="lg:table-cell font-semibold text-slate-900 truncate pr-4">
//                               <div className="flex items-center gap-2">
//                                 <span
//                                   className={`text-[10px] text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
//                                 >
//                                   ▶
//                                 </span>
//                                 {inscrito.nome}
//                               </div>
//                             </div>
//                             <div className="hidden lg:table-cell text-slate-600 font-mono">
//                               {inscrito.cpf}
//                             </div>
//                             <div className="hidden lg:table-cell text-slate-600 truncate pr-2">
//                               {inscrito.email}
//                             </div>
//                             <div className="lg:table-cell text-left">
//                               {renderPaymentBadge(inscrito.status_pagamento)}
//                             </div>
//                             <div className="hidden lg:table-cell text-left">
//                               {renderDocBadge(inscrito.status_documentacao)}
//                             </div>
//                           </div>

//                           {/* Seção Expandida Otimizada (Fim do Scroll Lateral) */}
//                           {isExpanded && (
//                             <div className="px-12 py-5 bg-slate-50/70 border-y border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-slate-700">
//                               {/* Coluna 1: Dados Completos */}
//                               <div className="space-y-2">
//                                 <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
//                                   Informações de Contato
//                                 </h4>
//                                 <p>
//                                   <strong className="text-slate-500">
//                                     E-mail:
//                                   </strong>{" "}
//                                   {inscrito.email}
//                                 </p>
//                                 <p>
//                                   <strong className="text-slate-500">
//                                     Telefone:
//                                   </strong>{" "}
//                                   {inscrito.telefone}
//                                 </p>
//                                 <p>
//                                   <strong className="text-slate-500">
//                                     Cidade:
//                                   </strong>{" "}
//                                   {inscrito.cidade}
//                                 </p>
//                                 <p>
//                                   <strong className="text-slate-500">
//                                     CPF:
//                                   </strong>{" "}
//                                   {inscrito.cpf}
//                                 </p>
//                               </div>

//                               {/* Coluna 2: Configurações de Inscrição */}
//                               <div className="space-y-3">
//                                 <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
//                                   Dados Técnicos
//                                 </h4>

//                                 <div className="grid grid-cols-2 gap-2">
//                                   <div>
//                                     <label className="block text-[10px] text-slate-400 font-bold mb-1">
//                                       TIPO INSCRIÇÃO
//                                     </label>
//                                     <select
//                                       value={
//                                         inscrito.tipo_inscricao || "NORMAL"
//                                       }
//                                       disabled={
//                                         processingId?.id === inscrito.row
//                                       }
//                                       className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                                       onChange={(e) =>
//                                         handleUpdateInscrito(
//                                           inscrito,
//                                           "tipo_inscricao",
//                                           e.target.value,
//                                         )
//                                       }
//                                     >
//                                       <option value="NORMAL">NORMAL</option>
//                                       <option value="EQUIPE">EQUIPE</option>
//                                       <option value="PARCERIA">PARCERIA</option>
//                                       <option value="DIVULGACAO">
//                                         DIVULGAÇÃO
//                                       </option>
//                                       <option value="CORTESIA">CORTESIA</option>
//                                     </select>
//                                   </div>
//                                   <div>
//                                     <label className="block text-[10px] text-slate-400 font-bold mb-1">
//                                       DISTÂNCIA
//                                     </label>
//                                     <select
//                                       value={inscrito.distancia || "0 KM"}
//                                       disabled={
//                                         processingId?.id === inscrito.row
//                                       }
//                                       className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                                       onChange={(e) =>
//                                         handleUpdateInscrito(
//                                           inscrito,
//                                           "distancia",
//                                           e.target.value,
//                                         )
//                                       }
//                                     >
//                                       <option value="0 KM">0 KM</option>
//                                       <option value="5 KM">5 KM</option>
//                                     </select>
//                                   </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-2">
//                                   <div>
//                                     <label className="block text-[10px] text-slate-400 font-bold mb-1">
//                                       PAGAMENTO
//                                     </label>
//                                     <select
//                                       value={
//                                         inscrito.status_pagamento || "PENDENTE"
//                                       }
//                                       disabled={
//                                         processingId?.id === inscrito.row
//                                       }
//                                       className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                                       onChange={(e) =>
//                                         handleUpdateInscrito(
//                                           inscrito,
//                                           "status_pagamento",
//                                           e.target.value,
//                                         )
//                                       }
//                                     >
//                                       <option value="PENDENTE">
//                                         ⏳ PENDENTE
//                                       </option>
//                                       <option value="PAGO">✅ PAGO</option>
//                                     </select>
//                                   </div>
//                                   <div>
//                                     <label className="block text-[10px] text-slate-400 font-bold mb-1">
//                                       DOCUMENTAÇÃO
//                                     </label>
//                                     <select
//                                       value={inscrito.status_documentacao || ""}
//                                       disabled={
//                                         processingId?.id === inscrito.row
//                                       }
//                                       className="w-full bg-white border border-slate-200 rounded p-1.5 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                                       onChange={(e) =>
//                                         handleUpdateInscrito(
//                                           inscrito,
//                                           "status_documentacao",
//                                           e.target.value,
//                                         )
//                                       }
//                                     >
//                                       <option value="" disabled hidden>
//                                         Selecione
//                                       </option>
//                                       <option value="PENDENTE">
//                                         📄 PENDENTE
//                                       </option>
//                                       <option value="APROVADO">
//                                         ✅ APROVADO
//                                       </option>
//                                       <option value="REPROVADO">
//                                         ❌ REPROVADO
//                                       </option>
//                                       <option value="NAO_APLICAVEL">
//                                         ➖ N/A
//                                       </option>
//                                     </select>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Coluna 3: Ações e Logística */}
//                               <div className="space-y-3 flex flex-col justify-between">
//                                 <div>
//                                   <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
//                                     Logística
//                                   </h4>
//                                   <p>
//                                     <strong className="text-slate-500">
//                                       Camisa:
//                                     </strong>{" "}
//                                     <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-bold ml-1">
//                                       {inscrito.tamanho_camisa || "N/A"}
//                                     </span>
//                                   </p>
//                                 </div>

//                                 <div className="space-y-2 pt-2">
//                                   <button
//                                     disabled={
//                                       inscrito.kit_retirado === "SIM" ||
//                                       processingId?.id === inscrito.row
//                                     }
//                                     onClick={() => handleConfirmarKit(inscrito)}
//                                     className={`w-full font-semibold rounded-lg py-2 px-3 text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
//                                       inscrito.kit_retirado === "SIM"
//                                         ? "bg-slate-200 text-slate-400 cursor-not-allowed"
//                                         : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
//                                     }`}
//                                   >
//                                     {processingId?.id === inscrito.row &&
//                                     processingId?.action === "kit"
//                                       ? "Processando..."
//                                       : inscrito.kit_retirado === "SIM"
//                                         ? "✓ Kit já Retirado"
//                                         : "🎽 Entregar Kit Integrado"}
//                                   </button>

//                                   <button
//                                     disabled={processingId?.id === inscrito.row}
//                                     onClick={() => handleResendEmail(inscrito)}
//                                     className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-semibold rounded-lg py-2 px-3 text-xs transition shadow-sm flex items-center justify-center gap-1.5"
//                                   >
//                                     <span>📧</span>{" "}
//                                     {processingId?.id === inscrito.row &&
//                                     processingId?.action === "email"
//                                       ? "Enviando..."
//                                       : "Reenviar Voucher / E-mail"}
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Rodapé de Ações de Sincronização */}
//         <div className="text-center pt-4">
//           <button
//             onClick={fetchInscritos}
//             className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow transition"
//           >
//             🔄 Sincronizar Base de Dados
//           </button>
//         </div>
//       </main>
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

// export default function Admin() {
//   const [inscritos, setInscritos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [dashboard, setDashboard] = useState(null);
//   const [loadingDashboard, setLoadingDashboard] = useState(true);

//   const [analytics, setAnalytics] = useState(null);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(true);

//   // ESTADOS PARA FILTRO E ORDENAÇÃO
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc', 'none'

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

//       const data = await getAdminInscritos();

//       // console.log(data[0]);
//       // console.log(Object.keys(data[0]));

//       // ============================================================
//       // MAPEAMENTO DE SEGURANÇA (Garante propriedades minúsculas)
//       // Resolve conflito se o backend mandar NOME ou nome
//       // ============================================================
//       const dadosMapeados = data.map((item) => ({
//         // Usamos 'row' (minúsculo) como ID para o frontend
//         row: item.row || item.ROW,

//         // Mapeia as propriedades maiúsculas para as minúsculas que o filtro usa
//         nome: item.NOME || item.nome || "",
//         cpf: item.CPF || item.cpf || "",
//         telefone: item.TELEFONE || item.telefone || "",
//         email: item.EMAIL || item.email || "",
//         cidade: item.CIDADE || item.cidade || "",
//         tamanho_camisa: item.TAMANHO_CAMISA || item.tamanho_camisa || "",

//         // Mapeia os status das operações
//         status_pagamento:
//           item.STATUS_PAGAMENTO || item.status_pagamento || "PENDENTE",
//         status_documentacao:
//           item.STATUS_DOCUMENTACAO || item.status_documentacao || "", //NAO_APLICAVEL
//         tipo_inscricao: item.TIPO_INSCRICAO || item.tipo_inscricao || "NORMAL",
//         distancia: item.DISTANCIA || item.distancia || "0 KM",
//         kit_retirado: item.KIT_RETIRADO || item.kit_retirado || "NÃO",
//       }));

//       setInscritos(dadosMapeados);
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
//       // Usamos 'inscrito.row' (que é o ID da linha no backend)
//       await updateInscrito(inscrito.row, { [field]: value });

//       setInscritos((prev) =>
//         prev.map((item) => {
//           // Atualiza localmente comparando pela 'row'
//           if (item.row !== inscrito.row) return item;
//           return { ...item, [field]: value };
//         }),
//       );

//       loadAnalytics();
//       loadDashboard();
//     } catch (error) {
//       alert(error.message || "Erro ao atualizar.");
//     }
//   };

//   const handleConfirmarKit = async (inscrito) => {
//     try {
//       await updateInscrito(inscrito.row, { kit_retirado: "SIM" });
//       await fetchInscritos();
//       await loadDashboard();
//       await loadAnalytics();
//       alert("Kit entregue com sucesso.");
//     } catch (error) {
//       alert(error.message || "Erro ao confirmar kit.");
//     }
//   };

//   /* ========================================================
//      LÓGICA DE FILTRAGEM E ORDENAÇÃO (CORRIGIDA)
//      ======================================================== */
//   const inscritosFiltradosEOrdenados = [...inscritos]
//     .filter((inscrito) => {
//       // 1. Se não há termo de busca, mostra tudo
//       if (!searchTerm) return true;

//       // 2. Função de normalização (remove acentos e deixa minúsculo)
//       const normalizar = (texto = "") =>
//         texto
//           .toString()
//           .normalize("NFD")
//           .replace(/[\u0300-\u036f]/g, "") // Remove acentos
//           .toLowerCase();

//       // 3. Normaliza o termo de busca UMA VEZ
//       const termNormalizado = normalizar(searchTerm);

//       // --- CORREÇÃO AQUI ---

//       // Busca por NOME: normaliza o nome do inscrito e compara com o termo normalizado
//       const nomeMatch = normalizar(inscrito.nome).includes(termNormalizado);

//       // Busca por CPF: remove tudo que não for dígito do CPF e do termo original
//       const cpfLimpoTermo = searchTerm.replace(/\D/g, "");

//       const cpfMatch =
//         cpfLimpoTermo.length >= 3 && inscrito.cpf
//           ? inscrito.cpf.replace(/\D/g, "").includes(cpfLimpoTermo)
//           : false;

//       return nomeMatch || cpfMatch;
//     })
//     .sort((a, b) => {
//       if (sortOrder === "none") return 0; // Mantém a ordem original

//       const nomeA = a.nome?.toLowerCase() || "";
//       const nomeB = b.nome?.toLowerCase() || "";

//       if (sortOrder === "asc") {
//         return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
//       } else {
//         return nomeB.localeCompare(nomeA, "pt-BR", { sensitivity: "base" });
//       }
//     });

//   /*   console.log("Busca:", searchTerm);

//   console.log("Total inscritos:", inscritos.length);

//   console.log("Resultado filtro:", inscritosFiltradosEOrdenados.length); */

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
//             {/* Header da Tabela + Inputs de Controle */}
//             <div className="p-6 border-b-2 border-purple-200 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-purple-600">
//                   📋 Inscritos ({inscritosFiltradosEOrdenados.length})
//                 </h2>
//                 {searchTerm && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     Filtrado de um total de {inscritos.length} registros
//                   </p>
//                 )}
//               </div>

//               {/* BLOCO DE BUSCA E ORDENAÇÃO (ESTILO PREMIUM ENTERPRISE) */}
//               <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto">
//                 {/* Campo de Pesquisa Otimizado */}
//                 <div className="relative flex-1 sm:w-72">
//                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                     <span className="text-gray-400 text-base">🔍</span>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Nome completo ou CPF..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition duration-150"
//                   />
//                   {searchTerm && (
//                     <button
//                       onClick={() => setSearchTerm("")}
//                       className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-red-500 transition-colors"
//                       title="Limpar busca"
//                     >
//                       <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
//                         ×
//                       </span>
//                     </button>
//                   )}
//                 </div>

//                 {/* Seletor de Ordenação Otimizado */}
//                 <div className="relative">
//                   <select
//                     value={sortOrder}
//                     onChange={(e) => setSortOrder(e.target.value)}
//                     className="w-full sm:w-auto border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-[13px] font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 cursor-pointer text-gray-900 transition duration-150 appearance-none"
//                   >
//                     <option value="none">⏳ Inscrição Original</option>
//                     <option value="asc">🔤 Alfabética (A-Z)</option>
//                     <option value="desc">🔤 Alfabética (Z-A)</option>
//                   </select>
//                   {/* Ícone de seta customizado para o select */}
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M19 9l-7 7-7-7"
//                       ></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* BLOCO DE BUSCA E ORDENAÇÃO */}
//               {/* <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"> */}
//               {/* Campo de Pesquisa */}
//               {/*                 <div className="relative flex-1 sm:w-64">
//                   <input
//                     type="text"
//                     placeholder="🔍 Buscar por Nome ou CPF..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
//                   />
//                   {searchTerm && (
//                     <button
//                       onClick={() => setSearchTerm("")}
//                       className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-sm"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div> */}

//               {/* Seletor de Ordenação */}
//               {/*                 <select
//                   value={sortOrder}
//                   onChange={(e) => setSortOrder(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
//                 >
//                   <option value="none">⏳ Ordem de Inscrição</option>
//                   <option value="asc">🔤 Ordem Alfabética (A-Z)</option>
//                   <option value="desc">🔤 Ordem Alfabética (Z-A)</option>
//                 </select>
//               </div> */}
//             </div>

//             {inscritosFiltradosEOrdenados.length === 0 ? (
//               <div className="p-8 text-center text-gray-600">
//                 <p className="text-lg">
//                   Nenhum inscrito corresponde aos critérios.
//                 </p>
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
//                     {/* USANDO A ARRAY TRATADA E FILTRADA */}
//                     {inscritosFiltradosEOrdenados.map((inscrito, index) => (
//                       <tr
//                         // Usamos 'row' como key
//                         key={inscrito.row}
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

//                               {/* STATUS DA DOCUMENTAÇÃO */}

//                               {/* STATUS DA DOCUMENTAÇÃO COM PLACEHOLDER TRATADO */}
//                               <select
//                                 // Se o status vier vazio ou nulo, ele assume string vazia "" para ativar o placeholder
//                                 value={inscrito.status_documentacao || ""}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer text-gray-700"
//                                 onChange={(e) =>
//                                   handleUpdateInscrito(
//                                     inscrito,
//                                     "status_documentacao",
//                                     e.target.value,
//                                   )
//                                 }
//                               >
//                                 {/* Opção usada como Placeholder */}
//                                 <option value="" disabled hidden>
//                                   📄 Status Documento
//                                 </option>

//                                 {/* Opções Reais */}
//                                 <option value="PENDENTE">📄 PENDENTE</option>
//                                 <option value="APROVADO">✅ APROVADO</option>
//                                 <option value="REPROVADO">❌ REPROVADO</option>
//                                 <option value="NAO_APLICAVEL">➖ N/A</option>
//                               </select>

//                               {/*                               <select
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
//                               </select> */}

//                               {/* TIPO INSCRIÇÃO E DISTÂNCIA */}
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
