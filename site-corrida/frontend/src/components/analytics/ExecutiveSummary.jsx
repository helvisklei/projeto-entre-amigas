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

  const resumo = analytics.resumoExecutivo || {};

  // const pix = resumo.pix || {};

  // const cartao = resumo.cartao || {};

  // const descontos = resumo.descontos || {};

  /*
==========================================================
FORMAS DE PAGAMENTO
==========================================================

Os dados abaixo já chegam calculados pelo backend.

pix
→ consolidado de todos os pagamentos PIX;

pixMercadoPago
→ pagamentos PIX processados pelo Mercado Pago;

pixDireto
→ pagamentos PIX recebidos diretamente, sem taxa
do Mercado Pago;

cartao
→ pagamentos realizados por cartão.

Este componente:

- não realiza cálculos financeiros;
- não soma valores;
- não subtrai taxas;
- não altera analytics;
- não realiza nova chamada à API;
- apenas apresenta os valores recebidos.
==========================================================
*/

  const pix = resumo.pix || {};

  const pixMercadoPago = resumo.pixMercadoPago || {};

  const pixDireto = resumo.pixDireto || {};

  const cartao = resumo.cartao || {};

  const descontos = resumo.descontos || {};

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
          <p className="text-sm text-gray-500">Receita Potencial</p>

          <h3
            className="
              text-2xl
              font-bold
              text-green-700
              break-words
            "
          >
            {formatMoney(resumo.receitaPotencial)}{" "}
            {/*{formatMoney(analytics.totalArrecadado)}*/}
          </h3>
        </div>

        {/* 
        ==========================================================
        DESCONTOS CONCEDIDOS
        ==========================================================

        Representa a redução total aplicada entre:

        VALOR_ORIGINAL → VALOR_FINAL

        Inclui descontos classificados como:

        - Cupom
        - TEA
        - PCD
        - Idoso
        - Equipe
        - Parceria
        - Divulgação
        - Cortesia
        - Não classificado

        Este componente apenas exibe o valor calculado
        pelo backend.
        ==========================================================
        */}

        <div
          className="
            bg-rose-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Descontos Concedidos</p>

          <h3
            className="
              text-2xl
              font-bold
              text-rose-700
              break-words
            "
          >
            {formatMoney(resumo.descontosConcedidos)}
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
          <p className="text-sm text-gray-500">Receita Comercial</p>

          <h3
            className="
              text-2xl
              font-bold
              text-emerald-700
              break-words
            "
          >
            {formatMoney(resumo.receitaComercial)}{" "}
            {/*{formatMoney(analytics.totalLiquido)}*/}
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
            {formatMoney(resumo.taxaMercadoPago)}{" "}
            {/*{formatMoney(analytics.totalTaxasMp)}*/}
          </h3>
        </div>

        {/* 
        ==========================================================
        RECEITA LÍQUIDA REAL
        ==========================================================

        Representa o valor efetivamente identificado na coluna:

        VALOR_LIQUIDO

        Este é o valor líquido registrado após as taxas
        do intermediador de pagamento.

        O frontend não realiza subtrações.

        Apenas apresenta o valor consolidado pelo backend.
        ==========================================================
        */}

        <div
          className="
            bg-emerald-50
            rounded-xl
            p-4
            min-w-0
            overflow-hidden
          "
        >
          <p className="text-sm text-gray-500">Receita Líquida Real</p>

          <h3
            className="
              text-2xl
              font-bold
              text-emerald-700
              break-words
            "
          >
            {formatMoney(resumo.receitaLiquida)}
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

        {/*         <div
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
        </div> */}
        {/* <div
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
        </div> */}

        {/*         <div
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
        </div> */}

        {/*         <div
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
        </div> */}

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

        {/*         <div
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
        </div> */}
      </div>

      {/* 
      ==========================================================
      DETALHAMENTO POR FORMA DE PAGAMENTO
      ==========================================================

      Exibe os valores financeiros separados por:

      - PIX
      - Cartão

      Os valores já foram calculados pelo backend.

      Este componente:

      - não calcula valores;
      - não altera dados;
      - não realiza nova chamada à API;
      - não escreve na planilha;
      - apenas apresenta analytics.resumoExecutivo.
      ==========================================================
      */}

      <div
        className="
          mt-8
          pt-8
          border-t
          border-gray-200
        "
      >
        <div className="mb-5">
          <h3
            className="
              text-xl
              font-bold
              text-gray-800
            "
          >
            💳 Detalhamento por Forma de Pagamento
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Comparativo entre os valores comerciais, as taxas e os valores
            líquidos registrados.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          "
        >
          {/* 
          ========================================================
          PIX
          ========================================================
          */}

          {/* 
          ========================================================
          PIX CONSOLIDADO
          ========================================================

          Apresenta o total de todos os pagamentos PIX.

          Composição:

          - PIX Mercado Pago;
          - PIX Direto.

          Os valores são recebidos prontos do backend.

          Este componente:

          - não soma valores;
          - não calcula taxas;
          - não calcula valores líquidos;
          - não altera analytics;
          - não realiza nova chamada à API.
          ========================================================
          */}

          <div
            className="
              rounded-2xl
              border
              border-cyan-200
              bg-cyan-50
              p-5
            "
          >
            {/*
            ======================================================
            CABEÇALHO DO PIX CONSOLIDADO
            ======================================================
            */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-5
              "
            >
              <div>
                <h4
                  className="
                    text-xl
                    font-bold
                    text-cyan-800
                  "
                >
                  PIX Consolidado
                </h4>

                <p
                  className="
                    text-sm
                    text-cyan-700
                  "
                >
                  Total recebido por PIX Mercado Pago e PIX Direto
                </p>
              </div>

              <div
                className="
                  w-fit
                  rounded-xl
                  bg-white
                  px-4
                  py-2
                  text-center
                  shadow-sm
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Pagamentos
                </p>

                <strong
                  className="
                    text-xl
                    text-cyan-700
                  "
                >
                  {Number(pix.quantidade || 0)}
                </strong>
              </div>
            </div>

            {/*
            ======================================================
            VALORES CONSOLIDADOS DO PIX
            ======================================================
            */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
              "
            >
              <div
                className="
                  min-w-0
                  rounded-xl
                  bg-white
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Valor Comercial
                </p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-gray-800
                    break-words
                  "
                >
                  {formatMoney(pix.bruto)}
                </strong>
              </div>

              <div
                className="
                  min-w-0
                  rounded-xl
                  bg-white
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Taxas
                </p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-red-600
                    break-words
                  "
                >
                  {formatMoney(pix.taxas)}
                </strong>
              </div>

              <div
                className="
                  min-w-0
                  rounded-xl
                  bg-white
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Líquido Recebido
                </p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-emerald-700
                    break-words
                  "
                >
                  {formatMoney(pix.liquido)}
                </strong>
              </div>
            </div>

            {/*
            ======================================================
            COMPOSIÇÃO DO PIX
            ======================================================

            Separa visualmente:

            - PIX Mercado Pago;
            - PIX Direto.

            Não altera o consolidado apresentado acima.
            ======================================================
            */}

            <div
              className="
                mt-5
                border-t
                border-cyan-200
                pt-5
              "
            >
              <div
                className="
                  mb-3
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-cyan-900
                  "
                >
                  Composição do PIX
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-cyan-700
                  "
                >
                  Separação entre os valores processados pelo Mercado Pago e os
                  valores recebidos diretamente.
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  xl:grid-cols-2
                  gap-4
                "
              >
                {/*
                ====================================================
                PIX MERCADO PAGO
                ====================================================
                */}

                <div
                  className="
                    rounded-xl
                    border
                    border-sky-200
                    bg-white
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                      mb-4
                    "
                  >
                    <div>
                      <h5
                        className="
                          font-bold
                          text-sky-800
                        "
                      >
                        PIX Mercado Pago
                      </h5>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                        "
                      >
                        Pagamentos processados pelo intermediador
                      </p>
                    </div>

                    <span
                      className="
                        inline-flex
                        min-w-[42px]
                        items-center
                        justify-center
                        rounded-full
                        bg-sky-100
                        px-3
                        py-1
                        text-sm
                        font-bold
                        text-sky-700
                      "
                    >
                      {Number(pixMercadoPago.quantidade || 0)}
                    </span>
                  </div>

                  <div
                    className="
                      space-y-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <span
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        Valor Comercial
                      </span>

                      <strong
                        className="
                          text-sm
                          text-gray-800
                          text-right
                        "
                      >
                        {formatMoney(pixMercadoPago.bruto)}
                      </strong>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <span
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        Taxas
                      </span>

                      <strong
                        className="
                          text-sm
                          text-red-600
                          text-right
                        "
                      >
                        {formatMoney(pixMercadoPago.taxas)}
                      </strong>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-gray-100
                        pt-3
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-semibold
                          text-gray-600
                        "
                      >
                        Líquido
                      </span>

                      <strong
                        className="
                          text-base
                          text-emerald-700
                          text-right
                        "
                      >
                        {formatMoney(pixMercadoPago.liquido)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/*
                ====================================================
                PIX DIRETO
                ====================================================
                */}

                <div
                  className="
                    rounded-xl
                    border
                    border-emerald-200
                    bg-white
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                      mb-4
                    "
                  >
                    <div>
                      <h5
                        className="
                          font-bold
                          text-emerald-800
                        "
                      >
                        PIX Direto
                      </h5>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                        "
                      >
                        Recebimentos diretos sem taxa do Mercado Pago
                      </p>
                    </div>

                    <span
                      className="
                        inline-flex
                        min-w-[42px]
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-100
                        px-3
                        py-1
                        text-sm
                        font-bold
                        text-emerald-700
                      "
                    >
                      {Number(pixDireto.quantidade || 0)}
                    </span>
                  </div>

                  <div
                    className="
                      space-y-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <span
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        Valor Comercial
                      </span>

                      <strong
                        className="
                          text-sm
                          text-gray-800
                          text-right
                        "
                      >
                        {formatMoney(pixDireto.bruto)}
                      </strong>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <span
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        Taxas
                      </span>

                      <strong
                        className="
                          text-sm
                          text-emerald-700
                          text-right
                        "
                      >
                        {formatMoney(pixDireto.taxas)}
                      </strong>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-gray-100
                        pt-3
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-semibold
                          text-gray-600
                        "
                      >
                        Líquido
                      </span>

                      <strong
                        className="
                          text-base
                          text-emerald-700
                          text-right
                        "
                      >
                        {formatMoney(pixDireto.liquido)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div
            className="
              rounded-2xl
              border
              border-cyan-200
              bg-cyan-50
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                mb-5
              "
            >
              <div>
                <h4
                  className="
                    text-xl
                    font-bold
                    text-cyan-800
                  "
                >
                  PIX
                </h4>

                <p className="text-sm text-cyan-700">
                  Recebimentos identificados como PIX
                </p>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  px-4
                  py-2
                  text-center
                  shadow-sm
                "
              >
                <p className="text-xs text-gray-500">Pagamentos</p>

                <strong
                  className="
                    text-xl
                    text-cyan-700
                  "
                >
                  {Number(pix.quantidade || 0)}
                </strong>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
              "
            >
              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  min-w-0
                "
              >
                <p className="text-xs text-gray-500">Valor Comercial</p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-gray-800
                    break-words
                  "
                >
                  {formatMoney(pix.bruto)}
                </strong>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  min-w-0
                "
              >
                <p className="text-xs text-gray-500">Taxas</p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-red-600
                    break-words
                  "
                >
                  {formatMoney(pix.taxas)}
                </strong>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  min-w-0
                "
              >
                <p className="text-xs text-gray-500">Líquido Recebido</p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-emerald-700
                    break-words
                  "
                >
                  {formatMoney(pix.liquido)}
                </strong>
              </div>
            </div>
          </div> */}

          {/* 
          ========================================================
          CARTÃO
          ========================================================
          */}

          <div
            className="
              rounded-2xl
              border
              border-indigo-200
              bg-indigo-50
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                mb-5
              "
            >
              <div>
                <h4
                  className="
                    text-xl
                    font-bold
                    text-indigo-800
                  "
                >
                  Cartão
                </h4>

                <p className="text-sm text-indigo-700">
                  Recebimentos identificados como cartão
                </p>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  px-4
                  py-2
                  text-center
                  shadow-sm
                "
              >
                <p className="text-xs text-gray-500">Pagamentos</p>

                <strong
                  className="
                    text-xl
                    text-indigo-700
                  "
                >
                  {Number(cartao.quantidade || 0)}
                </strong>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
              "
            >
              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  min-w-0
                "
              >
                <p className="text-xs text-gray-500">Valor Comercial</p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-gray-800
                    break-words
                  "
                >
                  {formatMoney(cartao.bruto)}
                </strong>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  min-w-0
                "
              >
                <p className="text-xs text-gray-500">Taxas</p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-red-600
                    break-words
                  "
                >
                  {formatMoney(cartao.taxas)}
                </strong>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  min-w-0
                "
              >
                <p className="text-xs text-gray-500">Líquido Recebido</p>

                <strong
                  className="
                    block
                    mt-1
                    text-lg
                    text-emerald-700
                    break-words
                  "
                >
                  {formatMoney(cartao.liquido)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
      ==========================================================
      COMPOSIÇÃO DOS DESCONTOS
      ==========================================================

      Exibe a distribuição dos descontos concedidos.

      Os valores são calculados exclusivamente pelo backend
      por meio do AnalyticsResumoExecutivoService.

      Este componente:

      - não calcula descontos;
      - não altera valores;
      - não escreve na planilha;
      - não realiza nova chamada à API;
      - não interfere no financeiro legado;
      - não interfere na logística.

      A soma das categorias deve corresponder ao indicador:

      resumo.descontosConcedidos
      ==========================================================
      */}

      <div
        className="
          mt-8
          pt-8
          border-t
          border-gray-200
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
            mb-5
          "
        >
          <div>
            <h3
              className="
                text-xl
                font-bold
                text-gray-800
              "
            >
              🏷️ Composição dos Descontos
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Distribuição das reduções aplicadas sobre os valores originais das
              inscrições.
            </p>
          </div>

          <div
            className="
              bg-rose-50
              border
              border-rose-200
              rounded-xl
              px-5
              py-3
              min-w-0
            "
          >
            <p
              className="
                text-xs
                text-rose-600
              "
            >
              Total de descontos
            </p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-rose-700
                break-words
              "
            >
              {formatMoney(resumo.descontosConcedidos)}
            </strong>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-4
          "
        >
          {/* CUPOM */}

          <div
            className="
              bg-purple-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">Cupom</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-purple-700
                break-words
              "
            >
              {formatMoney(descontos.cupom)}
            </strong>
          </div>

          {/* TEA */}

          <div
            className="
              bg-blue-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">TEA</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-blue-700
                break-words
              "
            >
              {formatMoney(descontos.tea)}
            </strong>
          </div>

          {/* PCD */}

          <div
            className="
              bg-cyan-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">PCD</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-cyan-700
                break-words
              "
            >
              {formatMoney(descontos.pcd)}
            </strong>
          </div>

          {/* IDOSO */}

          <div
            className="
              bg-amber-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">Idoso</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-amber-700
                break-words
              "
            >
              {formatMoney(descontos.idoso)}
            </strong>
          </div>

          {/* EQUIPE */}

          <div
            className="
              bg-pink-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">Equipe</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-pink-700
                break-words
              "
            >
              {formatMoney(descontos.equipe)}
            </strong>
          </div>

          {/* PARCERIA */}

          <div
            className="
              bg-yellow-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">Parceria</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-yellow-700
                break-words
              "
            >
              {formatMoney(descontos.parceria)}
            </strong>
          </div>

          {/* DIVULGAÇÃO */}

          <div
            className="
              bg-indigo-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">Divulgação</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-indigo-700
                break-words
              "
            >
              {formatMoney(descontos.divulgacao)}
            </strong>
          </div>

          {/* CORTESIA */}

          <div
            className="
              bg-emerald-50
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">Cortesia</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-emerald-700
                break-words
              "
            >
              {formatMoney(descontos.cortesia)}
            </strong>
          </div>

          {/* NÃO CLASSIFICADO */}

          <div
            className="
              bg-gray-100
              rounded-xl
              p-4
              min-w-0
            "
          >
            <p className="text-sm text-gray-500">Não Classificado</p>

            <strong
              className="
                block
                mt-1
                text-xl
                text-gray-700
                break-words
              "
            >
              {formatMoney(descontos.naoClassificado)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
