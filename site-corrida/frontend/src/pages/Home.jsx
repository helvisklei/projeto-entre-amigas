import "../styles/flip-animation.css";

import { useEffect, useState } from "react";

import DocumentacaoPublica from "../components/regulamento/DocumentacaoPublica";
import EventsSection from "../components/EventsSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InscricaoModal from "../components/InscricaoModal";
import LoadingScreen from "../components/LoadingScreen";
import TestimonialsSection from "../components/TestimonialsSection";
import { getFrontendConfig } from "../services/configService";
import { useNavigate } from "react-router-dom";

//import KitExtrasSection from "../components/KitExtrasSection";

export default function Home() {
  // 🔒 Controle de inscrições
  //const isInscriptionOpen = true; // Mude para true quando quiser reabrir

  const [configError, setConfigError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null); // 'pix' | 'credito'
  const [selectedKit, setSelectedKit] = useState(null);
  const [config, setConfig] = useState(null);
  const [contagemRegressiva, setContagemRegressiva] = useState(null);
  const [mostrarLembreteRetirada, setMostrarLembreteRetirada] = useState(true);
  const navigate = useNavigate();

  /*
  =========================================================
  CONTROLE CENTRAL DE INSCRIÇÕES
  =========================================================
  */
  const isInscriptionOpen = config ? !config.eventoEncerrado : false; // Padrão para fechado enquanto carrega config

  useEffect(() => {
    let ativo = true;

    async function loadConfig() {
      try {
        setConfigError(false);

        const cfg = await getFrontendConfig();

        if (ativo) {
          if (!cfg) {
            throw new Error("A configuração não foi retornada.");
          }

          setConfig(cfg);
        }
      } catch (error) {
        console.error("Erro carregando config:", error);

        if (ativo) {
          setConfigError(true);
        }
      }
    }

    loadConfig();

    return () => {
      ativo = false;
    };
  }, [retryKey]);

  // Contagem regressiva baseada exclusivamente na configuração do evento.
  useEffect(() => {
    const dataEventoConfig = config?.evento?.data;
    const horarioLargadaConfig = config?.evento?.largada;

    if (!dataEventoConfig || !horarioLargadaConfig) {
      setContagemRegressiva(null);
      return undefined;
    }

    const [dia, mes, ano] = dataEventoConfig.split("/").map(Number);
    const [horas, minutos] = horarioLargadaConfig.split(":").map(Number);

    if (
      !dia ||
      !mes ||
      !ano ||
      !Number.isInteger(horas) ||
      !Number.isInteger(minutos) ||
      horas < 0 ||
      horas > 23 ||
      minutos < 0 ||
      minutos > 59
    ) {
      setContagemRegressiva(null);
      return undefined;
    }

    const dataLargada = new Date(ano, mes - 1, dia, horas, minutos, 0, 0);

    if (
      dataLargada.getFullYear() !== ano ||
      dataLargada.getMonth() !== mes - 1 ||
      dataLargada.getDate() !== dia
    ) {
      setContagemRegressiva(null);
      return undefined;
    }

    const atualizarContagem = () => {
      const diferenca = dataLargada.getTime() - Date.now();

      if (diferenca <= 0) {
        setContagemRegressiva({
          iniciada: true,
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
        });
        return;
      }

      const totalSegundos = Math.floor(diferenca / 1000);

      setContagemRegressiva({
        iniciada: false,
        dias: Math.floor(totalSegundos / 86400),
        horas: Math.floor((totalSegundos % 86400) / 3600),
        minutos: Math.floor((totalSegundos % 3600) / 60),
        segundos: totalSegundos % 60,
      });
    };

    atualizarContagem();
    const intervalo = window.setInterval(atualizarContagem, 1000);

    return () => window.clearInterval(intervalo);
  }, [config?.evento?.data, config?.evento?.largada]);

  /*   useEffect(() => {
    async function loadConfig() {
      try {
        const cfg = await getFrontendConfig();

        setConfig(cfg);
      } catch (error) {
        console.error("Erro carregando config:", error);
      }
    }

    loadConfig();
  }, []); */

  // Helper para abrir o modal com checagem de bloqueio
  const tryOpenInscricaoModal = (type = null, kit = null) => {
    if (!isInscriptionOpen) {
      // Feedback mínimo para o usuário (mantém sem regressão)
      alert("Inscrições temporariamente fechadas. Em breve reabriremos.");
      return;
    }
    setPaymentType(type);
    setSelectedKit(kit);
    setShowInscricaoModal(true);
  };

  // Abre o modal automaticamente quando vindo do Google Forms (somente se aberto)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("fromForm") === "true") {
        if (isInscriptionOpen) {
          setShowInscricaoModal(true);
        } else {
          // evita abrir modal quando inscrições estão fechadas
          console.info(
            "Retorno do Forms detectado, mas inscrições estão fechadas.",
          );
        }
      }
    }
  }, [isInscriptionOpen]);

  // URL do Google Form (configurada)
  /*   const GOOGLE_FORM_URL =
    process.env.REACT_APP_GOOGLE_FORM_URL ||
    "https://forms.gle/cK5rsEZ75nbTYgTj9"; */

  const handleInscricaoSuccess = () => {
    // Lógica adicional após sucesso
    console.log("Inscrição realizada com sucesso!");
  };

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Benefícios do evento
  const benefits = [
    { icon: "👕", title: "Camisa Oficial", desc: "Design exclusivo do evento" },
    { icon: "🔢", title: "Número de Peito", desc: "Identificação única" },
    { icon: "🥇", title: "Medalha Exclusiva", desc: "Lembrança especial" },
    { icon: "🏆", title: "Pódios por Categoria", desc: "3 km e 5 km" },
    { icon: "💆", title: "Massagem", desc: "Para os atletas pós-corrida" },
    { icon: "❄️", title: "Piscina de Gelo", desc: "Recuperação profissional" },
    { icon: "🎧", title: "DJ ao Vivo", desc: "Animando todo o evento" },
    { icon: "☕", title: "Café da Manhã", desc: "Hidratação + refeição" },
    { icon: "🎁", title: "Brindes Especiais", desc: "Sorteios e prêmios" },
    { icon: "🛡️", title: "Seguro Atleta", desc: "Cobertura durante o evento" },
  ];

  //console.log("CONFIG:", config);

  if (!config) {
    return (
      <LoadingScreen
        error={configError}
        onRetry={() => setRetryKey((valor) => valor + 1)}
      />
    );
  }

  /*   if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  } */

  /*Só quando a Home for redenriada utilizando
   hoario local do navegador
  */

  const agora = new Date();

  const converterDataHora = (data, hora) => {
    if (!data || !hora) return null;

    const [dia, mes, ano] = data.split("/").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);

    if (!dia || !mes || !ano || horas == null || minutos == null) {
      return null;
    }

    const dataHora = new Date(ano, mes - 1, dia, horas, minutos);

    if (
      dataHora.getFullYear() !== ano ||
      dataHora.getMonth() !== mes - 1 ||
      dataHora.getDate() !== dia
    ) {
      return null;
    }

    return dataHora;
  };

  const inicioRetirada = converterDataHora(
    config.retiradaKit?.inicio,
    config.retiradaKit?.horaInicio,
  );

  const fimRetirada = converterDataHora(
    config.retiradaKit?.fim,
    config.retiradaKit?.horaFim,
  );

  const retiradaKitLiberada =
    inicioRetirada !== null &&
    fimRetirada !== null &&
    fimRetirada >= inicioRetirada &&
    agora >= inicioRetirada &&
    agora <= fimRetirada;

  const acessoTermoLiberado =
    config?.retiradaKit?.impressaoAntecipada === true || retiradaKitLiberada;

  //const descontoLegal = Number(config?.descontos?.pcd || 50) / 100;

  const descontoLegal = Number(config?.lote1?.descontos?.pcd || 0) / 100;

  const descontoLegalAtivo = config?.beneficios?.descontoPcdTea60Ativo ?? true;

  const getDataEvento = () => {
    if (!config?.evento?.data) {
      return {
        dia: "--",
        mes: "",
        ano: "",
      };
    }

    const [dia, mes, ano] = config.evento.data.split("/");

    const meses = {
      "01": "Janeiro",
      "02": "Fevereiro",
      "03": "Março",
      "04": "Abril",
      "05": "Maio",
      "06": "Junho",
      "07": "Julho",
      "08": "Agosto",
      "09": "Setembro",
      10: "Outubro",
      11: "Novembro",
      12: "Dezembro",
    };

    return {
      dia,
      mes: meses[mes] || "",
      ano,
    };
  };

  const dataEvento = getDataEvento();

  const kitsEvento = [
    {
      tipo: "KIT COMPLETO",
      ativo: config?.kits?.kitCompleto?.ativo === true,
      titulo: config?.kits?.kitCompleto?.nome || "Kit Completo",
      destaque: config?.kits?.kitCompleto?.destaque || "",
      itens: config?.kits?.kitCompleto?.itens || [],
      beneficios: config?.kits?.kitCompleto?.beneficios || [],
    },

    {
      tipo: "MEIO KIT",
      ativo: config?.kits?.meioKit?.ativo === true,
      titulo: config?.kits?.meioKit?.nome || "Meio Kit",
      destaque: config?.kits?.meioKit?.destaque || "",
      itens: config?.kits?.meioKit?.itens || [],
      beneficios: config?.kits?.meioKit?.beneficios || [],
    },

    {
      tipo: "LANCHE",
      ativo: config?.kits?.lanche?.ativo === true,
      titulo: config?.kits?.lanche?.nome || "Kit Lanche",
      destaque: config?.kits?.lanche?.destaque || "",
      itens: config?.kits?.lanche?.itens || [],
      beneficios: config?.kits?.lanche?.beneficios || [],
    },
  ];

  // NOVO
  const lotes = [
    {
      visivel: config?.lote1?.visivel,

      status:
        config?.loteAtual === 1
          ? "ATUAL"
          : config?.loteAtual === 2
            ? "BLOQUEADO"
            : "FUTURO",

      numero: 1,
      titulo: "LOTE 1",

      inicio: config.lote1?.inicio,
      fim: config.lote1?.fim,

      bgClass: "from-pink-400 to-pink-500",
      textClass: "text-pink-100",
      brandText: "text-pink-600",

      kits: [
        {
          tipo: "KIT COMPLETO",
          ativo: config?.kits?.kitCompleto?.ativo === true,
          nome: "KIT COMPLETO",
          pix: config.lote1?.kitCompletoPix,
          cartao: config.lote1?.kitCompletoCartao,
        },
        {
          tipo: "MEIO KIT",
          ativo: config?.kits?.meioKit?.ativo === true,
          nome: "MEIO KIT",
          pix: config.lote1?.meioKitPix,
          cartao: config.lote1?.meioKitCartao,
        },
      ],
    },

    {
      visivel: config?.lote2?.visivel,

      status:
        config?.loteAtual === 2
          ? "ATUAL"
          : config?.loteAtual === 1
            ? "BLOQUEADO"
            : "FUTURO",

      numero: 2,
      titulo: "LOTE 2",

      inicio: config.lote2?.inicio,
      fim: config.lote2?.fim,

      bgClass: "from-purple-400 to-purple-500",
      textClass: "text-purple-100",
      brandText: "text-purple-600",

      kits: [
        {
          tipo: "KIT COMPLETO",
          ativo: config?.kits?.kitCompleto?.ativo === true,
          nome: "KIT COMPLETO",
          pix: config.lote2?.kitCompletoPix,
          cartao: config.lote2?.kitCompletoCartao,
        },
        {
          tipo: "MEIO KIT",
          ativo: config?.kits?.meioKit?.ativo === true,
          nome: "MEIO KIT",
          pix: config.lote2?.meioKitPix,
          cartao: config.lote2?.meioKitCartao,
        },
      ],
    },
  ].filter((lote) => lote.visivel);

  // NOVO
  const apenasUmLote = lotes.length === 1;

  // Retorna os preços do kit considerando apenas o lote atual
  const obterPrecoKit = (tipoKit) => {
    const loteAtual = lotes.find((lote) => lote.status === "ATUAL");

    if (!loteAtual) {
      return {
        pix: null,
        cartao: null,
      };
    }

    const kit = loteAtual.kits.find((k) => k.tipo === tipoKit);

    return (
      kit || {
        pix: null,
        cartao: null,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Header com Logo */}
      <Header />

      {/* Hero Banner Melhorado */}
      <div className="relative h-96 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-200 overflow-hidden flex items-center justify-center shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-10 left-10 text-6xl animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-20 right-20 text-5xl animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="absolute bottom-10 left-1/4 text-5xl animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
        <div className="relative text-center px-4 z-10">
          <img
            src="/logoEntreAmigas.webp"
            alt="Entre Amigas Logo"
            className="h-64 md:h80 w-auto mx-auto drop-shadow-2xl"
            title="Entre Amigas - Corrida de Mulheres"
          />
          <p className="text-xl md:text-2xl text-white drop-shadow-md font-semibold -mt-6 -translate-y-2">
            6ª Edição • Celebrando Amizade, Saúde e Superação 💖
          </p>
        </div>
      </div>

      {/* Contagem regressiva para a largada */}
      {contagemRegressiva && (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#3B123F] via-purple-800 to-pink-700 px-4 py-10 text-white shadow-lg md:py-14">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-8 md:p-10">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-100 sm:text-sm">
                {contagemRegressiva.iniciada
                  ? "Chegou o grande dia"
                  : "Falta pouco para a largada"}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl md:text-4xl">
                {contagemRegressiva.iniciada
                  ? "A nossa corrida começou!"
                  : "A contagem regressiva já começou!"}
              </h2>
              <p className="mt-2 text-sm text-purple-100 sm:text-base">
                Preparem os tênis, reúnam os amigos e venham viver este momento!
              </p>
            </div>

            {!contagemRegressiva.iniciada ? (
              <div className="mx-auto mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  { valor: contagemRegressiva.dias, rotulo: "Dias" },
                  { valor: contagemRegressiva.horas, rotulo: "Horas" },
                  { valor: contagemRegressiva.minutos, rotulo: "Minutos" },
                  { valor: contagemRegressiva.segundos, rotulo: "Segundos" },
                ].map((item) => (
                  <div
                    key={item.rotulo}
                    className="rounded-2xl border border-white/20 bg-white/15 px-3 py-4 text-center shadow-inner sm:py-5"
                  >
                    <p className="text-4xl font-extrabold tabular-nums sm:text-5xl md:text-6xl">
                      {String(item.valor).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-100 sm:text-sm">
                      {item.rotulo}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-white/20 bg-white/15 px-4 py-6 text-center">
                <p className="text-2xl font-bold sm:text-3xl">
                  🏁 Boa corrida, Entre Amigas Run!
                </p>
                <p className="mt-2 text-sm text-purple-100">
                  Que seja um dia de alegria, amizade e superação.
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-col items-center justify-center gap-3 text-center text-sm text-purple-50 sm:flex-row sm:gap-7 sm:text-base">
              <p className="flex items-center gap-2">
                <span aria-hidden="true">📅</span>
                {config?.evento?.data || "Data a definir"}
              </p>
              <p className="flex items-center gap-2">
                <span aria-hidden="true">⏰</span>
                Largada às {config?.evento?.largada || "A definir"}
              </p>
              <p className="flex items-center gap-2">
                <span aria-hidden="true">📍</span>
                {config?.evento?.local || "Local a definir"}
              </p>
            </div>
            {config?.evento?.localComplemento && (
              <p className="mt-2 text-center text-xs text-purple-100">
                {config.evento.localComplemento}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Banner de Divulgação - Prepare-se */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 drop-shadow-lg">
            ✨ Prepare-se para viver uma experiência incrível! ✨
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="text-center transform transition hover:scale-110"
              >
                <div className="text-4xl md:text-5xl mb-2">{benefit.icon}</div>
                <p className="font-bold text-sm md:text-base drop-shadow">
                  {benefit.title}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg md:text-xl font-semibold drop-shadow">
              🎁 Brindes, sorteios e muito mais te esperando! 🎁
            </p>
          </div>
        </div>
      </div>

      {/* AVISO IMPORTANTE DO EVENTO */}
      {config?.avisoEvento?.ativo === true && (
        <section className="bg-white px-4 py-5 md:py-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-purple-200 bg-[#F5F0FF] p-5 shadow-sm md:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                  <span className="text-xl" aria-hidden="true">
                    📢
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold uppercase tracking-wide text-purple-800">
                    AVISO IMPORTANTE
                    {config.avisoEvento.titulo
                      ? ` — ${config.avisoEvento.titulo}`
                      : ""}
                  </h2>

                  {config.avisoEvento.texto && (
                    <p className="mt-4 text-sm leading-relaxed text-purple-950 md:text-base">
                      {config.avisoEvento.texto}
                    </p>
                  )}

                  {config.avisoEvento.descricao && (
                    <p className="mt-3 text-sm leading-relaxed text-purple-950 md:text-base">
                      {config.avisoEvento.descricao}
                    </p>
                  )}

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-purple-200/70 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-purple-800">
                        <span aria-hidden="true">☀️</span>
                        <span>Concentração</span>
                      </div>
                      <p className="mt-1 text-xl font-bold text-purple-900">
                        {config.avisoEvento.concentracao || "A definir"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-purple-200/70 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-purple-800">
                        <span aria-hidden="true">🏃‍♀️</span>
                        <span>Largada</span>
                      </div>
                      <p className="mt-1 text-xl font-bold text-purple-900">
                        {config.avisoEvento.largada || "A definir"}
                      </p>
                    </div>
                  </div>

                  {config.avisoEvento.rodape && (
                    <p className="mt-4 text-sm font-medium text-purple-800">
                      {config.avisoEvento.rodape}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          BANNER — RETIRADA DE KIT
          Exibido somente quando liberado pela configuração
          ========================================================= */}

      {config?.retiradaKitParticipante === true && (
        <section id="retirada-kit" className="bg-white py-8 scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4">
            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                bg-gradient-to-r
                from-purple-700
                via-fuchsia-600
                to-pink-500
                p-6
                md:p-8
                shadow-lg
              "
            >
              {/* Decoração */}
              <div
                className="
                  absolute
                  -right-10
                  -top-10
                  h-32
                  w-32
                  rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  absolute
                  -bottom-12
                  -left-8
                  h-32
                  w-32
                  rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  relative
                  grid
                  grid-cols-1
                  gap-6
                  md:grid-cols-[minmax(0,1fr)_auto]
                  md:items-center
                "
              >
                {/* Texto */}
                <div className="text-white">
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      uppercase
                      tracking-wide
                      text-white/90
                    "
                  >
                    <span>🎽</span>

                    <span>Retirada de Kit</span>
                  </div>

                  <h2
                    className="
                      text-2xl
                      md:text-3xl
                      font-extrabold
                    "
                  >
                    Seu Termo de Retirada está disponível
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-2xl
                      text-sm
                      md:text-base
                      text-white/90
                    "
                  >
                    Acesse com seu número de CPF para consultar e imprimir seu
                    Termo de Retirada de Kit. Lembre-se de assinar o documento.
                  </p>

                  {/* =================================================
                      AVISO DE DATAS (INÍCIO E FIM)
                      Efeito "Glassmorphism" adaptado ao tema
                      ================================================= */}
                  {/* =================================================
                      PERÍODO PARA RETIRADA DO KIT
                      ================================================= */}

                  <div className="mt-5 w-full max-w-2xl">
                    <div
                      className="
                        mb-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-white/80
                      "
                    >
                      Período para retirada do kit
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                      "
                    >
                      {/* =============================================
                          INÍCIO
                          ============================================= */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-white/20
                          bg-white/10
                          px-4
                          py-3
                          backdrop-blur-sm
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/15
                            text-lg
                          "
                          aria-hidden="true"
                        >
                          📅
                        </span>

                        <div className="min-w-0">
                          <div
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-white/70
                            "
                          >
                            Início da retirada
                          </div>

                          <div
                            className="
                              mt-0.5
                              text-sm
                              font-bold
                              text-white
                            "
                          >
                            <div>
                              {config?.retiradaKit?.inicio || "A definir"}
                            </div>

                            <div className="mt-0.5 text-xs font-semibold text-white/90">
                              Das {config?.retiradaKit?.horaInicio || "--:--"}{" "}
                              às {config?.retiradaKit?.horaFim || "--:--"}
                            </div>
                            {/* {config?.retiradaKit?.inicio || "A definir"} */}
                            {/* <span className="mx-1 text-white/60">às</span> */}
                            {/* {config?.retiradaKit?.horaInicio || "--:--"} */}
                          </div>
                        </div>
                      </div>

                      {/* =============================================
                          FIM
                          ============================================= */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-white/20
                          bg-white/10
                          px-4
                          py-3
                          backdrop-blur-sm
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/15
                            text-lg
                          "
                          aria-hidden="true"
                        >
                          🏁
                        </span>

                        <div className="min-w-0">
                          <div
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-white/70
                            "
                          >
                            Fim da retirada
                          </div>

                          <div
                            className="
                              mt-0.5
                              text-sm
                              font-bold
                              text-white
                            "
                          >
                            <div>{config?.retiradaKit?.fim || "A definir"}</div>

                            <div className="mt-0.5 text-xs font-semibold text-white/90">
                              Das {config?.retiradaKit?.horaInicio || "--:--"}{" "}
                              às {config?.retiradaKit?.horaFim || "--:--"}
                            </div>
                            {/*  {config?.retiradaKit?.fim || "A definir"}
                            <span className="mx-1 text-white/60">às</span>
                            {config?.retiradaKit?.horaFim || "--:--"} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Botão */}
                <button
                  type="button"
                  onClick={() => navigate("/retirada-kit")}
                  disabled={!acessoTermoLiberado}
                  className={`
                    relative inline-flex shrink-0 items-center justify-center gap-2
                    rounded-xl px-6 py-3 font-bold shadow-md transition
                    ${
                      acessoTermoLiberado
                        ? "bg-white text-purple-700 hover:scale-[1.02] hover:bg-gray-50"
                        : "cursor-not-allowed bg-gray-200 text-gray-500 opacity-80"
                    }
                  `}
                  title={
                    acessoTermoLiberado
                      ? "Acessar Termo"
                      : "O acesso estará disponível durante o período de retirada"
                  }
                >
                  <span>📄</span>

                  <span>Acessar Termo</span>
                </button>

                {/* AVISO DE DOCUMENTOS PARA RETIRADA */}
                {config?.retiradaKit?.avisoDocumentos?.trim() &&
                  (() => {
                    const partes = config.retiradaKit.avisoDocumentos
                      .split("|")
                      .map((parte) => parte.trim());

                    const [
                      titulo,
                      introducao,
                      tituloProprio,
                      textoProprio,
                      tituloTerceiro,
                      textoTerceiro,
                      tituloValidacao,
                      textoFinal,
                    ] = partes;

                    const secoes = [
                      {
                        titulo: tituloProprio,
                        texto: textoProprio,
                        icone: "👤",
                      },
                      {
                        titulo: tituloTerceiro,
                        texto: textoTerceiro,
                        icone: "👥",
                      },
                      {
                        titulo: tituloValidacao,
                        texto: textoFinal,
                        icone: "🛡️",
                      },
                    ];

                    return (
                      <div
                        /*                         className="mt-5 w-full max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm"
                        role="note"
                        aria-label="Orientações para retirada do kit" */
                        className="w-full min-w-0 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm md:col-span-2"
                      >
                        <h3 className="flex items-center gap-2 font-bold text-amber-800">
                          <span aria-hidden="true">⚠️</span>
                          {titulo}
                        </h3>

                        {introducao && (
                          <p className="mt-3 text-sm leading-relaxed text-amber-900">
                            {introducao}
                          </p>
                        )}

                        {secoes.map((secao, indice) => (
                          <div
                            key={`${indice}-${secao.titulo}`}
                            className="mt-4 border-t border-amber-300 pt-4"
                          >
                            <h4 className="flex items-start gap-2 text-sm font-semibold text-gray-900">
                              <span aria-hidden="true">{secao.icone}</span>
                              <span>{secao.titulo}</span>
                            </h4>

                            {secao.texto && (
                              <p className="mt-2 pl-6 text-sm leading-relaxed text-gray-800">
                                {secao.texto}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                {/* COMUNICADO PRINCIPAL — PRAZO E RESPONSABILIDADE PELA RETIRADA
                    Permanece dentro da condição config?.retiradaKitParticipante. */}
                <div
                  role="note"
                  aria-label="Comunicado importante sobre a retirada dos kits"
                  className="
                    md:col-span-2
                    rounded-xl
                    border-2
                    border-amber-400
                    bg-amber-50
                    p-4
                    shadow-sm
                    md:p-5
                  "
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-amber-900 md:text-base">
                      <span aria-hidden="true">📢</span>
                      Atenção, participantes!
                    </h3>

                    <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
                      Comunicado importante
                    </span>
                  </div>

                  <h4 className="mt-3 text-lg font-bold text-amber-800 md:text-xl">
                    Ainda não retirou seu kit?
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-amber-950 md:text-base">
                    A retirada dos kits deverá ser realizada exclusivamente nas
                    datas, horários e locais divulgados pela organização.
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-amber-950 md:text-base">
                    É de responsabilidade do participante realizar a retirada
                    dentro do prazo estabelecido, não sendo obrigação da
                    organização entrar em contato individualmente para lembrar
                    ou solicitar o comparecimento dos atletas.
                  </p>

                  <div className="mt-4 border-t border-amber-400 pt-3">
                    <h5 className="text-sm font-extrabold text-amber-900 md:text-base">
                      Fique atento!
                    </h5>

                    <p className="mt-2 text-sm leading-relaxed text-amber-950 md:text-base">
                      Após o encerramento do período de retirada, não haverá
                      garantia de entrega ou retirada posterior, ficando
                      qualquer possibilidade sujeita à disponibilidade e
                      confirmação da organização, respeitados os direitos
                      previstos na legislação vigente.
                    </p>

                    <p className="mt-3 text-xs text-amber-900 md:text-sm">
                      Consulte as condições completas no Termo de Retirada de
                      Kit.
                    </p>
                  </div>
                </div>

                {/* AVISO EXPRESSO — NÃO HAVERÁ ENTREGA NO DIA DA CORRIDA
                    Usa a mesma configuração do Termo de Retirada. */}
                <div
                  role="note"
                  aria-label="Aviso: não haverá entrega de kits no dia da corrida"
                  className="
                    md:col-span-2
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border-2
                    border-red-300
                    bg-red-50
                    p-4
                    shadow-sm
                    md:p-5
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-red-100
                      text-2xl
                    "
                  >
                    ⚠️
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold uppercase tracking-wide text-red-800 md:text-lg">
                      Atenção: não haverá entrega de kits no dia da corrida
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-red-900 md:text-base">
                      A organização não realizará, em nenhuma hipótese, a
                      entrega de kits no dia da corrida. Todos os participantes
                      deverão retirar seus kits exclusivamente nas datas,
                      horários e locais previamente divulgados pela organização.
                    </p>

                    <p className="mt-2 text-sm font-bold leading-relaxed text-red-800 md:text-base">
                      Programe-se e não deixe a retirada do seu kit para o dia
                      do evento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* About Section */}
        <section id="sobre" className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">
            O que é Entre Amigas?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            🌸 A Corrida Entre Amigas é mais do que um evento esportivo é um
            encontro de pessoas que acreditam na força da amizade, na saúde e no
            poder de se superar. Venha viver essa experiência inesquecível!{" "}
            <strong>
              Corra, caminhe, sorria e celebre conosco a força da amizade!
            </strong>
          </p>
          <p className="text-lg text-purple-700 font-semibold mt-4">
            Entre Amigas, toda corrida tem mais significado. 💕
          </p>
        </section>

        {/* Event Details */}
        <section id="eventos" className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">
            📋 Informações do Evento
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg shadow-lg p-8 border-l-4 border-pink-500 transform transition hover:scale-105">
              <h3 className="text-3xl font-bold text-pink-600 mb-3">📅 Data</h3>
              <p className="text-2xl font-semibold text-gray-800">
                {dataEvento.dia} de {dataEvento.mes} de {dataEvento.ano}
              </p>
              {/* <p className="text-lg text-gray-700">{dataEvento.ano}</p> */}
              <p className="text-sm text-gray-600 mt-2">Dia memorável!</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500 transform transition hover:scale-105">
              <h3 className="text-3xl font-bold text-purple-600 mb-3">
                📍 Local
              </h3>
              <p className="text-2xl font-semibold text-gray-800">
                {config?.evento?.local}
              </p>
              <p className="text-lg text-gray-700">
                {config?.evento?.localComplemento}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-lg p-6 border-l-4 border-rose-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-rose-600 mb-3">
                ⏰ Largada
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {config?.evento?.largada} Manhã
              </p>
              {/* <p className="text-gray-700">horas (matutino)</p> */}
              <p className="text-sm text-gray-600 mt-2">
                Chegar com antecedência! Concentração:{" "}
                {config?.evento?.concentracao}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">
                🏁 Distâncias
              </h3>
              {/* <p className="text-lg font-semibold text-gray-800">
                📏 <strong>3 km</strong>
              </p>
              <p className="text-gray-700 text-sm mb-2">Para mulheres</p> */}
              <p className="text-lg font-semibold text-gray-800">
                📏{" "}
                <strong>
                  {config?.evento?.distanciaPrincipal}{" "}
                  {config?.evento?.distanciaPrincipalDesc}
                </strong>
              </p>
              {/* <p className="text-gray-700 text-sm">
                {config?.evento?.distanciaPrincipalDesc}
              </p> */}
              <p className="text-gray-700 text-sm mt-2">
                OBS: {config?.evento?.observacao}
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-indigo-600 mb-3">
                🎽 Categorias
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                👩 {config?.evento?.categoria1}
              </p>
              <p className="text-gray-700 text-sm mb-2">
                {config?.evento?.categoria1Desc}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                👨 {config?.evento?.categoria2}
              </p>
              <p className="text-gray-700 text-sm">
                {config?.evento?.categoria2Desc}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-lg p-8 border-l-4 border-yellow-500 transform transition hover:scale-105">
            <h3 className="text-3xl font-bold text-yellow-600 mb-3">
              🏆 Premiação
            </h3>
            <p className="text-lg text-gray-800 font-semibold">
              {config?.evento?.premiacao}{" "}
              {/*Troféus para os 3 primeiros colocados em cada categoria */}
            </p>
            <p className="text-gray-700 mt-3">
              {config?.evento?.premiacaoObs}
              {/* Além de brindes especiais para todos os participantes! */}
            </p>
          </div>
        </section>

        {/* Kit e Pagamento */}
        {isInscriptionOpen && (
          <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-4xl font-extrabold text-center mb-3">
              🎁 Escolha seu Kit
            </h2>
            <p className="text-center text-pink-100 text-lg max-w-3xl mx-auto mb-3">
              Participe da <strong>6ª Corrida Entre Amigas RUN</strong> da forma
              que melhor combina com você.
            </p>
            <p className="text-center text-pink-200 text-sm mb-10">
              Todos os kits incluem uma experiência preparada com carinho,
              organização e segurança.
            </p>
            <div
              className={`grid gap-8 ${
                kitsEvento.filter((kit) => kit.ativo).length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : kitsEvento.filter((kit) => kit.ativo).length === 2
                    ? "md:grid-cols-2 max-w-5xl mx-auto"
                    : "lg:grid-cols-3"
              }`}
            >
              {kitsEvento
                .filter((kit) => kit.ativo)
                .map((kit) => (
                  <div
                    key={kit.titulo}
                    className="
                    bg-white
                    text-gray-800
                    rounded-3xl
                    shadow-xl
                    border
                    border-pink-300
                    p-6
                    flex
                    flex-col
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-2xl
                    "
                    // className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 flex flex-col"
                  >
                    {/* <h3 className="text-2xl font-extrabold text-pink-600 mb-2"> */}
                    <h3 className="text-2xl font-black text-pink-600 mb-2 leading-tight">
                      {kit.titulo}
                    </h3>

                    <div className="mb-4">
                      {kit.tipo === "KIT COMPLETO" && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                          ⭐ MAIS ESCOLHIDO
                        </span>
                      )}

                      {kit.tipo === "MEIO KIT" && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                          💜 Melhor custo-benefício
                        </span>
                      )}

                      {kit.tipo === "LANCHE" && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                          ☕ Participação
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      {kit.destaque}
                    </p>

                    {(() => {
                      const preco = obterPrecoKit(kit.tipo);

                      return (
                        <>
                          {preco.pix && (
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-5 mb-6">
                              <p className="text-xs uppercase tracking-widest text-gray-500 text-center">
                                A partir de
                              </p>

                              <h3 className="text-5xl font-black text-pink-600 text-center mt-1">
                                {formatCurrency(preco.pix)}
                              </h3>

                              {preco.cartao && (
                                <p className="text-center text-gray-600 mt-2">
                                  💳 Cartão:
                                  <strong className="text-purple-700 ml-1">
                                    {formatCurrency(preco.cartao)}
                                  </strong>
                                </p>
                              )}
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                      <h4 className="font-bold text-purple-600 mb-3">
                        ✔ Você recebe
                      </h4>

                      <ul className="space-y-2">
                        {kit.itens.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <span className="text-green-500 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                          // <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {kit.beneficios.length > 0 && (
                      <div className="bg-pink-50 rounded-xl p-4 mt-4">
                        <h4 className="font-bold text-purple-600 mb-3">
                          💜 Além disso você aproveita
                        </h4>

                        <ul className="space-y-2">
                          {kit.beneficios.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-gray-700"
                            >
                              <span className="text-pink-500">❤</span>
                              <span>{item}</span>
                            </li>
                            // <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto pt-6">
                      <button
                        /* onClick={tryOpenInscricaoModal} */
                        onClick={() => tryOpenInscricaoModal(null, kit.tipo)}
                        disabled={!isInscriptionOpen}
                        className={`
                          w-full
                          py-3
                          rounded-xl
                          font-bold
                          text-lg
                          transition-all
                          duration-300
                          ${
                            isInscriptionOpen
                              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-xl"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }
                        `}
                      >
                        {isInscriptionOpen
                          ? "💖 Quero este Kit"
                          : "⏳ Inscrições Encerradas"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-10 bg-white/10 rounded-2xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-center mb-6">
                ⚠️ Segurança e Organização em Primeiro Lugar
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <strong>Seguro Atleta</strong>
                    <p className="text-sm text-pink-100">
                      Cobertura para os participantes inscritos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚑</span>
                  <div>
                    <strong>Ambulância</strong>
                    <p className="text-sm text-pink-100">
                      Equipe preparada durante o evento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏍️</span>
                  <div>
                    <strong>Apoio no Percurso</strong>
                    <p className="text-sm text-pink-100">
                      Apoio operacional durante toda a prova.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎧</span>
                  <div>
                    <strong>DJ</strong>
                    <p className="text-sm text-pink-100">
                      Música e animação durante todo o evento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <strong>Evento Regularizado</strong>
                    <p className="text-sm text-pink-100">
                      Autorizado pelos órgãos competentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/30 my-10"></div>
            {/* {exibirKitExtras && <KitExtrasSection />} */}{" "}
            {/*🎯 Outras opções de participação*/}
          </section>
        )}

        {/* Inscrição CTA */}
        <section className="text-center space-y-6">
          <div>
            <p className="text-2xl text-gray-700 mb-4">
              Pronto(a) para fazer parte dessa história?
            </p>
            {!isInscriptionOpen ? (
              <div className="bg-red-50 rounded-lg p-8 border-2 border-red-300 mb-4 mx-auto max-w-md">
                <p className="text-2xl font-bold text-red-600 mb-2">
                  ⏰ Em Breve!
                </p>
                <p className="text-gray-700 mb-3">
                  As inscrições estão encerradas no momento.
                </p>
                <p className="text-sm text-gray-600">
                  Acompanhe nossas redes sociais para novas edições. 💕
                </p>
              </div>
            ) : (
              <button
                onClick={() => tryOpenInscricaoModal()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform transition hover:scale-105"
              >
                🏃‍♀️ Clique aqui. Se inscreva você também! 💕
              </button>
            )}
          </div>
        </section>
        {/* Lotes de Inscrição */}
        {isInscriptionOpen && (
          <div className="relative bg-gradient-to-b from-white to-pink-50 py-12 shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-600 mb-10 drop-shadow">
                💰 Valor da Inscrição
              </h2>

              {/* Validação Defensiva */}
              {!config ? (
                <div className="w-full text-center py-8 text-gray-500">
                  Carregando lotes vigentes...
                </div>
              ) : (
                <div
                  className={
                    apenasUmLote
                      ? "grid grid-cols-1 max-w-2xl mx-auto gap-6 mb-8"
                      : "grid md:grid-cols-2 gap-6 mb-8"
                  }
                >
                  {lotes.map((lote) => (
                    <div
                      key={`lote-${lote.numero}`}
                      className={`bg-gradient-to-br ${lote.bgClass} rounded-xl shadow-xl p-6 md:p-8 flex flex-col justify-between`}
                    >
                      <div>
                        <h3 className="text-3xl font-bold text-white text-center mb-2 tracking-wide">
                          {lote.titulo}
                        </h3>
                        <div className="flex justify-center mb-4">
                          {lote.status === "ATUAL" && (
                            <span
                              className="
                              bg-green-500
                              text-white
                              px-4
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              uppercase
                              tracking-wider
                            "
                            >
                              🔥 Lote Atual
                            </span>
                          )}

                          {lote.status === "FUTURO" && (
                            <span
                              className="
                              bg-blue-500
                              text-white
                              px-4
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              uppercase
                              tracking-wider
                            "
                            >
                              ⏳ Próximo Lote
                            </span>
                          )}

                          {lote.status === "BLOQUEADO" && (
                            <span
                              className="
                              bg-gray-500
                              text-white
                              px-4
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              uppercase
                              tracking-wider
                            "
                            >
                              🔒 BLOQUEADO
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-center ${lote.textClass} text-sm font-medium mb-6`}
                        >
                          {lote.inicio || "Breve"} até {lote.fim || "Breve"}
                        </p>

                        <div className="space-y-6">
                          {lote.kits
                            .filter(
                              (kit) =>
                                String(kit.ativo).toUpperCase() === "TRUE" ||
                                kit.ativo === true,
                            )
                            .map((kit) => {
                              const pixValue = Number(kit.pix || 0);
                              const cartaoValue = Number(kit.cartao || 0);

                              return (
                                <div
                                  key={`${lote.numero}-${kit.nome}`}
                                  className="bg-white rounded-xl p-5 shadow-inner border border-gray-100"
                                >
                                  {/* Bloco Inteiro */}
                                  <h4
                                    className={`font-black ${lote.brandText} text-xl mb-3 tracking-tight`}
                                  >
                                    {kit.nome}
                                  </h4>

                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-baseline justify-between text-gray-700">
                                      <span className="font-medium text-sm">
                                        PIX
                                      </span>
                                      <div className="flex-grow mx-2 border-b border-dashed border-gray-300"></div>
                                      <strong className="text-gray-900 font-bold">
                                        {formatCurrency(pixValue)}
                                      </strong>
                                    </div>
                                    <div className="flex items-baseline justify-between text-gray-700">
                                      <span className="font-medium text-sm">
                                        Cartão
                                      </span>
                                      <div className="flex-grow mx-2 border-b border-dashed border-gray-300"></div>
                                      <strong className="text-gray-900 font-bold">
                                        {formatCurrency(cartaoValue)}
                                      </strong>
                                    </div>
                                  </div>

                                  {/* Divisor de Subseção Moderno */}
                                  <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                      <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                      <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">
                                        Benefício Legal PCD / TEA / 60+
                                      </span>
                                    </div>
                                  </div>

                                  {/* Bloco 50% Meia Entrada (PCD / TEA / 60+) */}
                                  <div className="flex items-center justify-between mb-3">
                                    <div
                                      className="flex gap-2 text-lg"
                                      title="PCD, TEA e 60+"
                                    >
                                      <span>👨‍🦽</span>
                                      <span>🧩</span>
                                      <span>👵</span>
                                    </div>

                                    {descontoLegalAtivo ? (
                                      <span
                                        className="
                                                bg-green-100
                                                text-green-700
                                                font-bold
                                                text-xs
                                                px-2.5
                                                py-1
                                                rounded-full
                                                uppercase
                                                tracking-wider
                                            "
                                      >
                                        {config?.lote1.descontos.pcd || 50}%
                                        Desconto
                                      </span>
                                    ) : (
                                      <span
                                        className="
                                                bg-red-100
                                                text-red-700
                                                font-bold
                                                text-xs
                                                px-2.5
                                                py-1
                                                rounded-full
                                                uppercase
                                                tracking-wider
                                            "
                                      >
                                        💳 VALOR INTEGRAL
                                      </span>
                                    )}
                                    {/*🚫*/}
                                  </div>

                                  {descontoLegalAtivo ? (
                                    <>
                                      <div className="flex items-baseline justify-between">
                                        <span>PIX (Meia)</span>

                                        <div className="flex-grow mx-2 border-b border-dashed border-gray-200"></div>

                                        <strong className="text-green-600 font-bold">
                                          {formatCurrency(
                                            pixValue * (1 - descontoLegal),
                                          )}
                                        </strong>
                                      </div>

                                      <div className="flex items-baseline justify-between">
                                        <span>Cartão (Meia)</span>

                                        <div className="flex-grow mx-2 border-b border-dashed border-gray-200"></div>

                                        <strong className="text-green-600 font-bold">
                                          {formatCurrency(
                                            cartaoValue * (1 - descontoLegal),
                                          )}
                                        </strong>
                                      </div>
                                    </>
                                  ) : (
                                    <div
                                      className="
                                              rounded-lg
                                              border
                                              border-red-200
                                              bg-red-50
                                              p-3
                                              text-center
                                          "
                                    >
                                      <p className="font-bold text-red-600">
                                        O benefício legal para PCD • TEA • 60+
                                        não está disponível neste momento.
                                      </p>

                                      <p className="text-xs text-gray-500 mt-1">
                                        Inscrições continuam normalmente pelo
                                        valor integral.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isInscriptionOpen &&
                lotes.some((lote) => lote.status === "ATUAL") && (
                  <div className="text-center bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300 flex flex-col items-center justify-center gap-4">
                    <p className="text-lg font-semibold text-yellow-800">
                      ⏰ Garanta sua inscrição no primeiro lote e economize! 💪
                    </p>

                    <button
                      type="button"
                      onClick={() => tryOpenInscricaoModal()}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md transform transition hover:scale-105"
                    >
                      🏃‍♀️ Quero me Inscrever Agora! 💕
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Benefício Legal - PCD / TEA / 60+ */}
        {descontoLegalAtivo && (
          <section className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-green-700 mb-5 flex items-center gap-2">
              💜 Benefício Legal (60+, PCD e TEA)
            </h3>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Conforme a legislação vigente, participantes enquadrados nas
                categorias:
              </p>

              <ul className="list-disc ml-6 space-y-1">
                <li>Pessoa Idosa (60+)</li>
                <li>Pessoa com Deficiência (PCD)</li>
                <li>Pessoa com Transtorno do Espectro Autista (TEA)</li>
              </ul>

              <p>
                têm direito ao desconto legal de{" "}
                <strong className="text-green-700">
                  {/* {config?.lote1?.descontos?.pcd || 50}*/}50% exclusivamente
                  sobre o valor da inscrição no evento.
                </strong>
              </p>

              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="font-semibold text-amber-800">
                  ⚠️ O desconto NÃO incide sobre os itens físicos do kit, tais
                  como:
                </p>

                <ul className="list-disc ml-6 mt-2 space-y-1 text-amber-900">
                  <li>Camisa oficial</li>
                  <li>Medalha</li>
                  <li>Número de peito</li>
                  <li>Ecobag</li>
                  <li>Viseira</li>
                  <li>Demais brindes</li>
                </ul>
              </div>

              <p>Assim, o valor final é composto por:</p>

              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Valor da inscrição (com possibilidade de desconto legal);
                </li>
                <li>Valor do kit escolhido (integral).</li>
              </ul>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-blue-800 font-medium">
                  ℹ️ O valor atualizado da inscrição será apresentado
                  automaticamente durante o preenchimento da inscrição, conforme
                  o lote vigente.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Modal de Inscrição */}
        <InscricaoModal
          key={`${showInscricaoModal}-${selectedKit}`}
          isOpen={showInscricaoModal}
          onClose={() => setShowInscricaoModal(false)}
          selectedKit={selectedKit}
          onSuccess={handleInscricaoSuccess}
          paymentType={paymentType}
        />

        {/* Events Section */}
        {/* <EventsSection config={config} /> */}
        <EventsSection
          config={config}
          onInscricaoClick={() => tryOpenInscricaoModal()}
        />

        {/* Testimonials Section Depoimentos */}
        <TestimonialsSection config={config} />

        {/* Regras */}

        {/* =========================================================
            REGRAS IMPORTANTES E ORIENTAÇÕES PARA RETIRADA DE KIT
            ========================================================= */}

        <section
          id="regras"
          className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-5 mb-6 scroll-mt-24"
        >
          <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            🏆 REGRAS IMPORTANTES PARA O ATLETA
          </h2>

          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">🍿</span>
              <span>
                <strong>Atletas sem inscrição ("Pipoca"):</strong> Não possuem
                direito à cronometragem, medalha ou acesso aos pódios.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">🎽</span>
              <span>
                <strong>Retirada antecipada de kits:</strong> Não haverá entrega
                de kits no dia da corrida. A retirada ocorrerá no período
                divulgado oficialmente pela organização.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">⏰</span>
              <span>
                <strong>Pontualidade:</strong> Programe-se para chegar ao local
                com antecedência no dia da prova.
              </span>
            </li>
          </ul>

          {/* Orientações específicas para retirada de kit */}
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-base font-extrabold text-blue-900 mb-2 flex items-center gap-2">
              📋 DOCUMENTOS NECESSÁRIOS PARA RETIRADA DO KIT
            </h3>

            <p className="text-sm text-blue-900 mb-4 leading-relaxed">
              Para garantir uma retirada organizada e segura, confira os
              documentos necessários conforme cada situação:
            </p>

            <div className="space-y-4 text-sm text-gray-700">
              {/* Retirada pelo titular */}
              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  1. Retirada pelo próprio participante
                </h4>

                <p className="leading-relaxed">
                  O titular da inscrição deverá apresentar documento oficial de
                  identificação com foto e o Termo de Retirada de Kit
                  devidamente assinado.
                </p>
              </div>

              {/* Retirada por terceiros */}
              <div className="border-t border-blue-200 pt-3">
                <h4 className="font-bold text-gray-900 mb-1">
                  2. Retirada por outra pessoa (terceiros)
                </h4>

                <p className="leading-relaxed">
                  Caso o titular não possa comparecer, outra pessoa poderá
                  retirar o kit mediante apresentação do Termo de Retirada de
                  Kit, contendo autorização expressa do titular da inscrição e
                  devidamente assinado de forma eletrônica ou manuscrita.
                </p>

                <p className="mt-2 leading-relaxed">
                  A pessoa autorizada também deverá apresentar documento oficial
                  de identificação com foto.
                </p>
              </div>

              {/* Validação eletrônica */}
              <div className="border-t border-blue-200 pt-3">
                <h4 className="font-bold text-gray-900 mb-1">
                  3. Validação da assinatura eletrônica
                </h4>

                <p className="leading-relaxed">
                  Quando o termo for assinado eletronicamente, a organização
                  poderá verificar sua autenticidade por meio do portal oficial
                  do Instituto Nacional de Tecnologia da Informação (ITI).
                </p>

                <a
                  href="https://validar.iti.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-semibold text-blue-700 underline break-all"
                >
                  https://validar.iti.gov.br
                </a>

                <p className="mt-2 leading-relaxed">
                  Para essa conferência, deverá ser apresentado o arquivo PDF
                  original assinado eletronicamente.
                </p>
              </div>
            </div>
          </div>

          {/* Orientação sobre leitura do regulamento */}
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-100/70 p-3">
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>📖 Leitura obrigatória:</strong> Leia atentamente o
              regulamento oficial disponibilizado durante o processo de
              inscrição antes de finalizar seu cadastro. Ao realizar a
              inscrição, o participante deverá declarar ciência e concordância
              com suas disposições.
            </p>
          </div>
        </section>

        {/* Footer Message */}
        <div className="text-center py-8 border-t-4 border-pink-300">
          <p className="text-2xl font-bold text-pink-600 mb-2">
            🌟 Venha viver essa experiência inesquecível!
          </p>
          <p className="text-xl text-purple-700">
            Corra, caminhe, sorria e celebre conosco a força da amizade! 💕
          </p>
        </div>
      </div>

      {/* Documentação pública permanente */}
      <DocumentacaoPublica />

      <Footer />

      {/* LEMBRETE FLUTUANTE DE RETIRADA
          Não interfere nos botões da página e usa a mesma configuração do termo. */}
      {config?.retiradaKitParticipante === true && mostrarLembreteRetirada && (
        <>
          <style>
            {`
              @keyframes kitReminderAttention {
                0%, 100% {
                  transform: translateY(0);
                  box-shadow: 0 8px 24px rgba(180, 83, 9, 0.18);
                  filter: saturate(1);
                }
                50% {
                  transform: translateY(-4px);
                  box-shadow: 0 12px 30px rgba(220, 38, 38, 0.28);
                  filter: saturate(1.15);
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .kit-reminder-attention {
                  animation: none !important;
                }
              }
            `}
          </style>

          <aside
            aria-label="Lembrete de retirada de kits"
            className="
              fixed
              bottom-4
              right-4
              z-40
              w-[min(22rem,calc(100vw-2rem))]
              sm:bottom-6
              sm:right-6
            "
          >
            <div
              className="
                kit-reminder-attention
                relative
                overflow-hidden
                rounded-2xl
                border
                border-amber-300
                bg-gradient-to-r
                from-amber-50
                via-orange-50
                to-red-50
                p-3
                pr-10
                sm:p-4
                sm:pr-11
              "
              style={{
                animation: "kitReminderAttention 3s ease-in-out infinite",
              }}
            >
              <button
                type="button"
                aria-label="Ocultar lembrete de retirada"
                onClick={() => setMostrarLembreteRetirada(false)}
                className="
                  absolute
                  right-2
                  top-2
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  text-slate-500
                  transition
                  hover:bg-white/80
                  hover:text-slate-900
                  focus:outline-none
                  focus:ring-2
                  focus:ring-amber-500
                "
              >
                ×
              </button>

              <a
                href="#retirada-kit"
                className="
                  block
                  rounded-lg
                  text-left
                  focus:outline-none
                  focus:ring-2
                  focus:ring-amber-600
                  focus:ring-offset-2
                "
              >
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-red-700 sm:text-sm">
                  <span aria-hidden="true">🎽</span>
                  Atenção: retirada de kits
                </span>

                <span className="mt-1 block text-sm font-extrabold leading-snug text-slate-900 sm:text-base">
                  Ainda há participantes com kits aguardando retirada!
                </span>

                <span className="mt-2 block text-xs leading-relaxed text-slate-700 sm:text-sm">
                  A retirada dentro do prazo é de responsabilidade do
                  participante.
                </span>

                <span className="mt-1 block text-xs font-semibold text-amber-900 sm:text-sm">
                  Consulte as orientações e programe sua retirada →
                </span>
              </a>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

// import "../styles/flip-animation.css";

// import { useEffect, useState } from "react";

// import EventsSection from "../components/EventsSection";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import InscricaoModal from "../components/InscricaoModal";
// import LoadingScreen from "../components/LoadingScreen";
// import TestimonialsSection from "../components/TestimonialsSection";
// import { getFrontendConfig } from "../services/configService";
// import { useNavigate } from "react-router-dom";

// //import KitExtrasSection from "../components/KitExtrasSection";

// export default function Home() {
//   // 🔒 Controle de inscrições
//   //const isInscriptionOpen = true; // Mude para true quando quiser reabrir

//   const [configError, setConfigError] = useState(false);
//   const [retryKey, setRetryKey] = useState(0);
//   const [showInscricaoModal, setShowInscricaoModal] = useState(false);
//   const [paymentType, setPaymentType] = useState(null); // 'pix' | 'credito'
//   const [selectedKit, setSelectedKit] = useState(null);
//   const [config, setConfig] = useState(null);
//   const [contagemRegressiva, setContagemRegressiva] = useState(null);
//   const [mostrarLembreteRetirada, setMostrarLembreteRetirada] = useState(true);
//   const navigate = useNavigate();

//   /*
//   =========================================================
//   CONTROLE CENTRAL DE INSCRIÇÕES
//   =========================================================
//   */
//   const isInscriptionOpen = config ? !config.eventoEncerrado : false; // Padrão para fechado enquanto carrega config

//   useEffect(() => {
//     let ativo = true;

//     async function loadConfig() {
//       try {
//         setConfigError(false);

//         const cfg = await getFrontendConfig();

//         if (ativo) {
//           if (!cfg) {
//             throw new Error("A configuração não foi retornada.");
//           }

//           setConfig(cfg);
//         }
//       } catch (error) {
//         console.error("Erro carregando config:", error);

//         if (ativo) {
//           setConfigError(true);
//         }
//       }
//     }

//     loadConfig();

//     return () => {
//       ativo = false;
//     };
//   }, [retryKey]);

//   // Contagem regressiva baseada exclusivamente na configuração do evento.
//   useEffect(() => {
//     const dataEventoConfig = config?.evento?.data;
//     const horarioLargadaConfig = config?.evento?.largada;

//     if (!dataEventoConfig || !horarioLargadaConfig) {
//       setContagemRegressiva(null);
//       return undefined;
//     }

//     const [dia, mes, ano] = dataEventoConfig.split("/").map(Number);
//     const [horas, minutos] = horarioLargadaConfig.split(":").map(Number);

//     if (
//       !dia ||
//       !mes ||
//       !ano ||
//       !Number.isInteger(horas) ||
//       !Number.isInteger(minutos) ||
//       horas < 0 ||
//       horas > 23 ||
//       minutos < 0 ||
//       minutos > 59
//     ) {
//       setContagemRegressiva(null);
//       return undefined;
//     }

//     const dataLargada = new Date(ano, mes - 1, dia, horas, minutos, 0, 0);

//     if (
//       dataLargada.getFullYear() !== ano ||
//       dataLargada.getMonth() !== mes - 1 ||
//       dataLargada.getDate() !== dia
//     ) {
//       setContagemRegressiva(null);
//       return undefined;
//     }

//     const atualizarContagem = () => {
//       const diferenca = dataLargada.getTime() - Date.now();

//       if (diferenca <= 0) {
//         setContagemRegressiva({
//           iniciada: true,
//           dias: 0,
//           horas: 0,
//           minutos: 0,
//           segundos: 0,
//         });
//         return;
//       }

//       const totalSegundos = Math.floor(diferenca / 1000);

//       setContagemRegressiva({
//         iniciada: false,
//         dias: Math.floor(totalSegundos / 86400),
//         horas: Math.floor((totalSegundos % 86400) / 3600),
//         minutos: Math.floor((totalSegundos % 3600) / 60),
//         segundos: totalSegundos % 60,
//       });
//     };

//     atualizarContagem();
//     const intervalo = window.setInterval(atualizarContagem, 1000);

//     return () => window.clearInterval(intervalo);
//   }, [config?.evento?.data, config?.evento?.largada]);

//   /*   useEffect(() => {
//     async function loadConfig() {
//       try {
//         const cfg = await getFrontendConfig();

//         setConfig(cfg);
//       } catch (error) {
//         console.error("Erro carregando config:", error);
//       }
//     }

//     loadConfig();
//   }, []); */

//   // Helper para abrir o modal com checagem de bloqueio
//   const tryOpenInscricaoModal = (type = null, kit = null) => {
//     if (!isInscriptionOpen) {
//       // Feedback mínimo para o usuário (mantém sem regressão)
//       alert("Inscrições temporariamente fechadas. Em breve reabriremos.");
//       return;
//     }
//     setPaymentType(type);
//     setSelectedKit(kit);
//     setShowInscricaoModal(true);
//   };

//   // Abre o modal automaticamente quando vindo do Google Forms (somente se aberto)
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       if (params.get("fromForm") === "true") {
//         if (isInscriptionOpen) {
//           setShowInscricaoModal(true);
//         } else {
//           // evita abrir modal quando inscrições estão fechadas
//           console.info(
//             "Retorno do Forms detectado, mas inscrições estão fechadas.",
//           );
//         }
//       }
//     }
//   }, [isInscriptionOpen]);

//   // URL do Google Form (configurada)
//   /*   const GOOGLE_FORM_URL =
//     process.env.REACT_APP_GOOGLE_FORM_URL ||
//     "https://forms.gle/cK5rsEZ75nbTYgTj9"; */

//   const handleInscricaoSuccess = () => {
//     // Lógica adicional após sucesso
//     console.log("Inscrição realizada com sucesso!");
//   };

//   const formatCurrency = (value) => {
//     const number = Number(value || 0);

//     return number.toLocaleString("pt-BR", {
//       style: "currency",
//       currency: "BRL",
//     });
//   };

//   // Benefícios do evento
//   const benefits = [
//     { icon: "👕", title: "Camisa Oficial", desc: "Design exclusivo do evento" },
//     { icon: "🔢", title: "Número de Peito", desc: "Identificação única" },
//     { icon: "🥇", title: "Medalha Exclusiva", desc: "Lembrança especial" },
//     { icon: "🏆", title: "Pódios por Categoria", desc: "3 km e 5 km" },
//     { icon: "💆", title: "Massagem", desc: "Para os atletas pós-corrida" },
//     { icon: "❄️", title: "Piscina de Gelo", desc: "Recuperação profissional" },
//     { icon: "🎧", title: "DJ ao Vivo", desc: "Animando todo o evento" },
//     { icon: "☕", title: "Café da Manhã", desc: "Hidratação + refeição" },
//     { icon: "🎁", title: "Brindes Especiais", desc: "Sorteios e prêmios" },
//     { icon: "🛡️", title: "Seguro Atleta", desc: "Cobertura durante o evento" },
//   ];

//   //console.log("CONFIG:", config);

//   if (!config) {
//     return (
//       <LoadingScreen
//         error={configError}
//         onRetry={() => setRetryKey((valor) => valor + 1)}
//       />
//     );
//   }

//   /*   if (!config) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Carregando...
//       </div>
//     );
//   } */

//   /*Só quando a Home for redenriada utilizando
//    hoario local do navegador
//   */

//   const agora = new Date();

//   const converterDataHora = (data, hora) => {
//     if (!data || !hora) return null;

//     const [dia, mes, ano] = data.split("/").map(Number);
//     const [horas, minutos] = hora.split(":").map(Number);

//     if (!dia || !mes || !ano || horas == null || minutos == null) {
//       return null;
//     }

//     const dataHora = new Date(ano, mes - 1, dia, horas, minutos);

//     if (
//       dataHora.getFullYear() !== ano ||
//       dataHora.getMonth() !== mes - 1 ||
//       dataHora.getDate() !== dia
//     ) {
//       return null;
//     }

//     return dataHora;
//   };

//   const inicioRetirada = converterDataHora(
//     config.retiradaKit?.inicio,
//     config.retiradaKit?.horaInicio,
//   );

//   const fimRetirada = converterDataHora(
//     config.retiradaKit?.fim,
//     config.retiradaKit?.horaFim,
//   );

//   const retiradaKitLiberada =
//     inicioRetirada !== null &&
//     fimRetirada !== null &&
//     fimRetirada >= inicioRetirada &&
//     agora >= inicioRetirada &&
//     agora <= fimRetirada;

//   const acessoTermoLiberado =
//     config?.retiradaKit?.impressaoAntecipada === true || retiradaKitLiberada;

//   //const descontoLegal = Number(config?.descontos?.pcd || 50) / 100;

//   const descontoLegal = Number(config?.lote1?.descontos?.pcd || 0) / 100;

//   const descontoLegalAtivo = config?.beneficios?.descontoPcdTea60Ativo ?? true;

//   const getDataEvento = () => {
//     if (!config?.evento?.data) {
//       return {
//         dia: "--",
//         mes: "",
//         ano: "",
//       };
//     }

//     const [dia, mes, ano] = config.evento.data.split("/");

//     const meses = {
//       "01": "Janeiro",
//       "02": "Fevereiro",
//       "03": "Março",
//       "04": "Abril",
//       "05": "Maio",
//       "06": "Junho",
//       "07": "Julho",
//       "08": "Agosto",
//       "09": "Setembro",
//       10: "Outubro",
//       11: "Novembro",
//       12: "Dezembro",
//     };

//     return {
//       dia,
//       mes: meses[mes] || "",
//       ano,
//     };
//   };

//   const dataEvento = getDataEvento();

//   const kitsEvento = [
//     {
//       tipo: "KIT COMPLETO",
//       ativo: config?.kits?.kitCompleto?.ativo === true,
//       titulo: config?.kits?.kitCompleto?.nome || "Kit Completo",
//       destaque: config?.kits?.kitCompleto?.destaque || "",
//       itens: config?.kits?.kitCompleto?.itens || [],
//       beneficios: config?.kits?.kitCompleto?.beneficios || [],
//     },

//     {
//       tipo: "MEIO KIT",
//       ativo: config?.kits?.meioKit?.ativo === true,
//       titulo: config?.kits?.meioKit?.nome || "Meio Kit",
//       destaque: config?.kits?.meioKit?.destaque || "",
//       itens: config?.kits?.meioKit?.itens || [],
//       beneficios: config?.kits?.meioKit?.beneficios || [],
//     },

//     {
//       tipo: "LANCHE",
//       ativo: config?.kits?.lanche?.ativo === true,
//       titulo: config?.kits?.lanche?.nome || "Kit Lanche",
//       destaque: config?.kits?.lanche?.destaque || "",
//       itens: config?.kits?.lanche?.itens || [],
//       beneficios: config?.kits?.lanche?.beneficios || [],
//     },
//   ];

//   // NOVO
//   const lotes = [
//     {
//       visivel: config?.lote1?.visivel,

//       status:
//         config?.loteAtual === 1
//           ? "ATUAL"
//           : config?.loteAtual === 2
//             ? "BLOQUEADO"
//             : "FUTURO",

//       numero: 1,
//       titulo: "LOTE 1",

//       inicio: config.lote1?.inicio,
//       fim: config.lote1?.fim,

//       bgClass: "from-pink-400 to-pink-500",
//       textClass: "text-pink-100",
//       brandText: "text-pink-600",

//       kits: [
//         {
//           tipo: "KIT COMPLETO",
//           ativo: config?.kits?.kitCompleto?.ativo === true,
//           nome: "KIT COMPLETO",
//           pix: config.lote1?.kitCompletoPix,
//           cartao: config.lote1?.kitCompletoCartao,
//         },
//         {
//           tipo: "MEIO KIT",
//           ativo: config?.kits?.meioKit?.ativo === true,
//           nome: "MEIO KIT",
//           pix: config.lote1?.meioKitPix,
//           cartao: config.lote1?.meioKitCartao,
//         },
//       ],
//     },

//     {
//       visivel: config?.lote2?.visivel,

//       status:
//         config?.loteAtual === 2
//           ? "ATUAL"
//           : config?.loteAtual === 1
//             ? "BLOQUEADO"
//             : "FUTURO",

//       numero: 2,
//       titulo: "LOTE 2",

//       inicio: config.lote2?.inicio,
//       fim: config.lote2?.fim,

//       bgClass: "from-purple-400 to-purple-500",
//       textClass: "text-purple-100",
//       brandText: "text-purple-600",

//       kits: [
//         {
//           tipo: "KIT COMPLETO",
//           ativo: config?.kits?.kitCompleto?.ativo === true,
//           nome: "KIT COMPLETO",
//           pix: config.lote2?.kitCompletoPix,
//           cartao: config.lote2?.kitCompletoCartao,
//         },
//         {
//           tipo: "MEIO KIT",
//           ativo: config?.kits?.meioKit?.ativo === true,
//           nome: "MEIO KIT",
//           pix: config.lote2?.meioKitPix,
//           cartao: config.lote2?.meioKitCartao,
//         },
//       ],
//     },
//   ].filter((lote) => lote.visivel);

//   // NOVO
//   const apenasUmLote = lotes.length === 1;

//   // Retorna os preços do kit considerando apenas o lote atual
//   const obterPrecoKit = (tipoKit) => {
//     const loteAtual = lotes.find((lote) => lote.status === "ATUAL");

//     if (!loteAtual) {
//       return {
//         pix: null,
//         cartao: null,
//       };
//     }

//     const kit = loteAtual.kits.find((k) => k.tipo === tipoKit);

//     return (
//       kit || {
//         pix: null,
//         cartao: null,
//       }
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
//       {/* Header com Logo */}
//       <Header />

//       {/* Hero Banner Melhorado */}
//       <div className="relative h-96 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-200 overflow-hidden flex items-center justify-center shadow-lg">
//         <div className="absolute inset-0 opacity-20">
//           <div
//             className="absolute top-10 left-10 text-6xl animate-bounce"
//             style={{ animationDelay: "0s" }}
//           ></div>
//           <div
//             className="absolute top-20 right-20 text-5xl animate-bounce"
//             style={{ animationDelay: "0.2s" }}
//           ></div>
//           <div
//             className="absolute bottom-10 left-1/4 text-5xl animate-bounce"
//             style={{ animationDelay: "0.4s" }}
//           ></div>
//         </div>
//         <div className="relative text-center px-4 z-10">
//           <img
//             src="/logoEntreAmigas.webp"
//             alt="Entre Amigas Logo"
//             className="h-64 md:h80 w-auto mx-auto drop-shadow-2xl"
//             title="Entre Amigas - Corrida de Mulheres"
//           />
//           <p className="text-xl md:text-2xl text-white drop-shadow-md font-semibold -mt-6 -translate-y-2">
//             6ª Edição • Celebrando Amizade, Saúde e Superação 💖
//           </p>
//         </div>
//       </div>

//       {/* Contagem regressiva para a largada */}
//       {contagemRegressiva && (
//         <section className="relative overflow-hidden bg-gradient-to-br from-[#3B123F] via-purple-800 to-pink-700 px-4 py-10 text-white shadow-lg md:py-14">
//           <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />

//           <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-8 md:p-10">
//             <div className="text-center">
//               <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-100 sm:text-sm">
//                 {contagemRegressiva.iniciada
//                   ? "Chegou o grande dia"
//                   : "Falta pouco para a largada"}
//               </p>
//               <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl md:text-4xl">
//                 {contagemRegressiva.iniciada
//                   ? "A nossa corrida começou!"
//                   : "A contagem regressiva já começou!"}
//               </h2>
//               <p className="mt-2 text-sm text-purple-100 sm:text-base">
//                 Preparem os tênis, reúnam os amigos e venham viver este momento!
//               </p>
//             </div>

//             {!contagemRegressiva.iniciada ? (
//               <div className="mx-auto mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
//                 {[
//                   { valor: contagemRegressiva.dias, rotulo: "Dias" },
//                   { valor: contagemRegressiva.horas, rotulo: "Horas" },
//                   { valor: contagemRegressiva.minutos, rotulo: "Minutos" },
//                   { valor: contagemRegressiva.segundos, rotulo: "Segundos" },
//                 ].map((item) => (
//                   <div
//                     key={item.rotulo}
//                     className="rounded-2xl border border-white/20 bg-white/15 px-3 py-4 text-center shadow-inner sm:py-5"
//                   >
//                     <p className="text-4xl font-extrabold tabular-nums sm:text-5xl md:text-6xl">
//                       {String(item.valor).padStart(2, "0")}
//                     </p>
//                     <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-100 sm:text-sm">
//                       {item.rotulo}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="mt-7 rounded-2xl border border-white/20 bg-white/15 px-4 py-6 text-center">
//                 <p className="text-2xl font-bold sm:text-3xl">
//                   🏁 Boa corrida, Entre Amigas Run!
//                 </p>
//                 <p className="mt-2 text-sm text-purple-100">
//                   Que seja um dia de alegria, amizade e superação.
//                 </p>
//               </div>
//             )}

//             <div className="mt-7 flex flex-col items-center justify-center gap-3 text-center text-sm text-purple-50 sm:flex-row sm:gap-7 sm:text-base">
//               <p className="flex items-center gap-2">
//                 <span aria-hidden="true">📅</span>
//                 {config?.evento?.data || "Data a definir"}
//               </p>
//               <p className="flex items-center gap-2">
//                 <span aria-hidden="true">⏰</span>
//                 Largada às {config?.evento?.largada || "A definir"}
//               </p>
//               <p className="flex items-center gap-2">
//                 <span aria-hidden="true">📍</span>
//                 {config?.evento?.local || "Local a definir"}
//               </p>
//             </div>
//             {config?.evento?.localComplemento && (
//               <p className="mt-2 text-center text-xs text-purple-100">
//                 {config.evento.localComplemento}
//               </p>
//             )}
//           </div>
//         </section>
//       )}

//       {/* Banner de Divulgação - Prepare-se */}
//       <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 shadow-lg">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 drop-shadow-lg">
//             ✨ Prepare-se para viver uma experiência incrível! ✨
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//             {benefits.map((benefit, idx) => (
//               <div
//                 key={idx}
//                 className="text-center transform transition hover:scale-110"
//               >
//                 <div className="text-4xl md:text-5xl mb-2">{benefit.icon}</div>
//                 <p className="font-bold text-sm md:text-base drop-shadow">
//                   {benefit.title}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <div className="text-center">
//             <p className="text-lg md:text-xl font-semibold drop-shadow">
//               🎁 Brindes, sorteios e muito mais te esperando! 🎁
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* AVISO IMPORTANTE DO EVENTO */}
//       {config?.avisoEvento?.ativo === true && (
//         <section className="bg-white px-4 py-5 md:py-6">
//           <div className="mx-auto max-w-6xl">
//             <div className="rounded-2xl border border-purple-200 bg-[#F5F0FF] p-5 shadow-sm md:p-6">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
//                   <span className="text-xl" aria-hidden="true">
//                     📢
//                   </span>
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <h2 className="text-lg font-bold uppercase tracking-wide text-purple-800">
//                     AVISO IMPORTANTE
//                     {config.avisoEvento.titulo
//                       ? ` — ${config.avisoEvento.titulo}`
//                       : ""}
//                   </h2>

//                   {config.avisoEvento.texto && (
//                     <p className="mt-4 text-sm leading-relaxed text-purple-950 md:text-base">
//                       {config.avisoEvento.texto}
//                     </p>
//                   )}

//                   {config.avisoEvento.descricao && (
//                     <p className="mt-3 text-sm leading-relaxed text-purple-950 md:text-base">
//                       {config.avisoEvento.descricao}
//                     </p>
//                   )}

//                   <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
//                     <div className="rounded-xl bg-purple-200/70 p-3">
//                       <div className="flex items-center gap-2 text-sm font-medium text-purple-800">
//                         <span aria-hidden="true">☀️</span>
//                         <span>Concentração</span>
//                       </div>
//                       <p className="mt-1 text-xl font-bold text-purple-900">
//                         {config.avisoEvento.concentracao || "A definir"}
//                       </p>
//                     </div>

//                     <div className="rounded-xl bg-purple-200/70 p-3">
//                       <div className="flex items-center gap-2 text-sm font-medium text-purple-800">
//                         <span aria-hidden="true">🏃‍♀️</span>
//                         <span>Largada</span>
//                       </div>
//                       <p className="mt-1 text-xl font-bold text-purple-900">
//                         {config.avisoEvento.largada || "A definir"}
//                       </p>
//                     </div>
//                   </div>

//                   {config.avisoEvento.rodape && (
//                     <p className="mt-4 text-sm font-medium text-purple-800">
//                       {config.avisoEvento.rodape}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* =========================================================
//           BANNER — RETIRADA DE KIT
//           Exibido somente quando liberado pela configuração
//           ========================================================= */}

//       {config?.retiradaKitParticipante === true && (
//         <section id="retirada-kit" className="bg-white py-8 scroll-mt-24">
//           <div className="max-w-6xl mx-auto px-4">
//             <div
//               className="
//                 relative
//                 overflow-hidden
//                 rounded-3xl
//                 bg-gradient-to-r
//                 from-purple-700
//                 via-fuchsia-600
//                 to-pink-500
//                 p-6
//                 md:p-8
//                 shadow-lg
//               "
//             >
//               {/* Decoração */}
//               <div
//                 className="
//                   absolute
//                   -right-10
//                   -top-10
//                   h-32
//                   w-32
//                   rounded-full
//                   bg-white/10
//                 "
//               />

//               <div
//                 className="
//                   absolute
//                   -bottom-12
//                   -left-8
//                   h-32
//                   w-32
//                   rounded-full
//                   bg-white/10
//                 "
//               />

//               <div
//                 className="
//                   relative
//                   grid
//                   grid-cols-1
//                   gap-6
//                   md:grid-cols-[minmax(0,1fr)_auto]
//                   md:items-center
//                 "
//               >
//                 {/* Texto */}
//                 <div className="text-white">
//                   <div
//                     className="
//                       mb-2
//                       flex
//                       items-center
//                       gap-2
//                       text-sm
//                       font-semibold
//                       uppercase
//                       tracking-wide
//                       text-white/90
//                     "
//                   >
//                     <span>🎽</span>

//                     <span>Retirada de Kit</span>
//                   </div>

//                   <h2
//                     className="
//                       text-2xl
//                       md:text-3xl
//                       font-extrabold
//                     "
//                   >
//                     Seu Termo de Retirada está disponível
//                   </h2>

//                   <p
//                     className="
//                       mt-2
//                       max-w-2xl
//                       text-sm
//                       md:text-base
//                       text-white/90
//                     "
//                   >
//                     Acesse com seu número de CPF para consultar e imprimir seu
//                     Termo de Retirada de Kit. Lembre-se de assinar o documento.
//                   </p>

//                   {/* =================================================
//                       AVISO DE DATAS (INÍCIO E FIM)
//                       Efeito "Glassmorphism" adaptado ao tema
//                       ================================================= */}
//                   {/* =================================================
//                       PERÍODO PARA RETIRADA DO KIT
//                       ================================================= */}

//                   <div className="mt-5 w-full max-w-2xl">
//                     <div
//                       className="
//                         mb-2
//                         text-xs
//                         font-bold
//                         uppercase
//                         tracking-wide
//                         text-white/80
//                       "
//                     >
//                       Período para retirada do kit
//                     </div>

//                     <div
//                       className="
//                         grid
//                         grid-cols-1
//                         gap-3
//                         sm:grid-cols-2
//                       "
//                     >
//                       {/* =============================================
//                           INÍCIO
//                           ============================================= */}

//                       <div
//                         className="
//                           flex
//                           items-center
//                           gap-3
//                           rounded-xl
//                           border
//                           border-white/20
//                           bg-white/10
//                           px-4
//                           py-3
//                           backdrop-blur-sm
//                         "
//                       >
//                         <span
//                           className="
//                             flex
//                             h-9
//                             w-9
//                             shrink-0
//                             items-center
//                             justify-center
//                             rounded-lg
//                             bg-white/15
//                             text-lg
//                           "
//                           aria-hidden="true"
//                         >
//                           📅
//                         </span>

//                         <div className="min-w-0">
//                           <div
//                             className="
//                               text-[10px]
//                               font-bold
//                               uppercase
//                               tracking-wider
//                               text-white/70
//                             "
//                           >
//                             Início da retirada
//                           </div>

//                           <div
//                             className="
//                               mt-0.5
//                               text-sm
//                               font-bold
//                               text-white
//                             "
//                           >
//                             <div>
//                               {config?.retiradaKit?.inicio || "A definir"}
//                             </div>

//                             <div className="mt-0.5 text-xs font-semibold text-white/90">
//                               Das {config?.retiradaKit?.horaInicio || "--:--"}{" "}
//                               às {config?.retiradaKit?.horaFim || "--:--"}
//                             </div>
//                             {/* {config?.retiradaKit?.inicio || "A definir"} */}
//                             {/* <span className="mx-1 text-white/60">às</span> */}
//                             {/* {config?.retiradaKit?.horaInicio || "--:--"} */}
//                           </div>
//                         </div>
//                       </div>

//                       {/* =============================================
//                           FIM
//                           ============================================= */}

//                       <div
//                         className="
//                           flex
//                           items-center
//                           gap-3
//                           rounded-xl
//                           border
//                           border-white/20
//                           bg-white/10
//                           px-4
//                           py-3
//                           backdrop-blur-sm
//                         "
//                       >
//                         <span
//                           className="
//                             flex
//                             h-9
//                             w-9
//                             shrink-0
//                             items-center
//                             justify-center
//                             rounded-lg
//                             bg-white/15
//                             text-lg
//                           "
//                           aria-hidden="true"
//                         >
//                           🏁
//                         </span>

//                         <div className="min-w-0">
//                           <div
//                             className="
//                               text-[10px]
//                               font-bold
//                               uppercase
//                               tracking-wider
//                               text-white/70
//                             "
//                           >
//                             Fim da retirada
//                           </div>

//                           <div
//                             className="
//                               mt-0.5
//                               text-sm
//                               font-bold
//                               text-white
//                             "
//                           >
//                             <div>{config?.retiradaKit?.fim || "A definir"}</div>

//                             <div className="mt-0.5 text-xs font-semibold text-white/90">
//                               Das {config?.retiradaKit?.horaInicio || "--:--"}{" "}
//                               às {config?.retiradaKit?.horaFim || "--:--"}
//                             </div>
//                             {/*  {config?.retiradaKit?.fim || "A definir"}
//                             <span className="mx-1 text-white/60">às</span>
//                             {config?.retiradaKit?.horaFim || "--:--"} */}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Botão */}
//                 <button
//                   type="button"
//                   onClick={() => navigate("/retirada-kit")}
//                   disabled={!acessoTermoLiberado}
//                   className={`
//                     relative inline-flex shrink-0 items-center justify-center gap-2
//                     rounded-xl px-6 py-3 font-bold shadow-md transition
//                     ${
//                       acessoTermoLiberado
//                         ? "bg-white text-purple-700 hover:scale-[1.02] hover:bg-gray-50"
//                         : "cursor-not-allowed bg-gray-200 text-gray-500 opacity-80"
//                     }
//                   `}
//                   title={
//                     acessoTermoLiberado
//                       ? "Acessar Termo"
//                       : "O acesso estará disponível durante o período de retirada"
//                   }
//                 >
//                   <span>📄</span>

//                   <span>Acessar Termo</span>
//                 </button>

//                 {/* AVISO DE DOCUMENTOS PARA RETIRADA */}
//                 {config?.retiradaKit?.avisoDocumentos?.trim() &&
//                   (() => {
//                     const partes = config.retiradaKit.avisoDocumentos
//                       .split("|")
//                       .map((parte) => parte.trim());

//                     const [
//                       titulo,
//                       introducao,
//                       tituloProprio,
//                       textoProprio,
//                       tituloTerceiro,
//                       textoTerceiro,
//                       tituloValidacao,
//                       textoFinal,
//                     ] = partes;

//                     const secoes = [
//                       {
//                         titulo: tituloProprio,
//                         texto: textoProprio,
//                         icone: "👤",
//                       },
//                       {
//                         titulo: tituloTerceiro,
//                         texto: textoTerceiro,
//                         icone: "👥",
//                       },
//                       {
//                         titulo: tituloValidacao,
//                         texto: textoFinal,
//                         icone: "🛡️",
//                       },
//                     ];

//                     return (
//                       <div
//                         /*                         className="mt-5 w-full max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm"
//                         role="note"
//                         aria-label="Orientações para retirada do kit" */
//                         className="w-full min-w-0 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm md:col-span-2"
//                       >
//                         <h3 className="flex items-center gap-2 font-bold text-amber-800">
//                           <span aria-hidden="true">⚠️</span>
//                           {titulo}
//                         </h3>

//                         {introducao && (
//                           <p className="mt-3 text-sm leading-relaxed text-amber-900">
//                             {introducao}
//                           </p>
//                         )}

//                         {secoes.map((secao, indice) => (
//                           <div
//                             key={`${indice}-${secao.titulo}`}
//                             className="mt-4 border-t border-amber-300 pt-4"
//                           >
//                             <h4 className="flex items-start gap-2 text-sm font-semibold text-gray-900">
//                               <span aria-hidden="true">{secao.icone}</span>
//                               <span>{secao.titulo}</span>
//                             </h4>

//                             {secao.texto && (
//                               <p className="mt-2 pl-6 text-sm leading-relaxed text-gray-800">
//                                 {secao.texto}
//                               </p>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     );
//                   })()}

//                 {/* COMUNICADO PRINCIPAL — PRAZO E RESPONSABILIDADE PELA RETIRADA
//                     Permanece dentro da condição config?.retiradaKitParticipante. */}
//                 <div
//                   role="note"
//                   aria-label="Comunicado importante sobre a retirada dos kits"
//                   className="
//                     md:col-span-2
//                     rounded-xl
//                     border-2
//                     border-amber-400
//                     bg-amber-50
//                     p-4
//                     shadow-sm
//                     md:p-5
//                   "
//                 >
//                   <div className="flex flex-wrap items-center justify-between gap-2">
//                     <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-amber-900 md:text-base">
//                       <span aria-hidden="true">📢</span>
//                       Atenção, participantes!
//                     </h3>

//                     <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
//                       Comunicado importante
//                     </span>
//                   </div>

//                   <h4 className="mt-3 text-lg font-bold text-amber-800 md:text-xl">
//                     Ainda não retirou seu kit?
//                   </h4>

//                   <p className="mt-2 text-sm leading-relaxed text-amber-950 md:text-base">
//                     A retirada dos kits deverá ser realizada exclusivamente nas
//                     datas, horários e locais divulgados pela organização.
//                   </p>

//                   <p className="mt-2 text-sm leading-relaxed text-amber-950 md:text-base">
//                     É de responsabilidade do participante realizar a retirada
//                     dentro do prazo estabelecido, não sendo obrigação da
//                     organização entrar em contato individualmente para lembrar
//                     ou solicitar o comparecimento dos atletas.
//                   </p>

//                   <div className="mt-4 border-t border-amber-400 pt-3">
//                     <h5 className="text-sm font-extrabold text-amber-900 md:text-base">
//                       Fique atento!
//                     </h5>

//                     <p className="mt-2 text-sm leading-relaxed text-amber-950 md:text-base">
//                       Após o encerramento do período de retirada, não haverá
//                       garantia de entrega ou retirada posterior, ficando
//                       qualquer possibilidade sujeita à disponibilidade e
//                       confirmação da organização, respeitados os direitos
//                       previstos na legislação vigente.
//                     </p>

//                     <p className="mt-3 text-xs text-amber-900 md:text-sm">
//                       Consulte as condições completas no Termo de Retirada de
//                       Kit.
//                     </p>
//                   </div>
//                 </div>

//                 {/* AVISO EXPRESSO — NÃO HAVERÁ ENTREGA NO DIA DA CORRIDA
//                     Usa a mesma configuração do Termo de Retirada. */}
//                 <div
//                   role="note"
//                   aria-label="Aviso: não haverá entrega de kits no dia da corrida"
//                   className="
//                     md:col-span-2
//                     flex
//                     items-start
//                     gap-3
//                     rounded-xl
//                     border-2
//                     border-red-300
//                     bg-red-50
//                     p-4
//                     shadow-sm
//                     md:p-5
//                   "
//                 >
//                   <span
//                     aria-hidden="true"
//                     className="
//                       flex
//                       h-10
//                       w-10
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-red-100
//                       text-2xl
//                     "
//                   >
//                     ⚠️
//                   </span>

//                   <div className="min-w-0">
//                     <h3 className="text-base font-extrabold uppercase tracking-wide text-red-800 md:text-lg">
//                       Atenção: não haverá entrega de kits no dia da corrida
//                     </h3>

//                     <p className="mt-2 text-sm leading-relaxed text-red-900 md:text-base">
//                       A organização não realizará, em nenhuma hipótese, a
//                       entrega de kits no dia da corrida. Todos os participantes
//                       deverão retirar seus kits exclusivamente nas datas,
//                       horários e locais previamente divulgados pela organização.
//                     </p>

//                     <p className="mt-2 text-sm font-bold leading-relaxed text-red-800 md:text-base">
//                       Programe-se e não deixe a retirada do seu kit para o dia
//                       do evento.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}
//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
//         {/* About Section */}
//         <section id="sobre" className="bg-white rounded-lg shadow-md p-8">
//           <h2 className="text-3xl font-bold text-pink-600 mb-4">
//             O que é Entre Amigas?
//           </h2>
//           <p className="text-lg text-gray-700 leading-relaxed">
//             🌸 A Corrida Entre Amigas é mais do que um evento esportivo é um
//             encontro de pessoas que acreditam na força da amizade, na saúde e no
//             poder de se superar. Venha viver essa experiência inesquecível!{" "}
//             <strong>
//               Corra, caminhe, sorria e celebre conosco a força da amizade!
//             </strong>
//           </p>
//           <p className="text-lg text-purple-700 font-semibold mt-4">
//             Entre Amigas, toda corrida tem mais significado. 💕
//           </p>
//         </section>

//         {/* Event Details */}
//         <section id="eventos" className="space-y-6">
//           <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">
//             📋 Informações do Evento
//           </h2>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg shadow-lg p-8 border-l-4 border-pink-500 transform transition hover:scale-105">
//               <h3 className="text-3xl font-bold text-pink-600 mb-3">📅 Data</h3>
//               <p className="text-2xl font-semibold text-gray-800">
//                 {dataEvento.dia} de {dataEvento.mes} de {dataEvento.ano}
//               </p>
//               {/* <p className="text-lg text-gray-700">{dataEvento.ano}</p> */}
//               <p className="text-sm text-gray-600 mt-2">Dia memorável!</p>
//             </div>

//             <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500 transform transition hover:scale-105">
//               <h3 className="text-3xl font-bold text-purple-600 mb-3">
//                 📍 Local
//               </h3>
//               <p className="text-2xl font-semibold text-gray-800">
//                 {config?.evento?.local}
//               </p>
//               <p className="text-lg text-gray-700">
//                 {config?.evento?.localComplemento}
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-lg p-6 border-l-4 border-rose-500 transform transition hover:scale-105">
//               <h3 className="text-2xl font-bold text-rose-600 mb-3">
//                 ⏰ Largada
//               </h3>
//               <p className="text-3xl font-bold text-gray-800">
//                 {config?.evento?.largada} Manhã
//               </p>
//               {/* <p className="text-gray-700">horas (matutino)</p> */}
//               <p className="text-sm text-gray-600 mt-2">
//                 Chegar com antecedência! Concentração:{" "}
//                 {config?.evento?.concentracao}
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 transform transition hover:scale-105">
//               <h3 className="text-2xl font-bold text-blue-600 mb-3">
//                 🏁 Distâncias
//               </h3>
//               {/* <p className="text-lg font-semibold text-gray-800">
//                 📏 <strong>3 km</strong>
//               </p>
//               <p className="text-gray-700 text-sm mb-2">Para mulheres</p> */}
//               <p className="text-lg font-semibold text-gray-800">
//                 📏{" "}
//                 <strong>
//                   {config?.evento?.distanciaPrincipal}{" "}
//                   {config?.evento?.distanciaPrincipalDesc}
//                 </strong>
//               </p>
//               {/* <p className="text-gray-700 text-sm">
//                 {config?.evento?.distanciaPrincipalDesc}
//               </p> */}
//               <p className="text-gray-700 text-sm mt-2">
//                 OBS: {config?.evento?.observacao}
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 transform transition hover:scale-105">
//               <h3 className="text-2xl font-bold text-indigo-600 mb-3">
//                 🎽 Categorias
//               </h3>
//               <p className="text-lg font-semibold text-gray-800">
//                 👩 {config?.evento?.categoria1}
//               </p>
//               <p className="text-gray-700 text-sm mb-2">
//                 {config?.evento?.categoria1Desc}
//               </p>
//               <p className="text-lg font-semibold text-gray-800">
//                 👨 {config?.evento?.categoria2}
//               </p>
//               <p className="text-gray-700 text-sm">
//                 {config?.evento?.categoria2Desc}
//               </p>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-lg p-8 border-l-4 border-yellow-500 transform transition hover:scale-105">
//             <h3 className="text-3xl font-bold text-yellow-600 mb-3">
//               🏆 Premiação
//             </h3>
//             <p className="text-lg text-gray-800 font-semibold">
//               {config?.evento?.premiacao}{" "}
//               {/*Troféus para os 3 primeiros colocados em cada categoria */}
//             </p>
//             <p className="text-gray-700 mt-3">
//               {config?.evento?.premiacaoObs}
//               {/* Além de brindes especiais para todos os participantes! */}
//             </p>
//           </div>
//         </section>

//         {/* Kit e Pagamento */}
//         {isInscriptionOpen && (
//           <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
//             <h2 className="text-4xl font-extrabold text-center mb-3">
//               🎁 Escolha seu Kit
//             </h2>
//             <p className="text-center text-pink-100 text-lg max-w-3xl mx-auto mb-3">
//               Participe da <strong>6ª Corrida Entre Amigas RUN</strong> da forma
//               que melhor combina com você.
//             </p>
//             <p className="text-center text-pink-200 text-sm mb-10">
//               Todos os kits incluem uma experiência preparada com carinho,
//               organização e segurança.
//             </p>
//             <div
//               className={`grid gap-8 ${
//                 kitsEvento.filter((kit) => kit.ativo).length === 1
//                   ? "grid-cols-1 max-w-md mx-auto"
//                   : kitsEvento.filter((kit) => kit.ativo).length === 2
//                     ? "md:grid-cols-2 max-w-5xl mx-auto"
//                     : "lg:grid-cols-3"
//               }`}
//             >
//               {kitsEvento
//                 .filter((kit) => kit.ativo)
//                 .map((kit) => (
//                   <div
//                     key={kit.titulo}
//                     className="
//                     bg-white
//                     text-gray-800
//                     rounded-3xl
//                     shadow-xl
//                     border
//                     border-pink-300
//                     p-6
//                     flex
//                     flex-col
//                     transition-all
//                     duration-300
//                     hover:-translate-y-2
//                     hover:shadow-2xl
//                     "
//                     // className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 flex flex-col"
//                   >
//                     {/* <h3 className="text-2xl font-extrabold text-pink-600 mb-2"> */}
//                     <h3 className="text-2xl font-black text-pink-600 mb-2 leading-tight">
//                       {kit.titulo}
//                     </h3>

//                     <div className="mb-4">
//                       {kit.tipo === "KIT COMPLETO" && (
//                         <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
//                           ⭐ MAIS ESCOLHIDO
//                         </span>
//                       )}

//                       {kit.tipo === "MEIO KIT" && (
//                         <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
//                           💜 Melhor custo-benefício
//                         </span>
//                       )}

//                       {kit.tipo === "LANCHE" && (
//                         <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
//                           ☕ Participação
//                         </span>
//                       )}
//                     </div>

//                     <p className="text-gray-500 text-sm leading-relaxed mb-5">
//                       {kit.destaque}
//                     </p>

//                     {(() => {
//                       const preco = obterPrecoKit(kit.tipo);

//                       return (
//                         <>
//                           {preco.pix && (
//                             <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-5 mb-6">
//                               <p className="text-xs uppercase tracking-widest text-gray-500 text-center">
//                                 A partir de
//                               </p>

//                               <h3 className="text-5xl font-black text-pink-600 text-center mt-1">
//                                 {formatCurrency(preco.pix)}
//                               </h3>

//                               {preco.cartao && (
//                                 <p className="text-center text-gray-600 mt-2">
//                                   💳 Cartão:
//                                   <strong className="text-purple-700 ml-1">
//                                     {formatCurrency(preco.cartao)}
//                                   </strong>
//                                 </p>
//                               )}
//                             </div>
//                           )}
//                         </>
//                       );
//                     })()}

//                     <div className="bg-gray-50 rounded-xl p-4 mb-5">
//                       <h4 className="font-bold text-purple-600 mb-3">
//                         ✔ Você recebe
//                       </h4>

//                       <ul className="space-y-2">
//                         {kit.itens.map((item) => (
//                           <li
//                             key={item}
//                             className="flex items-center gap-2 text-gray-700"
//                           >
//                             <span className="text-green-500 font-bold">✓</span>
//                             <span>{item}</span>
//                           </li>
//                           // <li key={item}>{item}</li>
//                         ))}
//                       </ul>
//                     </div>

//                     {kit.beneficios.length > 0 && (
//                       <div className="bg-pink-50 rounded-xl p-4 mt-4">
//                         <h4 className="font-bold text-purple-600 mb-3">
//                           💜 Além disso você aproveita
//                         </h4>

//                         <ul className="space-y-2">
//                           {kit.beneficios.map((item) => (
//                             <li
//                               key={item}
//                               className="flex items-center gap-2 text-gray-700"
//                             >
//                               <span className="text-pink-500">❤</span>
//                               <span>{item}</span>
//                             </li>
//                             // <li key={item}>{item}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     <div className="mt-auto pt-6">
//                       <button
//                         /* onClick={tryOpenInscricaoModal} */
//                         onClick={() => tryOpenInscricaoModal(null, kit.tipo)}
//                         disabled={!isInscriptionOpen}
//                         className={`
//                           w-full
//                           py-3
//                           rounded-xl
//                           font-bold
//                           text-lg
//                           transition-all
//                           duration-300
//                           ${
//                             isInscriptionOpen
//                               ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-xl"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           }
//                         `}
//                       >
//                         {isInscriptionOpen
//                           ? "💖 Quero este Kit"
//                           : "⏳ Inscrições Encerradas"}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//             <div className="mt-10 bg-white/10 rounded-2xl border border-white/20 p-8">
//               <h3 className="text-2xl font-bold text-center mb-6">
//                 ⚠️ Segurança e Organização em Primeiro Lugar
//               </h3>

//               <div className="grid md:grid-cols-2 gap-5">
//                 <div className="flex items-start gap-3">
//                   <span className="text-2xl">🛡️</span>
//                   <div>
//                     <strong>Seguro Atleta</strong>
//                     <p className="text-sm text-pink-100">
//                       Cobertura para os participantes inscritos.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <span className="text-2xl">🚑</span>
//                   <div>
//                     <strong>Ambulância</strong>
//                     <p className="text-sm text-pink-100">
//                       Equipe preparada durante o evento.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <span className="text-2xl">🏍️</span>
//                   <div>
//                     <strong>Apoio no Percurso</strong>
//                     <p className="text-sm text-pink-100">
//                       Apoio operacional durante toda a prova.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <span className="text-2xl">🎧</span>
//                   <div>
//                     <strong>DJ</strong>
//                     <p className="text-sm text-pink-100">
//                       Música e animação durante todo o evento.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <span className="text-2xl">✅</span>
//                   <div>
//                     <strong>Evento Regularizado</strong>
//                     <p className="text-sm text-pink-100">
//                       Autorizado pelos órgãos competentes.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="border-t border-white/30 my-10"></div>
//             {/* {exibirKitExtras && <KitExtrasSection />} */}{" "}
//             {/*🎯 Outras opções de participação*/}
//           </section>
//         )}

//         {/* Inscrição CTA */}
//         <section className="text-center space-y-6">
//           <div>
//             <p className="text-2xl text-gray-700 mb-4">
//               Pronto(a) para fazer parte dessa história?
//             </p>
//             {!isInscriptionOpen ? (
//               <div className="bg-red-50 rounded-lg p-8 border-2 border-red-300 mb-4 mx-auto max-w-md">
//                 <p className="text-2xl font-bold text-red-600 mb-2">
//                   ⏰ Em Breve!
//                 </p>
//                 <p className="text-gray-700 mb-3">
//                   As inscrições estão encerradas no momento.
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Acompanhe nossas redes sociais para novas edições. 💕
//                 </p>
//               </div>
//             ) : (
//               <button
//                 onClick={() => tryOpenInscricaoModal()}
//                 className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform transition hover:scale-105"
//               >
//                 🏃‍♀️ Clique aqui. Se inscreva você também! 💕
//               </button>
//             )}
//           </div>
//         </section>
//         {/* Lotes de Inscrição */}
//         {isInscriptionOpen && (
//           <div className="relative bg-gradient-to-b from-white to-pink-50 py-12 shadow-lg">
//             <div className="max-w-6xl mx-auto px-4">
//               <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-600 mb-10 drop-shadow">
//                 💰 Valor da Inscrição
//               </h2>

//               {/* Validação Defensiva */}
//               {!config ? (
//                 <div className="w-full text-center py-8 text-gray-500">
//                   Carregando lotes vigentes...
//                 </div>
//               ) : (
//                 <div
//                   className={
//                     apenasUmLote
//                       ? "grid grid-cols-1 max-w-2xl mx-auto gap-6 mb-8"
//                       : "grid md:grid-cols-2 gap-6 mb-8"
//                   }
//                 >
//                   {lotes.map((lote) => (
//                     <div
//                       key={`lote-${lote.numero}`}
//                       className={`bg-gradient-to-br ${lote.bgClass} rounded-xl shadow-xl p-6 md:p-8 flex flex-col justify-between`}
//                     >
//                       <div>
//                         <h3 className="text-3xl font-bold text-white text-center mb-2 tracking-wide">
//                           {lote.titulo}
//                         </h3>
//                         <div className="flex justify-center mb-4">
//                           {lote.status === "ATUAL" && (
//                             <span
//                               className="
//                               bg-green-500
//                               text-white
//                               px-4
//                               py-1
//                               rounded-full
//                               text-xs
//                               font-bold
//                               uppercase
//                               tracking-wider
//                             "
//                             >
//                               🔥 Lote Atual
//                             </span>
//                           )}

//                           {lote.status === "FUTURO" && (
//                             <span
//                               className="
//                               bg-blue-500
//                               text-white
//                               px-4
//                               py-1
//                               rounded-full
//                               text-xs
//                               font-bold
//                               uppercase
//                               tracking-wider
//                             "
//                             >
//                               ⏳ Próximo Lote
//                             </span>
//                           )}

//                           {lote.status === "BLOQUEADO" && (
//                             <span
//                               className="
//                               bg-gray-500
//                               text-white
//                               px-4
//                               py-1
//                               rounded-full
//                               text-xs
//                               font-bold
//                               uppercase
//                               tracking-wider
//                             "
//                             >
//                               🔒 BLOQUEADO
//                             </span>
//                           )}
//                         </div>

//                         <p
//                           className={`text-center ${lote.textClass} text-sm font-medium mb-6`}
//                         >
//                           {lote.inicio || "Breve"} até {lote.fim || "Breve"}
//                         </p>

//                         <div className="space-y-6">
//                           {lote.kits
//                             .filter(
//                               (kit) =>
//                                 String(kit.ativo).toUpperCase() === "TRUE" ||
//                                 kit.ativo === true,
//                             )
//                             .map((kit) => {
//                               const pixValue = Number(kit.pix || 0);
//                               const cartaoValue = Number(kit.cartao || 0);

//                               return (
//                                 <div
//                                   key={`${lote.numero}-${kit.nome}`}
//                                   className="bg-white rounded-xl p-5 shadow-inner border border-gray-100"
//                                 >
//                                   {/* Bloco Inteiro */}
//                                   <h4
//                                     className={`font-black ${lote.brandText} text-xl mb-3 tracking-tight`}
//                                   >
//                                     {kit.nome}
//                                   </h4>

//                                   <div className="space-y-2 mb-4">
//                                     <div className="flex items-baseline justify-between text-gray-700">
//                                       <span className="font-medium text-sm">
//                                         PIX
//                                       </span>
//                                       <div className="flex-grow mx-2 border-b border-dashed border-gray-300"></div>
//                                       <strong className="text-gray-900 font-bold">
//                                         {formatCurrency(pixValue)}
//                                       </strong>
//                                     </div>
//                                     <div className="flex items-baseline justify-between text-gray-700">
//                                       <span className="font-medium text-sm">
//                                         Cartão
//                                       </span>
//                                       <div className="flex-grow mx-2 border-b border-dashed border-gray-300"></div>
//                                       <strong className="text-gray-900 font-bold">
//                                         {formatCurrency(cartaoValue)}
//                                       </strong>
//                                     </div>
//                                   </div>

//                                   {/* Divisor de Subseção Moderno */}
//                                   <div className="relative my-4">
//                                     <div className="absolute inset-0 flex items-center">
//                                       <div className="w-full border-t border-gray-200"></div>
//                                     </div>
//                                     <div className="relative flex justify-center text-xs uppercase">
//                                       <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">
//                                         Benefício Legal PCD / TEA / 60+
//                                       </span>
//                                     </div>
//                                   </div>

//                                   {/* Bloco 50% Meia Entrada (PCD / TEA / 60+) */}
//                                   <div className="flex items-center justify-between mb-3">
//                                     <div
//                                       className="flex gap-2 text-lg"
//                                       title="PCD, TEA e 60+"
//                                     >
//                                       <span>👨‍🦽</span>
//                                       <span>🧩</span>
//                                       <span>👵</span>
//                                     </div>

//                                     {descontoLegalAtivo ? (
//                                       <span
//                                         className="
//                                                 bg-green-100
//                                                 text-green-700
//                                                 font-bold
//                                                 text-xs
//                                                 px-2.5
//                                                 py-1
//                                                 rounded-full
//                                                 uppercase
//                                                 tracking-wider
//                                             "
//                                       >
//                                         {config?.lote1.descontos.pcd || 50}%
//                                         Desconto
//                                       </span>
//                                     ) : (
//                                       <span
//                                         className="
//                                                 bg-red-100
//                                                 text-red-700
//                                                 font-bold
//                                                 text-xs
//                                                 px-2.5
//                                                 py-1
//                                                 rounded-full
//                                                 uppercase
//                                                 tracking-wider
//                                             "
//                                       >
//                                         💳 VALOR INTEGRAL
//                                       </span>
//                                     )}
//                                     {/*🚫*/}
//                                   </div>

//                                   {descontoLegalAtivo ? (
//                                     <>
//                                       <div className="flex items-baseline justify-between">
//                                         <span>PIX (Meia)</span>

//                                         <div className="flex-grow mx-2 border-b border-dashed border-gray-200"></div>

//                                         <strong className="text-green-600 font-bold">
//                                           {formatCurrency(
//                                             pixValue * (1 - descontoLegal),
//                                           )}
//                                         </strong>
//                                       </div>

//                                       <div className="flex items-baseline justify-between">
//                                         <span>Cartão (Meia)</span>

//                                         <div className="flex-grow mx-2 border-b border-dashed border-gray-200"></div>

//                                         <strong className="text-green-600 font-bold">
//                                           {formatCurrency(
//                                             cartaoValue * (1 - descontoLegal),
//                                           )}
//                                         </strong>
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <div
//                                       className="
//                                               rounded-lg
//                                               border
//                                               border-red-200
//                                               bg-red-50
//                                               p-3
//                                               text-center
//                                           "
//                                     >
//                                       <p className="font-bold text-red-600">
//                                         O benefício legal para PCD • TEA • 60+
//                                         não está disponível neste momento.
//                                       </p>

//                                       <p className="text-xs text-gray-500 mt-1">
//                                         Inscrições continuam normalmente pelo
//                                         valor integral.
//                                       </p>
//                                     </div>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {isInscriptionOpen &&
//                 lotes.some((lote) => lote.status === "ATUAL") && (
//                   <div className="text-center bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300 flex flex-col items-center justify-center gap-4">
//                     <p className="text-lg font-semibold text-yellow-800">
//                       ⏰ Garanta sua inscrição no primeiro lote e economize! 💪
//                     </p>

//                     <button
//                       type="button"
//                       onClick={() => tryOpenInscricaoModal()}
//                       className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md transform transition hover:scale-105"
//                     >
//                       🏃‍♀️ Quero me Inscrever Agora! 💕
//                     </button>
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* Benefício Legal - PCD / TEA / 60+ */}
//         {descontoLegalAtivo && (
//           <section className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
//             <h3 className="text-2xl font-bold text-green-700 mb-5 flex items-center gap-2">
//               💜 Benefício Legal (60+, PCD e TEA)
//             </h3>

//             <div className="space-y-4 text-gray-700 leading-relaxed">
//               <p>
//                 Conforme a legislação vigente, participantes enquadrados nas
//                 categorias:
//               </p>

//               <ul className="list-disc ml-6 space-y-1">
//                 <li>Pessoa Idosa (60+)</li>
//                 <li>Pessoa com Deficiência (PCD)</li>
//                 <li>Pessoa com Transtorno do Espectro Autista (TEA)</li>
//               </ul>

//               <p>
//                 têm direito ao desconto legal de{" "}
//                 <strong className="text-green-700">
//                   {/* {config?.lote1?.descontos?.pcd || 50}*/}50% exclusivamente
//                   sobre o valor da inscrição no evento.
//                 </strong>
//               </p>

//               <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
//                 <p className="font-semibold text-amber-800">
//                   ⚠️ O desconto NÃO incide sobre os itens físicos do kit, tais
//                   como:
//                 </p>

//                 <ul className="list-disc ml-6 mt-2 space-y-1 text-amber-900">
//                   <li>Camisa oficial</li>
//                   <li>Medalha</li>
//                   <li>Número de peito</li>
//                   <li>Ecobag</li>
//                   <li>Viseira</li>
//                   <li>Demais brindes</li>
//                 </ul>
//               </div>

//               <p>Assim, o valor final é composto por:</p>

//               <ul className="list-disc ml-6 space-y-1">
//                 <li>
//                   Valor da inscrição (com possibilidade de desconto legal);
//                 </li>
//                 <li>Valor do kit escolhido (integral).</li>
//               </ul>

//               <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
//                 <p className="text-blue-800 font-medium">
//                   ℹ️ O valor atualizado da inscrição será apresentado
//                   automaticamente durante o preenchimento da inscrição, conforme
//                   o lote vigente.
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Modal de Inscrição */}
//         <InscricaoModal
//           key={`${showInscricaoModal}-${selectedKit}`}
//           isOpen={showInscricaoModal}
//           onClose={() => setShowInscricaoModal(false)}
//           selectedKit={selectedKit}
//           onSuccess={handleInscricaoSuccess}
//           paymentType={paymentType}
//         />

//         {/* Events Section */}
//         {/* <EventsSection config={config} /> */}
//         <EventsSection
//           config={config}
//           onInscricaoClick={() => tryOpenInscricaoModal()}
//         />

//         {/* Testimonials Section Depoimentos */}
//         <TestimonialsSection config={config} />

//         {/* Regras */}

//         {/* =========================================================
//             REGRAS IMPORTANTES E ORIENTAÇÕES PARA RETIRADA DE KIT
//             ========================================================= */}

//         <section
//           id="regras"
//           className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-5 mb-6 scroll-mt-24"
//         >
//           <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
//             🏆 REGRAS IMPORTANTES PARA O ATLETA
//           </h2>

//           <ul className="space-y-3 text-sm text-gray-700">
//             <li className="flex items-start gap-2">
//               <span className="text-amber-600 mt-0.5">🍿</span>
//               <span>
//                 <strong>Atletas sem inscrição ("Pipoca"):</strong> Não possuem
//                 direito à cronometragem, medalha ou acesso aos pódios.
//               </span>
//             </li>

//             <li className="flex items-start gap-2">
//               <span className="text-amber-600 mt-0.5">🎽</span>
//               <span>
//                 <strong>Retirada antecipada de kits:</strong> Não haverá entrega
//                 de kits no dia da corrida. A retirada ocorrerá no período
//                 divulgado oficialmente pela organização.
//               </span>
//             </li>

//             <li className="flex items-start gap-2">
//               <span className="text-amber-600 mt-0.5">⏰</span>
//               <span>
//                 <strong>Pontualidade:</strong> Programe-se para chegar ao local
//                 com antecedência no dia da prova.
//               </span>
//             </li>
//           </ul>

//           {/* Orientações específicas para retirada de kit */}
//           <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
//             <h3 className="text-base font-extrabold text-blue-900 mb-2 flex items-center gap-2">
//               📋 DOCUMENTOS NECESSÁRIOS PARA RETIRADA DO KIT
//             </h3>

//             <p className="text-sm text-blue-900 mb-4 leading-relaxed">
//               Para garantir uma retirada organizada e segura, confira os
//               documentos necessários conforme cada situação:
//             </p>

//             <div className="space-y-4 text-sm text-gray-700">
//               {/* Retirada pelo titular */}
//               <div>
//                 <h4 className="font-bold text-gray-900 mb-1">
//                   1. Retirada pelo próprio participante
//                 </h4>

//                 <p className="leading-relaxed">
//                   O titular da inscrição deverá apresentar documento oficial de
//                   identificação com foto e o Termo de Retirada de Kit
//                   devidamente assinado.
//                 </p>
//               </div>

//               {/* Retirada por terceiros */}
//               <div className="border-t border-blue-200 pt-3">
//                 <h4 className="font-bold text-gray-900 mb-1">
//                   2. Retirada por outra pessoa (terceiros)
//                 </h4>

//                 <p className="leading-relaxed">
//                   Caso o titular não possa comparecer, outra pessoa poderá
//                   retirar o kit mediante apresentação do Termo de Retirada de
//                   Kit, contendo autorização expressa do titular da inscrição e
//                   devidamente assinado de forma eletrônica ou manuscrita.
//                 </p>

//                 <p className="mt-2 leading-relaxed">
//                   A pessoa autorizada também deverá apresentar documento oficial
//                   de identificação com foto.
//                 </p>
//               </div>

//               {/* Validação eletrônica */}
//               <div className="border-t border-blue-200 pt-3">
//                 <h4 className="font-bold text-gray-900 mb-1">
//                   3. Validação da assinatura eletrônica
//                 </h4>

//                 <p className="leading-relaxed">
//                   Quando o termo for assinado eletronicamente, a organização
//                   poderá verificar sua autenticidade por meio do portal oficial
//                   do Instituto Nacional de Tecnologia da Informação (ITI).
//                 </p>

//                 <a
//                   href="https://validar.iti.gov.br"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block mt-2 font-semibold text-blue-700 underline break-all"
//                 >
//                   https://validar.iti.gov.br
//                 </a>

//                 <p className="mt-2 leading-relaxed">
//                   Para essa conferência, deverá ser apresentado o arquivo PDF
//                   original assinado eletronicamente.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Orientação sobre leitura do regulamento */}
//           <div className="mt-4 rounded-lg border border-amber-300 bg-amber-100/70 p-3">
//             <p className="text-sm text-amber-900 leading-relaxed">
//               <strong>📖 Leitura obrigatória:</strong> Leia atentamente o
//               regulamento oficial disponibilizado durante o processo de
//               inscrição antes de finalizar seu cadastro. Ao realizar a
//               inscrição, o participante deverá declarar ciência e concordância
//               com suas disposições.
//             </p>
//           </div>
//         </section>

//         {/* Footer Message */}
//         <div className="text-center py-8 border-t-4 border-pink-300">
//           <p className="text-2xl font-bold text-pink-600 mb-2">
//             🌟 Venha viver essa experiência inesquecível!
//           </p>
//           <p className="text-xl text-purple-700">
//             Corra, caminhe, sorria e celebre conosco a força da amizade! 💕
//           </p>
//         </div>
//       </div>

//       <Footer />

//       {/* LEMBRETE FLUTUANTE DE RETIRADA
//           Não interfere nos botões da página e usa a mesma configuração do termo. */}
//       {config?.retiradaKitParticipante === true && mostrarLembreteRetirada && (
//         <>
//           <style>
//             {`
//               @keyframes kitReminderAttention {
//                 0%, 100% {
//                   transform: translateY(0);
//                   box-shadow: 0 8px 24px rgba(180, 83, 9, 0.18);
//                   filter: saturate(1);
//                 }
//                 50% {
//                   transform: translateY(-4px);
//                   box-shadow: 0 12px 30px rgba(220, 38, 38, 0.28);
//                   filter: saturate(1.15);
//                 }
//               }

//               @media (prefers-reduced-motion: reduce) {
//                 .kit-reminder-attention {
//                   animation: none !important;
//                 }
//               }
//             `}
//           </style>

//           <aside
//             aria-label="Lembrete de retirada de kits"
//             className="
//               fixed
//               bottom-4
//               right-4
//               z-40
//               w-[min(22rem,calc(100vw-2rem))]
//               sm:bottom-6
//               sm:right-6
//             "
//           >
//             <div
//               className="
//                 kit-reminder-attention
//                 relative
//                 overflow-hidden
//                 rounded-2xl
//                 border
//                 border-amber-300
//                 bg-gradient-to-r
//                 from-amber-50
//                 via-orange-50
//                 to-red-50
//                 p-3
//                 pr-10
//                 sm:p-4
//                 sm:pr-11
//               "
//               style={{
//                 animation: "kitReminderAttention 3s ease-in-out infinite",
//               }}
//             >
//               <button
//                 type="button"
//                 aria-label="Ocultar lembrete de retirada"
//                 onClick={() => setMostrarLembreteRetirada(false)}
//                 className="
//                   absolute
//                   right-2
//                   top-2
//                   flex
//                   h-7
//                   w-7
//                   items-center
//                   justify-center
//                   rounded-full
//                   text-slate-500
//                   transition
//                   hover:bg-white/80
//                   hover:text-slate-900
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-amber-500
//                 "
//               >
//                 ×
//               </button>

//               <a
//                 href="#retirada-kit"
//                 className="
//                   block
//                   rounded-lg
//                   text-left
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-amber-600
//                   focus:ring-offset-2
//                 "
//               >
//                 <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-red-700 sm:text-sm">
//                   <span aria-hidden="true">🎽</span>
//                   Atenção: retirada de kits
//                 </span>

//                 <span className="mt-1 block text-sm font-extrabold leading-snug text-slate-900 sm:text-base">
//                   Ainda há participantes com kits aguardando retirada!
//                 </span>

//                 <span className="mt-1 block text-xs font-semibold text-amber-900 sm:text-sm">
//                   Consulte as orientações e programe sua retirada →
//                 </span>
//               </a>
//             </div>
//           </aside>
//         </>
//       )}
//     </div>
//   );
// }

/*
Plano de implementação (registrado)
Fase 1 — Backend (sem alterar frontend)

✅ Criar novos acumuladores exclusivos da logística.
✅ Não alterar nenhum contador existente.
✅ Não remover nenhuma variável atual.

Fase 2 — Processamento

Calcular somente participantes pagantes.
Calcular kits reais.
Calcular camisas reais.
Calcular lanches reais.
Calcular meio kit real.

Fase 3 — JSON

Acrescentar os novos campos ao retorno da API.

Fase 4 — Frontend

Atualizar os cards para utilizar os novos indicadores.
Exibir todos os tamanhos de camisa (incluindo infantis), mesmo quando o total for zero.
Manter os indicadores operacionais (Seguro Atleta e Número de Peito) separados dos indicadores logísticos.

Essa arquitetura deixará o sistema dividido em dois grandes blocos:

Operacional: controle de inscritos, seguro atleta, número de peito e acompanhamento geral.
Logístico/Financeiro: compra de kits, camisas, medalhas e lanches, utilizando apenas os participantes que efetivamente geram necessidade de materiais.

Essa separação reduz o risco de compras incorretas e torna o painel muito mais confiável para a organização do evento.
*/
