import { useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import EventsSection from '../components/EventsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import InscricaoModal from '../components/InscricaoModal';

export default function Home() {
  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  
  // URL do seu Google Form (configurada)
  const GOOGLE_FORM_URL = process.env.REACT_APP_GOOGLE_FORM_URL || 'https://forms.gle/cK5rsEZ75nbTYgTj9';

  const handleInscricaoSuccess = () => {
    // Aqui você pode adicionar lógica adicional após sucesso
    console.log('Inscrição realizada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Hero Banner */}
      <div className="relative h-96 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-200 overflow-hidden flex items-center justify-center shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl">🏃‍♀️</div>
          <div className="absolute top-20 right-20 text-5xl">💕</div>
          <div className="absolute bottom-10 left-1/4 text-5xl">🌸</div>
        </div>
        <div className="relative text-center px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
            Entre Amigas
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md font-semibold">
            5ª Edição • Celebrando Amizade, Saúde e Superação 💖
          </p>
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

        {/* Event Details Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Data */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg shadow p-6 border-l-4 border-pink-500">
            <h3 className="text-2xl font-bold text-pink-600 mb-2">📅 Data</h3>
            <p className="text-xl font-semibold text-gray-800">17 de Maio de 2026</p>
          </div>

          {/* Local */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-2xl font-bold text-purple-600 mb-2">📍 Local</h3>
            <p className="text-xl font-semibold text-gray-800">Orla de Brasília Teimosa</p>
            <p className="text-sm text-gray-600">(Buraco da Velha)</p>
          </div>

          {/* Horário */}
          <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow p-6 border-l-4 border-rose-500">
            <h3 className="text-2xl font-bold text-rose-600 mb-2">⏰ Largada</h3>
            <p className="text-xl font-semibold text-gray-800">06:00 horas</p>
          </div>

          {/* Distâncias */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">🏁 Distâncias</h3>
            <p className="text-gray-800"><strong>3 km</strong> - Mulheres</p>
            <p className="text-gray-800"><strong>5 km</strong> - Mulheres e Homens</p>
          </div>

          {/* Categorias */}
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <h3 className="text-2xl font-bold text-indigo-600 mb-2">🎽 Categorias</h3>
            <p className="text-gray-800"><strong>Feminino</strong></p>
            <p className="text-gray-800"><strong>Masculino</strong></p>
          </div>

          {/* Premiação */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-yellow-600 mb-2">💖 Premiação</h3>
            <p className="text-gray-800">Troféus para os 3 primeiros colocados em cada categoria</p>
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
