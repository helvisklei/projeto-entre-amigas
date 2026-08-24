import TermoRetiradaKit from "../components/logistics/TermoRetiradaKit";

export default function TesteTermoRetirada() {
  const participanteTeste = {
    nome: "Maria da Silva",
    cpf: "123.456.789-00",
    numeroInscricao: "EA20260001",
  };

  const kitTeste = {
    nome: "KIT COMPLETO",
    itens: [
      "👕 Camisa Oficial",
      "🛍️ Ecobag",
      "🧢 Viseira",
      "🔢 Número de Peito",
      "🏅 Medalha pós-prova",
    ],
  };

  const eventoTeste = {
    nome: "6ª Corrida Entre Amigas RUN",
    data: "29/11/2026",
    local: "Brasília Teimosa - Recife/PE",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            🧪 Teste do Termo de Retirada
          </h1>

          <p className="text-gray-500 mt-1">
            Ambiente de simulação do documento.
          </p>
        </div>

        <TermoRetiradaKit
          participante={participanteTeste}
          kit={kitTeste}
          evento={eventoTeste}
        />
      </div>
    </div>
  );
}
