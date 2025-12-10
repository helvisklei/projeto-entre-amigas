import { useState } from 'react';
import { useEffect } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import EventsSection from '../components/EventsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import InscricaoModal from '../components/InscricaoModal';
import '../styles/flip-animation.css';

export default function Home() {
  const [showInscricaoModal, setShowInscricaoModal] = useState(false);

  // Abre o modal automaticamente quando vindo do Google Forms
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("fromForm") === "true") {
        setShowInscricaoModal(true);
      }
    }
  }, []);

  
  // URL do Google Form (configurada)
  const GOOGLE_FORM_URL = process.env.REACT_APP_GOOGLE_FORM_URL || 'https://forms.gle/cK5rsEZ75nbTYgTj9';

  const handleInscricaoSuccess = () => {
    // Lógica adicional após sucesso
    console.log('Inscrição realizada com sucesso!');
  };

  // Benefícios do evento
  const benefits = [
    { icon: '👕', title: 'Camisa Oficial', desc: 'Design exclusivo do evento' },
    { icon: '🔢', title: 'Número de Peito', desc: 'Identificação única' },
    { icon: '🥇', title: 'Medalha Exclusiva', desc: 'Lembrança especial' },
    { icon: '🏆', title: 'Pódios por Categoria', desc: '3 km e 5 km' },
    { icon: '💆', title: 'Massagem', desc: 'Para os atletas pós-corrida' },
    { icon: '❄️', title: 'Piscina de Gelo', desc: 'Recuperação profissional' },
    { icon: '🎧', title: 'DJ ao Vivo', desc: 'Animando todo o evento' },
    { icon: '☕', title: 'Café da Manhã', desc: 'Hidratação + refeição' },
    { icon: '🎁', title: 'Brindes Especiais', desc: 'Sorteios e prêmios' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Header com Logo */}
      <Header />

      {/* Hero Banner Melhorado */}
      <div className="relative h-96 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-200 overflow-hidden flex items-center justify-center shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{animationDelay: '0s'}}>🏃‍♀️</div>
          <div className="absolute top-20 right-20 text-5xl animate-bounce" style={{animationDelay: '0.2s'}}>💕</div>
          <div className="absolute bottom-10 left-1/4 text-5xl animate-bounce" style={{animationDelay: '0.4s'}}>🌸</div>
        </div>
        <div className="relative text-center px-4 z-10 space-y-0">
          <img
            src="/logoEntreAmigas.webp"
            alt="Entre Amigas Logo"
            className="h-80 w-auto mx-auto drop-shadow-xl"
            title="Entre Amigas - Corrida de Mulheres"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg -mt-4">
            Entre Amigas
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md font-semibold -mt-2">
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
              <div key={idx} className="text-center transform transition hover:scale-110">
                <div className="text-4xl md:text-5xl mb-2">{benefit.icon}</div>
                <p className="font-bold text-sm md:text-base drop-shadow">{benefit.title}</p>
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
            💰 Valores por Lote de Inscrição
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Lote 1 */}
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105">
              <div className="text-4xl font-bold text-white mb-3">1º Lote</div>
              <p className="text-white text-lg mb-4 font-semibold">05/01/26 até 05/02/26</p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-3xl font-bold text-pink-600">R$ 100,00</p>
              </div>
            </div>

            {/* Lote 2 */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105">
              <div className="text-4xl font-bold text-white mb-3">2º Lote</div>
              <p className="text-white text-lg mb-4 font-semibold">06/02/26 até 30/03/26</p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-3xl font-bold text-purple-600">R$ 120,00</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
            <p className="text-lg font-semibold text-yellow-800">
              ⏰ Garanta sua inscrição no primeiro lote e economize! 💪
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

        {/* About Section */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">O que é Entre Amigas?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            🌸 A Corrida Entre Amigas é mais do que um evento esportivo — é um encontro de pessoas que acreditam na força da amizade, na saúde e no poder de se superar.
            Venha viver essa experiência inesquecível! <strong>Corra, caminhe, sorria e celebre conosco a força da amizade!</strong>
          </p>
          <p className="text-lg text-purple-700 font-semibold mt-4">
            Entre Amigas, toda corrida tem mais significado. 💕
          </p>
        </section>

        {/* Event Details - Cards Unificados e Responsivos */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">📋 Informações do Evento</h2>
          
          {/* Card 1: Data e Local - Lado a Lado em Desktop */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Data Card */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg shadow-lg p-8 border-l-4 border-pink-500 transform transition hover:scale-105">
              <h3 className="text-3xl font-bold text-pink-600 mb-3">📅 Data</h3>
              <p className="text-2xl font-semibold text-gray-800">17 de Maio</p>
              <p className="text-lg text-gray-700">2026</p>
              <p className="text-sm text-gray-600 mt-2">Dia memorável!</p>
            </div>

            {/* Local Card */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500 transform transition hover:scale-105">
              <h3 className="text-3xl font-bold text-purple-600 mb-3">📍 Local</h3>
              <p className="text-2xl font-semibold text-gray-800">Orla de Brasília Teimosa</p>
              <p className="text-lg text-gray-700">(Buraco da Velha)</p>
              <p className="text-sm text-gray-600 mt-2">Recife - PE</p>
            </div>
          </div>

          {/* Card 2: Largada, Distâncias e Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Largada Card */}
            <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-lg p-6 border-l-4 border-rose-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-rose-600 mb-3">⏰ Largada</h3>
              <p className="text-3xl font-bold text-gray-800">06:00</p>
              <p className="text-gray-700">horas (matutino)</p>
              <p className="text-sm text-gray-600 mt-2">Chegar com antecedência!</p>
            </div>

            {/* Distâncias Card */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">🏁 Distâncias</h3>
              <p className="text-lg font-semibold text-gray-800">📏 <strong>3 km</strong></p>
              <p className="text-gray-700 text-sm mb-2">Para mulheres</p>
              <p className="text-lg font-semibold text-gray-800">📏 <strong>5 km</strong></p>
              <p className="text-gray-700 text-sm">Mulheres e Homens</p>
            </div>

            {/* Categorias Card */}
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-indigo-600 mb-3">🎽 Categorias</h3>
              <p className="text-lg font-semibold text-gray-800">👩 Feminino</p>
              <p className="text-gray-700 text-sm mb-2">Todas as idades</p>
              <p className="text-lg font-semibold text-gray-800">👨 Masculino</p>
              <p className="text-gray-700 text-sm">Convidados especiais</p>
            </div>
          </div>

          {/* Card 3: Premiação */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-lg p-8 border-l-4 border-yellow-500 transform transition hover:scale-105">
            <h3 className="text-3xl font-bold text-yellow-600 mb-3">🏆 Premiação</h3>
            <p className="text-lg text-gray-800 font-semibold">Troféus para os 3 primeiros colocados em cada categoria</p>
            <p className="text-gray-700 mt-3">Além de brindes especiais para todos os participantes!</p>
          </div>
        </section>

        {/* Kit e Pagamento */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🎁 Kit Oficial - R$ 100,00</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">O que inclui:</h3>
              <ul className="space-y-2 text-lg">
                <li>✓ Camisa oficial</li>
                <li>✓ Número de peito</li>
                <li>✓ Medalha de participação</li>
                <li>✓ Seguro Atleta</li>
                <li>✓ Brindes de patrocinadores</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Formas de Pagamento:</h3>
              <p className="text-lg mb-4">💳 <strong>Pix ou Cartão</strong> (via Mercado Pago)</p>
              <p className="text-lg mb-4">ou</p>
              <p className="text-lg">💰 <strong>Pix Direto:</strong></p>
              <p className="text-sm bg-white text-gray-900 p-3 rounded mt-2 font-mono">
                51095174-281a-476c-a0ff-b3d9992107cd
              </p>
            </div>
          </div>
        </section>

        {/* Inscrição CTA */}
        <section className="text-center space-y-6">
          <div>
            <p className="text-2xl text-gray-700 mb-4">
              Pronta para fazer parte dessa história?
            </p>
            <button
              onClick={() => setShowInscricaoModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform transition hover:scale-105"
            >
              🏃‍♀️ Se inscreva você também! 💕
            </button>
          </div>
        </section>

        {/* Modal de Inscrição */}
        <InscricaoModal
          isOpen={showInscricaoModal}
          onClose={() => setShowInscricaoModal(false)}
          googleFormUrl={GOOGLE_FORM_URL}
          onSuccess={handleInscricaoSuccess}
        />

        {/* Events Section */}
        <EventsSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Regras */}
        <section className="bg-yellow-50 rounded-lg shadow p-8 border-l-4 border-yellow-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Regras Importantes</h2>
          <ul className="space-y-3 text-lg text-gray-700">
            <li><strong>📋 Pipoca não vai para os pódios</strong></li>
            <li><strong>🎽 Não levamos kits para retirar no dia da corrida</strong> - Retirada uma semana antes</li>
            <li><strong>⏰ Chegue com antecedência</strong></li>
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
