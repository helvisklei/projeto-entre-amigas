import "../styles/flip-animation.css";

import { useEffect, useState } from "react";

import EventsSection from "../components/EventsSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InscricaoModal from "../components/InscricaoModal";
import KitExtrasSection from "../components/KitExtrasSection";
import TestimonialsSection from "../components/TestimonialsSection";

export default function Home() {
  // 🔒 Controle de inscrições
  const isInscriptionOpen = false; // Mude para true quando quiser reabrir

  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null); // 'pix' | 'credito'

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
  const GOOGLE_FORM_URL =
    process.env.REACT_APP_GOOGLE_FORM_URL ||
    "https://forms.gle/cK5rsEZ75nbTYgTj9";

  const handleInscricaoSuccess = () => {
    // Lógica adicional após sucesso
    console.log("Inscrição realizada com sucesso!");
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

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Lote 1 - PIX */}
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105">
              <div className="text-4xl font-bold text-white mb-3">PIX</div>
              <p className="text-white text-lg mb-4 font-semibold">Á vista</p>
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-3xl font-bold text-pink-600">R$ 105,00</p>
              </div>

              {isInscriptionOpen ? (
                <button
                  onClick={() => tryOpenInscricaoModal("pix")}
                  className="w-full bg-white text-pink-600 font-bold py-3 px-4 rounded-lg hover:bg-pink-50 transition transform hover:scale-105 shadow-md"
                >
                  🎯 Se Inscrever Agora
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-4 rounded-lg cursor-not-allowed opacity-50"
                >
                  ⏰ Inscrições Fechadas
                </button>
              )}
            </div>

            {/* Lote 2 - CRÉDITO */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105">
              <div className="text-4xl font-bold text-white mb-3">Crédito</div>
              <p className="text-white text-lg mb-4 font-semibold">
                Em duas vezes sem acréscimo
              </p>
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-3xl font-bold text-purple-600">R$ 115</p>
              </div>

              {isInscriptionOpen ? (
                <button
                  onClick={() => tryOpenInscricaoModal("credito")}
                  className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg hover:bg-purple-50 transition transform hover:scale-105 shadow-md"
                >
                  🎯 Se Inscrever Agora
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-4 rounded-lg cursor-not-allowed opacity-50"
                >
                  ⏰ Inscrições Fechadas
                </button>
              )}
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
              <p className="text-2xl font-semibold text-gray-800">17 de Maio</p>
              <p className="text-lg text-gray-700">2026</p>
              <p className="text-sm text-gray-600 mt-2">Dia memorável!</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500 transform transition hover:scale-105">
              <h3 className="text-3xl font-bold text-purple-600 mb-3">
                📍 Local
              </h3>
              <p className="text-2xl font-semibold text-gray-800">
                Orla de Brasília Teimosa
              </p>
              <p className="text-lg text-gray-700">(Buraco da Velha)</p>
              <p className="text-sm text-gray-600 mt-2">Recife - PE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-lg p-6 border-l-4 border-rose-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-rose-600 mb-3">
                ⏰ Largada
              </h3>
              <p className="text-3xl font-bold text-gray-800">06:00</p>
              <p className="text-gray-700">horas (matutino)</p>
              <p className="text-sm text-gray-600 mt-2">
                Chegar com antecedência!
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">
                🏁 Distâncias
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                📏 <strong>3 km</strong>
              </p>
              <p className="text-gray-700 text-sm mb-2">Para mulheres</p>
              <p className="text-lg font-semibold text-gray-800">
                📏 <strong>5 km</strong>
              </p>
              <p className="text-gray-700 text-sm">Mulheres e Homens</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 transform transition hover:scale-105">
              <h3 className="text-2xl font-bold text-indigo-600 mb-3">
                🎽 Categorias
              </h3>
              <p className="text-lg font-semibold text-gray-800">👩 Feminino</p>
              <p className="text-gray-700 text-sm mb-2">Todas as idades</p>
              <p className="text-lg font-semibold text-gray-800">
                👨 Masculino
              </p>
              <p className="text-gray-700 text-sm">Todas as idades</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-lg p-8 border-l-4 border-yellow-500 transform transition hover:scale-105">
            <h3 className="text-3xl font-bold text-yellow-600 mb-3">
              🏆 Premiação
            </h3>
            <p className="text-lg text-gray-800 font-semibold">
              Troféus para os 3 primeiros colocados em cada categoria
            </p>
            <p className="text-gray-700 mt-3">
              Além de brindes especiais para todos os participantes!
            </p>
          </div>
        </section>

        {/* Kit e Pagamento */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🎁 Inscrição Completa</h2>

          <p className="text-2xl font-bold mb-6">
            R$ 105 (Pix) | R$ 115 (Cartão)
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
              <p className="text-lg mb-4">ou</p>
              <p className="text-lg">
                💰 <strong>Pix Direto:</strong>
              </p>
              <p className="text-sm bg-white text-gray-900 p-3 rounded mt-2 font-mono">
                07944726484
              </p>
            </div>
          </div>

          <div className="border-t border-white/30 my-8"></div>

          <KitExtrasSection />
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
                  Inscrições temporariamente fechadas
                </p>
                <p className="text-sm text-gray-600">
                  Fique atenta para as próximas inscrições! 💕
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
          googleFormUrl={GOOGLE_FORM_URL}
          onSuccess={handleInscricaoSuccess}
          paymentType={paymentType}
        />

        {/* Events Section */}
        <EventsSection />

        {/* Testimonials Section Depoimentos */}
        <TestimonialsSection />

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

// import "../styles/flip-animation.css";

// import { useCallback, useEffect, useState } from "react";

// import EventsSection from "../components/EventsSection";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import InscricaoModal from "../components/InscricaoModal";
// import KitExtrasSection from "../components/KitExtrasSection";
// import TestimonialsSection from "../components/TestimonialsSection";

// export default function Home() {
//   // 🔒 FEATURE FLAG CENTRAL (Single Source of Truth)
//   const isInscriptionOpen = false;

//   const [showInscricaoModal, setShowInscricaoModal] = useState(false);
//   const [paymentType, setPaymentType] = useState(null);

//   /**
//    * 🔐 GUARD CENTRAL (NÃO PERMITE ABRIR SE FECHADO)
//    * Clean Code: única responsabilidade → controlar acesso
//    */
//   const openInscription = useCallback(
//     (type = null) => {
//       if (!isInscriptionOpen) return; // 🚫 BLOQUEIO GLOBAL

//       if (type) setPaymentType(type);
//       setShowInscricaoModal(true);
//     },
//     [isInscriptionOpen],
//   );

//   /**
//    * 🔒 BLOQUEIA inclusive entrada externa (Google Forms)
//    */
//   useEffect(() => {
//     if (!isInscriptionOpen) return;

//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       if (params.get("fromForm") === "true") {
//         setShowInscricaoModal(true);
//       }
//     }
//   }, [isInscriptionOpen]);
//   const GOOGLE_FORM_URL =
//     process.env.REACT_APP_GOOGLE_FORM_URL ||
//     "https://forms.gle/cK5rsEZ75nbTYgTj9";

//   const handleInscricaoSuccess = () => {
//     console.log("Inscrição realizada com sucesso!");
//   };
//   const benefits = [
//     { icon: "👕", title: "Camisa Oficial" },
//     { icon: "🔢", title: "Número de Peito" },
//     { icon: "🥇", title: "Medalha Exclusiva" },
//     { icon: "🏆", title: "Pódios por Categoria" },
//     { icon: "💆", title: "Massagem" },
//     { icon: "❄️", title: "Piscina de Gelo" },
//     { icon: "🎧", title: "DJ ao Vivo" },
//     { icon: "☕", title: "Café da Manhã" },
//     { icon: "🎁", title: "Brindes Especiais" },
//     { icon: "🛡️", title: "Seguro Atleta" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
//       <Header />

//       {/* HERO */}
//       <div className="relative h-96 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-200 flex items-center justify-center">
//         <div className="text-center">
//           <img
//             src="/logoEntreAmigas.webp"
//             alt="Entre Amigas Logo"
//             className="h-64 mx-auto"
//           />
//           <p className="text-xl text-white font-semibold">
//             5ª Edição • Celebrando Amizade 💖
//           </p>
//         </div>
//       </div>

//       {/* BENEFÍCIOS */}
//       <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
//           {benefits.map((b, i) => (
//             <div key={i} className="text-center">
//               <div className="text-4xl">{b.icon}</div>
//               <p>{b.title}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PLANOS */}
//       <div className="max-w-6xl mx-auto py-12 grid md:grid-cols-2 gap-6">
//         {/* PIX */}
//         <div className="p-8 bg-pink-400 rounded-lg text-center">
//           <h3 className="text-white text-3xl">PIX</h3>

//           {isInscriptionOpen ? (
//             <button
//               onClick={() => openInscription("pix")}
//               className="bg-white text-pink-600 p-3 rounded-lg w-full"
//             >
//               Se Inscrever
//             </button>
//           ) : (
//             <button
//               disabled
//               className="bg-gray-300 p-3 w-full rounded-lg cursor-not-allowed"
//             >
//               ⏰ Inscrições Fechadas
//             </button>
//           )}
//         </div>

//         {/* CRÉDITO */}
//         <div className="p-8 bg-purple-400 rounded-lg text-center">
//           <h3 className="text-white text-3xl">Crédito</h3>

//           {isInscriptionOpen ? (
//             <button
//               onClick={() => openInscription("credito")}
//               className="bg-white text-purple-600 p-3 rounded-lg w-full"
//             >
//               Se Inscrever
//             </button>
//           ) : (
//             <button
//               disabled
//               className="bg-gray-300 p-3 w-full rounded-lg cursor-not-allowed"
//             >
//               ⏰ Inscrições Fechadas
//             </button>
//           )}
//         </div>
//       </div>

//       {/* CTA */}
//       <div className="text-center py-10">
//         {isInscriptionOpen ? (
//           <button
//             onClick={() => openInscription()}
//             className="bg-pink-500 text-white px-8 py-4 rounded-lg"
//           >
//             Inscreva-se
//           </button>
//         ) : (
//           <div className="text-red-500 font-bold text-xl">
//             ⏰ Inscrições Temporariamente Fechadas
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       <InscricaoModal
//         isOpen={showInscricaoModal}
//         onClose={() => setShowInscricaoModal(false)}
//         googleFormUrl={GOOGLE_FORM_URL}
//         onSuccess={handleInscricaoSuccess}
//         paymentType={paymentType}
//       />

//       <KitExtrasSection />
//       <EventsSection />
//       <TestimonialsSection />
//       <Footer />
//     </div>
//   );
// }

// import "../styles/flip-animation.css";

// import EventsSection from "../components/EventsSection";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import InscricaoModal from "../components/InscricaoModal";
// import KitExtrasSection from "../components/KitExtrasSection";
// import TestimonialsSection from "../components/TestimonialsSection";
// import { useEffect } from "react";
// import { useState } from "react";

// export default function Home() {
//   // 🔒 Controle de inscrições
//   const isInscriptionOpen = false; // Mude para true quando quiser reabrir
//   const [showInscricaoModal, setShowInscricaoModal] = useState(false);
//   const [paymentType, setPaymentType] = useState(null); // 'pix' | 'credito'

//   // Abre o modal automaticamente quando vindo do Google Forms
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       if (params.get("fromForm") === "true") {
//         setShowInscricaoModal(true);
//       }
//     }
//   }, []);

//   // URL do Google Form (configurada)
//   const GOOGLE_FORM_URL =
//     process.env.REACT_APP_GOOGLE_FORM_URL ||
//     "https://forms.gle/cK5rsEZ75nbTYgTj9";

//   const handleInscricaoSuccess = () => {
//     // Lógica adicional após sucesso
//     console.log("Inscrição realizada com sucesso!");
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
//           {/*🏃‍♀️*/}
//           <div
//             className="absolute top-20 right-20 text-5xl animate-bounce"
//             style={{ animationDelay: "0.2s" }}
//           ></div>
//           {/*💕*/}
//           <div
//             className="absolute bottom-10 left-1/4 text-5xl animate-bounce"
//             style={{ animationDelay: "0.4s" }}
//           ></div>{" "}
//           {/*🌸*/}
//         </div>
//         <div className="relative text-center px-4 z-10">
//           <img
//             src="/logoEntreAmigas.webp"
//             alt="Entre Amigas Logo"
//             className="h-64 md:h80 w-auto mx-auto drop-shadow-2xl"
//             title="Entre Amigas - Corrida de Mulheres"
//           />
//           <p className="text-xl md:text-2xl text-white drop-shadow-md font-semibold -mt-6 -translate-y-2">
//             5ª Edição • Celebrando Amizade, Saúde e Superação 💖
//           </p>
//         </div>
//       </div>

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

//       {/* Lotes de Inscrição */}
//       <div className="relative bg-gradient-to-b from-white to-pink-50 py-12 shadow-lg">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-600 mb-10 drop-shadow">
//             💰 Valor da Inscrição
//           </h2>

//           <div className="grid md:grid-cols-2 gap-6 mb-8">
//             {/* Lote 1 */}
//             <div
//               className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105 cursor-pointer"
//               //onClick={() => setShowInscricaoModal(true)} depois habilitar para abrir o modal
//             >
//               <div className="text-4xl font-bold text-white mb-3">PIX</div>
//               <p className="text-white text-lg mb-4 font-semibold">
//                 Á vista
//               </p>{" "}
//               {/* Alterado de 05/01/26 até 05/02/26 */}
//               <div className="bg-white rounded-lg p-4 mb-6">
//                 <p className="text-3xl font-bold text-pink-600">R$ 105,00</p>
//               </div>
//               {isInscriptionOpen ? (
//                 <button
//                   onClick={() => {
//                     setPaymentType("pix");
//                     setShowInscricaoModal(true);
//                   }}
//                   //disabled={!isInscriptionOpen} // 👈 Adicione isto
//                   // coloca o tipo de pagamento PIX
//                   className="w-full bg-white text-pink-600 font-bold py-3 px-4 rounded-lg hover:bg-pink-50 transition transform hover:scale-105 shadow-md"
//                 >
//                   🎯 Se Inscrever Agora
//                 </button>
//               ) : (
//                 <button
//                   disabled
//                   className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-4 rounded-lg cursor-not-allowed opacity-50"
//                 >
//                   ⏰ Inscrições Fechadas
//                 </button>
//               )}
//             </div>

//             {/* Lote 2 CREDITO*/}
//             <div
//               className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105 cursor-pointer"
//               //onClick={() => setShowInscricaoModal(true)} depois habilitar para abrir o modal
//             >
//               <div className="text-4xl font-bold text-white mb-3">Crédito</div>
//               <p className="text-white text-lg mb-4 font-semibold">
//                 Em duas vezes sem acréscimo
//               </p>
//               {/*06/02/26 até 30/03/26*/}
//               <div className="bg-white rounded-lg p-4 mb-6">
//                 <p className="text-3xl font-bold text-purple-600">R$ 115</p>
//               </div>

//               {isInscriptionOpen ? (
//                 <button
//                   onClick={() => {
//                     setPaymentType("credito"); // coloquei para testar o tipo de pagamento cartão de crédito
//                     setShowInscricaoModal(true);
//                   }}
//                   //disabled={!isInscriptionOpen} // 👈 Adicione isto
//                   className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg hover:bg-purple-50 transition transform hover:scale-105 shadow-md"
//                 >
//                   🎯 Se Inscrever Agora
//                 </button>
//               ) : (
//                 <button
//                   disabled
//                   className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-4 rounded-lg cursor-not-allowed opacity-50"
//                 >
//                   ⏰ Inscrições Fechadas
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="text-center bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
//             <p className="text-lg font-semibold text-yellow-800">
//               ⏰ Garanta sua inscrição no primeiro lote e economize! 💪
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
//         {/* About Section */}
//         <section id="sobre" className="bg-white rounded-lg shadow-md p-8">
//           <h2 className="text-3xl font-bold text-pink-600 mb-4">
//             O que é Entre Amigas?
//           </h2>
//           <p className="text-lg text-gray-700 leading-relaxed">
//             🌸 A Corrida Entre Amigas é mais do que um evento esportivo — é um
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

//         {/* Event Details - Cards Unificados e Responsivos */}
//         <section id="eventos" className="space-y-6">
//           <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">
//             📋 Informações do Evento
//           </h2>

//           {/* Card 1: Data e Local - Lado a Lado em Desktop */}
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Data Card */}
//             <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg shadow-lg p-8 border-l-4 border-pink-500 transform transition hover:scale-105">
//               <h3 className="text-3xl font-bold text-pink-600 mb-3">📅 Data</h3>
//               <p className="text-2xl font-semibold text-gray-800">17 de Maio</p>
//               <p className="text-lg text-gray-700">2026</p>
//               <p className="text-sm text-gray-600 mt-2">Dia memorável!</p>
//             </div>

//             {/* Local Card */}
//             <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500 transform transition hover:scale-105">
//               <h3 className="text-3xl font-bold text-purple-600 mb-3">
//                 📍 Local
//               </h3>
//               <p className="text-2xl font-semibold text-gray-800">
//                 Orla de Brasília Teimosa
//               </p>
//               <p className="text-lg text-gray-700">(Buraco da Velha)</p>
//               <p className="text-sm text-gray-600 mt-2">Recife - PE</p>
//             </div>
//           </div>

//           {/* Card 2: Largada, Distâncias e Categorias */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Largada Card */}
//             <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-lg p-6 border-l-4 border-rose-500 transform transition hover:scale-105">
//               <h3 className="text-2xl font-bold text-rose-600 mb-3">
//                 ⏰ Largada
//               </h3>
//               <p className="text-3xl font-bold text-gray-800">06:00</p>
//               <p className="text-gray-700">horas (matutino)</p>
//               <p className="text-sm text-gray-600 mt-2">
//                 Chegar com antecedência!
//               </p>
//             </div>

//             {/* Distâncias Card */}
//             <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 transform transition hover:scale-105">
//               <h3 className="text-2xl font-bold text-blue-600 mb-3">
//                 🏁 Distâncias
//               </h3>
//               <p className="text-lg font-semibold text-gray-800">
//                 📏 <strong>3 km</strong>
//               </p>
//               <p className="text-gray-700 text-sm mb-2">Para mulheres</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 📏 <strong>5 km</strong>
//               </p>
//               <p className="text-gray-700 text-sm">Mulheres e Homens</p>
//             </div>

//             {/* Categorias Card */}
//             <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 transform transition hover:scale-105">
//               <h3 className="text-2xl font-bold text-indigo-600 mb-3">
//                 🎽 Categorias
//               </h3>
//               <p className="text-lg font-semibold text-gray-800">👩 Feminino</p>
//               <p className="text-gray-700 text-sm mb-2">Todas as idades</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 👨 Masculino
//               </p>
//               <p className="text-gray-700 text-sm">Todas as idades</p>
//             </div>
//           </div>

//           {/* Card 3: Premiação */}
//           <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-lg p-8 border-l-4 border-yellow-500 transform transition hover:scale-105">
//             <h3 className="text-3xl font-bold text-yellow-600 mb-3">
//               🏆 Premiação
//             </h3>
//             <p className="text-lg text-gray-800 font-semibold">
//               Troféus para os 3 primeiros colocados em cada categoria
//             </p>
//             <p className="text-gray-700 mt-3">
//               Além de brindes especiais para todos os participantes!
//             </p>
//           </div>
//         </section>

//         {/* Kit e Pagamento */}

//         {/* Kit e Pagamento */}
//         <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
//           <h2 className="text-3xl font-bold mb-6">🎁 Inscrição Completa</h2>

//           <p className="text-2xl font-bold mb-6">
//             R$ 105 (Pix) | R$ 115 (Cartão)
//           </p>

//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-xl font-semibold mb-3">O que inclui:</h3>
//               <ul className="space-y-2 text-lg">
//                 <li>✓ Camisa oficial</li>
//                 <li>✓ Número de peito</li>
//                 <li>✓ Medalha de participação</li>
//                 <li>✓ Viseira</li>
//                 <li>✓ Ecobag</li>
//                 <li>✓ Seguro Atleta</li>
//                 <li>✓ Brindes de patrocinadores - Sorteios</li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-xl font-semibold mb-3">
//                 Formas de Pagamento:
//               </h3>
//               <p className="text-lg mb-4">
//                 💳 <strong>Pix ou Cartão</strong> (via Mercado Pago)
//               </p>
//               <p className="text-lg mb-4">ou</p>
//               <p className="text-lg">
//                 💰 <strong>Pix Direto:</strong>
//               </p>
//               <p className="text-sm bg-white text-gray-900 p-3 rounded mt-2 font-mono">
//                 07944726484
//               </p>
//             </div>
//           </div>

//           {/* 🔥 DIVISOR VISUAL */}
//           <div className="border-t border-white/30 my-8"></div>

//           {/* 👇 Kits alternativos */}
//           <KitExtrasSection />
//         </section>
//         {/*         <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
//           <h2 className="text-3xl font-bold mb-6">🎁 Inscrição Completa</h2>
//           <p className="text-2xl font-bold mb-4">
//             {" "}
//             R$ 105 (Pix) | R$ 115 (Cartão)
//           </p>
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-xl font-semibold mb-3">O que inclui:</h3>
//               <ul className="space-y-2 text-lg">
//                 <li>✓ Camisa oficial</li>
//                 <li>✓ Número de peito</li>
//                 <li>✓ Medalha de participação</li>
//                 <li>✓ Viseira</li>
//                 <li>✓ Ecobag</li>
//                 <li>✓ Seguro Atleta</li>
//                 <li>✓ Brindes de patrocinadores</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold mb-3">
//                 Formas de Pagamento:
//               </h3>
//               <p className="text-lg mb-4">
//                 💳 <strong>Pix ou Cartão</strong> (via Mercado Pago)
//               </p>
//               <p className="text-lg mb-4">ou</p>
//               <p className="text-lg">
//                 💰 <strong>Pix Direto:</strong>
//               </p>
//               <p className="text-sm bg-white text-gray-900 p-3 rounded mt-2 font-mono">
//                 07944726484
//               </p>
//             </div>
//           </div> */}
//         {/* 👇 Kit Extras 25 e 55*/}
//         {/*  <KitExtrasSection />
//         </section> */}

//         {/* Inscrição CTA */}
//         <section className="text-center space-y-6">
//           <div>
//             <p className="text-2xl text-gray-700 mb-4">
//               Pronto(a) para fazer parte dessa história?
//             </p>
//             {!isInscriptionOpen ? (
//               // 📢 Mensagem quando inscrições estão FECHADAS
//               <div className="bg-red-50 rounded-lg p-8 border-2 border-red-300 mb-4 mx-auto max-w-md">
//                 <p className="text-2xl font-bold text-red-600 mb-2">
//                   ⏰ Em Breve!
//                 </p>
//                 <p className="text-gray-700 mb-3">
//                   Inscrições temporariamente fechadas
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Fique atenta para as próximas inscrições! 💕
//                 </p>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setShowInscricaoModal(true)}
//                 //disabled={!isInscriptionOpen} // 👈 Adicione isto
//                 className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform transition hover:scale-105"
//               >
//                 🏃‍♀️ Clique aqui. Se inscreva você também! 💕
//               </button>
//             )}
//           </div>
//         </section>

//         {/* Modal de Inscrição */}
//         <InscricaoModal
//           isOpen={showInscricaoModal}
//           onClose={() => setShowInscricaoModal(false)}
//           googleFormUrl={GOOGLE_FORM_URL}
//           onSuccess={handleInscricaoSuccess}
//           paymentType={paymentType}
//         />

//         {/* Events Section */}
//         <EventsSection />

//         {/* Testimonials Section Depoimentos*/}
//         <TestimonialsSection />

//         {/* Regras */}
//         <section
//           id="regras"
//           className="bg-yellow-50 rounded-lg shadow p-8 border-l-4 border-yellow-400"
//         >
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             🏆 Regras Importantes
//           </h2>
//           <ul className="space-y-3 text-lg text-gray-700">
//             <li>
//               <strong>📋 Pipoca não vai para os pódios</strong>
//             </li>
//             <li>
//               <strong>
//                 🎽 Não levamos kits para retirar no dia da corrida
//               </strong>{" "}
//               - Retirada uma semana antes
//             </li>
//             <li>
//               <strong>⏰ Chegue com antecedência</strong>
//             </li>
//           </ul>
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
//     </div>
//   );
// }
