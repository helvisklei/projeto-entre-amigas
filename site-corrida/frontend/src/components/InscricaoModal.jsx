import React, { useEffect, useState } from 'react';

export default function InscricaoModal({ isOpen, onClose, googleFormUrl, onSuccess,paymentType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Monitorar parâmetro de URL para retorno automático do Google Forms
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Se o usuário volta via redirect com ?fromForm=true
    if (params.get('fromForm') === 'true' && isOpen) {
      setIsLoading(false);
      setShowConfirmation(true);
      // Limpa a URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isOpen]);

  // Monitorar quando o usuário retorna do Google Forms (window focus)
  React.useEffect(() => {
    const handleFocus = () => {
      // Quando a janela recebe foco (usuário voltou da aba do Forms)
      const formSubmitTime = sessionStorage.getItem('formSubmitTime');
      const currentTime = Date.now();
      
      // Se o Google Forms foi aberto há menos de 5 minutos
      if (formSubmitTime && (currentTime - parseInt(formSubmitTime)) < 300000) {
        // Mostrar tela de pagamento automaticamente
        setIsLoading(false);
        setShowConfirmation(true);
        sessionStorage.removeItem('formSubmitTime');
      }
    };

    if (isOpen) {
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [isOpen]);

  const handleGoogleFormClick = () => {
    setIsLoading(true);
    // Armazena o tempo de abertura do formulário
    sessionStorage.setItem('formSubmitTime', Date.now().toString());
    
    // Abre o Google Forms em nova aba
    // O Google Forms redireciona automaticamente após submissão
    window.open(googleFormUrl, '_blank');
    
    // Fallback: se o usuário não voltar em 5 minutos, mostrar opção manual
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setShowConfirmation(true);
      }
    }, 300000); // 5 minutos
    
    return () => clearTimeout(timeout);
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
    window.location.href = 'https://mpago.li/2BNyGHm';
  };

  // ⬇⬇⬇ AQUI ⬇⬇⬇
  const pixKey = "00020126330014br.gov.bcb.pix0111079447264845204000053039865406105.005802BR5921Denize Jaques Valenca6009Sao Paulo610901227-20062230519daqr1745725661741916304042E";

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      alert("Chave Pix copiada com sucesso. Abra o aplicativo do seu banco, acesse a opção Pix, cole a chave e finalize o pagamento.");
    } catch (err) {
      alert("Não foi possível copiar automaticamente. Copie manualmente a chave Pix.");
    }
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
                <strong>✓ Formulário enviado com sucesso</strong><br/>
                <strong>✓ Enviar comprovante para validar inscrição</strong><br/>
                <strong>✓ Limite: 200 pessoas</strong>
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

              {isLoading && (
                <button
                  onClick={() => {
                    setIsLoading(false);
                    setShowConfirmation(true);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  ✓ Já Preencheu? Avançar para Pagamento
                </button>
              )}

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
                Parabéns! Agora você precisa pagar a taxa para confirmar sua inscrição.
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

              {paymentType==='pix'&& (
              <button
                onClick={handleCopyPix}
                className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2 border border-gray-300 rounded-lg transition"
              >
                💠 Copiar chave Pix e pagar no banco
              </button>)}
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
