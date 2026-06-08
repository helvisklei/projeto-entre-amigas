//import { useEffect, useState } from "react";

//import InscricaoModal from "./InscricaoModal";

import { useState } from "react";

//import axios from "axios";

export default function EventsSection({ config, onInscricaoClick }) {
  //const [events, setEvents] = useState([]);
  //const [loading, setLoading] = useState(true);
  const [loading] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const benefits = [
    { icon: "👕", title: "Camisa Oficial" },
    { icon: "🔢", title: "Número de Peito" },
    { icon: "🥇", title: "Medalha Exclusiva" },
    { icon: "🏆", title: "Pódio 5 km" },
    { icon: "💆", title: "Massagem" },
    { icon: "❄️", title: "Piscina de Gelo" },
    { icon: "🎧", title: "DJ ao Vivo" },
    { icon: "☕", title: "Café + Hidratação" },
    { icon: "🎁", title: "Brindes Especiais" },
  ];

  const pastEvents = config?.eventosAnteriores || [];

  const hasPastEvents = pastEvents.length > 0;

  const currentEvent = {
    id: 1,

    titulo: config?.evento?.nome || "Corrida Entre Amigas",

    data: config?.evento?.data || config?.corridaAtiva,

    local: config?.evento?.local || "Local a definir",
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Carregando eventos...</p>
      </div>
    );
  }

  return (
    <section
      id="eventos"
      className="py-12 bg-gradient-to-b from-white to-purple-50"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">
          🏃 Nossos Eventos
        </h2>

        {!config?.evento ? (
          <div className="text-center py-8 text-gray-600">
            <p>Nenhum evento disponível no momento.</p>
          </div>
        ) : (
          <>
            {/* Eventos Atuais */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-pink-600 mb-8 text-center">
                ⭐ Próximo Evento
              </h3>

              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                <div
                  className="h-80 cursor-pointer group"
                  onClick={() => toggleFlip("current")}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-500 transform-gpu"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: flippedCards.current
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* Frente */}
                    <div
                      className="absolute w-full h-full bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-lg p-6 border-4 border-purple-600 flex flex-col justify-between"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div>
                        <div className="bg-purple-600 text-white text-center py-2 font-bold rounded mb-4">
                          ⭐ PRÓXIMO EVENTO
                        </div>

                        <h3 className="text-2xl font-bold text-purple-600 mb-4">
                          {currentEvent.titulo}
                        </h3>

                        <div className="space-y-3 text-gray-700">
                          <p className="flex items-center gap-2">
                            <span className="text-2xl">📅</span>
                            <span className="font-semibold">
                              {currentEvent.data}
                            </span>
                          </p>

                          <p className="flex items-center gap-2">
                            <span className="text-2xl">📍</span>
                            <span>{currentEvent.local}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 text-center mt-4 font-semibold">
                        👆 Clique para ver benefícios
                      </p>
                    </div>

                    {/* Verso */}
                    <div
                      className="absolute w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-lg p-6 border-4 border-pink-500 flex flex-col"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <h4 className="text-xl font-bold text-pink-600 mb-4 text-center">
                        🎉 Benefícios do Evento
                      </h4>

                      <div className="grid grid-cols-3 gap-2 flex-1 overflow-y-auto">
                        {benefits.map((benefit, idx) => (
                          <div key={idx} className="text-center text-sm">
                            <p className="text-2xl mb-1">{benefit.icon}</p>
                            <p className="font-semibold text-gray-700 text-xs">
                              {benefit.title}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        /* disabled={
                          !config?.inscricoesAbertas
                            ? "📝 Inscrever-se"
                            : "🚫 Inscrições Encerradas"
                        } */
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onInscricaoClick) {
                            onInscricaoClick();
                          }
                        }}
                      >
                        📝 Inscrever-se
                      </button>

                      <p className="text-xs text-gray-600 text-center mt-2">
                        👆 Clique novamente para voltar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <InscricaoModal isOpen={isInscricaoOpen} onClose={closeInscricao} /> */}

            {/* Eventos Passados */}
            {hasPastEvents && (
              <div>
                <h3 className="text-2xl font-bold text-purple-700 mb-8 text-center">
                  📜 Edições Anteriores
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {pastEvents.map((pastEvent, index) => (
                    <div
                      key={index}
                      className="h-64 cursor-pointer"
                      onClick={() => toggleFlip(`past-${index}`)}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-500 transform-gpu"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: flippedCards[`past-${index}`]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        {/* Front - Past Event Info */}
                        <div
                          className="absolute w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg shadow-lg p-6 border-4 border-purple-600 flex flex-col justify-between"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <div>
                            <h3 className="text-2xl font-bold text-purple-800 mb-4">
                              {pastEvent.titulo}
                            </h3>
                            <div className="space-y-3 text-gray-700">
                              <p className="flex items-center gap-2">
                                <span className="text-2xl">📅</span>
                                <span className="font-semibold">
                                  {pastEvent.data}
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-2xl">👥</span>
                                <span>{pastEvent.participantes}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 text-center font-semibold">
                            👆 Clique para ver detalhes
                          </p>
                        </div>

                        {/* Back - Past Event Details */}
                        <div
                          className="absolute w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg shadow-lg p-6 border-4 border-yellow-500 flex flex-col justify-between"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <div>
                            <h4 className="text-lg font-bold text-yellow-700 mb-3">
                              ⭐ Destaques
                            </h4>
                            <p className="text-gray-700 font-semibold mb-2">
                              {pastEvent.destaque}
                            </p>
                            <p className="text-sm text-gray-600">
                              {pastEvent.mensagem}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 text-center mt-3 font-semibold">
                            👆 Clique para voltar
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {config?.evento && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              Próximo evento: <strong>{config?.corridaAtiva}</strong>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Acompanhe nossas redes sociais para mais informações!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
