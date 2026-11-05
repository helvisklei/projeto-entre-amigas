import {
  getEquipeDashboard,
  getEquipeInscritos,
} from "../services/equipeService";
import { useEffect, useState } from "react";

import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import KitRetiradaDashboard from "../components/dashboard/KitRetiradaDashboard";
import { useNavigate } from "react-router-dom";

const ITENS_POR_PAGINA = 8;

const FILTROS_SITUACAO = [
  { valor: "TODOS", label: "Todos" },
  { valor: "ATIVAS", label: "Ativas" },
  { valor: "CANCELADAS", label: "Canceladas" },
  { valor: "PENDENTES_ATIVAS", label: "Pendentes ativas" },
  { valor: "PENDENTES_CANCELADAS", label: "Pendentes canceladas" },
  { valor: "PAGAS", label: "Pagas" },
];

/**
 * Normaliza textos para comparação.
 */
function normalizar(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase();
}

/**
 * Identifica o status da inscrição.
 */
function obterStatusInscricao(inscrito) {
  return normalizar(inscrito.status_inscricao);
}

/**
 * Identifica o status do pagamento.
 */
function obterStatusPagamento(inscrito) {
  const status = normalizar(inscrito.status_pagamento);

  if (status === "PAGO" || Boolean(inscrito.pago)) {
    return "PAGO";
  }

  if (status === "PENDENTE" || status === "AGUARDANDO") {
    return "PENDENTE";
  }

  return status || "PENDENTE";
}

function inscricaoEstaAtiva(inscrito) {
  return ["ATIVA", "ATIVO"].includes(obterStatusInscricao(inscrito));
}

function inscricaoEstaCancelada(inscrito) {
  return ["CANCELADA", "CANCELADO"].includes(obterStatusInscricao(inscrito));
}

function pagamentoEstaPendente(inscrito) {
  return obterStatusPagamento(inscrito) === "PENDENTE";
}

function pagamentoEstaPago(inscrito) {
  return obterStatusPagamento(inscrito) === "PAGO";
}

/**
 * Classificação operacional dos kits.
 *
 * NORMAL + tamanho válido = KIT COMPLETO
 * NORMAL + X ou vazio = MEIO KIT
 *
 * Outras categorias não entram nessa classificação.
 */
function classificarKit(inscrito) {
  const tipo = normalizar(inscrito.tipo_inscricao);

  if (tipo !== "NORMAL") {
    return null;
  }

  const tamanho = normalizar(inscrito.tamanho_camisa);

  return tamanho && tamanho !== "X" ? "KIT COMPLETO" : "MEIO KIT";
}

/**
 * Verifica se o participante possui camisa.
 */
function possuiCamisa(inscrito) {
  const tamanho = normalizar(inscrito.tamanho_camisa);

  return Boolean(tamanho && tamanho !== "X");
}

/**
 * Aplica os filtros de situação.
 */
function correspondeSituacao(inscrito, filtro) {
  const ativa = inscricaoEstaAtiva(inscrito);
  const cancelada = inscricaoEstaCancelada(inscrito);
  const pendente = pagamentoEstaPendente(inscrito);
  const pago = pagamentoEstaPago(inscrito);

  switch (filtro) {
    case "ATIVAS":
      return ativa;

    case "CANCELADAS":
      return cancelada;

    case "PENDENTES_ATIVAS":
      return ativa && pendente;

    case "PENDENTES_CANCELADAS":
      return cancelada && pendente;

    case "PAGAS":
      return pago;

    default:
      return true;
  }
}

/**
 * Pesquisa por nome, CPF ou número de inscrição.
 */
function correspondePesquisa(inscrito, pesquisa) {
  const termo = normalizar(pesquisa);

  if (!termo) return true;

  const nome = normalizar(inscrito.nome);
  const cpf = normalizar(inscrito.cpf);
  const numero = normalizar(inscrito.numero_inscricao);

  const cpfPesquisa = cpf.replace(/\D/g, "");
  const termoNumerico = termo.replace(/\D/g, "");

  return (
    nome.includes(termo) ||
    cpf.includes(termo) ||
    numero.includes(termo) ||
    (termoNumerico && cpfPesquisa.includes(termoNumerico))
  );
}

/**
 * Estilo visual do status de pagamento.
 */
