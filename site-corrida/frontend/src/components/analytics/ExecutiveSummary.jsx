function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ExecutiveSummary({ analytics }) {
  if (!analytics) {
    return null;
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        mb-6
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          mb-6
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
            "
          >
            📊 Resumo Executivo
          </h2>

          <p className="text-gray-500">Gestão operacional da corrida</p>
        </div>

        <button
          onClick={() => window.print()}
          className="
            bg-purple-600
            hover:bg-purple-700
            text-white
            font-semibold
            px-5
            py-3
            rounded-xl
            transition
          "
        >
          🖨️ Imprimir Relatório
        </button>
      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          xl:grid-cols-5    
          gap-4
        "
      >
        <div
          className="
            bg-purple-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Total Inscritos</p>

          <h3
            className="
              text-3xl
              font-bold
              text-purple-700
            "
          >
            {analytics.totalInscritos}
          </h3>
        </div>

        <div
          className="
            bg-green-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Arrecadado Bruto</p>

          <h3
            className="
              text-2xl
              font-bold
              text-green-700
              break-words
            "
          >
            {formatMoney(analytics.totalArrecadado)}
          </h3>
        </div>

        <div
          className="
            bg-emerald-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Receita Líquida</p>

          <h3
            className="
              text-2xl
              font-bold
              text-emerald-700
              break-words
            "
          >
            {formatMoney(analytics.totalLiquido)}
          </h3>
        </div>

        <div
          className="
            bg-red-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Taxas Mercado Pago</p>

          <h3
            className="
              text-2xl
              font-bold
              text-red-700
              break-words
            "
          >
            {formatMoney(analytics.totalTaxasMp)}
          </h3>
        </div>

        <div
          className="
            bg-orange-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Desenvolvedor</p>

          <h3
            className="
              text-2xl
              font-bold
              text-orange-700
              break-words
            "
          >
            {formatMoney(analytics.valorDesenvolvedor)}
          </h3>
        </div>

        <div
          className="
            bg-blue-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Kits Vendidos</p>

          <h3
            className="
              text-3xl
              font-bold
              text-blue-700
            "
          >
            {Object.values(analytics.kits || {}).reduce(
              (total, item) => total + item,
              0,
            )}
          </h3>
        </div>
        <div
          className="
            bg-pink-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Equipe</p>

          <h3
            className="
              text-3xl
              font-bold
              text-pink-700
            "
          >
            {analytics.totalEquipe || 0}
          </h3>
        </div>

        <div
          className="
            bg-cyan-50
            rounded-xl
            p-4
          "
        >
          <p className="text-sm text-gray-500">PIX Recebido</p>

          <h3
            className="
              text-2xl
              font-bold
              text-cyan-700
            "
          >
            {formatMoney(analytics.pixRecebido)}
          </h3>
        </div>

        <div
          className="
            bg-indigo-50
            rounded-xl
            p-4
          "
        >
          <p className="text-sm text-gray-500">Cartão Recebido</p>

          <h3
            className="
              text-2xl
              font-bold
              text-indigo-700
            "
          >
            {formatMoney(analytics.cartaoRecebido)}
          </h3>
        </div>

        <div
          className="
            bg-emerald-50
            rounded-xl
            p-4
          "
        >
          <p className="text-sm text-gray-500">Ticket Médio</p>

          <h3
            className="
              text-2xl
              font-bold
              text-emerald-700
            "
          >
            {formatMoney(analytics.ticketMedio)}
          </h3>
        </div>

        <div
          className="
            bg-yellow-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Parceria</p>

          <h3
            className="
              text-3xl
              font-bold
              text-yellow-700
            "
          >
            {analytics.totalParceria || 0}
          </h3>
        </div>

        {/* <div
          className="
            bg-cyan-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Divulgação</p>

          <h3
            className="
              text-3xl
              font-bold
              text-cyan-700
            "
          >
            {analytics.totalDivulgacao || 0}
          </h3>
        </div> */}
      </div>
    </div>
  );
}
