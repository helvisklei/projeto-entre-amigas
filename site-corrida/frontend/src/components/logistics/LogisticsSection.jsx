/*
==========================================================
LOGISTICS SECTION
==========================================================

Responsável exclusivamente pela apresentação dos
indicadores logísticos da corrida.

Fonte dos dados:

analytics.logistica

Este componente:

- não realiza cálculos financeiros;
- não altera dados;
- não escreve na planilha;
- não realiza nova chamada à API;
- não utiliza analytics.kits;
- não utiliza analytics.camisas;
- não interfere no Seguro Atleta;
- não interfere no Número de Peito operacional.

A quantidade recomendada para compra utiliza somente
participantes confirmados/pagos.
==========================================================
*/

/*
==========================================================
ORDEM PADRÃO DOS TAMANHOS
==========================================================

Define exclusivamente a ordem de apresentação das camisas.

Os tamanhos que ainda não existem no retorno da API
serão apresentados com valores zerados.

Esta estrutura:

- não altera analytics;
- não altera analytics.logistica;
- não escreve na planilha;
- não cria tamanhos no backend;
- controla apenas a apresentação no frontend.
==========================================================
*/

import { useState } from "react";

const TAMANHOS_CAMISA = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "XG",
  "INFANTIL 02",
  "INFANTIL 04",
  "INFANTIL 06",
  "INFANTIL 08",
  "INFANTIL 10",
  "INFANTIL 12",
  "INFANTIL 14",
  "NÃO INFORMADO",
];

function somarResumo(resumo = {}) {
  return Object.values(resumo).reduce(
    (acumulador, item) => {
      return {
        pagos: acumulador.pagos + Number(item?.pagos || 0),

        pendentes: acumulador.pendentes + Number(item?.pendentes || 0),

        total: acumulador.total + Number(item?.total || 0),
      };
    },
    {
      pagos: 0,
      pendentes: 0,
      total: 0,
    },
  );
}

/*
==========================================================
CARD DE RESUMO LOGÍSTICO
==========================================================

Apresenta:

- quantidade confirmada;
- quantidade pendente;
- cenário total.

O componente recebe os valores prontos e não conhece
regras da planilha ou do backend.
==========================================================
*/

function LogisticsSummaryCard({ title, icon, summary }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          mb-5
        "
      >
        <span className="text-2xl">{icon}</span>

        <h3
          className="
            text-lg
            font-bold
            text-gray-800
          "
        >
          {title}
        </h3>
      </div>

      <div
        className="
          grid
          grid-cols-3
          gap-3
        "
      >
        <div
          className="
            rounded-xl
            bg-emerald-50
            p-3
            text-center
          "
        >
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Confirmados
          </p>

          <strong
            className="
              block
              mt-1
              text-2xl
              text-emerald-700
            "
          >
            {summary.pagos}
          </strong>
        </div>

        <div
          className="
            rounded-xl
            bg-amber-50
            p-3
            text-center
          "
        >
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Pendentes
          </p>

          <strong
            className="
              block
              mt-1
              text-2xl
              text-amber-700
            "
          >
            {summary.pendentes}
          </strong>
        </div>

        <div
          className="
            rounded-xl
            bg-blue-50
            p-3
            text-center
          "
        >
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Cenário Total
          </p>

          <strong
            className="
              block
              mt-1
              text-2xl
              text-blue-700
            "
          >
            {summary.total}
          </strong>
        </div>
      </div>
    </div>
  );
}

/*
==========================================================
DETALHAMENTO LOGÍSTICO DE CAMISAS
==========================================================

Responsável exclusivamente por apresentar:

- tamanho;
- quantidade confirmada;
- quantidade pendente;
- cenário total.

Fonte:

analytics.logistica.camisas

Não utiliza:

analytics.camisas

Não altera dados.

Não realiza cálculos financeiros.

Não escreve na planilha.
==========================================================
*/

// function LogisticsShirtsTable({ shirts = {} }) {
//   return (
//     <div
//       className="
//         mt-8
//         rounded-2xl
//         border
//         border-gray-200
//         bg-white
//         p-5
//         shadow-sm
//       "
//     >
//       <div className="mb-5">
//         <h3
//           className="
//             text-xl
//             font-bold
//             text-purple-700
//           "
//         >
//           👕 Camisas por Tamanho
//         </h3>