function obterClasseStatus(status) {
  const normalizado = normalizar(status);

  if (normalizado === "PAGO") {
    return "bg-green-100 text-green-700";
  }

  if (normalizado === "PENDENTE" || normalizado === "AGUARDANDO") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-gray-100 text-gray-700";
}

/**
 * Botões dos filtros de situação.
 */
function FiltrosSituacao({ valor, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTROS_SITUACAO.map((filtro) => {
        const selecionado = valor === filtro.valor;

        return (
          <button
            key={filtro.valor}
            type="button"
            onClick={() => onChange(filtro.valor)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selecionado
                ? "bg-purple-600 border-purple-600 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filtro.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Paginação reutilizável para as duas listas.
 */
function Paginacao({ pagina, totalPaginas, totalRegistros, onChange }) {
  const inicio = totalRegistros === 0 ? 0 : (pagina - 1) * ITENS_POR_PAGINA + 1;

  const fim = Math.min(pagina * ITENS_POR_PAGINA, totalRegistros);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      <p className="text-sm text-gray-500">
        Exibindo {inicio} a {fim} de {totalRegistros} registros
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pagina <= 1}
          onClick={() => onChange(pagina - 1)}
          className="px-3 py-2 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Anterior
        </button>

        <span className="text-sm text-gray-600 px-2">
          Página {pagina} de {totalPaginas}
        </span>

        <button
          type="button"
          disabled={pagina >= totalPaginas}
          onClick={() => onChange(pagina + 1)}
          className="px-3 py-2 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default function Equipe() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [inscritos, setInscritos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros da lista de inscritos.
  const [situacaoInscritos, setSituacaoInscritos] = useState("TODOS");
  const [tipoInscricao, setTipoInscricao] = useState("TODOS");
  const [tipoKit, setTipoKit] = useState("TODOS");
  const [pesquisaInscritos, setPesquisaInscritos] = useState("");
  const [paginaInscritos, setPaginaInscritos] = useState(1);

  // Filtros da lista de camisas.
  const [situacaoCamisas, setSituacaoCamisas] = useState("TODOS");
  const [tipoCamisa, setTipoCamisa] = useState("TODOS");
  const [tamanhoCamisa, setTamanhoCamisa] = useState("TODOS");
  const [pesquisaCamisas, setPesquisaCamisas] = useState("");
  const [paginaCamisas, setPaginaCamisas] = useState(1);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const [dashboardData, inscritosData] = await Promise.all([
          getEquipeDashboard(),
          getEquipeInscritos(),
        ]);

        if (!ativo) return;

        setDashboard(dashboardData.dashboard || {});
        setAnalytics(dashboardData.analytics || {});
        setInscritos(inscritosData.inscritos || []);
      } catch (err) {
        if (!ativo) return;

        setError(err.message || "Erro ao carregar painel.");
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  function sair() {
    sessionStorage.removeItem("equipe_user");
    sessionStorage.removeItem("equipe_password");

    localStorage.removeItem("perfil_usuario");

    navigate("/login");
  }

  // Opções dinâmicas dos filtros.
  const tiposDisponiveis = [
    ...new Set(
      inscritos.map((item) => normalizar(item.tipo_inscricao)).filter(Boolean),
    ),
  ].sort();

  const tamanhosDisponiveis = [
    ...new Set(
      inscritos
        .filter(possuiCamisa)
        .map((item) => normalizar(item.tamanho_camisa)),
    ),
  ].sort();

  // Indicadores de kits.
  // Considera inscrições NORMAL ativas, incluindo pendentes.
  const inscritosNormaisAtivos = inscritos.filter(
    (item) =>
      normalizar(item.tipo_inscricao) === "NORMAL" && inscricaoEstaAtiva(item),
  );

  const totalKitCompleto = inscritosNormaisAtivos.filter(
    (item) => classificarKit(item) === "KIT COMPLETO",
  ).length;

  const totalMeioKit = inscritosNormaisAtivos.filter(
    (item) => classificarKit(item) === "MEIO KIT",
  ).length;

  // LISTA DE INSCRITOS
  const inscritosFiltrados = inscritos.filter((item) => {
    const correspondeTipo =
      tipoInscricao === "TODOS" ||
      normalizar(item.tipo_inscricao) === tipoInscricao;

    const correspondeKit =
      tipoKit === "TODOS" || classificarKit(item) === tipoKit;

    return (
      correspondeSituacao(item, situacaoInscritos) &&
      correspondeTipo &&
      correspondeKit &&
      correspondePesquisa(item, pesquisaInscritos)
    );
  });

  const totalPaginasInscritos = Math.max(
    1,
    Math.ceil(inscritosFiltrados.length / ITENS_POR_PAGINA),
  );

  const inscritosPaginados = inscritosFiltrados.slice(
    (paginaInscritos - 1) * ITENS_POR_PAGINA,
    paginaInscritos * ITENS_POR_PAGINA,
  );

  // LISTA DE CAMISAS
  const inscritosComCamisa = inscritos.filter(possuiCamisa);

  const camisasFiltradas = inscritosComCamisa.filter((item) => {
    const correspondeTipo =
      tipoCamisa === "TODOS" || normalizar(item.tipo_inscricao) === tipoCamisa;

    const correspondeTamanho =
      tamanhoCamisa === "TODOS" ||
      normalizar(item.tamanho_camisa) === tamanhoCamisa;

    return (
      correspondeSituacao(item, situacaoCamisas) &&
      correspondeTipo &&
      correspondeTamanho &&
      correspondePesquisa(item, pesquisaCamisas)
    );
  });

  const totalPaginasCamisas = Math.max(
    1,
    Math.ceil(camisasFiltradas.length / ITENS_POR_PAGINA),
  );

  const camisasPaginadas = camisasFiltradas.slice(
    (paginaCamisas - 1) * ITENS_POR_PAGINA,
    paginaCamisas * ITENS_POR_PAGINA,
  );

  // Proteção contra página inválida após alteração de filtros.
  useEffect(() => {
    if (paginaInscritos > totalPaginasInscritos) {
      setPaginaInscritos(totalPaginasInscritos);
    }
  }, [paginaInscritos, totalPaginasInscritos]);

  useEffect(() => {
    if (paginaCamisas > totalPaginasCamisas) {
      setPaginaCamisas(totalPaginasCamisas);
    }
  }, [paginaCamisas, totalPaginasCamisas]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando painel operacional...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>

        <button
          onClick={sair}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg"
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              Painel Operacional
            </h1>

            <p className="text-sm text-gray-500">
              Corrida Entre Amigas Run 2026
            </p>
          </div>

          <button
            onClick={sair}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            Sair
          </button>
        </header>

        {/* Indicadores principais */}
        <DashboardGrid dashboard={dashboard} />

        {/* Controle de retirada */}
        <KitRetiradaDashboard analytics={analytics} />

        {/* Controle quantitativo de camisas */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-700 mb-4">
            Controle de Camisas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Tamanho</th>
                  <th className="text-center">Pagas</th>
                  <th className="text-center">Pendentes</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(analytics.camisas || {}).map((tamanho) => (
                  <tr key={tamanho} className="border-b">
                    <td className="py-3 font-medium">{tamanho}</td>

                    <td className="text-center">
                      {analytics.camisasPagas?.[tamanho] || 0}
                    </td>

                    <td className="text-center">
                      {analytics.camisasPendentes?.[tamanho] || 0}
                    </td>

                    <td className="text-center font-bold">
                      {analytics.camisas?.[tamanho] || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quantidade de kits */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Quantidade de Kits
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DashboardCard title="KIT COMPLETO" value={totalKitCompleto} />

            <DashboardCard title="MEIO KIT" value={totalMeioKit} />
          </div>
        </section>

        {/* Categorias operacionais */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-700 mb-4">
            Categorias Operacionais
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard title="Equipe" value={analytics.totalEquipe} />

            <DashboardCard title="Parceria" value={analytics.totalParceria} />

            <DashboardCard
              title="Divulgação"
              value={analytics.totalDivulgacao}
            />

            <DashboardCard title="Cortesia" value={analytics.totalCortesia} />

            <DashboardCard title="Kits pagos" value={analytics.kitsPagos} />

            <DashboardCard
              title="Kits pendentes de pagamento"
              value={analytics.kitsPendentesPagamento}
            />
          </div>
        </section>

        {/* Números de peito por percurso */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">
            Números de Peito por Percurso
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.distancias || {}).map(([nome, total]) => (
              <DashboardCard key={nome} title={nome} value={total} />
            ))}
          </div>
        </section>

        {/* LISTA DE CAMISAS */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
            <div>
              <h2 className="text-xl font-bold text-purple-700">
                Lista de Camisas
              </h2>

              <p className="text-sm text-gray-500">
                Participantes com tamanho de camisa informado.
              </p>
            </div>

            <span className="font-semibold text-purple-700">
              Total: {camisasFiltradas.length}
            </span>
          </div>

          {/* Filtros de situação */}
          <div className="mb-4">
            <FiltrosSituacao
              valor={situacaoCamisas}
              onChange={(valor) => {
                setSituacaoCamisas(valor);
                setPaginaCamisas(1);
              }}
            />
          </div>

          {/* Filtros adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tipo de inscrição
              </label>

              <select
                value={tipoCamisa}
                onChange={(event) => {
                  setTipoCamisa(event.target.value);
                  setPaginaCamisas(1);
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="TODOS">Todos os tipos</option>

                {tiposDisponiveis.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tamanho da camisa
              </label>

              <select
                value={tamanhoCamisa}
                onChange={(event) => {
                  setTamanhoCamisa(event.target.value);
                  setPaginaCamisas(1);
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="TODOS">Todos os tamanhos</option>

                {tamanhosDisponiveis.map((tamanho) => (
                  <option key={tamanho} value={tamanho}>
                    {tamanho}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Pesquisar participante
              </label>

              <input
                type="search"
                value={pesquisaCamisas}
                onChange={(event) => {
                  setPesquisaCamisas(event.target.value);
                  setPaginaCamisas(1);
                }}
                placeholder="Nome, CPF ou inscrição..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Participantes com camisa: <strong>{camisasFiltradas.length}</strong>{" "}
            • Os filtros funcionam em conjunto.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Nº Inscrição</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-center p-3">Tamanho</th>
                  <th className="text-center p-3">Pagamento</th>
                  <th className="text-left p-3">Forma</th>
                </tr>
              </thead>

              <tbody>
                {camisasPaginadas.length > 0 ? (
                  camisasPaginadas.map((item) => {
                    const status = obterStatusPagamento(item);

                    return (
                      <tr
                        key={item.id || item.row || item.numero_inscricao}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{item.numero_inscricao || "-"}</td>

                        <td className="p-3 font-medium">{item.nome || "-"}</td>

                        <td className="p-3 text-center font-bold">
                          {item.tamanho_camisa}
                        </td>

                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${obterClasseStatus(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="p-3">{item.forma_pagamento || "-"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      Nenhuma camisa encontrada para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Paginacao
            pagina={paginaCamisas}
            totalPaginas={totalPaginasCamisas}
            totalRegistros={camisasFiltradas.length}
            onChange={setPaginaCamisas}
          />
        </section>

        {/* LISTA DE INSCRITOS */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
            <div>
              <h2 className="text-xl font-bold text-blue-700">
                Lista de Inscritos
              </h2>

              <p className="text-sm text-gray-500">
                Relação operacional dos participantes.
              </p>
            </div>

            <span className="font-semibold text-blue-700">
              Total: {inscritosFiltrados.length}
            </span>
          </div>

          {/* Indicadores de kits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm text-green-700">KIT COMPLETO</p>

              <p className="text-2xl font-bold text-green-800">
                {totalKitCompleto}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <p className="text-sm text-purple-700">MEIO KIT</p>

              <p className="text-2xl font-bold text-purple-800">
                {totalMeioKit}
              </p>
            </div>
          </div>

          {/* Filtros de situação */}
          <div className="mb-4">
            <FiltrosSituacao
              valor={situacaoInscritos}
              onChange={(valor) => {
                setSituacaoInscritos(valor);
                setPaginaInscritos(1);
              }}
            />
          </div>

          {/* Filtros adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tipo de inscrição
              </label>

              <select
                value={tipoInscricao}
                onChange={(event) => {
                  setTipoInscricao(event.target.value);
                  setPaginaInscritos(1);
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="TODOS">Todos os tipos</option>

                {tiposDisponiveis.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Classificação do kit
              </label>

              <select
                value={tipoKit}
                onChange={(event) => {
                  setTipoKit(event.target.value);
                  setPaginaInscritos(1);
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="TODOS">Todos os kits</option>
                <option value="KIT COMPLETO">KIT COMPLETO</option>
                <option value="MEIO KIT">MEIO KIT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Pesquisar participante
              </label>

              <input
                type="search"
                value={pesquisaInscritos}
                onChange={(event) => {
                  setPesquisaInscritos(event.target.value);
                  setPaginaInscritos(1);
                }}
                placeholder="Nome, CPF ou inscrição..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Exibindo {inscritosFiltrados.length} inscrição(ões). Os filtros de
            situação, tipo, kit e pesquisa funcionam em conjunto.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Nº</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">CPF</th>
                  <th className="text-left p-3">Telefone</th>
                  <th className="text-left p-3">Kit</th>
                  <th className="text-center p-3">Camisa</th>
                  <th className="text-center p-3">Pagamento</th>
                  <th className="text-left p-3">Forma</th>
                </tr>
              </thead>

              <tbody>
                {inscritosPaginados.length > 0 ? (
                  inscritosPaginados.map((item) => {
                    const status = obterStatusPagamento(item);
                    const classificacao = classificarKit(item);

                    return (
                      <tr
                        key={item.id || item.row || item.numero_inscricao}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{item.numero_inscricao || "-"}</td>

                        <td className="p-3 font-medium">{item.nome || "-"}</td>

                        <td className="p-3">{item.cpf || "-"}</td>

                        <td className="p-3">{item.telefone || "-"}</td>

                        <td className="p-3">
                          {classificacao || item.tipo_inscricao || "-"}
                        </td>

                        <td className="p-3 text-center">
                          {possuiCamisa(item) ? item.tamanho_camisa : "-"}
                        </td>

                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${obterClasseStatus(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="p-3">{item.forma_pagamento || "-"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="p-6 text-center text-gray-500">
                      Nenhum inscrito encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Paginacao
            pagina={paginaInscritos}
            totalPaginas={totalPaginasInscritos}
            totalRegistros={inscritosFiltrados.length}
            onChange={setPaginaInscritos}
          />
        </section>
      </div>
    </main>
  );
}

// import {
//   getEquipeDashboard,
//   getEquipeInscritos,
// } from "../services/equipeService";
// import { useEffect, useState } from "react";

// import DashboardCard from "../components/dashboard/DashboardCard";
// import DashboardGrid from "../components/dashboard/DashboardGrid";
// import KitRetiradaDashboard from "../components/dashboard/KitRetiradaDashboard";
// import { useNavigate } from "react-router-dom";

// export default function Equipe() {
//   const navigate = useNavigate();

//   const [dashboard, setDashboard] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [inscritos, setInscritos] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let ativo = true;

//     async function carregarDados() {
//       try {
//         const [dashboardData, inscritosData] = await Promise.all([
//           getEquipeDashboard(),
//           getEquipeInscritos(),
//         ]);

//         if (!ativo) return;

//         setDashboard(dashboardData.dashboard);
//         setAnalytics(dashboardData.analytics);
//         setInscritos(inscritosData.inscritos || []);
//       } catch (err) {
//         if (!ativo) return;

//         setError(err.message || "Erro ao carregar painel.");
//       } finally {
//         if (ativo) setLoading(false);
//       }
//     }

//     carregarDados();

//     return () => {
//       ativo = false;
//     };
//   }, []);

//   function sair() {
//     sessionStorage.removeItem("equipe_user");
//     sessionStorage.removeItem("equipe_password");

//     localStorage.removeItem("perfil_usuario");

//     navigate("/login");
//   }

//   function formatarStatusPagamento(inscrito) {
//     return inscrito.status_pagamento || (inscrito.pago ? "PAGO" : "PENDENTE");
//   }

//   function obterClasseStatus(status) {
//     const normalizado = String(status || "").toUpperCase();

//     if (normalizado === "PAGO") {
//       return "bg-green-100 text-green-700";
//     }

//     if (normalizado === "PENDENTE" || normalizado === "AGUARDANDO") {
//       return "bg-yellow-100 text-yellow-700";
//     }

//     return "bg-gray-100 text-gray-700";
//   }

//   // Considera apenas tamanhos válidos.
//   // O valor "X" representa inscrição sem camisa.
//   const inscritosComCamisa = inscritos.filter((item) => {
//     const tamanho = String(item.tamanho_camisa || "")
//       .trim()
//       .toUpperCase();

//     return tamanho && tamanho !== "X";
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Carregando painel operacional...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen p-6 flex flex-col items-center justify-center">
//         <p className="text-red-600 mb-4">{error}</p>

//         <button
//           onClick={sair}
//           className="bg-purple-600 text-white px-5 py-2 rounded-lg"
//         >
//           Voltar ao login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Cabeçalho */}
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-purple-700">
//               Painel Operacional
//             </h1>

//             <p className="text-sm text-gray-500">
//               Corrida Entre Amigas Run 2026
//             </p>
//           </div>

//           <button
//             onClick={sair}
//             className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
//           >
//             Sair
//           </button>
//         </header>

//         {/* Indicadores principais */}
//         <DashboardGrid dashboard={dashboard} />

//         {/* Controle de retirada */}
//         <KitRetiradaDashboard analytics={analytics} />

//         {/* Controle quantitativo de camisas */}
//         <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-bold text-purple-700 mb-4">
//             Controle de Camisas
//           </h2>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left py-3">Tamanho</th>
//                   <th className="text-center">Pagas</th>
//                   <th className="text-center">Pendentes</th>
//                   <th className="text-center">Total</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {Object.keys(analytics.camisas || {}).map((tamanho) => (
//                   <tr key={tamanho} className="border-b">
//                     <td className="py-3 font-medium">{tamanho}</td>

//                     <td className="text-center">
//                       {analytics.camisasPagas?.[tamanho] || 0}
//                     </td>

//                     <td className="text-center">
//                       {analytics.camisasPendentes?.[tamanho] || 0}
//                     </td>

//                     <td className="text-center font-bold">
//                       {analytics.camisas?.[tamanho] || 0}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Quantidade de kits */}
//         <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-bold text-green-700 mb-4">
//             Quantidade de Kits
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {Object.entries(analytics.kits || {}).map(([nome, quantidade]) => (
//               <DashboardCard key={nome} title={nome} value={quantidade} />
//             ))}
//           </div>
//         </section>

//         {/* Categorias operacionais */}
//         <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-bold text-slate-700 mb-4">
//             Categorias Operacionais
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <DashboardCard title="Equipe" value={analytics.totalEquipe} />

//             <DashboardCard title="Parceria" value={analytics.totalParceria} />

//             <DashboardCard
//               title="Divulgação"
//               value={analytics.totalDivulgacao}
//             />

//             <DashboardCard title="Cortesia" value={analytics.totalCortesia} />

//             <DashboardCard title="Kits pagos" value={analytics.kitsPagos} />

//             <DashboardCard
//               title="Kits pendentes de pagamento"
//               value={analytics.kitsPendentesPagamento}
//             />
//           </div>
//         </section>

//         {/* Números de peito por percurso */}
//         <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-bold text-blue-700 mb-4">
//             Números de Peito por Percurso
//           </h2>

//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(analytics.distancias || {}).map(([nome, total]) => (
//               <DashboardCard key={nome} title={nome} value={total} />
//             ))}
//           </div>
//         </section>

//         {/* Lista individual de camisas */}
//         <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
//             <div>
//               <h2 className="text-xl font-bold text-purple-700">
//                 Lista de Camisas
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Participantes com tamanho de camisa informado.
//               </p>
//             </div>

//             <span className="font-semibold text-purple-700">
//               Total: {inscritosComCamisa.length}
//             </span>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b bg-gray-50">
//                   <th className="text-left p-3">Nº Inscrição</th>
//                   <th className="text-left p-3">Nome</th>
//                   <th className="text-center p-3">Tamanho</th>
//                   <th className="text-center p-3">Pagamento</th>
//                   <th className="text-left p-3">Forma</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {inscritosComCamisa.length > 0 ? (
//                   inscritosComCamisa.map((item) => {
//                     const status = formatarStatusPagamento(item);

//                     return (
//                       <tr
//                         key={item.id || item.row || item.numero_inscricao}
//                         className="border-b hover:bg-gray-50"
//                       >
//                         <td className="p-3">{item.numero_inscricao || "-"}</td>

//                         <td className="p-3 font-medium">{item.nome || "-"}</td>

//                         <td className="p-3 text-center font-bold">
//                           {item.tamanho_camisa}
//                         </td>

//                         <td className="p-3 text-center">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-semibold ${obterClasseStatus(status)}`}
//                           >
//                             {status}
//                           </span>
//                         </td>

//                         <td className="p-3">{item.forma_pagamento || "-"}</td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="p-6 text-center text-gray-500">
//                       Nenhuma camisa encontrada.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Lista individual de inscritos */}
//         <section className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
//             <div>
//               <h2 className="text-xl font-bold text-blue-700">
//                 Lista de Inscritos
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Relação operacional dos participantes.
//               </p>
//             </div>

//             <span className="font-semibold text-blue-700">
//               Total: {inscritos.length}
//             </span>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b bg-gray-50">
//                   <th className="text-left p-3">Nº</th>
//                   <th className="text-left p-3">Nome</th>
//                   <th className="text-left p-3">CPF</th>
//                   <th className="text-left p-3">Telefone</th>
//                   <th className="text-left p-3">Kit</th>
//                   <th className="text-center p-3">Camisa</th>
//                   <th className="text-center p-3">Pagamento</th>
//                   <th className="text-left p-3">Forma</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {inscritos.length > 0 ? (
//                   inscritos.map((item) => {
//                     const status = formatarStatusPagamento(item);

//                     return (
//                       <tr
//                         key={item.id || item.row || item.numero_inscricao}
//                         className="border-b hover:bg-gray-50"
//                       >
//                         <td className="p-3">{item.numero_inscricao || "-"}</td>

//                         <td className="p-3 font-medium">{item.nome || "-"}</td>

//                         <td className="p-3">{item.cpf || "-"}</td>

//                         <td className="p-3">{item.telefone || "-"}</td>

//                         <td className="p-3">{item.tipo_kit || "-"}</td>

//                         <td className="p-3 text-center">
//                           {item.tamanho_camisa && item.tamanho_camisa !== "X"
//                             ? item.tamanho_camisa
//                             : "-"}
//                         </td>

//                         <td className="p-3 text-center">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-semibold ${obterClasseStatus(status)}`}
//                           >
//                             {status}
//                           </span>
//                         </td>

//                         <td className="p-3">{item.forma_pagamento || "-"}</td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="p-6 text-center text-gray-500">
//                       Nenhum inscrito encontrado.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

/* import { useEffect, useState } from "react";

import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import KitRetiradaDashboard from "../components/dashboard/KitRetiradaDashboard";
import { getEquipeDashboard } from "../services/equipeService";
import { useNavigate } from "react-router-dom";

export default function Equipe() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const data = await getEquipeDashboard();

        if (!ativo) return;

        setDashboard(data.dashboard);
        setAnalytics(data.analytics);
      } catch (err) {
        if (!ativo) return;

        setError(err.message || "Erro ao carregar painel.");
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  function sair() {
    sessionStorage.removeItem("equipe_user");
    sessionStorage.removeItem("equipe_password");
    localStorage.removeItem("perfil_usuario");
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando painel operacional...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={sair}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg"
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              Painel Operacional
            </h1>
            <p className="text-sm text-gray-500">
              Corrida Entre Amigas Run 2026
            </p>
          </div>

          <button
            onClick={sair}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            Sair
          </button>
        </header>

        <DashboardGrid dashboard={dashboard} />

        <KitRetiradaDashboard analytics={analytics} />

        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-700 mb-4">
            Controle de Camisas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Tamanho</th>
                  <th className="text-center">Pagas</th>
                  <th className="text-center">Pendentes</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(analytics.camisas || {}).map((tamanho) => (
                  <tr key={tamanho} className="border-b">
                    <td className="py-3 font-medium">{tamanho}</td>
                    <td className="text-center">
                      {analytics.camisasPagas?.[tamanho] || 0}
                    </td>
                    <td className="text-center">
                      {analytics.camisasPendentes?.[tamanho] || 0}
                    </td>
                    <td className="text-center font-bold">
                      {analytics.camisas?.[tamanho] || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Quantidade de Kits
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(analytics.kits || {}).map(([nome, quantidade]) => (
              <DashboardCard key={nome} title={nome} value={quantidade} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-700 mb-4">
            Categorias Operacionais
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard title="Equipe" value={analytics.totalEquipe} />
            <DashboardCard title="Parceria" value={analytics.totalParceria} />
            <DashboardCard
              title="Divulgação"
              value={analytics.totalDivulgacao}
            />
            <DashboardCard title="Cortesia" value={analytics.totalCortesia} />
            <DashboardCard title="Kits pagos" value={analytics.kitsPagos} />
            <DashboardCard
              title="Kits pendentes de pagamento"
              value={analytics.kitsPendentesPagamento}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">
            Números de Peito por Percurso
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.distancias || {}).map(([nome, total]) => (
              <DashboardCard key={nome} title={nome} value={total} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
 */
