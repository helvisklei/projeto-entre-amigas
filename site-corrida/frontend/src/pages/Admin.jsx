import {
  cancelarInscricao,
  exportSeguroAtletaPdf,
  getAdminInscritos,
  resendEmail,
  trocarInscricao,
} from "../services/adminService";
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
  const [exportingSeguroAtleta, setExportingSeguroAtleta] = useState(false);

  /*
  ==========================================================
  EDIÇÃO CADASTRAL DO PARTICIPANTE
  ==========================================================

  Controla:

  - abertura e fechamento do modal;
  - participante selecionado;
  - dados temporários do formulário;
  - estado de salvamento.

  Os dados somente serão enviados ao backend quando o
  administrador confirmar a alteração.

  Nenhuma chamada à API ocorre ao abrir o modal.
  ==========================================================
  */

  // estado do modal de edição

  const [participanteEmEdicao, setParticipanteEmEdicao] = useState(null);

  const [formularioEdicao, setFormularioEdicao] = useState({
    nome: "",

    email: "",

    telefone: "",

    tamanho_camisa: "",
  });

  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // estado do modal de troca de inscrição

  const [participanteEmTroca, setParticipanteEmTroca] = useState(null);

  const [formularioTroca, setFormularioTroca] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    idade: "",
    sexo: "",
    cidade: "",
    distancia: "",
    tipo_kit: "",
    forma_pagamento: "",
  });

  const [trocandoInscricao, setTrocandoInscricao] = useState(false);

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
        status_inscricao:
          item.STATUS_INSCRICAO || item.status_inscricao || "ATIVA",
        status_documentacao:
          item.STATUS_DOCUMENTACAO || item.status_documentacao || "",
        tipo_inscricao: item.TIPO_INSCRICAO || item.tipo_inscricao || "NORMAL",
        tipo_kit: item.TIPO_KIT || item.tipo_kit || "",
        idade: item.IDADE || item.idade || "",
        sexo: item.SEXO || item.sexo || "",
        forma_pagamento: item.FORMA_PAGAMENTO || item.forma_pagamento || "PIX",
        distancia: item.DISTANCIA || item.distancia || "0 KM",
        kit_retirado: item.KIT_RETIRADO || item.kit_retirado || "NÃO",
        numero_inscricao:
          item.NUMERO_INSCRICAO ||
          item.numero_inscricao ||
          item.numeroInscricao ||
          "",
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

  const handleExportSeguroAtletaPdf = async () => {
    try {
      setExportingSeguroAtleta(true);

      const data = await exportSeguroAtletaPdf();

      if (!data?.pdfBase64) {
        throw new Error("O PDF não foi retornado pelo servidor.");
      }

      /*
       * Converte Base64 para bytes
       */
      const byteCharacters = atob(data.pdfBase64);

      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      /*
       * Cria o Blob PDF
       */
      const blob = new Blob([byteArray], {
        type: "application/pdf",
      });

      /*
       * Cria URL temporária
       */
      const pdfUrl = URL.createObjectURL(blob);

      /*
       * Abre o PDF em nova aba
       */
      window.open(pdfUrl, "_blank", "noopener,noreferrer");

      /*
       * Libera a URL depois
       */
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error("Erro ao abrir PDF do Seguro Atleta:", error);

      showError(error.message || "Erro ao gerar o PDF do Seguro Atleta.");
    } finally {
      setExportingSeguroAtleta(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  /*
  ==========================================================
  ABRIR MODAL DE EDIÇÃO
  ==========================================================

  Recebe o participante selecionado e cria uma cópia dos
  dados editáveis.

  A edição ocorre inicialmente apenas no estado local.

  Nenhuma alteração é realizada na planilha nesta etapa.
  ==========================================================
  */

  const abrirModalEdicao = (inscrito) => {
    setParticipanteEmEdicao(inscrito);

    setFormularioEdicao({
      nome: String(inscrito.nome || ""),

      email: String(inscrito.email || ""),

      telefone: String(inscrito.telefone || ""),

      tamanho_camisa: String(inscrito.tamanho_camisa || ""),
    });
  };

  /*
  ==========================================================
  FECHAR MODAL DE EDIÇÃO
  ==========================================================

  Limpa o participante selecionado e descarta alterações
  que ainda não foram enviadas ao backend.
  ==========================================================
  */

  const fecharModalEdicao = () => {
    if (salvandoEdicao) {
      return;
    }

    setParticipanteEmEdicao(null);

    setFormularioEdicao({
      nome: "",

      email: "",

      telefone: "",

      tamanho_camisa: "",
    });
  };

  /*
  ==========================================================
  SALVAR EDIÇÃO CADASTRAL
  ==========================================================

  Responsável por:

  - validar os dados informados;
  - normalizar os valores;
  - enviar todos os campos em uma única chamada;
  - atualizar a lista local;
  - atualizar Dashboard e Analytics;
  - fechar o modal após sucesso.

  Campos atualizados:

  - nome;
  - e-mail;
  - telefone;
  - tamanho da camisa.

  Não altera:

  - pagamento;
  - documentação;
  - tipo de inscrição;
  - distância;
  - valores financeiros;
  - retirada do kit.
  ==========================================================
  */

  const salvarEdicaoParticipante = async () => {
    /*
    ========================================================
    PROTEÇÃO
    ========================================================
    */

    if (!participanteEmEdicao || salvandoEdicao) {
      return;
    }

    /*
    ========================================================
    NORMALIZAÇÃO
    ========================================================
    */

    const nome = String(formularioEdicao.nome || "").trim();

    const email = String(formularioEdicao.email || "")
      .trim()
      .toLowerCase();

    const telefone = String(formularioEdicao.telefone || "").replace(
      /\D/g,

      "",
    );

    const tamanhoCamisa = String(formularioEdicao.tamanho_camisa || "")
      .trim()
      .toUpperCase();

    /*
    ========================================================
    VALIDAÇÃO DO NOME
    ========================================================
    */

    if (nome.length < 3) {
      showError("Informe o nome completo do participante.");

      return;
    }

    /*
    ========================================================
    VALIDAÇÃO DO E-MAIL
    ========================================================
    */

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
      showError("Informe um endereço de e-mail válido.");

      return;
    }

    /*
    ========================================================
    VALIDAÇÃO DO TELEFONE
    ========================================================

    Aceita:

    - telefone fixo com DDD: 10 dígitos;
    - celular com DDD: 11 dígitos.
    ========================================================
    */

    if (telefone.length < 10 || telefone.length > 11) {
      showError("Informe um telefone válido com DDD.");

      return;
    }

    /*
    ========================================================
    VALIDAÇÃO DA CAMISA
    ========================================================
    */

    const tamanhosPermitidos = [
      "INFANTIL 02",

      "INFANTIL 04",

      "INFANTIL 06",

      "INFANTIL 08",

      "INFANTIL 10",

      "INFANTIL 12",

      "INFANTIL 14",

      "PP",

      "P",

      "M",

      "G",

      "GG",

      "XG",

      "2XG",

      "3XG",
    ];

    if (!tamanhosPermitidos.includes(tamanhoCamisa)) {
      showError("Selecione um tamanho de camisa válido.");

      return;
    }

    /*
    ========================================================
    OBJETO ÚNICO DE ATUALIZAÇÃO
    ========================================================

    Todos os campos são enviados em uma única requisição.
    ========================================================
    */

    const dadosAtualizados = {
      nome,

      email,

      telefone,

      tamanho_camisa: tamanhoCamisa,
    };

    try {
      /*
      ======================================================
      INÍCIO DO PROCESSAMENTO
      ======================================================
      */

      setSalvandoEdicao(true);

      /*
      ======================================================
      ÚNICA CHAMADA DE ATUALIZAÇÃO
      ======================================================
      */

      await updateInscrito(
        participanteEmEdicao.row,

        dadosAtualizados,
      );

      /*
      ======================================================
      ATUALIZAÇÃO IMEDIATA DA LISTA LOCAL
      ======================================================

      Evita esperar uma nova consulta para que os dados
      editados apareçam na Lista de Inscritos.
      ======================================================
      */

      setInscritos((listaAnterior) =>
        listaAnterior.map((inscrito) => {
          if (inscrito.row !== participanteEmEdicao.row) {
            return inscrito;
          }

          return {
            ...inscrito,

            ...dadosAtualizados,
          };
        }),
      );

      /*
      ======================================================
      ATUALIZAÇÃO DOS RELATÓRIOS
      ======================================================

      A alteração da camisa pode modificar:

      - Camisas por Tamanho;
      - listas nominais;
      - Camisas Especiais;
      - indicadores logísticos.

      Dashboard e Analytics são atualizados somente após
      confirmação de sucesso do backend.
      ======================================================
      */

      await Promise.all([loadDashboard(), loadAnalytics()]);

      /*
      ======================================================
      FECHAMENTO APÓS SUCESSO
      ======================================================
      */

      setParticipanteEmEdicao(null);

      setFormularioEdicao({
        nome: "",

        email: "",

        telefone: "",

        tamanho_camisa: "",
      });

      showSuccess("Dados do participante atualizados com sucesso.");
    } catch (error) {
      console.error(
        "Erro ao atualizar dados do participante:",

        error,
      );

      showError(
        error.message || "Não foi possível atualizar os dados do participante.",
      );
    } finally {
      setSalvandoEdicao(false);
    }
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

  const abrirModalTroca = (inscrito) => {
    if (
      inscrito.status_inscricao === "CANCELADA" ||
      inscrito.status_pagamento === "PAGO"
    ) {
      showError(
        inscrito.status_pagamento === "PAGO"
          ? "Não é possível trocar uma inscrição já paga."
          : "Não é possível trocar uma inscrição cancelada.",
      );

      return;
    }

    setParticipanteEmTroca(inscrito);

    setFormularioTroca({
      nome: String(inscrito.nome || ""),
      email: String(inscrito.email || ""),
      telefone: String(inscrito.telefone || ""),
      cpf: String(inscrito.cpf || ""),
      idade: String(inscrito.idade || ""),
      sexo: String(inscrito.sexo || ""),
      cidade: String(inscrito.cidade || ""),
      distancia: String(inscrito.distancia || "0 KM"),
      tipo_kit: String(inscrito.tipo_kit || "KIT COMPLETO"),
      forma_pagamento: String(inscrito.forma_pagamento || "PIX"),
    });
  };

  const fecharModalTroca = () => {
    if (trocandoInscricao) {
      return;
    }

    setParticipanteEmTroca(null);

    setFormularioTroca({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      idade: "",
      sexo: "",
      cidade: "",
      distancia: "",
      tipo_kit: "",
      forma_pagamento: "",
    });
  };

  const confirmarTrocaInscricao = async () => {
    if (!participanteEmTroca || trocandoInscricao) {
      return;
    }

    const nome = String(formularioTroca.nome || "").trim();
    const email = String(formularioTroca.email || "")
      .trim()
      .toLowerCase();

    const telefone = String(formularioTroca.telefone || "").replace(/\D/g, "");

    const cpf = String(formularioTroca.cpf || "").replace(/\D/g, "");

    const idade = String(formularioTroca.idade || "").trim();

    const tipoKit = String(formularioTroca.tipo_kit || "").trim();

    if (nome.length < 3) {
      showError("Informe o nome completo do participante.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Informe um endereço de e-mail válido.");
      return;
    }

    if (telefone.length < 10 || telefone.length > 11) {
      showError("Informe um telefone válido com DDD.");
      return;
    }

    if (cpf.length !== 11) {
      showError("Informe um CPF válido com 11 dígitos.");
      return;
    }

    if (!tipoKit) {
      showError("Selecione o novo kit.");
      return;
    }

    const confirmado = window.confirm(
      `Confirma a troca da inscrição ${participanteEmTroca.numero_inscricao}?\n\n` +
        `A inscrição atual será CANCELADA e uma NOVA inscrição será criada.`,
    );

    if (!confirmado) {
      return;
    }

    try {
      setTrocandoInscricao(true);

      setProcessingId({
        id: participanteEmTroca.row,
        action: "trocar",
      });

      const resultado = await trocarInscricao(
        participanteEmTroca.row,
        participanteEmTroca.numero_inscricao,
        {
          nomeCompleto: nome,
          email,
          telefone,
          cpf,
          idade,
          sexo: formularioTroca.sexo,
          cidade: formularioTroca.cidade,
          distancia: formularioTroca.distancia,
          tipoKit,
          formaPagamento: formularioTroca.forma_pagamento,
        },
      );

      await Promise.all([fetchInscritos(), loadDashboard(), loadAnalytics()]);

      fecharModalTroca();

      showSuccess(
        `Troca concluída! Nova inscrição: ${resultado.novaInscricao}.`,
      );
    } catch (error) {
      console.error("Erro ao trocar inscrição:", error);

      showError(
        error.message || "Não foi possível realizar a troca da inscrição.",
      );
    } finally {
      setTrocandoInscricao(false);
      setProcessingId(null);
    }
  };

  const handleCancelarInscricao = async (inscrito) => {
    const confirmado = window.confirm(
      `Deseja realmente cancelar a inscrição de ${inscrito.nome}?`,
    );

    if (!confirmado) return;

    try {
      setProcessingId({
        id: inscrito.row,
        action: "cancelar",
      });

      await cancelarInscricao(inscrito.row);

      setInscritos((prev) =>
        prev.map((item) =>
          item.row === inscrito.row
            ? {
                ...item,
                status_inscricao: "CANCELADA",
              }
            : item,
        ),
      );

      showSuccess(`Inscrição de ${inscrito.nome} cancelada com sucesso!`);

      await loadDashboard();
      await loadAnalytics();
    } catch (error) {
      showError(error.message || "Erro ao cancelar inscrição.");
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

      const numeroMatch =
        inscrito.numero_inscricao &&
        inscrito.numero_inscricao.toString().includes(searchTerm.trim());

      return nomeMatch || cpfMatch || numeroMatch;
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
                  <SeguroAtletaDashboard
                    analytics={analytics}
                    onExportSeguroAtletaPdf={handleExportSeguroAtletaPdf}
                    exportingSeguroAtleta={exportingSeguroAtleta}
                  />
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
                  placeholder="Nome, CPF ou Nº da inscrição..."
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
                                    type="button"
                                    onClick={() => handleResendEmail(inscrito)}
                                    disabled={processingId?.id === inscrito.row}
                                    className="
                                      w-full
                                      inline-flex
                                      items-center
                                      justify-center
                                      gap-2
                                      bg-slate-50
                                      border
                                      border-slate-200
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      text-slate-700
                                      rounded-lg
                                      transition
                                      hover:bg-slate-100
                                      hover:border-slate-300
                                      disabled:cursor-not-allowed
                                      disabled:opacity-60
                                    "
                                  >
                                    {processingId?.id === inscrito.row &&
                                    processingId?.action === "email"
                                      ? "⏳ Enviando..."
                                      : "📧 Reenviar E-mail"}
                                  </button>

                                  {/*                                   <button
                                    disabled={processingId?.id === inscrito.row}
                                    onClick={() => handleResendEmail(inscrito)}
                                    className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-semibold rounded-lg py-2 px-3 text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                                  >
                                    📧{" "}
                                    {processingId?.id === inscrito.row &&
                                    processingId?.action === "email"
                                      ? "Enviando..."
                                      : "Reenviar E-mail"}
                                  </button> */}

                                  {/*
                                  ========================================================
                                  EDITAR DADOS CADASTRAIS
                                  ========================================================
                                  */}

                                  <button
                                    type="button"
                                    onClick={() => abrirModalEdicao(inscrito)}
                                    disabled={Boolean(processingId)}
                                    className="
                                      w-full
                                      inline-flex
                                      items-center
                                      justify-center
                                      gap-2
                                      rounded-xl
                                      border
                                      border-blue-200
                                      bg-blue-50
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      text-blue-700
                                      transition

                                      hover:bg-blue-100

                                      disabled:cursor-not-allowed
                                      disabled:opacity-60
                                    "
                                  >
                                    <span>✏️</span>

                                    <span>Editar dados</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => abrirModalTroca(inscrito)}
                                    disabled={
                                      Boolean(processingId) ||
                                      inscrito.status_inscricao ===
                                        "CANCELADA" ||
                                      inscrito.status_pagamento === "PAGO"
                                    }
                                    className="
                                      w-full
                                      inline-flex
                                      items-center
                                      justify-center
                                      gap-2
                                      rounded-xl
                                      border
                                      border-amber-200
                                      bg-amber-50
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      text-amber-700
                                      transition
                                      hover:bg-amber-100
                                      disabled:cursor-not-allowed
                                      disabled:opacity-60
                                    "
                                  >
                                    <span>🔄</span>

                                    <span>Trocar inscrição</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCancelarInscricao(inscrito)
                                    }
                                    disabled={
                                      processingId?.id === inscrito.row ||
                                      inscrito.status_inscricao ===
                                        "CANCELADA" ||
                                      inscrito.status_pagamento === "PAGO"
                                    }
                                    className="
                                      w-full
                                      inline-flex
                                      items-center
                                      justify-center
                                      gap-2
                                      bg-red-50
                                      border
                                      border-red-200
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      text-red-700
                                      rounded-lg
                                      transition
                                      hover:bg-red-100
                                      hover:border-red-300
                                      disabled:cursor-not-allowed
                                      disabled:opacity-60
                                    "
                                  >
                                    {processingId?.id === inscrito.row &&
                                    processingId?.action === "cancelar"
                                      ? "⏳ Cancelando..."
                                      : "❌ Cancelar inscrição"}
                                  </button>

                                  {/*                                   <button
                                    type="button"
                                    onClick={() =>
                                      handleCancelarInscricao(inscrito)
                                    }
                                    disabled={
                                      processingId?.id === inscrito.row ||
                                      inscrito.status_inscricao ===
                                        "CANCELADA" ||
                                      inscrito.status_pagamento === "PAGO"
                                    }
                                  >
                                    {processingId?.id === inscrito.row &&
                                    processingId?.action === "cancelar"
                                      ? "⏳ Cancelando..."
                                      : "❌ Cancelar inscrição"}
                                  </button> */}
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

      {/*
      ========================================================
      MODAL DE EDIÇÃO CADASTRAL
      ========================================================

      Permite editar:

      - nome;
      - e-mail;
      - telefone;
      - tamanho da camisa.

      Nesta etapa, os campos alteram somente o estado local.

      O envio ao backend será implementado na próxima etapa.
      ========================================================
      */}

      {participanteEmEdicao && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModalEdicao();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-edicao"
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >
            {/*
            ==================================================
            CABEÇALHO
            ==================================================
            */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-slate-200
                px-6
                py-5
              "
            >
              <div>
                <h2
                  id="titulo-modal-edicao"
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  ✏️ Editar dados do participante
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Atualize os dados cadastrais antes de confirmar o salvamento.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModalEdicao}
                disabled={salvandoEdicao}
                aria-label="Fechar modal"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition

                  hover:bg-slate-100
                  hover:text-slate-700

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                ✕
              </button>
            </div>

            {/*
            ==================================================
            FORMULÁRIO
            ==================================================
            */}

            <div
              className="
                max-h-[70vh]
                overflow-y-auto
                px-6
                py-6
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  md:grid-cols-2
                "
              >
                {/*
                ==============================================
                NOME
                ==============================================
                */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="edicao-nome"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Nome completo
                  </label>

                  <input
                    id="edicao-nome"
                    type="text"
                    value={formularioEdicao.nome}
                    onChange={(event) =>
                      setFormularioEdicao((estadoAnterior) => ({
                        ...estadoAnterior,

                        nome: event.target.value,
                      }))
                    }
                    disabled={salvandoEdicao}
                    autoComplete="name"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition

                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                {/*
                ==============================================
                E-MAIL
                ==============================================
                */}

                <div>
                  <label
                    htmlFor="edicao-email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    E-mail
                  </label>

                  <input
                    id="edicao-email"
                    type="email"
                    value={formularioEdicao.email}
                    onChange={(event) =>
                      setFormularioEdicao((estadoAnterior) => ({
                        ...estadoAnterior,

                        email: event.target.value,
                      }))
                    }
                    disabled={salvandoEdicao}
                    autoComplete="email"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition

                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                {/*
                ==============================================
                TELEFONE
                ==============================================
                */}

                <div>
                  <label
                    htmlFor="edicao-telefone"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Telefone
                  </label>

                  <input
                    id="edicao-telefone"
                    type="tel"
                    value={formularioEdicao.telefone}
                    onChange={(event) =>
                      setFormularioEdicao((estadoAnterior) => ({
                        ...estadoAnterior,

                        telefone: event.target.value,
                      }))
                    }
                    disabled={salvandoEdicao}
                    autoComplete="tel"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition

                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                {/*
                ==============================================
                TAMANHO DA CAMISA
                ==============================================
                */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="edicao-tamanho-camisa"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Tamanho da camisa
                  </label>

                  <select
                    id="edicao-tamanho-camisa"
                    value={formularioEdicao.tamanho_camisa}
                    onChange={(event) =>
                      setFormularioEdicao((estadoAnterior) => ({
                        ...estadoAnterior,

                        tamanho_camisa: event.target.value,
                      }))
                    }
                    disabled={salvandoEdicao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition

                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  >
                    <option value="">Selecione o tamanho</option>

                    <option value="INFANTIL 02">Infantil 02</option>

                    <option value="INFANTIL 04">Infantil 04</option>

                    <option value="INFANTIL 06">Infantil 06</option>

                    <option value="INFANTIL 08">Infantil 08</option>

                    <option value="INFANTIL 10">Infantil 10</option>

                    <option value="INFANTIL 12">Infantil 12</option>

                    <option value="INFANTIL 14">Infantil 14</option>

                    <option value="PP">PP</option>

                    <option value="P">P</option>

                    <option value="M">M</option>

                    <option value="G">G</option>

                    <option value="GG">GG</option>

                    <option value="XG">XG</option>

                    <option value="2XG">2XG</option>

                    <option value="3XG">3XG</option>
                  </select>
                </div>
              </div>

              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-blue-200
                  bg-blue-50
                  p-4
                "
              >
                <p
                  className="
                    text-sm
                    leading-relaxed
                    text-blue-800
                  "
                >
                  <strong>Participante selecionado:</strong>{" "}
                  {participanteEmEdicao.nome}
                  <br />
                  <strong>Linha de referência:</strong>{" "}
                  {participanteEmEdicao.row}
                </p>
              </div>
            </div>

            {/*
            ==================================================
            RODAPÉ
            ==================================================
            */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-200
                bg-slate-50
                px-6
                py-4

                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={fecharModalEdicao}
                disabled={salvandoEdicao}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition

                  hover:bg-slate-100

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={salvarEdicaoParticipante}
                disabled={salvandoEdicao}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition

                  hover:bg-indigo-700

                  focus:outline-none
                  focus:ring-4
                  focus:ring-indigo-500/20

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {salvandoEdicao ? (
                  <>
                    <span
                      className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/40
                            border-t-white
                          "
                    />
                    Salvando...
                  </>
                ) : (
                  <>💾 Salvar alterações</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {participanteEmTroca && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModalTroca();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-troca"
            className="
              w-full
              max-w-3xl
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-slate-200
                px-6
                py-5
              "
            >
              <div>
                <h2
                  id="titulo-modal-troca"
                  className="text-xl font-bold text-slate-900"
                >
                  🔄 Trocar inscrição
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A inscrição atual será cancelada e uma nova será criada.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModalTroca}
                disabled={trocandoInscricao}
                aria-label="Fechar modal"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              <div
                className="
                  mb-6
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-4
                "
              >
                <p className="text-sm leading-relaxed text-amber-800">
                  <strong>Inscrição atual:</strong>{" "}
                  {participanteEmTroca.numero_inscricao}
                  <br />
                  <strong>Participante:</strong> {participanteEmTroca.nome}
                  <br />
                  <strong>Kit atual:</strong>{" "}
                  {participanteEmTroca.tipo_kit || "Não informado"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nome completo
                  </label>

                  <input
                    type="text"
                    value={formularioTroca.nome}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        nome: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    CPF
                  </label>

                  <input
                    type="text"
                    value={formularioTroca.cpf}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        cpf: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Idade
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formularioTroca.idade}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        idade: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={formularioTroca.email}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        email: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Telefone
                  </label>

                  <input
                    type="tel"
                    value={formularioTroca.telefone}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        telefone: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Cidade
                  </label>

                  <input
                    type="text"
                    value={formularioTroca.cidade}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        cidade: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Distância
                  </label>

                  <select
                    value={formularioTroca.distancia}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        distancia: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  >
                    <option value="0 KM">0 KM</option>
                    <option value="5 KM">5 KM</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Forma de pagamento
                  </label>

                  <select
                    value={formularioTroca.forma_pagamento}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        forma_pagamento: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  >
                    <option value="PIX">PIX</option>
                    <option value="CARTAO">CARTÃO</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Novo kit
                  </label>

                  <select
                    value={formularioTroca.tipo_kit}
                    onChange={(event) =>
                      setFormularioTroca((estadoAnterior) => ({
                        ...estadoAnterior,
                        tipo_kit: event.target.value,
                      }))
                    }
                    disabled={trocandoInscricao}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-indigo-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-slate-900
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                    "
                  >
                    <option value="KIT COMPLETO">KIT COMPLETO</option>

                    <option value="MEIO KIT">MEIO KIT</option>
                  </select>
                </div>

                {formularioTroca.tipo_kit === "MEIO KIT" && (
                  <div className="md:col-span-2">
                    <div
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                      "
                    >
                      <p className="text-sm text-slate-700">
                        <strong>Camisa:</strong> X
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        O MEIO KIT não possui camisa. O sistema registrará
                        automaticamente o tamanho como X.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-200
                bg-slate-50
                px-6
                py-4
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={fecharModalTroca}
                disabled={trocandoInscricao}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarTrocaInscricao}
                disabled={trocandoInscricao}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-amber-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-amber-700
                  focus:outline-none
                  focus:ring-4
                  focus:ring-amber-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {trocandoInscricao ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />
                    Processando troca...
                  </>
                ) : (
                  <>🔄 Confirmar troca</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
