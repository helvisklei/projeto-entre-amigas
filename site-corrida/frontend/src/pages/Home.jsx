import "../styles/flip-animation.css";

import { useEffect, useState } from "react";

import EventsSection from "../components/EventsSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InscricaoModal from "../components/InscricaoModal";
import KitExtrasSection from "../components/KitExtrasSection";
import TestimonialsSection from "../components/TestimonialsSection";
import { getFrontendConfig } from "../services/configService";

export default function Home() {
  // 🔒 Controle de inscrições
  //const isInscriptionOpen = true; // Mude para true quando quiser reabrir

  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null); // 'pix' | 'credito'
  const [config, setConfig] = useState(null);

  /*
  =========================================================
  CONTROLE CENTRAL DE INSCRIÇÕES
  =========================================================
  */
  const isInscriptionOpen = config ? !config.eventoEncerrado : false; // Padrão para fechado enquanto carrega config

  useEffect(() => {
    async function loadConfig() {
      try {
        const cfg = await getFrontendConfig();

        setConfig(cfg);
      } catch (error) {
        console.error("Erro carregando config:", error);
      }
    }

    loadConfig();
  }, []);

  // Helper para abrir o modal com checagem de bloqueio
  const tryOpenInscricaoModal = (type = null) => {
    if (!isInscriptionOpen) {
      // Feedback mínimo para o usuário (mantém sem regressão)
      alert("Inscrições temporariamente fechadas. Em breve reabriremos.");
      return;
    }
    setPaymentType(type);
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

  console.log("CONFIG:", config);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }
  const descontoLegal = Number(config?.descontos?.pcd || 50) / 100;

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

  const exibirKitExtras = config?.kits?.meioKit || config?.kits?.lanche;

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
            5ª Edição • Celebrando Amizade, Saúde e Superação 💖
          </p>
        </div>
      </div>

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

      {/* Lotes de Inscrição */}
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
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
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
                      ativo: config.kits?.kitCompleto,
                      nome: "KIT COMPLETO",
                      pix: config.lote1?.kitCompletoPix,
                      cartao: config.lote1?.kitCompletoCartao,
                    },
                    {
                      ativo: config.kits?.meioKit,
                      nome: "MEIO KIT",
                      pix: config.lote1?.meioKitPix,
                      cartao: config.lote1?.meioKitCartao,
                    },
                  ],
                },
                {
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
                      ativo: config.kits?.kitCompleto,
                      nome: "KIT COMPLETO",
                      pix: config.lote2?.kitCompletoPix,
                      cartao: config.lote2?.kitCompletoCartao,
                    },
                    {
                      ativo: config.kits?.meioKit,
                      nome: "MEIO KIT",
                      pix: config.lote2?.meioKitPix,
                      cartao: config.lote2?.meioKitCartao,
                    },
                  ],
                },
              ].map((lote) => (
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
                                <span className="bg-green-100 text-green-700 font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  {config?.lote1.descontos.pcd || 50}% Desconto
                                </span>
                              </div>

                              <div className="space-y-2 text-gray-500 text-sm">
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
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
            <p className="text-lg font-semibold text-yellow-800">
              ⏰ Garanta sua inscrição no primeiro lote e economize! 💪
            </p>
          </div>
        </div>
      </div>
      {/*       <div className="relative bg-gradient-to-b from-white to-pink-50 py-12 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-600 mb-10 drop-shadow">
            💰 Valor da Inscrição
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8"> */}
      {/* Validação Defensiva: Se o config não estiver carregado, exibe um placeholder ou retorna nulo */}
      {/*             {!config ? (
              <div className="w-full text-center py-8 text-gray-500">
                Carregando lotes vigentes...
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    numero: 1,
                    titulo: "LOTE 1",
                    inicio: config.lote1?.inicio,
                    fim: config.lote1?.fim,
                    bgClass: "from-pink-400 to-pink-500",
                    textClass: "text-pink-100",
                    brandText: "text-pink-600",
                    kits: [
                      {
                        ativo: config.lote1?.kitCompleto,
                        nome: "KIT COMPLETO",
                        pix: config.lote1?.kitCompletoPix,
                        cartao: config.lote1?.kitCompletoCartao,
                      },
                      {
                        ativo: config.lote1?.meioKit,
                        nome: "MEIO KIT",
                        pix: config.lote1?.meioKitPix,
                        cartao: config.lote1?.meioKitCartao,
                      },
                    ],
                  },
                  {
                    numero: 2,
                    titulo: "LOTE 2",
                    inicio: config.lote2?.inicio,
                    fim: config.lote2?.fim,
                    bgClass: "from-purple-400 to-purple-500",
                    textClass: "text-purple-100",
                    brandText: "text-purple-600",
                    kits: [
                      {
                        ativo: config.lote2?.kitCompleto,
                        nome: "KIT COMPLETO",
                        pix: config.lote2?.kitCompletoPix,
                        cartao: config.lote2?.kitCompletoCartao,
                      },
                      {
                        ativo: config.lote2?.meioKit,
                        nome: "MEIO KIT",
                        pix: config.lote2?.meioKitPix,
                        cartao: config.lote2?.meioKitCartao,
                      },
                    ],
                  },
                ].map((lote) => (
                  <div
                    key={`lote-${lote.numero}`}
                    className={`bg-gradient-to-br ${lote.bgClass} rounded-xl shadow-xl p-8`}
                  >
                    <h3 className="text-3xl font-bold text-white text-center mb-2">
                      {lote.titulo}
                    </h3>

                    <p className={`text-center ${lote.textClass} mb-6`}>
                      {lote.inicio || "Breve"} até {lote.fim || "Breve"}
                    </p>

                    <div className="space-y-4">
                      {lote.kits
                        .filter(
                          (kit) =>
                            String(kit.ativo).toUpperCase() === "TRUE" ||
                            kit.ativo === true,
                        )
                        .map((kit, index) => (
                          <div
                            key={`${lote.numero}-${kit.nome}`}
                            className="bg-white rounded-lg p-4"
                          >
                            <h4
                              className={`font-bold ${lote.brandText} text-lg mb-3`}
                            >
                              {kit.nome}
                            </h4>

                            <div className="flex justify-between text-gray-700 mb-1">
                              <span>PIX</span>
                              <strong className="text-gray-900">
                                {formatCurrency(kit.pix)}
                              </strong>
                            </div>

                            <div className="flex justify-between text-gray-700">
                              <span>Cartão</span>
                              <strong className="text-gray-900">
                                {formatCurrency(kit.cartao)}
                              </strong>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
            <p className="text-lg font-semibold text-yellow-800">
              ⏰ Garanta sua inscrição no primeiro lote e economize! 💪
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* About Section */}
        <section id="sobre" className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">
            O que é Entre Amigas?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            🌸 A Corrida Entre Amigas é mais do que um evento esportivo — é um
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
              {/*               <p className="text-sm text-gray-600 mt-2">
                {config?.evento?.cidade}
              </p> */}
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
        <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🎁 Inscrição Completa</h2>

          <p className="text-2xl font-bold mb-6">
            {/* R$ 105 (Pix) | R$ 115 (Cartão) */}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">O que inclui:</h3>
              <ul className="space-y-2 text-lg">
                <li>✓ Camisa oficial</li>
                <li>✓ Número de peito</li>
                <li>✓ Medalha de participação</li>
                <li>✓ Viseira</li>
                <li>✓ Ecobag</li>
                <li>✓ Seguro Atleta</li>
                <li>✓ Brindes de patrocinadores - Sorteios</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                Formas de Pagamento:
              </h3>
              <p className="text-lg mb-4">
                💳 <strong>Pix ou Cartão</strong> (via Mercado Pago)
              </p>
              {/* <p className="text-lg mb-4">ou</p>
              <p className="text-lg">
                💰 <strong>Pix Direto:</strong>
              </p>
              <p className="text-sm bg-white text-gray-900 p-3 rounded mt-2 font-mono">
                07944726484
              </p> */}
            </div>
          </div>

          <div className="border-t border-white/30 my-8"></div>
          {/* Exbe as informações dos kits extras */}
          {exibirKitExtras && <KitExtrasSection />}
        </section>

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

        {/* Modal de Inscrição */}
        <InscricaoModal
          isOpen={showInscricaoModal}
          onClose={() => setShowInscricaoModal(false)}
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
        <section
          id="regras"
          className="bg-yellow-50 rounded-lg shadow p-8 border-l-4 border-yellow-400"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🏆 Regras Importantes
          </h2>
          <ul className="space-y-3 text-lg text-gray-700">
            <li>
              <strong>📋 Pipoca não vai para os pódios</strong>
            </li>
            <li>
              <strong>
                🎽 Não levamos kits para retirar no dia da corrida
              </strong>{" "}
              - Retirada uma semana antes
            </li>
            <li>
              <strong>⏰ Chegue com antecedência</strong>
            </li>
          </ul>
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

      <Footer />
    </div>
  );
}
