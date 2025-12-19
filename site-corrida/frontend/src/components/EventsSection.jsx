import { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  // parse date string "YYYY-MM-DD" como data local (evita shift para dia anterior por timezone)
  const parseDateLocal = (isoDate) => {
    if (!isoDate) return null;
    const parts = isoDate.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    return new Date(year, month - 1, day);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // cache-busting + headers para evitar respostas em cache com data incorreta
      const url = `${process.env.REACT_APP_API_URL}/events?_ts=${Date.now()}`;
      const response = await axios.get(url, {
        headers: { 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' }
      });
      console.log('API /events response:', response.data);
      setEvents(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setEvents([
        {
          id: 1,
          titulo: 'Corrida Entre Amigas 2025',
          data_evento: '2025-05-17',
          descricao: 'Corrida beneficente para as amigas',
          local: 'Recife - PE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleEventClick = (eventId) => {
    navigate('/inscricao', { state: { eventId } });
  };

  const benefits = [
    { icon: '👕', title: 'Camisa Oficial' },
    { icon: '🔢', title: 'Número de Peito' },
    { icon: '🥇', title: 'Medalha Exclusiva' },
    { icon: '🏆', title: 'Pódios (3 e 5 km)' },
    { icon: '💆', title: 'Massagem' },
    { icon: '❄️', title: 'Piscina de Gelo' },
    { icon: '🎧', title: 'DJ ao Vivo' },
    { icon: '☕', title: 'Café + Hidratação' },
    { icon: '🎁', title: 'Brindes Especiais' }
  ];

  const pastEvents = [
    { title: '4ª Edição 2025', date: '19 Outubro 2025', participants: '160 participantes', highlights: 'Melhor equipe!' },
    { title: '3ª Edição 2025', date: '20 Junho 2025', participants: '110 participantes', highlights: 'Melhor estrutura!' }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Carregando eventos...</p>
      </div>
    );
  }

  return (
    <section id="eventos" className="py-12 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">
          🏃 Nossos Eventos
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>Nenhum evento disponível no momento.</p>
          </div>
        ) : (
          <>
            {/* Eventos Atuais */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-pink-600 mb-8 text-center">⭐ Evento Atual</h3>
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {events.map((event, index) => {
                  if (index !== 0) return null;
                  const dateObj = parseDateLocal(event.data_evento) || new Date(event.data_evento);
                  const dataFormatada = dateObj.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={event.id}
                      className="h-80 cursor-pointer group"
                      onClick={() => toggleFlip(`current-${event.id}`)}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-500 transform-gpu"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: flippedCards[`current-${event.id}`] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        {/* Front - Event Info */}
                        <div
                          className="absolute w-full h-full bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-lg p-6 border-4 border-purple-600 flex flex-col justify-between"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div>
                            <div className="bg-purple-600 text-white text-center py-2 font-bold rounded mb-4">
                              ⭐ EVENTO ATUAL
                            </div>
                            <h3 className="text-2xl font-bold text-purple-600 mb-4">
                              {event.titulo}
                            </h3>
                            <div className="space-y-3 text-gray-700">
                              <p className="flex items-center gap-2">
                                <span className="text-2xl">📅</span>
                                <span className="font-semibold">{dataFormatada}</span> {/* a data está errada nessa parte*/}
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-2xl">📍</span>
                                <span>{event.local || 'Local a definir'}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 text-center mt-4 font-semibold">
                            👆 Clique para ver benefícios
                          </p>
                        </div>

                        {/* Back - Benefits */}
                        <div
                          className="absolute w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-lg p-6 border-4 border-pink-500 flex flex-col"
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                          <h4 className="text-xl font-bold text-pink-600 mb-4 text-center">
                            🎉 Benefícios do Evento
                          </h4>
                          <div className="grid grid-cols-3 gap-2 flex-1 overflow-y-auto">
                            {benefits.map((benefit, idx) => (
                              <div key={idx} className="text-center text-sm">
                                <p className="text-2xl mb-1">{benefit.icon}</p>
                                <p className="font-semibold text-gray-700 text-xs">{benefit.title}</p>
                              </div>
                            ))}
                          </div>
                          <button
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event.id);
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
                  );
                })}
              </div>
            </div>

            {/* Eventos Passados */}
            <div>
              <h3 className="text-2xl font-bold text-purple-700 mb-8 text-center">📜 Edições Anteriores</h3>
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
                        transformStyle: 'preserve-3d',
                        transform: flippedCards[`past-${index}`] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Front - Past Event Info */}
                      <div
                        className="absolute w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg shadow-lg p-6 border-4 border-purple-600 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div>
                          <h3 className="text-2xl font-bold text-purple-800 mb-4">
                            {pastEvent.title}
                          </h3>
                          <div className="space-y-3 text-gray-700">
                            <p className="flex items-center gap-2">
                              <span className="text-2xl">📅</span>
                              <span className="font-semibold">{pastEvent.date}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-2xl">👥</span>
                              <span>{pastEvent.participants}</span>
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
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div>
                          <h4 className="text-lg font-bold text-yellow-700 mb-3">
                            ⭐ Destaques
                          </h4>
                          <p className="text-gray-700 font-semibold mb-2">
                            {pastEvent.highlights}
                          </p>
                          <p className="text-sm text-gray-600">
                            Momento memorável da corrida Entre Amigas! Obrigada a todas que participaram! 💕
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
          </>
        )}

        {events.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              Próximo evento: <strong>Maio 2026</strong>
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
