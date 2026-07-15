import { useState } from "react";

/*
==========================================================
FUNÇÕES AUXILIARES
==========================================================
*/
function getTotalCategoria(categoria) {
  return Object.values(categoria || {}).reduce(
    (total, valor) => total + Number(valor || 0),
    0,
  );
}

/**
 * Normaliza textos utilizados nas comparações.
 */
function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase();
}

/**
 * Retorna somente os segurados pertencentes
 * ao status solicitado.
 */
function filtrarSeguradosPorStatus(listaSeguroAtleta, status) {
  const statusNormalizado = normalizarTexto(status);

  return (listaSeguroAtleta || []).filter(
    (atleta) => normalizarTexto(atleta?.statusPagamento) === statusNormalizado,
  );
}

/*
==========================================================
COMPONENTE PRINCIPAL
==========================================================
*/

export default function SeguroAtletaDashboard({ analytics }) {
  /*
  ========================================================
  ESTADO DO MODAL
  ========================================================
  */
  const [modalData, setModalData] = useState(null);

  /*
  ========================================================
  PROTEÇÃO
  ========================================================
  */
  if (!analytics) {
    return null;
  }

  /*
  ========================================================
  DADOS DEMOGRÁFICOS
  ========================================================
  */
  const masculino = getTotalCategoria(analytics?.categorias?.masculino);
  const feminino = getTotalCategoria(analytics?.categorias?.feminino);
  const sessentaMaisMasculino = getTotalCategoria(
    analytics?.sessentaMais?.masculino,
  );
  const sessentaMaisFeminino = getTotalCategoria(
    analytics?.sessentaMais?.feminino,
  );

  /*
  ========================================================
  LISTAS DEMOGRÁFICAS
  ========================================================
  */
  const listaMasculino = analytics?.listaMasculino || [];
  const listaFeminino = analytics?.listaFeminino || [];
  const listaMasculino60Mais = analytics?.listaMasculino60Mais || [];
  const listaFeminino60Mais = analytics?.listaFeminino60Mais || [];

  /*
  ========================================================
  SEGURO ATLETA
  ========================================================
  */
  const listaSeguroAtleta = analytics?.listaSeguroAtleta || [];
  const seguradosPagos = filtrarSeguradosPorStatus(listaSeguroAtleta, "PAGO");
  const seguradosPendentes = filtrarSeguradosPorStatus(
    listaSeguroAtleta,
    "PENDENTE",
  );

  /*
  ========================================================
  ABERTURA DO MODAL
  ========================================================
  */
  function handleOpenModal(titulo, listaAtletas, tipoModal = "DOCUMENTACAO") {
    if (!Array.isArray(listaAtletas) || listaAtletas.length === 0) {
      return;
    }

    setModalData({
      titulo,
      atletas: listaAtletas,
      tipoModal,
    });
  }

  /*
  ========================================================
  FECHAMENTO DO MODAL
  ========================================================
  */
  function handleCloseModal() {
    setModalData(null);
  }

  /*
  ========================================================
  RETORNO VISUAL
  ========================================================
  */
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* TÍTULO */}
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <span>🛡️</span>
        Seguro Atleta
      </h2>

      {/* ==================================================
          CARDS
      ================================================== */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          gap-4
        "
      >
        {/* TOTAL SEGURADOS */}
        <div
          onClick={() =>
            handleOpenModal(
              "Todos os Segurados",
              listaSeguroAtleta,
              "PAGAMENTO",
            )
          }
          className={`
            rounded-xl
            p-4
            bg-blue-50
            transition-all
            ${
              listaSeguroAtleta.length > 0
                ? `
                  cursor-pointer
                  hover:bg-blue-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">Total</p>
          <h3 className="text-3xl font-bold text-blue-700 mt-1">
            {analytics.totalInscritos || 0}
          </h3>
        </div>

        {/* SEGURADOS PAGOS */}
        <div
          onClick={() =>
            handleOpenModal("Segurados Pagos", seguradosPagos, "PAGAMENTO")
          }
          className={`
            rounded-xl
            p-4
            bg-green-50
            transition-all
            ${
              seguradosPagos.length > 0
                ? `
                  cursor-pointer
                  hover:bg-green-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">Segurados Pagos</p>
          <h3 className="text-3xl font-bold text-green-700 mt-1">
            {analytics.totalPago || 0}
          </h3>
        </div>

        {/* SEGURADOS PENDENTES */}
        <div
          onClick={() =>
            handleOpenModal(
              "Segurados Pendentes",
              seguradosPendentes,
              "PAGAMENTO",
            )
          }
          className={`
            rounded-xl
            p-4
            bg-amber-50
            transition-all
            ${
              seguradosPendentes.length > 0
                ? `
                  cursor-pointer
                  hover:bg-amber-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">
            Segurados Pendentes
          </p>
          <h3 className="text-3xl font-bold text-amber-700 mt-1">
            {analytics.totalPendente || 0}
          </h3>
        </div>

        {/* MASCULINO */}
        <div
          onClick={() =>
            handleOpenModal(
              "Atletas - Masculino",
              listaMasculino,
              "DEMOGRAFICO",
            )
          }
          className={`
            rounded-xl
            p-4
            bg-cyan-50
            transition-all
            ${
              listaMasculino.length > 0
                ? `
                  cursor-pointer
                  hover:bg-cyan-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">Masculino</p>
          <h3 className="text-3xl font-bold text-cyan-700 mt-1">{masculino}</h3>
        </div>

        {/* FEMININO */}
        <div
          onClick={() =>
            handleOpenModal("Atletas - Feminino", listaFeminino, "DEMOGRAFICO")
          }
          className={`
            rounded-xl
            p-4
            bg-pink-50
            transition-all
            ${
              listaFeminino.length > 0
                ? `
                  cursor-pointer
                  hover:bg-pink-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">Feminino</p>
          <h3 className="text-3xl font-bold text-pink-700 mt-1">{feminino}</h3>
        </div>

        {/* MASCULINO 60+ */}
        <div
          onClick={() =>
            handleOpenModal(
              "Atletas - Masculino 60+",
              listaMasculino60Mais,
              "DEMOGRAFICO",
            )
          }
          className={`
            rounded-xl
            p-4
            bg-orange-50
            transition-all
            ${
              listaMasculino60Mais.length > 0
                ? `
                  cursor-pointer
                  hover:bg-orange-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">Masculino 60+</p>
          <h3 className="text-3xl font-bold text-orange-700 mt-1">
            {sessentaMaisMasculino}
          </h3>
        </div>

        {/* FEMININO 60+ */}
        <div
          onClick={() =>
            handleOpenModal(
              "Atletas - Feminino 60+",
              listaFeminino60Mais,
              "DEMOGRAFICO",
            )
          }
          className={`
            rounded-xl
            p-4
            bg-yellow-50
            transition-all
            ${
              listaFeminino60Mais.length > 0
                ? `
                  cursor-pointer
                  hover:bg-yellow-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">Feminino 60+</p>
          <h3 className="text-3xl font-bold text-yellow-700 mt-1">
            {sessentaMaisFeminino}
          </h3>
        </div>

        {/* TEA */}
        <div
          onClick={() =>
            handleOpenModal("Atletas - TEA", analytics.listaTea, "DOCUMENTACAO")
          }
          className={`
            rounded-xl
            p-4
            bg-indigo-50
            transition-all
            ${
              analytics.listaTea?.length
                ? `
                  cursor-pointer
                  hover:bg-indigo-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">TEA</p>
          <h3 className="text-3xl font-bold text-indigo-700 mt-1">
            {analytics.totalTea || 0}
          </h3>
        </div>

        {/* PCD */}
        <div
          onClick={() =>
            handleOpenModal("Atletas - PCD", analytics.listaPcd, "DOCUMENTACAO")
          }
          className={`
            rounded-xl
            p-4
            bg-sky-50
            transition-all
            ${
              analytics.listaPcd?.length
                ? `
                  cursor-pointer
                  hover:bg-sky-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">PCD</p>
          <h3 className="text-3xl font-bold text-sky-700 mt-1">
            {analytics.totalPcd || 0}
          </h3>
        </div>

        {/* IDOSOS */}
        <div
          onClick={() =>
            handleOpenModal(
              "Atletas - Idosos 60+",
              analytics.listaIdoso,
              "DOCUMENTACAO",
            )
          }
          className={`
            rounded-xl
            p-4
            bg-green-50
            transition-all
            ${
              analytics.listaIdoso?.length
                ? `
                  cursor-pointer
                  hover:bg-green-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">Idosos 60+</p>
          <h3 className="text-3xl font-bold text-green-700 mt-1">
            {analytics.totalIdoso || 0}
          </h3>
        </div>

        {/* ACOLHIMENTO */}
        <div
          onClick={() =>
            handleOpenModal(
              "Atletas - Acolhimento",
              analytics.listaAcolhimento,
              "DOCUMENTACAO",
            )
          }
          className={`
            rounded-xl
            p-4
            bg-purple-50
            transition-all
            ${
              analytics.listaAcolhimento?.length
                ? `
                  cursor-pointer
                  hover:bg-purple-100
                  hover:shadow-sm
                  select-none
                `
                : ""
            }
          `}
        >
          <p className="text-sm text-gray-500 font-medium">💜 Acolhimento</p>
          <h3 className="text-3xl font-bold text-purple-700 mt-1">
            {analytics.totalAcolhimento || 0}
          </h3>
        </div>
      </div>

      {/* ==================================================
          MODAL
      ================================================== */}
      {modalData && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/40
            backdrop-blur-sm
          "
        >
          <div
            className="
              bg-white
              w-full
              max-w-2xl
              rounded-2xl
              shadow-2xl
              overflow-hidden
              border
              border-gray-100
            "
          >
            {/* CABEÇALHO */}
            <div
              className="
                flex
                items-center
                justify-between
                p-5
                border-b
                border-gray-100
                bg-gray-50
              "
            >
              <h3
                className="
                  text-lg
                  font-bold
                  text-gray-800
                  flex
                  items-center
                  gap-2
                "
              >
                📋 {modalData.titulo}
                <span
                  className="
                    text-xs
                    bg-gray-200
                    text-gray-600
                    font-semibold
                    px-2
                    py-0.5
                    rounded-full
                  "
                >
                  {modalData.atletas.length}
                </span>
              </h3>

              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Fechar"
                className="
                  text-gray-500
                  hover:text-gray-700
                  hover:bg-gray-200
                  px-3
                  py-2
                  rounded-lg
                  transition
                "
              >
                ✕
              </button>
            </div>

            {/* LISTA */}
            <div
              className="
                p-4
                max-h-[65vh]
                overflow-y-auto
                divide-y
                divide-gray-100
              "
            >
              {modalData.atletas.map((atleta, index) => {
                const status =
                  modalData.tipoModal === "DOCUMENTACAO"
                    ? normalizarTexto(atleta.documentacao)
                    : normalizarTexto(atleta.statusPagamento);

                const aprovado = status === "PAGO" || status === "APROVADO";

                return (
                  <div
                    key={atleta.numero || `${atleta.nome}-${index}`}
                    className="
                        py-3
                        flex
                        justify-between
                        items-center
                        gap-4
                        px-1
                      "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                            font-semibold
                            text-gray-800
                            text-sm
                          "
                      >
                        {atleta.nome || "Nome não informado"}
                      </p>

                      <p
                        className="
                            text-xs
                            text-gray-400
                            mt-1
                            font-mono
                          "
                      >
                        {atleta.numero || "Inscrição não informada"}
                      </p>

                      {modalData.tipoModal === "DEMOGRAFICO" && (
                        <p
                          className="
                            text-xs
                            text-gray-500
                            mt-1
                          "
                        >
                          Idade:{" "}
                          <span className="font-semibold">
                            {Number.isFinite(Number(atleta.idade))
                              ? `${atleta.idade} anos`
                              : "Não informada"}
                          </span>
                        </p>
                      )}
                    </div>

                    <span
                      className={`
                          text-[11px]
                          font-bold
                          px-3
                          py-1
                          rounded-full
                          whitespace-nowrap
                          border

                          ${
                            aprovado
                              ? `
                                bg-green-50
                                text-green-700
                                border-green-200
                              `
                              : `
                                bg-amber-50
                                text-amber-700
                                border-amber-200
                              `
                          }
                        `}
                    >
                      {status || "NÃO INFORMADO"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* RODAPÉ */}
            <div
              className="
                p-4
                border-t
                border-gray-100
                bg-gray-50
                flex
                justify-end
              "
            >
              <button
                type="button"
                onClick={handleCloseModal}
                className="
                  px-5
                  py-2
                  bg-gray-200
                  hover:bg-gray-300
                  text-gray-700
                  text-sm
                  font-semibold
                  rounded-xl
                  transition
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

// import { useState } from "react";

// /*
// ==========================================================
// FUNÇÕES AUXILIARES
// ==========================================================
// */
// function getTotalCategoria(categoria) {
//   return Object.values(categoria || {}).reduce(
//     (total, valor) => total + Number(valor || 0),
//     0,
//   );
// }

// /**
//  * Normaliza textos utilizados nas comparações.
//  */
// function normalizarTexto(valor) {
//   return String(valor || "")
//     .trim()
//     .toUpperCase();
// }

// /**
//  * Retorna somente os segurados pertencentes
//  * ao status solicitado.
//  */
// function filtrarSeguradosPorStatus(listaSeguroAtleta, status) {
//   const statusNormalizado = normalizarTexto(status);

//   return (listaSeguroAtleta || []).filter(
//     (atleta) => normalizarTexto(atleta?.statusPagamento) === statusNormalizado,
//   );
// }

// /*
// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================
// */

// export default function SeguroAtletaDashboard({ analytics }) {
//   /*
//   ========================================================
//   ESTADO DO MODAL
//   ========================================================
//   */

//   const [modalData, setModalData] = useState(null);

//   /*
//   ========================================================
//   PROTEÇÃO
//   ========================================================
//   */

//   if (!analytics) {
//     return null;
//   }

//   /*
//   ========================================================
//   DADOS DEMOGRÁFICOS
//   ========================================================
//   */

//   const masculino = getTotalCategoria(analytics?.categorias?.masculino);

//   const feminino = getTotalCategoria(analytics?.categorias?.feminino);

//   const sessentaMaisMasculino = getTotalCategoria(
//     analytics?.sessentaMais?.masculino,
//   );

//   const sessentaMaisFeminino = getTotalCategoria(
//     analytics?.sessentaMais?.feminino,
//   );

//   /*
//   ========================================================
//   LISTAS DEMOGRÁFICAS
//   ========================================================
//   */

//   const listaMasculino = analytics?.listaMasculino || [];

//   const listaFeminino = analytics?.listaFeminino || [];

//   const listaMasculino60Mais = analytics?.listaMasculino60Mais || [];

//   const listaFeminino60Mais = analytics?.listaFeminino60Mais || [];

//   /*
//   ========================================================
//   SEGURO ATLETA
//   ========================================================
//   */

//   const listaSeguroAtleta = analytics?.listaSeguroAtleta || [];

//   const seguradosPagos = filtrarSeguradosPorStatus(listaSeguroAtleta, "PAGO");

//   const seguradosPendentes = filtrarSeguradosPorStatus(
//     listaSeguroAtleta,
//     "PENDENTE",
//   );

//   /*
//   ========================================================
//   ABERTURA DO MODAL
//   ========================================================
//   */

//   function handleOpenModal(titulo, listaAtletas, tipoModal = "DOCUMENTACAO") {
//     if (!Array.isArray(listaAtletas) || listaAtletas.length === 0) {
//       return;
//     }

//     setModalData({
//       titulo,
//       atletas: listaAtletas,
//       tipoModal,
//     });
//   }

//   /*
//   ========================================================
//   FECHAMENTO DO MODAL
//   ========================================================
//   */

//   function handleCloseModal() {
//     setModalData(null);
//   }

//   /*
//   ========================================================
//   RETORNO VISUAL
//   ========================================================
//   */

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//       {/* TÍTULO */}

//       <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
//         <span>🛡️</span>
//         Seguro Atleta
//       </h2>

//       {/* ==================================================
//           CARDS
//       ================================================== */}

//       <div
//         className="
//           grid
//           grid-cols-1
//           sm:grid-cols-2
//           md:grid-cols-3
//           lg:grid-cols-5
//           gap-4
//         "
//       >
//         {/* TOTAL SEGURADOS */}
//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Todos os Segurados",
//               listaSeguroAtleta,
//               "PAGAMENTO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-blue-50
//             transition-all

//             ${
//               listaSeguroAtleta.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-blue-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">Total</p>

//             {listaSeguroAtleta.length > 0 && (
//               <span
//                 className="
//                   text-[10px]
//                   bg-blue-200
//                   text-blue-800
//                   font-bold
//                   px-2
//                   py-0.5
//                   rounded-full
//                   uppercase
//                 "
//               ></span>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold text-blue-700 mt-1">
//             {analytics.totalInscritos || 0}
//           </h3>
//         </div>

//         {/* SEGURADOS PAGOS */}

//         <div
//           onClick={() =>
//             handleOpenModal("Segurados Pagos", seguradosPagos, "PAGAMENTO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-green-50
//             transition-all

//             ${
//               seguradosPagos.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-green-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">Segurados Pagos</p>

//             {seguradosPagos.length > 0 && (
//               <span
//                 className="
//                   text-[10px]
//                   bg-green-200
//                   text-green-800
//                   font-bold
//                   px-2
//                   py-0.5
//                   rounded-full
//                   uppercase
//                 "
//               ></span>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold text-green-700 mt-1">
//             {analytics.totalPago || 0}
//           </h3>
//         </div>

//         {/* SEGURADOS PENDENTES */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Segurados Pendentes",
//               seguradosPendentes,
//               "PAGAMENTO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-amber-50
//             transition-all

//             ${
//               seguradosPendentes.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-amber-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">
//               Segurados Pendentes
//             </p>

//             {seguradosPendentes.length > 0 && (
//               <span
//                 className="
//                   text-[10px]
//                   bg-amber-200
//                   text-amber-800
//                   font-bold
//                   px-2
//                   py-0.5
//                   rounded-full
//                   uppercase
//                 "
//               ></span>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold text-amber-700 mt-1">
//             {analytics.totalPendente || 0}
//           </h3>
//         </div>

//         {/* MASCULINO */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Masculino",
//               listaMasculino,
//               "DEMOGRAFICO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-cyan-50
//             transition-all

//             ${
//               listaMasculino.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-cyan-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Masculino</p>

//           <h3 className="text-3xl font-bold text-cyan-700 mt-1">{masculino}</h3>
//         </div>

//         {/* FEMININO */}

//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - Feminino", listaFeminino, "DEMOGRAFICO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-pink-50
//             transition-all

//             ${
//               listaFeminino.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-pink-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Feminino</p>

//           <h3 className="text-3xl font-bold text-pink-700 mt-1">{feminino}</h3>
//         </div>

//         {/* MASCULINO 60+ */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Masculino 60+",
//               listaMasculino60Mais,
//               "DEMOGRAFICO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-orange-50
//             transition-all

//             ${
//               listaMasculino60Mais.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-orange-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Masculino 60+</p>

//           <h3 className="text-3xl font-bold text-orange-700 mt-1">
//             {sessentaMaisMasculino}
//           </h3>
//         </div>

//         {/* FEMININO 60+ */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Feminino 60+",
//               listaFeminino60Mais,
//               "DEMOGRAFICO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-yellow-50
//             transition-all

//             ${
//               listaFeminino60Mais.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-yellow-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Feminino 60+</p>

//           <h3 className="text-3xl font-bold text-yellow-700 mt-1">
//             {sessentaMaisFeminino}
//           </h3>
//         </div>

//         {/* TEA */}

//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - TEA", analytics.listaTea, "DOCUMENTACAO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-indigo-50
//             transition-all

//             ${
//               analytics.listaTea?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-indigo-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">TEA</p>

//           <h3 className="text-3xl font-bold text-indigo-700 mt-1">
//             {analytics.totalTea || 0}
//           </h3>
//         </div>

//         {/* PCD */}

//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - PCD", analytics.listaPcd, "DOCUMENTACAO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-sky-50
//             transition-all

//             ${
//               analytics.listaPcd?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-sky-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">PCD</p>

//           <h3 className="text-3xl font-bold text-sky-700 mt-1">
//             {analytics.totalPcd || 0}
//           </h3>
//         </div>

//         {/* IDOSOS */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Idosos 60+",
//               analytics.listaIdoso,
//               "DOCUMENTACAO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-green-50
//             transition-all

//             ${
//               analytics.listaIdoso?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-green-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Idosos 60+</p>

//           <h3 className="text-3xl font-bold text-green-700 mt-1">
//             {analytics.totalIdoso || 0}
//           </h3>
//         </div>

//         {/* ACOLHIMENTO */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Acolhimento",
//               analytics.listaAcolhimento,
//               "DOCUMENTACAO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-purple-50
//             transition-all

//             ${
//               analytics.listaAcolhimento?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-purple-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">💜 Acolhimento</p>

//           <h3 className="text-3xl font-bold text-purple-700 mt-1">
//             {analytics.totalAcolhimento || 0}
//           </h3>
//         </div>
//       </div>

//       {/* ==================================================
//           MODAL
//       ================================================== */}

//       {modalData && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-50
//             flex
//             items-center
//             justify-center
//             p-4
//             bg-black/40
//             backdrop-blur-sm
//           "
//         >
//           <div
//             className="
//               bg-white
//               w-full
//               max-w-2xl
//               rounded-2xl
//               shadow-2xl
//               overflow-hidden
//               border
//               border-gray-100
//             "
//           >
//             {/* CABEÇALHO */}

//             <div
//               className="
//                 flex
//                 items-center
//                 justify-between
//                 p-5
//                 border-b
//                 border-gray-100
//                 bg-gray-50
//               "
//             >
//               <h3
//                 className="
//                   text-lg
//                   font-bold
//                   text-gray-800
//                   flex
//                   items-center
//                   gap-2
//                 "
//               >
//                 📋 {modalData.titulo}
//                 <span
//                   className="
//                     text-xs
//                     bg-gray-200
//                     text-gray-600
//                     font-semibold
//                     px-2
//                     py-0.5
//                     rounded-full
//                   "
//                 >
//                   {modalData.atletas.length}
//                 </span>
//               </h3>

//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 aria-label="Fechar"
//                 className="
//                   text-gray-500
//                   hover:text-gray-700
//                   hover:bg-gray-200
//                   px-3
//                   py-2
//                   rounded-lg
//                   transition
//                 "
//               >
//                 ✕
//               </button>
//             </div>

//             {/* LISTA */}

//             <div
//               className="
//                 p-4
//                 max-h-[65vh]
//                 overflow-y-auto
//                 divide-y
//                 divide-gray-100
//               "
//             >
//               {modalData.atletas.map((atleta, index) => {
//                 const status =
//                   modalData.tipoModal === "DOCUMENTACAO"
//                     ? normalizarTexto(atleta.documentacao)
//                     : normalizarTexto(atleta.statusPagamento);

//                 const aprovado = status === "PAGO" || status === "APROVADO";

//                 return (
//                   <div
//                     key={atleta.numero || `${atleta.nome}-${index}`}
//                     className="
//                         py-3
//                         flex
//                         justify-between
//                         items-center
//                         gap-4
//                         px-1
//                       "
//                   >
//                     <div className="min-w-0">
//                       <p
//                         className="
//                             font-semibold
//                             text-gray-800
//                             text-sm
//                           "
//                       >
//                         {atleta.nome || "Nome não informado"}
//                       </p>

//                       <p
//                         className="
//                             text-xs
//                             text-gray-400
//                             mt-1
//                             font-mono
//                           "
//                       >
//                         {atleta.numero || "Inscrição não informada"}
//                       </p>

//                       {modalData.tipoModal === "DEMOGRAFICO" && (
//                         <p
//                           className="
//                             text-xs
//                             text-gray-500
//                             mt-1
//                           "
//                         >
//                           Idade:{" "}
//                           <span className="font-semibold">
//                             {Number.isFinite(Number(atleta.idade))
//                               ? `${atleta.idade} anos`
//                               : "Não informada"}
//                           </span>
//                         </p>
//                       )}
//                     </div>

//                     <span
//                       className={`
//                           text-[11px]
//                           font-bold
//                           px-3
//                           py-1
//                           rounded-full
//                           whitespace-nowrap
//                           border

//                           ${
//                             aprovado
//                               ? `
//                                 bg-green-50
//                                 text-green-700
//                                 border-green-200
//                               `
//                               : `
//                                 bg-amber-50
//                                 text-amber-700
//                                 border-amber-200
//                               `
//                           }
//                         `}
//                     >
//                       {status || "NÃO INFORMADO"}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* RODAPÉ */}

//             <div
//               className="
//                 p-4
//                 border-t
//                 border-gray-100
//                 bg-gray-50
//                 flex
//                 justify-end
//               "
//             >
//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 className="
//                   px-5
//                   py-2
//                   bg-gray-200
//                   hover:bg-gray-300
//                   text-gray-700
//                   text-sm
//                   font-semibold
//                   rounded-xl
//                   transition
//                 "
//               >
//                 Fechar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//Funcional em 10-07-2026 só na parte Seguro atleta fez os ahjuste e estout estando outra versão acima para essa mesma parte
// import { useState } from "react";

// /*
// ==========================================================
// FUNÇÕES AUXILIARES
// ==========================================================
// */
// function getTotalCategoria(categoria) {
//   return Object.values(categoria || {}).reduce(
//     (total, valor) => total + Number(valor || 0),
//     0,
//   );
// }

// /**
//  * Normaliza textos utilizados nas comparações.
//  */
// function normalizarTexto(valor) {
//   return String(valor || "")
//     .trim()
//     .toUpperCase();
// }

// /**
//  * Retorna somente os segurados pertencentes
//  * ao status solicitado.
//  */
// function filtrarSeguradosPorStatus(listaSeguroAtleta, status) {
//   const statusNormalizado = normalizarTexto(status);

//   return (listaSeguroAtleta || []).filter(
//     (atleta) => normalizarTexto(atleta?.statusPagamento) === statusNormalizado,
//   );
// }

// /*
// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================
// */

// export default function SeguroAtletaDashboard({ analytics }) {
//   /*
//   ========================================================
//   ESTADO DO MODAL
//   ========================================================
//   */

//   const [modalData, setModalData] = useState(null);

//   /*
//   ========================================================
//   PROTEÇÃO
//   ========================================================
//   */

//   if (!analytics) {
//     return null;
//   }

//   /*
//   ========================================================
//   DADOS DEMOGRÁFICOS
//   ========================================================
//   */

//   const masculino = getTotalCategoria(analytics?.categorias?.masculino);

//   const feminino = getTotalCategoria(analytics?.categorias?.feminino);

//   const sessentaMaisMasculino = getTotalCategoria(
//     analytics?.sessentaMais?.masculino,
//   );

//   const sessentaMaisFeminino = getTotalCategoria(
//     analytics?.sessentaMais?.feminino,
//   );

//   /*
//   ========================================================
//   LISTAS DEMOGRÁFICAS
//   ========================================================
//   */

//   const listaMasculino = analytics?.listaMasculino || [];

//   const listaFeminino = analytics?.listaFeminino || [];

//   const listaMasculino60Mais = analytics?.listaMasculino60Mais || [];

//   const listaFeminino60Mais = analytics?.listaFeminino60Mais || [];

//   /*
//   ========================================================
//   SEGURO ATLETA
//   ========================================================
//   */

//   const listaSeguroAtleta = analytics?.listaSeguroAtleta || [];

//   const seguradosPagos = filtrarSeguradosPorStatus(listaSeguroAtleta, "PAGO");

//   const seguradosPendentes = filtrarSeguradosPorStatus(
//     listaSeguroAtleta,
//     "PENDENTE",
//   );

//   /*
//   ========================================================
//   ABERTURA DO MODAL
//   ========================================================
//   */

//   function handleOpenModal(titulo, listaAtletas, tipoModal = "DOCUMENTACAO") {
//     if (!Array.isArray(listaAtletas) || listaAtletas.length === 0) {
//       return;
//     }

//     setModalData({
//       titulo,
//       atletas: listaAtletas,
//       tipoModal,
//     });
//   }

//   /*
//   ========================================================
//   FECHAMENTO DO MODAL
//   ========================================================
//   */

//   function handleCloseModal() {
//     setModalData(null);
//   }

//   /*
//   ========================================================
//   RETORNO VISUAL
//   ========================================================
//   */

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//       {/* TÍTULO */}

//       <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
//         <span>🛡️</span>
//         Seguro Atleta
//       </h2>

//       {/* ==================================================
//           CARDS
//       ================================================== */}

//       <div
//         className="
//           grid
//           grid-cols-1
//           sm:grid-cols-2
//           md:grid-cols-3
//           lg:grid-cols-5
//           gap-4
//         "
//       >
//         {/* TOTAL SEGURADOS */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Todos os Segurados",
//               listaSeguroAtleta,
//               "PAGAMENTO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-blue-50
//             transition-all

//             ${
//               listaSeguroAtleta.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-blue-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">Total</p>

//             {listaSeguroAtleta.length > 0 && (
//               <span
//                 className="
//                   text-[10px]
//                   bg-blue-200
//                   text-blue-800
//                   font-bold
//                   px-2
//                   py-0.5
//                   rounded-full
//                   uppercase
//                 "
//               ></span>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold text-blue-700 mt-1">
//             {analytics.totalInscritos || 0}
//           </h3>
//         </div>

//         {/* SEGURADOS PAGOS */}

//         <div
//           onClick={() =>
//             handleOpenModal("Segurados Pagos", seguradosPagos, "PAGAMENTO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-green-50
//             transition-all

//             ${
//               seguradosPagos.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-green-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">Segurados Pagos</p>

//             {seguradosPagos.length > 0 && (
//               <span
//                 className="
//                   text-[10px]
//                   bg-green-200
//                   text-green-800
//                   font-bold
//                   px-2
//                   py-0.5
//                   rounded-full
//                   uppercase
//                 "
//               ></span>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold text-green-700 mt-1">
//             {analytics.totalPago || 0}
//           </h3>
//         </div>

//         {/* SEGURADOS PENDENTES */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Segurados Pendentes",
//               seguradosPendentes,
//               "PAGAMENTO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-amber-50
//             transition-all

//             ${
//               seguradosPendentes.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-amber-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">
//               Segurados Pendentes
//             </p>

//             {seguradosPendentes.length > 0 && (
//               <span
//                 className="
//                   text-[10px]
//                   bg-amber-200
//                   text-amber-800
//                   font-bold
//                   px-2
//                   py-0.5
//                   rounded-full
//                   uppercase
//                 "
//               ></span>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold text-amber-700 mt-1">
//             {analytics.totalPendente || 0}
//           </h3>
//         </div>

//         {/* MASCULINO */}

//         {/*         <div className="bg-cyan-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Masculino</p>

//           <h3 className="text-3xl font-bold text-cyan-700">{masculino}</h3>
//         </div> */}

//         {/* MASCULINO */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Masculino",
//               listaMasculino,
//               "DEMOGRAFICO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-cyan-50
//             transition-all

//             ${
//               listaMasculino.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-cyan-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Masculino</p>

//           <h3 className="text-3xl font-bold text-cyan-700 mt-1">{masculino}</h3>
//         </div>

//         {/* FEMININO */}

//         {/*         <div className="bg-pink-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Feminino</p>

//           <h3 className="text-3xl font-bold text-pink-700">{feminino}</h3>
//         </div> */}

//         {/* FEMININO */}
//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - Feminino", listaFeminino, "DEMOGRAFICO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-pink-50
//             transition-all

//             ${
//               listaFeminino.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-pink-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Feminino</p>

//           <h3 className="text-3xl font-bold text-pink-700 mt-1">{feminino}</h3>
//         </div>

//         {/* MASCULINO 60+ */}

//         {/*         <div className="bg-orange-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Masculino 60+</p>

//           <h3 className="text-3xl font-bold text-orange-700">
//             {sessentaMaisMasculino}
//           </h3>
//         </div> */}

//         {/* MASCULINO 60+ */}
//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Masculino 60+",
//               listaMasculino60Mais,
//               "DEMOGRAFICO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-orange-50
//             transition-all

//             ${
//               listaMasculino60Mais.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-orange-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Masculino 60+</p>

//           <h3 className="text-3xl font-bold text-orange-700 mt-1">
//             {sessentaMaisMasculino}
//           </h3>
//         </div>

//         {/* FEMININO 60+ */}

//         {/*         <div className="bg-yellow-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Feminino 60+</p>

//           <h3 className="text-3xl font-bold text-yellow-700">
//             {sessentaMaisFeminino}
//           </h3>
//         </div> */}

//         {/* FEMININO 60+ */}
//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Feminino 60+",
//               listaFeminino60Mais,
//               "DEMOGRAFICO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-yellow-50
//             transition-all

//             ${
//               listaFeminino60Mais.length > 0
//                 ? `
//                   cursor-pointer
//                   hover:bg-yellow-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Feminino 60+</p>

//           <h3 className="text-3xl font-bold text-yellow-700 mt-1">
//             {sessentaMaisFeminino}
//           </h3>
//         </div>

//         {/* TEA */}

//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - TEA", analytics.listaTea, "DOCUMENTACAO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-indigo-50
//             transition-all

//             ${
//               analytics.listaTea?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-indigo-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">TEA</p>

//           <h3 className="text-3xl font-bold text-indigo-700 mt-1">
//             {analytics.totalTea || 0}
//           </h3>
//         </div>

//         {/* PCD */}

//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - PCD", analytics.listaPcd, "DOCUMENTACAO")
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-sky-50
//             transition-all

//             ${
//               analytics.listaPcd?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-sky-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">PCD</p>

//           <h3 className="text-3xl font-bold text-sky-700 mt-1">
//             {analytics.totalPcd || 0}
//           </h3>
//         </div>

//         {/* IDOSOS */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Idosos 60+",
//               analytics.listaIdoso,
//               "DOCUMENTACAO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-green-50
//             transition-all

//             ${
//               analytics.listaIdoso?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-green-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">Idosos 60+</p>

//           <h3 className="text-3xl font-bold text-green-700 mt-1">
//             {analytics.totalIdoso || 0}
//           </h3>
//         </div>

//         {/* ACOLHIMENTO */}

//         <div
//           onClick={() =>
//             handleOpenModal(
//               "Atletas - Acolhimento",
//               analytics.listaAcolhimento,
//               "DOCUMENTACAO",
//             )
//           }
//           className={`
//             rounded-xl
//             p-4
//             bg-purple-50
//             transition-all

//             ${
//               analytics.listaAcolhimento?.length
//                 ? `
//                   cursor-pointer
//                   hover:bg-purple-100
//                   hover:shadow-sm
//                   select-none
//                 `
//                 : ""
//             }
//           `}
//         >
//           <p className="text-sm text-gray-500 font-medium">💜 Acolhimento</p>

//           <h3 className="text-3xl font-bold text-purple-700 mt-1">
//             {analytics.totalAcolhimento || 0}
//           </h3>
//         </div>
//       </div>

//       {/* ==================================================
//           MODAL
//       ================================================== */}

//       {modalData && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-50
//             flex
//             items-center
//             justify-center
//             p-4
//             bg-black/40
//             backdrop-blur-sm
//           "
//         >
//           <div
//             className="
//               bg-white
//               w-full
//               max-w-2xl
//               rounded-2xl
//               shadow-2xl
//               overflow-hidden
//               border
//               border-gray-100
//             "
//           >
//             {/* CABEÇALHO */}

//             <div
//               className="
//                 flex
//                 items-center
//                 justify-between
//                 p-5
//                 border-b
//                 border-gray-100
//                 bg-gray-50
//               "
//             >
//               <h3
//                 className="
//                   text-lg
//                   font-bold
//                   text-gray-800
//                   flex
//                   items-center
//                   gap-2
//                 "
//               >
//                 📋 {modalData.titulo}
//                 <span
//                   className="
//                     text-xs
//                     bg-gray-200
//                     text-gray-600
//                     font-semibold
//                     px-2
//                     py-0.5
//                     rounded-full
//                   "
//                 >
//                   {modalData.atletas.length}
//                 </span>
//               </h3>

//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 aria-label="Fechar"
//                 className="
//                   text-gray-500
//                   hover:text-gray-700
//                   hover:bg-gray-200
//                   px-3
//                   py-2
//                   rounded-lg
//                   transition
//                 "
//               >
//                 ✕
//               </button>
//             </div>

//             {/* LISTA */}

//             <div
//               className="
//                 p-4
//                 max-h-[65vh]
//                 overflow-y-auto
//                 divide-y
//                 divide-gray-100
//               "
//             >
//               {modalData.atletas.map((atleta, index) => {
//                 const status =
//                   modalData.tipoModal === "DOCUMENTACAO"
//                     ? normalizarTexto(atleta.documentacao)
//                     : normalizarTexto(atleta.statusPagamento);
//                 /*                 const status =
//                   modalData.tipoModal === "PAGAMENTO"
//                     ? normalizarTexto(atleta.statusPagamento)
//                     : normalizarTexto(atleta.documentacao); */

//                 const aprovado = status === "PAGO" || status === "APROVADO";

//                 return (
//                   <div
//                     key={atleta.numero || `${atleta.nome}-${index}`}
//                     className="
//                         py-3
//                         flex
//                         justify-between
//                         items-center
//                         gap-4
//                         px-1
//                       "
//                   >
//                     <div className="min-w-0">
//                       <p
//                         className="
//                             font-semibold
//                             text-gray-800
//                             text-sm
//                           "
//                       >
//                         {atleta.nome || "Nome não informado"}
//                       </p>

//                       <p
//                         className="
//                             text-xs
//                             text-gray-400
//                             mt-1
//                             font-mono
//                           "
//                       >
//                         {atleta.numero || "Inscrição não informada"}
//                       </p>

//                       {modalData.tipoModal === "DEMOGRAFICO" && (
//                         <p
//                           className="
//                             text-xs
//                             text-gray-500
//                             mt-1
//                           "
//                         >
//                           Idade:{" "}
//                           <span className="font-semibold">
//                             {Number.isFinite(Number(atleta.idade))
//                               ? `${atleta.idade} anos`
//                               : "Não informada"}
//                           </span>
//                         </p>
//                       )}
//                     </div>

//                     <span
//                       className={`
//                           text-[11px]
//                           font-bold
//                           px-3
//                           py-1
//                           rounded-full
//                           whitespace-nowrap
//                           border

//                           ${
//                             aprovado
//                               ? `
//                                 bg-green-50
//                                 text-green-700
//                                 border-green-200
//                               `
//                               : `
//                                 bg-amber-50
//                                 text-amber-700
//                                 border-amber-200
//                               `
//                           }
//                         `}
//                     >
//                       {status || "NÃO INFORMADO"}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* RODAPÉ */}

//             <div
//               className="
//                 p-4
//                 border-t
//                 border-gray-100
//                 bg-gray-50
//                 flex
//                 justify-end
//               "
//             >
//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 className="
//                   px-5
//                   py-2
//                   bg-gray-200
//                   hover:bg-gray-300
//                   text-gray-700
//                   text-sm
//                   font-semibold
//                   rounded-xl
//                   transition
//                 "
//               >
//                 Fechar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import { useState } from "react";

// function getTotalCategoria(categoria) {
//   return Object.values(categoria || {}).reduce(
//     (total, valor) => total + valor,
//     0,
//   );
// }

// export default function SeguroAtletaDashboard({ analytics }) {
//   // Estado para gerenciar os dados exibidos no modal
//   const [modalData, setModalData] = useState(null);

//   if (!analytics) {
//     return null;
//   }
//   /*   console.log(
//     "Analytics Seguro:",
//     analytics.listaTea,
//     analytics.listaPcd,
//     analytics.listaIdoso,
//     analytics.listaAcolhimento,
//   ); */

//   const masculino = getTotalCategoria(analytics?.categorias?.masculino);

//   const feminino = getTotalCategoria(analytics?.categorias?.feminino);

//   const sessentaMaisMasculino = getTotalCategoria(
//     analytics?.sessentaMais?.masculino,
//   );

//   const sessentaMaisFeminino = getTotalCategoria(
//     analytics?.sessentaMais?.feminino,
//   );

//   // Abre o modal apenas se houver registros na lista correspondente
//   const handleOpenModal = (titulo, listaAtletas) => {
//     if (listaAtletas && listaAtletas.length > 0) {
//       setModalData({ titulo, atletas: listaAtletas });
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//       <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
//         <span>🛡️</span> Seguro Atleta
//       </h2>

//       {/* Grid responsivo: se ajusta de 1 a 5 colunas dependendo da tela */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//         {/* Total Segurados */}
//         <div className="bg-blue-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Total Segurados</p>
//           <h3 className="text-3xl font-bold text-blue-700">
//             {analytics.totalInscritos}
//           </h3>
//         </div>

//         {/* Masculino */}
//         <div className="bg-cyan-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Masculino</p>
//           <h3 className="text-3xl font-bold text-cyan-700">{masculino}</h3>
//         </div>

//         {/* Feminino */}
//         <div className="bg-pink-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Feminino</p>
//           <h3 className="text-3xl font-bold text-pink-700">{feminino}</h3>
//         </div>

//         {/* Masculino 60+ */}
//         <div className="bg-orange-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Masculino 60+</p>
//           <h3 className="text-3xl font-bold text-orange-700">
//             {sessentaMaisMasculino}
//           </h3>
//         </div>

//         {/* Feminino 60+ */}
//         <div className="bg-yellow-50 rounded-xl p-4">
//           <p className="text-sm text-gray-500">Feminino 60+</p>
//           <h3 className="text-3xl font-bold text-yellow-700">
//             {sessentaMaisFeminino}
//           </h3>
//         </div>

//         {/* CARDS INTERATIVOS (Mapeados diretamente com o Log da sua API) */}

//         {/* TEA */}
//         <div
//           onClick={() => handleOpenModal("Atletas - TEA", analytics.listaTea)}
//           className={`rounded-xl p-4 bg-indigo-50 transition-all ${
//             analytics.listaTea?.length
//               ? "cursor-pointer hover:bg-indigo-100 hover:shadow-sm select-none"
//               : ""
//           }`}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">TEA</p>
//             {analytics.listaTea?.length > 0 && (
//               <span className="text-[10px] bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"></span>
//             )}
//           </div>
//           <h3 className="text-3xl font-bold text-indigo-700 mt-1">
//             {analytics.totalTea || 0}
//           </h3>
//         </div>

//         {/* PCD */}
//         <div
//           onClick={() => handleOpenModal("Atletas - PCD", analytics.listaPcd)}
//           className={`rounded-xl p-4 bg-sky-50 transition-all ${
//             analytics.listaPcd?.length
//               ? "cursor-pointer hover:bg-sky-100 hover:shadow-sm select-none"
//               : ""
//           }`}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">PCD</p>
//             {analytics.listaPcd?.length > 0 && (
//               <span className="text-[10px] bg-sky-200 text-sky-800 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"></span>
//             )}
//           </div>
//           <h3 className="text-3xl font-bold text-sky-700 mt-1">
//             {analytics.totalPcd || 0}
//           </h3>
//         </div>

//         {/* Idosos 60+ */}
//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - Idosos 60+", analytics.listaIdoso)
//           }
//           className={`rounded-xl p-4 bg-green-50 transition-all ${
//             analytics.listaIdoso?.length
//               ? "cursor-pointer hover:bg-green-100 hover:shadow-sm select-none"
//               : ""
//           }`}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">Idosos 60+</p>
//             {analytics.listaIdoso?.length > 0 && (
//               <span className="text-[10px] bg-green-200 text-green-800 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"></span>
//             )}
//           </div>
//           <h3 className="text-3xl font-bold text-green-700 mt-1">
//             {analytics.totalIdoso || 0}
//           </h3>
//         </div>

//         {/* ACOLHIMENTO */}
//         <div
//           onClick={() =>
//             handleOpenModal("Atletas - Acolhimento", analytics.listaAcolhimento)
//           }
//           className={`rounded-xl p-4 bg-purple-50 transition-all ${
//             analytics.listaAcolhimento?.length
//               ? "cursor-pointer hover:bg-purple-100 hover:shadow-sm select-none"
//               : ""
//           }`}
//         >
//           <div className="flex justify-between items-start">
//             <p className="text-sm text-gray-500 font-medium">💜 Acolhimento</p>

//             {analytics.listaAcolhimento?.length > 0 && (
//               <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"></span>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold text-purple-700 mt-1">
//             {analytics.totalAcolhimento || 0}
//           </h3>
//         </div>
//       </div>

//       {/* MODAL ISOLADO PARA PRODUÇÃO */}
//       {modalData && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//           {/* Caixa do Modal */}
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             {/* Header */}
//             <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
//               <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                 📋 {modalData.titulo}
//                 <span className="text-xs bg-gray-200 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
//                   {modalData.atletas.length}
//                 </span>
//               </h3>
//               <button
//                 onClick={() => setModalData(null)}
//                 className="text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 p-1.5 rounded-lg transition-colors font-sans text-sm"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Lista Interna */}
//             <div className="p-4 max-h-[50vh] overflow-y-auto divide-y divide-gray-100">
//               {modalData.atletas.map((atleta, index) => (
//                 <div
//                   key={index}
//                   className="py-3 flex justify-between items-center px-1"
//                 >
//                   <div className="pr-2">
//                     <p className="font-semibold text-gray-800 text-sm leading-tight">
//                       {atleta.nome}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-0.5 font-mono">
//                       {atleta.numero}
//                     </p>
//                   </div>

//                   {/* Badge Dinâmico de Documentação */}
//                   <span
//                     className={`text-[11px] font-bold px-2 py-1 rounded-full ${
//                       atleta.documentacao === "APROVADO"
//                         ? "bg-green-50 text-green-700 border border-green-200"
//                         : "bg-amber-50 text-amber-700 border border-amber-200"
//                     }`}
//                   >
//                     {atleta.documentacao}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Footer */}
//             <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
//               <button
//                 onClick={() => setModalData(null)}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
//               >
//                 Fechar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//antigo
// return (
//   <div
//     className="
//       bg-white
//       rounded-2xl
//       shadow-lg
//       p-6
//       mb-6
//     "
//   >
//     <h2
//       className="
//         text-2xl
//         font-bold
//         text-blue-700
//         mb-6
//       "
//     >
//       🛡 Seguro Atleta
//     </h2>

//     <div
//       className="
//         grid
//         grid-cols-1
//         md:grid-cols-2
//         lg:grid-cols-5
//         gap-4
//       "
//     >
//       <div className="bg-blue-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">Total Segurados</p>

//         <h3 className="text-3xl font-bold text-blue-700">
//           {analytics.totalInscritos}
//         </h3>
//       </div>

//       <div className="bg-cyan-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">Masculino</p>

//         <h3 className="text-3xl font-bold text-cyan-700">{masculino}</h3>
//       </div>

//       <div className="bg-pink-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">Feminino</p>

//         <h3 className="text-3xl font-bold text-pink-700">{feminino}</h3>
//       </div>

//       <div className="bg-orange-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">Masculino 60+</p>

//         <h3 className="text-3xl font-bold text-orange-700">
//           {sessentaMaisMasculino}
//         </h3>
//       </div>

//       <div className="bg-yellow-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">Feminino 60+</p>

//         <h3 className="text-3xl font-bold text-yellow-700">
//           {sessentaMaisFeminino}
//         </h3>
//       </div>

//       {/* NOVOS CARDS */}

//       <div className="bg-indigo-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">TEA</p>

//         <h3 className="text-3xl font-bold text-indigo-700">
//           {analytics.totalTea || 0}
//         </h3>
//       </div>

//       <div className="bg-sky-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">PCD</p>

//         <h3 className="text-3xl font-bold text-sky-700">
//           {analytics.totalPcd || 0}
//         </h3>
//       </div>

//       <div className="bg-green-50 rounded-xl p-4">
//         <p className="text-sm text-gray-500">Idosos 60+</p>

//         <h3 className="text-3xl font-bold text-green-700">
//           {analytics.totalIdoso || 0}
//         </h3>
//       </div>
//     </div>
//   </div>
// );