//         <p
//           className="
//             mt-1
//             text-sm
//             text-gray-500
//           "
//         >
//           Quantidades confirmadas, pendentes e cenário máximo por tamanho.
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <table
//           className="
//             w-full
//             min-w-[650px]
//             text-sm
//           "
//         >
//           <thead>
//             <tr
//               className="
//                 border-b
//                 border-gray-200
//                 bg-gray-50
//               "
//             >
//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-left
//                   font-semibold
//                   text-gray-600
//                 "
//               >
//                 Tamanho
//               </th>

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-center
//                   font-semibold
//                   text-emerald-700
//                 "
//               >
//                 Confirmadas
//               </th>

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-center
//                   font-semibold
//                   text-amber-700
//                 "
//               >
//                 Pendentes
//               </th>

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-center
//                   font-semibold
//                   text-blue-700
//                 "
//               >
//                 Cenário Total
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {TAMANHOS_CAMISA.map((tamanho) => {
//               const resumo = shirts[tamanho] || {
//                 pagos: 0,
//                 pendentes: 0,
//                 total: 0,
//               };

//               return (
//                 <tr
//                   key={tamanho}
//                   className="
//                       border-b
//                       border-gray-100
//                       transition
//                       hover:bg-gray-50
//                     "
//                 >
//                   <td
//                     className="
//                         px-4
//                         py-3
//                         font-semibold
//                         text-gray-700
//                       "
//                   >
//                     {tamanho}
//                   </td>

//                   <td
//                     className="
//                         px-4
//                         py-3
//                         text-center
//                       "
//                   >
//                     <span
//                       className="
//                           inline-flex
//                           min-w-[40px]
//                           justify-center
//                           rounded-full
//                           bg-emerald-100
//                           px-3
//                           py-1
//                           font-bold
//                           text-emerald-700
//                         "
//                     >
//                       {Number(resumo.pagos || 0)}
//                     </span>
//                   </td>

//                   <td
//                     className="
//                         px-4
//                         py-3
//                         text-center
//                       "
//                   >
//                     <span
//                       className="
//                           inline-flex
//                           min-w-[40px]
//                           justify-center
//                           rounded-full
//                           bg-amber-100
//                           px-3
//                           py-1
//                           font-bold
//                           text-amber-700
//                         "
//                     >
//                       {Number(resumo.pendentes || 0)}
//                     </span>
//                   </td>

//                   <td
//                     className="
//                         px-4
//                         py-3
//                         text-center
//                       "
//                   >
//                     <span
//                       className="
//                           inline-flex
//                           min-w-[40px]
//                           justify-center
//                           rounded-full
//                           bg-blue-100
//                           px-3
//                           py-1
//                           font-bold
//                           text-blue-700
//                         "
//                     >
//                       {Number(resumo.total || 0)}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//       <div
//         className="
//           mt-5
//           rounded-xl
//           border
//           border-purple-200
//           bg-purple-50
//           p-4
//         "
//       >
//         <p
//           className="
//             text-sm
//             text-purple-800
//           "
//         >
//           <strong>Referência para compra:</strong> a coluna Confirmadas
//           representa a necessidade atual baseada nos participantes pagos. A
//           coluna Pendentes indica uma possível demanda adicional.
//         </p>
//       </div>
//     </div>
//   );
// }

function LogisticsShirtsTable({ shirts = {}, shirtParticipants = [] }) {
  /*
  ========================================================
  CONTROLE DO MODAL
  ========================================================

  Armazena:

  - tamanho selecionado;
  - tipo de visualização:
    - PAGOS;
    - PENDENTES;
    - TOTAL.

  Não realiza nova chamada à API.

  Não altera os dados recebidos.
  ========================================================
  */

  const [detalhamentoSelecionado, setDetalhamentoSelecionado] = useState(null);

  /*
  ========================================================
  FECHAR MODAL
  ========================================================
  */

  function fecharModal() {
    setDetalhamentoSelecionado(null);
  }

  /*
  ========================================================
  ABRIR MODAL
  ========================================================
  */

  function abrirModal(tamanho, tipo, quantidade) {
    if (Number(quantidade || 0) <= 0) {
      return;
    }

    setDetalhamentoSelecionado({
      tamanho,
      tipo,
    });
  }

  /*
  ========================================================
  NORMALIZAÇÃO DE TEXTO

  Evita diferenças causadas por:

  - letras minúsculas;
  - letras maiúsculas;
  - espaços antes ou depois do valor.

  Não altera a lista original.
  ========================================================
  */

  function normalizarTexto(valor) {
    return String(valor || "")
      .trim()
      .toUpperCase();
  }

  /*
  ========================================================
  PARTICIPANTES DO MODAL

  Utiliza exclusivamente:

  analytics.logistica.listaCamisas

  Primeiro seleciona o tamanho.

  Depois aplica o filtro:

  PAGOS
  → status PAGO;

  PENDENTES
  → qualquer status diferente de PAGO;

  TOTAL
  → todos os participantes daquele tamanho.

  Não realiza nova chamada à API.
  ========================================================
  */

  const participantesSelecionados = detalhamentoSelecionado
    ? shirtParticipants.filter((participante) => {
        const mesmoTamanho =
          normalizarTexto(participante.tamanho) ===
          normalizarTexto(detalhamentoSelecionado.tamanho);

        if (!mesmoTamanho) {
          return false;
        }

        const pagamentoConfirmado =
          normalizarTexto(participante.statusPagamento) === "PAGO";

        if (detalhamentoSelecionado.tipo === "PAGOS") {
          return pagamentoConfirmado;
        }

        if (detalhamentoSelecionado.tipo === "PENDENTES") {
          return !pagamentoConfirmado;
        }

        return true;
      })
    : [];

  /*
  ========================================================
  TÍTULO DO FILTRO SELECIONADO
  ========================================================
  */

  const tituloDoFiltro = {
    PAGOS: "Confirmadas",
    PENDENTES: "Pendentes",
    TOTAL: "Cenário Total",
  };

  return (
    <>
      <div
        className="
          mt-8
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
        "
      >
        <div className="mb-5">
          <h3
            className="
              text-xl
              font-bold
              text-purple-700
            "
          >
            👕 Camisas por Tamanho
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Quantidades confirmadas, pendentes e cenário máximo por tamanho.
            Clique em uma quantidade para visualizar os participantes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            className="
              w-full
              min-w-[650px]
              text-sm
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  border-gray-200
                  bg-gray-50
                "
              >
                <th
                  className="
                    px-4
                    py-3
                    text-left
                    font-semibold
                    text-gray-600
                  "
                >
                  Tamanho
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-center
                    font-semibold
                    text-emerald-700
                  "
                >
                  Confirmadas
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-center
                    font-semibold
                    text-amber-700
                  "
                >
                  Pendentes
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-center
                    font-semibold
                    text-blue-700
                  "
                >
                  Cenário Total
                </th>
              </tr>
            </thead>

            <tbody>
              {TAMANHOS_CAMISA.map((tamanho) => {
                const resumo = shirts[tamanho] || {
                  pagos: 0,
                  pendentes: 0,
                  total: 0,
                };

                const quantidadePagas = Number(resumo.pagos || 0);

                const quantidadePendentes = Number(resumo.pendentes || 0);

                const quantidadeTotal = Number(resumo.total || 0);

                return (
                  <tr
                    key={tamanho}
                    className="
                      border-b
                      border-gray-100
                      transition
                      hover:bg-gray-50
                    "
                  >
                    <td
                      className="
                        px-4
                        py-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      {tamanho}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-center
                      "
                    >
                      <button
                        type="button"
                        disabled={quantidadePagas === 0}
                        onClick={() => {
                          abrirModal(tamanho, "PAGOS", quantidadePagas);
                        }}
                        title={
                          quantidadePagas > 0
                            ? `Visualizar participantes confirmados — ${tamanho}`
                            : `Nenhuma camisa confirmada no tamanho ${tamanho}`
                        }
                        className={`
                          inline-flex
                          min-w-[40px]
                          justify-center
                          rounded-full
                          px-3
                          py-1
                          font-bold
                          transition

                          ${
                            quantidadePagas > 0
                              ? `
                                bg-emerald-100
                                text-emerald-700
                                cursor-pointer
                                hover:bg-emerald-200
                                hover:scale-105
                              `
                              : `
                                bg-emerald-50
                                text-emerald-400
                                cursor-not-allowed
                              `
                          }
                        `}
                      >
                        {quantidadePagas}
                      </button>
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-center
                      "
                    >
                      <button
                        type="button"
                        disabled={quantidadePendentes === 0}
                        onClick={() => {
                          abrirModal(tamanho, "PENDENTES", quantidadePendentes);
                        }}
                        title={
                          quantidadePendentes > 0
                            ? `Visualizar participantes pendentes — ${tamanho}`
                            : `Nenhuma camisa pendente no tamanho ${tamanho}`
                        }
                        className={`
                          inline-flex
                          min-w-[40px]
                          justify-center
                          rounded-full
                          px-3
                          py-1
                          font-bold
                          transition

                          ${
                            quantidadePendentes > 0
                              ? `
                                bg-amber-100
                                text-amber-700
                                cursor-pointer
                                hover:bg-amber-200
                                hover:scale-105
                              `
                              : `
                                bg-amber-50
                                text-amber-400
                                cursor-not-allowed
                              `
                          }
                        `}
                      >
                        {quantidadePendentes}
                      </button>
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-center
                      "
                    >
                      <button
                        type="button"
                        disabled={quantidadeTotal === 0}
                        onClick={() => {
                          abrirModal(tamanho, "TOTAL", quantidadeTotal);
                        }}
                        title={
                          quantidadeTotal > 0
                            ? `Visualizar todos os participantes — ${tamanho}`
                            : `Nenhuma camisa no tamanho ${tamanho}`
                        }
                        className={`
                          inline-flex
                          min-w-[40px]
                          justify-center
                          rounded-full
                          px-3
                          py-1
                          font-bold
                          transition

                          ${
                            quantidadeTotal > 0
                              ? `
                                bg-blue-100
                                text-blue-700
                                cursor-pointer
                                hover:bg-blue-200
                                hover:scale-105
                              `
                              : `
                                bg-blue-50
                                text-blue-400
                                cursor-not-allowed
                              `
                          }
                        `}
                      >
                        {quantidadeTotal}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          className="
            mt-5
            rounded-xl
            border
            border-purple-200
            bg-purple-50
            p-4
          "
        >
          <p
            className="
              text-sm
              text-purple-800
            "
          >
            <strong>Referência para compra:</strong> a coluna Confirmadas
            representa a necessidade atual baseada nos participantes pagos. A
            coluna Pendentes indica uma possível demanda adicional. Clique nas
            quantidades para visualizar os participantes.
          </p>
        </div>
      </div>

      {/*
      ======================================================
      MODAL DAS CAMISAS COMUNS
      ======================================================

      Utiliza exclusivamente:

      analytics.logistica.listaCamisas

      Não realiza nova chamada à API.

      Não altera os indicadores.

      Não escreve na planilha.
      ======================================================
      */}

      {detalhamentoSelecionado && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onClick={fecharModal}
        >
          <div
            className="
              flex
              max-h-[85vh]
              w-full
              max-w-2xl
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-gray-200
                px-6
                py-5
              "
            >
              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-bold
                      text-gray-800
                    "
                  >
                    👕 Camisa {detalhamentoSelecionado.tamanho}
                  </h3>

                  <span
                    className="
                      rounded-full
                      bg-purple-100
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-purple-700
                    "
                  >
                    {participantesSelecionados.length}
                  </span>
                </div>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                  "
                >
                  {tituloDoFiltro[detalhamentoSelecionado.tipo]}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar modal"
                className="
                  rounded-lg
                  px-3
                  py-2
                  text-xl
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-800
                "
              >
                ×
              </button>
            </div>

            <div
              className="
                flex-1
                overflow-y-auto
                px-6
                py-3
              "
            >
              {participantesSelecionados.length > 0 ? (
                participantesSelecionados.map((participante) => {
                  const pagamentoConfirmado =
                    normalizarTexto(participante.statusPagamento) === "PAGO";

                  return (
                    <div
                      key={participante.numero}
                      className="
                          flex
                          flex-col
                          gap-3
                          border-b
                          border-gray-100
                          py-4
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                              break-words
                              font-semibold
                              text-gray-800
                            "
                        >
                          {participante.nome}
                        </p>

                        <p
                          className="
                              mt-1
                              text-sm
                              text-gray-400
                            "
                        >
                          {participante.numero}
                        </p>

                        <p
                          className="
                              mt-1
                              text-sm
                              text-gray-600
                            "
                        >
                          Tamanho:{" "}
                          <strong>
                            {participante.tamanho || "NÃO INFORMADO"}
                          </strong>
                        </p>
                      </div>

                      <span
                        className={`
                            inline-flex
                            w-fit
                            items-center
                            justify-center
                            rounded-full
                            border
                            px-4
                            py-1
                            text-xs
                            font-bold

                            ${
                              pagamentoConfirmado
                                ? `
                                  border-emerald-200
                                  bg-emerald-50
                                  text-emerald-700
                                `
                                : `
                                  border-amber-200
                                  bg-amber-50
                                  text-amber-700
                                `
                            }
                          `}
                      >
                        {pagamentoConfirmado
                          ? "PAGO"
                          : participante.statusPagamento || "PENDENTE"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div
                  className="
                    py-12
                    text-center
                    text-gray-500
                  "
                >
                  Nenhum participante encontrado para este filtro.
                </div>
              )}
            </div>

            <div
              className="
                flex
                justify-end
                border-t
                border-gray-200
                bg-gray-50
                px-6
                py-4
              "
            >
              <button
                type="button"
                onClick={fecharModal}
                className="
                  rounded-xl
                  bg-gray-200
                  px-5
                  py-2
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-300
                "
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/*
==========================================================
DETALHAMENTO LOGÍSTICO DOS KITS
==========================================================

Responsável exclusivamente por apresentar:

- tipo do kit;
- quantidade confirmada;
- quantidade pendente;
- cenário total.

Fonte:

analytics.logistica.kits

Este componente:

- não utiliza analytics.kits;
- não altera os dados recebidos;
- não realiza nova chamada à API;
- não escreve na planilha;
- não calcula financeiro;
- não interfere na tabela de camisas.
==========================================================
*/

function LogisticsKitsTable({ kits = {} }) {
  const tiposDeKit = Object.entries(kits);

  if (tiposDeKit.length === 0) {
    return null;
  }

  return (
    <div
      className="
        mt-8
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div className="mb-5">
        <h3
          className="
            text-xl
            font-bold
            text-emerald-700
          "
        >
          🎒 Kits por Tipo
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Quantidades confirmadas, pendentes e cenário máximo por tipo de kit.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table
          className="
            w-full
            min-w-[650px]
            text-sm
          "
        >
          <thead>
            <tr
              className="
                border-b
                border-gray-200
                bg-gray-50
              "
            >
              <th
                className="
                  px-4
                  py-3
                  text-left
                  font-semibold
                  text-gray-600
                "
              >
                Tipo de Kit
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-center
                  font-semibold
                  text-emerald-700
                "
              >
                Confirmados
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-center
                  font-semibold
                  text-amber-700
                "
              >
                Pendentes
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-center
                  font-semibold
                  text-blue-700
                "
              >
                Cenário Total
              </th>
            </tr>
          </thead>

          <tbody>
            {tiposDeKit.map(([tipoKit, resumo]) => {
              return (
                <tr
                  key={tipoKit}
                  className="
                      border-b
                      border-gray-100
                      transition
                      hover:bg-gray-50
                    "
                >
                  <td
                    className="
                        px-4
                        py-3
                        font-semibold
                        text-gray-700
                      "
                  >
                    {tipoKit}
                  </td>

                  <td
                    className="
                        px-4
                        py-3
                        text-center
                      "
                  >
                    <span
                      className="
                          inline-flex
                          min-w-[40px]
                          justify-center
                          rounded-full
                          bg-emerald-100
                          px-3
                          py-1
                          font-bold
                          text-emerald-700
                        "
                    >
                      {Number(resumo?.pagos || 0)}
                    </span>
                  </td>

                  <td
                    className="
                        px-4
                        py-3
                        text-center
                      "
                  >
                    <span
                      className="
                          inline-flex
                          min-w-[40px]
                          justify-center
                          rounded-full
                          bg-amber-100
                          px-3
                          py-1
                          font-bold
                          text-amber-700
                        "
                    >
                      {Number(resumo?.pendentes || 0)}
                    </span>
                  </td>

                  <td
                    className="
                        px-4
                        py-3
                        text-center
                      "
                  >
                    <span
                      className="
                          inline-flex
                          min-w-[40px]
                          justify-center
                          rounded-full
                          bg-blue-100
                          px-3
                          py-1
                          font-bold
                          text-blue-700
                        "
                    >
                      {Number(resumo?.total || 0)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="
          mt-5
          rounded-xl
          border
          border-emerald-200
          bg-emerald-50
          p-4
        "
      >
        <p
          className="
            text-sm
            text-emerald-800
          "
        >
          <strong>Referência para planejamento:</strong> os confirmados
          representam a necessidade atual. Os pendentes representam uma possível
          demanda adicional.
        </p>
      </div>
    </div>
  );
}

/*
==========================================================
DETALHAMENTO DAS CAMISAS ESPECIAIS
==========================================================

Responsável exclusivamente pela apresentação das camisas
destinadas aos grupos institucionais do evento.

Grupos atualmente apresentados:

- Equipe;
- Parceria;
- Divulgação;
- Cortesia.

Fonte exclusiva:

analytics.logistica.camisasEspeciais

Este componente:

- não utiliza analytics.camisas;
- não utiliza analytics.logistica.camisas;
- não altera os dados recebidos;
- não escreve na planilha;
- não realiza nova chamada à API;
- não calcula financeiro;
- não contabiliza kits;
- não contabiliza medalhas;
- não contabiliza lanches;
- não contabiliza números de peito.

Os dados já chegam calculados e separados pelo backend.
==========================================================
*/

// function LogisticsSpecialShirtsTable({
//   specialShirts = {},
// }) {

//   /*
//   ========================================================
//   ORDEM PADRÃO DOS GRUPOS ESPECIAIS
//   ========================================================

//   Mantém uma ordem previsível no relatório.

//   Caso futuramente o backend envie um novo grupo,
//   ele também será incluído automaticamente.
//   ========================================================
//   */

//   const gruposPadrao = [
//     "EQUIPE",
//     "PARCERIA",
//     "DIVULGACAO",
//     "CORTESIA",
//   ];

//   const gruposRecebidos =
//     Object.keys(specialShirts);

//   const grupos = [
//     ...gruposPadrao,

//     ...gruposRecebidos.filter(
//       (grupo) =>
//         !gruposPadrao.includes(grupo),
//     ),
//   ];

//   /*
//   ========================================================
//   VERIFICA SE EXISTE ALGUMA CAMISA ESPECIAL
//   ========================================================

//   Evita apresentar uma tabela vazia quando ainda não
//   existem participantes dos grupos especiais.
//   ========================================================
//   */

//   const possuiCamisasEspeciais =
//     grupos.some((grupo) => {

//       const tamanhos =
//         specialShirts[grupo] || {};

//       return Object.keys(tamanhos).length > 0;

//     });

//   if (!possuiCamisasEspeciais) {

//     return null;

//   }

//   return (

//     <div
//       className="
//         mt-8
//         rounded-2xl
//         border
//         border-pink-200
//         bg-white
//         p-5
//         shadow-sm
//       "
//     >

//       {/*
//       ======================================================
//       CABEÇALHO
//       ======================================================
//       */}

//       <div className="mb-5">

//         <h3
//           className="
//             text-xl
//             font-bold
//             text-pink-700
//           "
//         >

//           👕 Camisas Especiais

//         </h3>

//         <p
//           className="
//             mt-1
//             text-sm
//             text-gray-500
//           "
//         >

//           Camisas destinadas à equipe, parcerias,
//           divulgação, cortesias e demais grupos
//           institucionais.

//         </p>

//       </div>

//       {/*
//       ======================================================
//       TABELA
//       ======================================================
//       */}

//       <div className="overflow-x-auto">

//         <table
//           className="
//             w-full
//             min-w-[750px]
//             text-sm
//           "
//         >

//           <thead>

//             <tr
//               className="
//                 border-b
//                 border-gray-200
//                 bg-pink-50
//               "
//             >

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-left
//                   font-semibold
//                   text-gray-600
//                 "
//               >

//                 Grupo

//               </th>

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-left
//                   font-semibold
//                   text-gray-600
//                 "
//               >

//                 Tamanho

//               </th>

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-center
//                   font-semibold
//                   text-emerald-700
//                 "
//               >

//                 Confirmadas

//               </th>

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-center
//                   font-semibold
//                   text-amber-700
//                 "
//               >

//                 Pendentes

//               </th>

//               <th
//                 className="
//                   px-4
//                   py-3
//                   text-center
//                   font-semibold
//                   text-blue-700
//                 "
//               >

//                 Cenário Total

//               </th>

//             </tr>

//           </thead>

//           <tbody>

//             {grupos.map((grupo) => {

//               const tamanhosDoGrupo =
//                 specialShirts[grupo] || {};

//               /*
//               ==============================================
//               APRESENTA TODOS OS TAMANHOS PADRÃO

//               Mesmo tamanhos sem participantes serão
//               exibidos com valor zero.

//               Isso mantém o mesmo padrão da tabela de
//               camisas comuns.
//               ==============================================
//               */

//               return TAMANHOS_CAMISA.map(
//                 (tamanho) => {

//                   const resumo =
//                     tamanhosDoGrupo[tamanho] || {

//                       pagos: 0,

//                       pendentes: 0,

//                       total: 0,

//                     };

//                   return (

//                     <tr
//                       key={`${grupo}-${tamanho}`}
//                       className="
//                         border-b
//                         border-gray-100
//                         transition
//                         hover:bg-gray-50
//                       "
//                     >

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           font-bold
//                           text-pink-700
//                         "
//                       >

//                         {grupo}

//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           font-semibold
//                           text-gray-700
//                         "
//                       >

//                         {tamanho}

//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           text-center
//                         "
//                       >

//                         <span
//                           className="
//                             inline-flex
//                             min-w-[40px]
//                             justify-center
//                             rounded-full
//                             bg-emerald-100
//                             px-3
//                             py-1
//                             font-bold
//                             text-emerald-700
//                           "
//                         >

//                           {Number(
//                             resumo.pagos || 0,
//                           )}

//                         </span>

//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           text-center
//                         "
//                       >

//                         <span
//                           className="
//                             inline-flex
//                             min-w-[40px]
//                             justify-center
//                             rounded-full
//                             bg-amber-100
//                             px-3
//                             py-1
//                             font-bold
//                             text-amber-700
//                           "
//                         >

//                           {Number(
//                             resumo.pendentes || 0,
//                           )}

//                         </span>

//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           text-center
//                         "
//                       >

//                         <span
//                           className="
//                             inline-flex
//                             min-w-[40px]
//                             justify-center
//                             rounded-full
//                             bg-blue-100
//                             px-3
//                             py-1
//                             font-bold
//                             text-blue-700
//                           "
//                         >

//                           {Number(
//                             resumo.total || 0,
//                           )}

//                         </span>

//                       </td>

//                     </tr>

//                   );

//                 },
//               );

//             })}

//           </tbody>

//         </table>

//       </div>

//       {/*
//       ======================================================
//       OBSERVAÇÃO OPERACIONAL
//       ======================================================
//       */}

//       <div
//         className="
//           mt-5
//           rounded-xl
//           border
//           border-pink-200
//           bg-pink-50
//           p-4
//         "
//       >

//         <p
//           className="
//             text-sm
//             text-pink-800
//           "
//         >

//           <strong>
//             Regra das camisas especiais:
//           </strong>{" "}

//           estes participantes geram necessidade de camisa,
//           mas não são contabilizados na compra de kits,
//           medalhas, lanches ou outros materiais vinculados
//           às inscrições comuns.

//         </p>

//       </div>

//     </div>

//   );

// }

/*
==========================================================
RESUMO COMPACTO DAS CAMISAS ESPECIAIS
==========================================================

Responsável exclusivamente pela apresentação resumida
das camisas destinadas aos grupos especiais.

Fonte:

analytics.logistica.camisasEspeciais

Apresenta:

- grupo especial;
- camisas confirmadas;
- camisas pendentes;
- cenário total.

Não apresenta tamanhos com valor zero.

Não altera:

- analytics;
- planilha;
- financeiro;
- kits;
- medalhas;
- lanches;
- número de peito.

A relação nominal será integrada posteriormente por meio
de uma lista específica enviada pelo backend.
==========================================================
*/

function LogisticsSpecialShirtsTable({
  specialShirts = {},
  specialShirtsParticipants = [],
}) {
  /*
  ========================================================
  CONTROLE DO MODAL
  ========================================================

  Armazena exclusivamente o grupo selecionado.

  Exemplos:

  - EQUIPE;
  - PARCERIA;
  - DIVULGACAO;
  - CORTESIA.

  Quando o valor é null, o modal permanece fechado.

  Não altera analytics.

  Não altera a planilha.

  Não realiza nova chamada à API.
  ========================================================
  */

  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

  /*
  ========================================================
  PARTICIPANTES DO GRUPO SELECIONADO
  ========================================================

  Utiliza a lista nominal que já chegou na mesma resposta
  do endpoint de Analytics.

  Não busca novamente os dados.

  Não duplica chamadas.

  Não altera a lista original.
  ========================================================
  */

  const participantesDoGrupo = specialShirtsParticipants.filter(
    (participante) => {
      return participante.grupo === grupoSelecionado;
    },
  );
  /*
  ========================================================
  ORDEM DE APRESENTAÇÃO
  ========================================================
  */

  const gruposPadrao = ["EQUIPE", "PARCERIA", "DIVULGACAO", "CORTESIA"];

  /*
  ========================================================
  GRUPOS ADICIONAIS

  Caso futuramente o backend envie outro grupo especial,
  ele será exibido automaticamente.
  ========================================================
  */

  const gruposAdicionais = Object.keys(specialShirts).filter(
    (grupo) => !gruposPadrao.includes(grupo),
  );

  const grupos = [...gruposPadrao, ...gruposAdicionais];

  /*
  ========================================================
  MONTA O RESUMO DE CADA GRUPO

  Cada grupo pode possuir vários tamanhos.

  Exemplo:

  EQUIPE
  ├── P
  ├── M
  └── G

  Esta etapa apenas soma os valores já calculados pelo
  backend.
  ========================================================
  */

  const resumoDosGrupos = grupos.map((grupo) => {
    const tamanhos = specialShirts[grupo] || {};

    const resumo = somarResumo(tamanhos);

    return {
      grupo,

      pagos: resumo.pagos,

      pendentes: resumo.pendentes,

      total: resumo.total,
    };
  });

  /*
  ========================================================
  OCULTA SOMENTE GRUPOS NÃO PADRÃO VAZIOS

  Os quatro grupos oficiais permanecem visíveis,
  inclusive quando possuem total zero.

  Isso permite acompanhar Equipe, Parceria,
  Divulgação e Cortesia de forma previsível.
  ========================================================
  */

  const gruposVisiveis = resumoDosGrupos.filter((item) => {
    return gruposPadrao.includes(item.grupo) || item.total > 0;
  });

  return (
    <div
      className="
        mt-8
        rounded-2xl
        border
        border-pink-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/*
      ======================================================
      CABEÇALHO
      ======================================================
      */}

      <div className="mb-5">
        <h3
          className="
            text-xl
            font-bold
            text-pink-700
          "
        >
          👕 Camisas Especiais
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Quantidade de camisas destinadas aos grupos institucionais, separadas
          dos materiais das inscrições comuns.
        </p>
      </div>

      {/*
      ======================================================
      TABELA COMPACTA
      ======================================================
      */}

      <div className="overflow-x-auto">
        <table
          className="
            w-full
            min-w-[650px]
            text-sm
          "
        >
          <thead>
            <tr
              className="
                border-b
                border-gray-200
                bg-pink-50
              "
            >
              <th
                className="
                  px-4
                  py-3
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Grupo
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-center
                  font-semibold
                  text-emerald-700
                "
              >
                Confirmadas
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-center
                  font-semibold
                  text-amber-700
                "
              >
                Pendentes
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-center
                  font-semibold
                  text-blue-700
                "
              >
                Total
              </th>

              <th
                className="
                  px-4
                  py-3
                  text-center
                  font-semibold
                  text-purple-700
                "
              >
                Participantes
              </th>
            </tr>
          </thead>

          <tbody>
            {gruposVisiveis.map((item) => {
              const nomeDoGrupo =
                item.grupo === "DIVULGACAO" ? "DIVULGAÇÃO" : item.grupo;

              return (
                <tr
                  key={item.grupo}
                  className="
                      border-b
                      border-gray-100
                      transition
                      hover:bg-gray-50
                    "
                >
                  <td
                    className="
                        px-4
                        py-4
                        font-bold
                        text-gray-700
                      "
                  >
                    {nomeDoGrupo}
                  </td>

                  <td
                    className="
                        px-4
                        py-4
                        text-center
                      "
                  >
                    <span
                      className="
                          inline-flex
                          min-w-[42px]
                          justify-center
                          rounded-full
                          bg-emerald-100
                          px-3
                          py-1
                          font-bold
                          text-emerald-700
                        "
                    >
                      {item.pagos}
                    </span>
                  </td>

                  <td
                    className="
                        px-4
                        py-4
                        text-center
                      "
                  >
                    <span
                      className="
                          inline-flex
                          min-w-[42px]
                          justify-center
                          rounded-full
                          bg-amber-100
                          px-3
                          py-1
                          font-bold
                          text-amber-700
                        "
                    >
                      {item.pendentes}
                    </span>
                  </td>

                  <td
                    className="
                        px-4
                        py-4
                        text-center
                      "
                  >
                    <span
                      className="
                          inline-flex
                          min-w-[42px]
                          justify-center
                          rounded-full
                          bg-blue-100
                          px-3
                          py-1
                          font-bold
                          text-blue-700
                        "
                    >
                      {item.total}
                    </span>
                  </td>

                  <td
                    className="
                        px-4
                        py-4
                        text-center
                      "
                  >
                    <button
                      type="button"
                      disabled={item.total === 0}
                      onClick={() => {
                        setGrupoSelecionado(item.grupo);
                      }}
                      title={
                        item.total > 0
                          ? `Visualizar participantes de ${nomeDoGrupo}`
                          : "Nenhum participante neste grupo."
                      }
                      className={`
                    rounded-lg
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    transition

                    ${
                      item.total > 0
                        ? `
                          bg-purple-100
                          text-purple-700
                          hover:bg-purple-200
                          cursor-pointer
                        `
                        : `
                          bg-gray-100
                          text-gray-400
                          cursor-not-allowed
                        `
                    }
                  `}
                    >
                      Ver pessoas
                    </button>
                    {/*                     <button
                      type="button"
                      disabled
                      title={
                        item.total > 0
                          ? "A lista nominal será integrada na próxima etapa."
                          : "Nenhum participante neste grupo."
                      }
                      className="
                          rounded-lg
                          bg-gray-100
                          px-4
                          py-2
                          text-xs
                          font-semibold
                          text-gray-400
                          cursor-not-allowed
                        "
                    >
                      Ver pessoas
                    </button> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/*
      ======================================================
      REGRA LOGÍSTICA
      ======================================================
      */}

      <div
        className="
          mt-5
          rounded-xl
          border
          border-pink-200
          bg-pink-50
          p-4
        "
      >
        <p
          className="
            text-sm
            text-pink-800
          "
        >
          <strong>Regra das camisas especiais:</strong> esses participantes
          geram somente a necessidade da camisa. Eles não são contabilizados na
          compra de kits, medalhas ou lanches das inscrições comuns.
        </p>
      </div>
      {/*
        ======================================================
        MODAL DOS PARTICIPANTES DAS CAMISAS ESPECIAIS
        ======================================================

        Utiliza exclusivamente:

        analytics.logistica.listaCamisasEspeciais

        Não realiza nova chamada à API.

        Não altera dados.

        Não escreve na planilha.

        Não recalcula os indicadores.
        ======================================================
        */}

      {grupoSelecionado && (
        <div
          className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/50
              p-4
            "
          onClick={() => {
            setGrupoSelecionado(null);
          }}
        >
          <div
            className="
                flex
                max-h-[85vh]
                w-full
                max-w-2xl
                flex-col
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
              "
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {/*
              =================================================
              CABEÇALHO DO MODAL
              =================================================
              */}

            <div
              className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-200
                  px-6
                  py-5
                "
            >
              <div>
                <div
                  className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                >
                  <h3
                    className="
                        text-xl
                        font-bold
                        text-gray-800
                      "
                  >
                    👕 Camisas Especiais —{" "}
                    {grupoSelecionado === "DIVULGACAO"
                      ? "DIVULGAÇÃO"
                      : grupoSelecionado}
                  </h3>

                  <span
                    className="
                        rounded-full
                        bg-pink-100
                        px-3
                        py-1
                        text-xs
                        font-bold
                        text-pink-700
                      "
                  >
                    {participantesDoGrupo.length}
                  </span>
                </div>

                <p
                  className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                >
                  Participantes e tamanhos das camisas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setGrupoSelecionado(null);
                }}
                aria-label="Fechar modal"
                className="
                    rounded-lg
                    px-3
                    py-2
                    text-xl
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    hover:text-gray-800
                  "
              >
                ×
              </button>
            </div>

            {/*
              =================================================
              LISTA DOS PARTICIPANTES
              =================================================
              */}

            <div
              className="
                  flex-1
                  overflow-y-auto
                  px-6
                  py-3
                "
            >
              {participantesDoGrupo.length > 0 ? (
                participantesDoGrupo.map((participante) => {
                  const pagamentoConfirmado =
                    participante.statusPagamento === "PAGO";

                  return (
                    <div
                      key={participante.numero}
                      className="
                            flex
                            flex-col
                            gap-3
                            border-b
                            border-gray-100
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                    >
                      <div
                        className="
                              min-w-0
                            "
                      >
                        <p
                          className="
                                break-words
                                font-semibold
                                text-gray-800
                              "
                        >
                          {participante.nome}
                        </p>

                        <p
                          className="
                                mt-1
                                text-sm
                                text-gray-400
                              "
                        >
                          {participante.numero}
                        </p>

                        <p
                          className="
                                mt-1
                                text-sm
                                text-gray-600
                              "
                        >
                          Tamanho:{" "}
                          <strong>
                            {participante.tamanho || "NÃO INFORMADO"}
                          </strong>
                        </p>
                      </div>

                      <span
                        className={`
                              inline-flex
                              w-fit
                              items-center
                              justify-center
                              rounded-full
                              border
                              px-4
                              py-1
                              text-xs
                              font-bold

                              ${
                                pagamentoConfirmado
                                  ? `
                                    border-emerald-200
                                    bg-emerald-50
                                    text-emerald-700
                                  `
                                  : `
                                    border-amber-200
                                    bg-amber-50
                                    text-amber-700
                                  `
                              }
                            `}
                      >
                        {participante.statusPagamento || "PENDENTE"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div
                  className="
                      py-12
                      text-center
                      text-gray-500
                    "
                >
                  Nenhum participante encontrado para este grupo.
                </div>
              )}
            </div>

            {/*
              =================================================
              RODAPÉ DO MODAL
              =================================================
              */}

            <div
              className="
                  flex
                  justify-end
                  border-t
                  border-gray-200
                  bg-gray-50
                  px-6
                  py-4
                "
            >
              <button
                type="button"
                onClick={() => {
                  setGrupoSelecionado(null);
                }}
                className="
                    rounded-xl
                    bg-gray-200
                    px-5
                    py-2
                    font-semibold
                    text-gray-700
                    transition
                    hover:bg-gray-300
                  "
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
==========================================================
SEÇÃO PRINCIPAL DE LOGÍSTICA
==========================================================
*/

export default function LogisticsSection({ analytics }) {
  if (!analytics) {
    return null;
  }

  const logistica = analytics.logistica || {};

  const resumoKits = somarResumo(logistica.kits);

  const resumoCamisas = somarResumo(logistica.camisas);

  const resumoMedalhas = somarResumo(logistica.medalhas);

  const resumoLanches = somarResumo(logistica.lanches);

  /*
  ========================================================
  IMPORTANTE

  Número de Peito continuará separado visualmente
  dos materiais de compra.

  Embora os dados existam em analytics.logistica,
  ele é um recurso operacional de preparação,
  não um item de compra.

  O card específico será criado na próxima etapa.
  ========================================================
  */

  return (
    <section
      className="
        bg-gray-50
        rounded-2xl
        p-6
        mb-8
      "
    >
      <div className="mb-6">
        <h2
          className="
            text-2xl
            font-bold
            text-gray-800
          "
        >
          📦 Planejamento Logístico
        </h2>

        <p
          className="
            mt-1
            text-gray-500
          "
        >
          Quantidades confirmadas para compra e acompanhamento da demanda
          pendente.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >
        <LogisticsSummaryCard title="Kits" icon="🎒" summary={resumoKits} />

        <LogisticsSummaryCard
          title="Camisas"
          icon="👕"
          summary={resumoCamisas}
        />

        <LogisticsSummaryCard
          title="Medalhas"
          icon="🏅"
          summary={resumoMedalhas}
        />

        <LogisticsSummaryCard
          title="Lanches"
          icon="🥪"
          summary={resumoLanches}
        />
      </div>

      {/*
      ======================================================
      DETALHAMENTO DAS CAMISAS

      Utiliza exclusivamente:

      analytics.logistica.camisas
      ======================================================
      */}

      <LogisticsShirtsTable
        shirts={logistica.camisas}
        shirtParticipants={logistica.listaCamisas}
      />

      {/*
      ======================================================
      CAMISAS ESPECIAIS

      Fonte exclusiva:

      analytics.logistica.camisasEspeciais

      Não interfere nas camisas comuns.
      Não interfere nos kits.
      ======================================================
      */}

      {/* <LogisticsSpecialShirtsTable specialShirts={logistica.camisasEspeciais} /> */}
      <LogisticsSpecialShirtsTable
        specialShirts={logistica.camisasEspeciais}
        specialShirtsParticipants={logistica.listaCamisasEspeciais}
      />

      {/*
      ======================================================
      DETALHAMENTO DOS KITS

      Utiliza exclusivamente:

      analytics.logistica.kits
      ======================================================
      */}

      <LogisticsKitsTable kits={logistica.kits} />

      <div
        className="
          mt-6
          rounded-xl
          border
          border-blue-200
          bg-blue-50
          p-4
        "
      >
        <p
          className="
            text-sm
            text-blue-800
          "
        >
          <strong>Critério de planejamento:</strong> utilize a quantidade de
          participantes confirmados como base atual para compra. Os pendentes
          representam demanda adicional possível e devem ser acompanhados até o
          encerramento das inscrições.
        </p>
      </div>
    </section>
  );
}
