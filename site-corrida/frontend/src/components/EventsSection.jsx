import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
      setEvents(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setEvents([
        {
          id: 1,
          titulo: 'Corrida Entre Amigas 2024',
          data_evento: '2024-12-15',
          descricao: 'Corrida beneficente para as amigas',
          local: 'Recife - PE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate('/inscricao', { state: { eventId } });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Carregando eventos...</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">
          🏃 Nossos Eventos
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>Nenhum evento disponível no momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const dataFormatada = new Date(event.data_evento).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              });
              const isCurrentEvent = index === 0;

              return (
                <div
                  key={event.id}
                  className={`rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer ${
                    isCurrentEvent
                      ? 'border-4 border-purple-600 bg-gradient-to-br from-purple-50 to-white'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                  onClick={() => handleEventClick(event.id)}
                >
                  {isCurrentEvent && (
                    <div className="bg-purple-600 text-white text-center py-2 font-bold">
                      ⭐ EVENTO ATUAL
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-purple-600 mb-2">
                      {event.titulo}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <span className="text-xl">📅</span>
                      <span className="font-semibold">{dataFormatada}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 mb-4">
                      <span className="text-xl">📍</span>
                      <span>{event.local || 'Local a definir'}</span>
                    </div>

                    <p className="text-gray-600 mb-6 h-16 overflow-hidden">
                      {event.descricao}
                    </p>

                    <button
                      className={`w-full font-bold py-3 px-4 rounded-lg transition text-white ${
                        isCurrentEvent
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => handleEventClick(event.id)}
                    >
                      📝 Inscrever-se
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {events.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              Próximo evento: <strong>Setembro 2025</strong>
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
