import React, { useState } from 'react';

export default function InscricaoModal({ isOpen, onClose, googleFormUrl, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleGoogleFormClick = () => {
    setIsLoading(true);
    // Abre o Google Forms em nova aba
    window.open(googleFormUrl, '_blank');
    
    // Simula delay para permitir preenchimento
    // Depois de 3 segundos, mostra opção de confirmar
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmation(true);
    }, 3000);
  };

  const handleConfirmInscription = () => {
    setShowConfirmation(false);
    setIsLoading(false);
    
    // Chama callback se fornecido
    if (onSuccess) {
      onSuccess();
    }
    
    // Fecha o modal após 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleGoToPayment = () => {
    // Redireciona para pagamento (Mercado Pago)
    window.location.href = 'https://mpago.li/17yVTQM';
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-in fade-in scale-95 transition">
        
        {!showConfirmation ? (
          <>
            {/* Etapa 1: Abrir Google Forms */}
            <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
              🎯 Inscrição Entre Amigas
            </h2>
            
            <p className="text-gray-700 mb-6 text-center">
              Você será redirecionada para o formulário do Google Forms para completar sua inscrição.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-sm text-blue-900">
                <strong>✓ Formulário seguro</strong><br/>
                <strong>✓ Sincroniza com Google Sheets</strong><br/>
                <strong>✓ Limite: 100 pessoas</strong>
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleFormClick}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-70"
              >
                {isLoading ? '⏳ Abrindo formulário...' : '📋 Abrir Google Forms'}
              </button>

              <button
                onClick={handleCancel}
                className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Etapa 2: Após preencher o formulário */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Formulário Preenchido!
              </h2>
              <p className="text-gray-700">
                Parabéns! Agora você precisa pagar a taxa de R$ 100,00 para confirmar sua inscrição.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
              <p className="text-sm text-yellow-900">
                <strong>💡 Próximo Passo:</strong><br/>
                Escolha a forma de pagamento abaixo:
              </p>
            </div>

            <div className="space-y-3">
              {/* Opção 1: Pagar e voltar */}
              <button
                onClick={handleConfirmInscription}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                ✓ Já Paguei / Pago depois
              </button>

              {/* Opção 2: Ir para Mercado Pago */}
              <button
                onClick={handleGoToPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <span>💳</span> Pagar com Mercado Pago
              </button>

              {/* Opção 3: Pagar depois */}
              <button
                onClick={handleConfirmInscription}
                className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2 border border-gray-300 rounded-lg transition"
              >
                Pago Depois
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Dados já foram salvos no Google Forms
            </p>
          </>
        )}
      </div>
    </div>
  );
}
