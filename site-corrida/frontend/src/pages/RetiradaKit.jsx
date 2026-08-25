import React, { useEffect, useState } from "react";

import TermoRetiradaKit from "../components/logistics/TermoRetiradaKit";
import { getDadosTermo } from "../services/participanteService";
import { getFrontendConfig } from "../services/configService";

/**
 * =========================================================
 * RETIRADA KIT
 * =========================================================
 *
 * Responsabilidade:
 *
 * - permitir acesso do participante ao Termo;
 * - receber número da inscrição + CPF;
 * - solicitar validação ao participanteService;
 * - apresentar mensagens de erro;
 * - disponibilizar os dados autorizados ao termo.
 *
 * NÃO:
 *
 * - acessa diretamente a API;
 * - acessa a planilha;
 * - valida pagamento localmente;
 * - decide se a retirada está liberada;
 * - altera KIT_RETIRADO;
 * - gera regras de negócio.
 *
 * A segurança real permanece no backend.
 *
 * =========================================================
 */

export default function RetiradaKit() {
  /*
  =========================================================
  CONFIGURAÇÃO DO EVENTO
  =========================================================
  */

  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configErro, setConfigErro] = useState("");

  /*
  =========================================================
  ESTADO DO FORMULÁRIO
  =========================================================
  */

  const [numeroInscricao, setNumeroInscricao] = useState("");
  const [cpf, setCpf] = useState("");

  /*
  =========================================================
  ESTADO DO PARTICIPANTE
  =========================================================
  */

  const [participante, setParticipante] = useState(null);

  /*
  =========================================================
  ESTADO DE INTERFACE
  =========================================================
  */

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  /*
  =========================================================
  CARREGAR CONFIGURAÇÃO OFICIAL
  =========================================================
  */

  useEffect(() => {
    let ativo = true;

    async function carregarConfig() {
      try {
        setConfigLoading(true);
        setConfigErro("");

        const dadosConfig = await getFrontendConfig();

        if (!ativo) {
          return;
        }

        setConfig(dadosConfig);
      } catch (error) {
        console.error("Erro ao carregar configuração do evento:", error);

        if (!ativo) {
          return;
        }

        setConfigErro("Não foi possível carregar a configuração do evento.");
      } finally {
        if (ativo) {
          setConfigLoading(false);
        }
      }
    }

    carregarConfig();

    return () => {
      ativo = false;
    };
  }, []);

  /*
  =========================================================
  BUSCAR TERMO
  =========================================================
  */

  async function handleConsultarTermo(event) {
    event.preventDefault();

    setErro("");
    setParticipante(null);
    setLoading(true);

    try {
      const dados = await getDadosTermo(numeroInscricao, cpf);
      setParticipante(dados);
    } catch (error) {
      console.error("Erro ao consultar Termo:", error);

      setErro(
        error.message || "Não foi possível consultar o Termo de Retirada.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  =========================================================
  FORMATAR CPF
  =========================================================
  */

  function handleCpfChange(event) {
    const valor = event.target.value.replace(/\D/g, "").slice(0, 11);
    setCpf(valor);
  }

  /*
  =========================================================
  FORMATAR NÚMERO DA INSCRIÇÃO
  =========================================================
  */

  function handleNumeroInscricaoChange(event) {
    const valor = event.target.value.toUpperCase().trim();
    setNumeroInscricao(valor);
  }

  /*
  =========================================================
  MONTAR KIT DO PARTICIPANTE
  =========================================================
  */

  function normalizarTipoKit(valor) {
    return String(valor || "")
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");
  }

  function obterKitParticipante() {
    if (!config?.kits || !participante) {
      return null;
    }

    const tipoKit = normalizarTipoKit(
      participante.tipoKit || participante.TIPO_KIT,
    );

    switch (tipoKit) {
      case "KIT_COMPLETO":
        return config.kits.kitCompleto;

      case "MEIO_KIT":
      case "KIT_PARTICIPACAO":
        return config.kits.meioKit;

      case "LANCHE":
      case "KIT_LANCHE":
        return config.kits.lanche;

      default:
        return null;
    }
  }

  // Otimização com useMemo para evitar execuções em cada caractere digitado
  const kitParticipante = obterKitParticipante();

  /*
  =========================================================
  DADOS DO EVENTO
  =========================================================
  */

  const eventoConfig = config?.evento || {};

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =================================================
          CABEÇALHO
          ================================================= */}

      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Retirada de Kit</h1>

          <p className="mt-3 text-white/90">
            Consulte e gere seu Termo de Retirada de Kit.
          </p>
        </div>
      </section>

      {/* =================================================
          CONTEÚDO
          ================================================= */}

      <main className="max-w-4xl mx-auto px-4 py-8">
        {configLoading && (
          <div
            className="
              max-w-xl
              mx-auto
              mb-6
              rounded-xl
              border
              border-purple-200
              bg-purple-50
              px-4
              py-4
              text-center
              text-sm
              text-purple-700
            "
          >
            Carregando as configurações do evento...
          </div>
        )}

        {/* Exibição Única de Erro de Configuração fora do Form se a config falhar */}
        {configErro && (
          <div
            className="
              max-w-xl
              mx-auto
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-4
              text-sm
              text-red-700
            "
            role="alert"
          >
            {configErro}
          </div>
        )}

        {!participante && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Acesso do participante
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Informe seu número de inscrição e CPF para consultar o Termo de
                Retirada.
              </p>
            </div>

            {/* Mensagem de Erro da Consulta */}
            {erro && (
              <div
                className="
                  mb-5
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
                role="alert"
              >
                {erro}
              </div>
            )}

            {/* =========================================
                FORMULÁRIO
                ========================================= */}

            <form onSubmit={handleConsultarTermo} className="space-y-5">
              {/* Número da inscrição */}
              <div>
                <label
                  htmlFor="numeroInscricao"
                  className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Número da inscrição
                </label>

                <input
                  id="numeroInscricao"
                  type="text"
                  value={numeroInscricao}
                  onChange={handleNumeroInscricaoChange}
                  placeholder="Ex.: EA2026-0000"
                  autoComplete="off"
                  disabled={loading}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-200
                    disabled:bg-gray-100
                  "
                />
              </div>

              {/* CPF */}
              <div>
                <label
                  htmlFor="cpf"
                  className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  CPF
                </label>

                <input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="Digite seu CPF (11 dígitos)"
                  autoComplete="off"
                  disabled={loading}
                  maxLength={11}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-200
                    disabled:bg-gray-100
                  "
                />
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={
                  loading ||
                  configLoading ||
                  !config ||
                  !numeroInscricao.trim() ||
                  cpf.length !== 11 // Garante que o CPF tem exatamente 11 números antes de consultar
                }
                className="
                  w-full
                  rounded-lg
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-600
                  px-5
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Consultando..."
                  : configLoading
                    ? "Carregando configuração..."
                    : "Consultar Termo"}
              </button>
            </form>

            {/* AVISO */}
            <div
              className="
                mt-6
                rounded-lg
                bg-gray-50
                px-4
                py-3
                text-xs
                leading-relaxed
                text-gray-600
              "
            >
              O acesso ao Termo de Retirada de Kit está sujeito à liberação da
              organização e à confirmação do pagamento da inscrição.
            </div>
          </div>
        )}

        {/* =================================================
            TERMO AUTORIZADO
            ================================================= */}

        {participante && (
          <div>
            <div
              className="
                mb-6
                flex
                flex-col
                gap-3
                rounded-xl
                border
                border-green-200
                bg-green-50
                p-4
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div>
                <p className="font-bold text-green-800">Acesso autorizado</p>

                <p className="text-sm text-green-700">
                  Inscrição: {participante.numeroInscricao}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setParticipante(null);
                  setErro("");
                }}
                className="
                  rounded-lg
                  border
                  border-green-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-green-800
                  hover:bg-green-100
                "
              >
                Voltar
              </button>
            </div>

            {/* DOCUMENTO */}
            {kitParticipante ? (
              <TermoRetiradaKit
                participante={participante}
                kit={kitParticipante}
                evento={eventoConfig}
              />
            ) : (
              <div
                className="
                  rounded-xl
                  border
                  border-yellow-200
                  bg-yellow-50
                  p-5
                  text-sm
                  text-yellow-800
                "
              >
                Não foi possível identificar a configuração do kit desta
                inscrição. Entre em contato com a organização do evento.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// import React, { useEffect, useState } from "react";

// import TermoRetiradaKit from "../components/logistics/TermoRetiradaKit";
// import { getDadosTermo } from "../services/participanteService";
// import { getFrontendConfig } from "../services/configService";

// /**
//  * =========================================================
//  * RETIRADA KIT
//  * =========================================================
//  *
//  * Responsabilidade:
//  *
//  * - permitir acesso do participante ao Termo;
//  * - receber número da inscrição + CPF;
//  * - solicitar validação ao participanteService;
//  * - apresentar mensagens de erro;
//  * - disponibilizar os dados autorizados ao termo.
//  *
//  * NÃO:
//  *
//  * - acessa diretamente a API;
//  * - acessa a planilha;
//  * - valida pagamento localmente;
//  * - decide se a retirada está liberada;
//  * - altera KIT_RETIRADO;
//  * - gera regras de negócio.
//  *
//  * A segurança real permanece no backend.
//  *
//  * =========================================================
//  */

// export default function RetiradaKit() {
//   /*
//   =========================================================
//   CONFIGURAÇÃO DO EVENTO
//   =========================================================
//   */

//   const [config, setConfig] = useState(null);

//   const [configLoading, setConfigLoading] = useState(true);

//   const [configErro, setConfigErro] = useState("");
//   /*
//   =========================================================
//   ESTADO DO FORMULÁRIO
//   =========================================================
//   */

//   const [numeroInscricao, setNumeroInscricao] = useState("");

//   const [cpf, setCpf] = useState("");

//   /*
//   =========================================================
//   ESTADO DO PARTICIPANTE
//   =========================================================
//   */

//   const [participante, setParticipante] = useState(null);

//   /*
//   =========================================================
//   ESTADO DE INTERFACE
//   =========================================================
//   */

//   const [loading, setLoading] = useState(false);

//   const [erro, setErro] = useState("");

//   /*
//   =========================================================
//   CARREGAR CONFIGURAÇÃO OFICIAL
//   =========================================================

//   A configuração vem do mesmo endpoint já utilizado
//   pelo restante do projeto.

//   NÃO existe hardcode de:
//   - nome do evento;
//   - data;
//   - local;
//   - nome do kit;
//   - itens do kit;
//   - benefícios.
//   =========================================================
//   */

//   useEffect(() => {
//     let ativo = true;

//     async function carregarConfig() {
//       try {
//         setConfigLoading(true);
//         setConfigErro("");

//         const dadosConfig = await getFrontendConfig();

//         if (!ativo) {
//           return;
//         }

//         setConfig(dadosConfig);
//       } catch (error) {
//         console.error("Erro ao carregar configuração do evento:", error);

//         if (!ativo) {
//           return;
//         }

//         setConfigErro("Não foi possível carregar a configuração do evento.");
//       } finally {
//         if (ativo) {
//           setConfigLoading(false);
//         }
//       }
//     }

//     carregarConfig();

//     return () => {
//       ativo = false;
//     };
//   }, []);

//   /*
//   =========================================================
//   BUSCAR TERMO
//   =========================================================
//   */

//   async function handleConsultarTermo(event) {
//     event.preventDefault();

//     setErro("");
//     setParticipante(null);

//     setLoading(true);

//     try {
//       const dados = await getDadosTermo(numeroInscricao, cpf);

//       setParticipante(dados);
//     } catch (error) {
//       console.error("Erro ao consultar Termo:", error);

//       setErro(
//         error.message || "Não foi possível consultar o Termo de Retirada.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   /*
//   =========================================================
//   FORMATAR CPF
//   =========================================================
//   */

//   function handleCpfChange(event) {
//     const valor = event.target.value.replace(/\D/g, "").slice(0, 11);

//     setCpf(valor);
//   }

//   /*
//   =========================================================
//   FORMATAR NÚMERO DA INSCRIÇÃO
//   =========================================================
//   */

//   function handleNumeroInscricaoChange(event) {
//     const valor = event.target.value.toUpperCase().trim();

//     setNumeroInscricao(valor);
//   }

//   /*
//   =========================================================
//   MONTAR KIT DO PARTICIPANTE
//   =========================================================

//   O tipoKit vem da inscrição.

//   Os dados completos do kit vêm da Config.

//   Exemplo:

//   participante.tipoKit = "KIT COMPLETO"

//   =>
//   config.kits.kitCompleto
//   =========================================================
//   */

//   function normalizarTipoKit(valor) {
//     return String(valor || "")
//       .trim()
//       .toUpperCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "")
//       .replace(/\s+/g, "_");
//   }

//   function obterKitParticipante() {
//     if (!config?.kits || !participante) {
//       return null;
//     }

//     const tipoKit = normalizarTipoKit(
//       participante.tipoKit || participante.TIPO_KIT,
//     );

//     switch (tipoKit) {
//       case "KIT_COMPLETO":
//         return config.kits.kitCompleto;

//       case "MEIO_KIT":
//       case "KIT_PARTICIPACAO":
//         return config.kits.meioKit;

//       case "LANCHE":
//       case "KIT_LANCHE":
//         return config.kits.lanche;

//       default:
//         return null;
//     }
//   }

//   const kitParticipante = obterKitParticipante();

//   /*
//   =========================================================
//   DADOS DO EVENTO
//   =========================================================
//   */

//   const eventoConfig = config?.evento || {};

//   /*
//   =========================================================
//   RENDER
//   =========================================================
//   */

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* =================================================
//           CABEÇALHO
//           ================================================= */}

//       <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
//         <div className="max-w-4xl mx-auto px-4 py-10 text-center">
//           <h1 className="text-3xl md:text-4xl font-bold">Retirada de Kit</h1>

//           <p className="mt-3 text-white/90">
//             Consulte e gere seu Termo de Retirada de Kit.
//           </p>
//         </div>
//       </section>

//       {/* =================================================
//           CONTEÚDO
//           ================================================= */}

//       <main className="max-w-4xl mx-auto px-4 py-8">
//         {configLoading && (
//           <div
//             className="
//               max-w-xl
//               mx-auto
//               mb-6
//               rounded-xl
//               border
//               border-purple-200
//               bg-purple-50
//               px-4
//               py-4
//               text-center
//               text-sm
//               text-purple-700
//             "
//           >
//             Carregando as configurações do evento...
//           </div>
//         )}

//         {configErro && (
//           <div
//             className="
//               max-w-xl
//               mx-auto
//               mb-6
//               rounded-xl
//               border
//               border-red-200
//               bg-red-50
//               px-4
//               py-4
//               text-sm
//               text-red-700
//             "
//             role="alert"
//           >
//             {configErro}
//           </div>
//         )}
//         {!participante && (
//           <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8">
//             <div className="text-center mb-6">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Acesso do participante
//               </h2>

//               <p className="mt-2 text-sm text-gray-600">
//                 Informe seu número de inscrição e CPF para consultar o Termo de
//                 Retirada.
//               </p>
//             </div>

//             {/* =========================================
//                 MENSAGEM DE ERRO
//                 ========================================= */}

//             {erro && (
//               <div
//                 className="
//                   mb-5
//                   rounded-lg
//                   border
//                   border-red-200
//                   bg-red-50
//                   px-4
//                   py-3
//                   text-sm
//                   text-red-700
//                 "
//                 role="alert"
//               >
//                 {erro}
//               </div>
//             )}
//             {configErro && (
//               <div
//                 className="
//                   mb-5
//                   rounded-lg
//                   border
//                   border-red-200
//                   bg-red-50
//                   px-4
//                   py-3
//                   text-sm
//                   text-red-700
//                 "
//                 role="alert"
//               >
//                 {configErro}
//               </div>
//             )}

//             {/* =========================================
//                 FORMULÁRIO
//                 ========================================= */}

//             <form onSubmit={handleConsultarTermo} className="space-y-5">
//               {/* Número da inscrição */}

//               <div>
//                 <label
//                   htmlFor="numeroInscricao"
//                   className="
//                     block
//                     mb-2
//                     text-sm
//                     font-semibold
//                     text-gray-700
//                   "
//                 >
//                   Número da inscrição
//                 </label>

//                 <input
//                   id="numeroInscricao"
//                   type="text"
//                   value={numeroInscricao}
//                   onChange={handleNumeroInscricaoChange}
//                   placeholder="Ex.: EA2026-0000"
//                   autoComplete="off"
//                   disabled={loading}
//                   className="
//                     w-full
//                     rounded-lg
//                     border
//                     border-gray-300
//                     px-4
//                     py-3
//                     outline-none
//                     transition
//                     focus:border-purple-500
//                     focus:ring-2
//                     focus:ring-purple-200
//                     disabled:bg-gray-100
//                   "
//                 />
//               </div>

//               {/* CPF */}

//               <div>
//                 <label
//                   htmlFor="cpf"
//                   className="
//                     block
//                     mb-2
//                     text-sm
//                     font-semibold
//                     text-gray-700
//                   "
//                 >
//                   CPF
//                 </label>

//                 <input
//                   id="cpf"
//                   type="text"
//                   inputMode="numeric"
//                   value={cpf}
//                   onChange={handleCpfChange}
//                   placeholder="Digite seu CPF"
//                   autoComplete="off"
//                   disabled={loading}
//                   maxLength={11}
//                   className="
//                     w-full
//                     rounded-lg
//                     border
//                     border-gray-300
//                     px-4
//                     py-3
//                     outline-none
//                     transition
//                     focus:border-purple-500
//                     focus:ring-2
//                     focus:ring-purple-200
//                     disabled:bg-gray-100
//                   "
//                 />
//               </div>

//               {/* =======================================
//                   BOTÃO
//                   ======================================= */}

//               <button
//                 type="submit"
//                 disabled={
//                   loading ||
//                   configLoading ||
//                   !config ||
//                   !numeroInscricao.trim() ||
//                   !cpf.trim()
//                 }
//                 className="
//                   w-full
//                   rounded-lg
//                   bg-gradient-to-r
//                   from-purple-600
//                   to-pink-600
//                   px-5
//                   py-3
//                   font-bold
//                   text-white
//                   transition
//                   hover:opacity-90
//                   disabled:cursor-not-allowed
//                   disabled:opacity-50
//                 "
//               >
//                 {loading
//                   ? "Consultando..."
//                   : configLoading
//                     ? "Carregando configuração..."
//                     : "Consultar Termo"}
//               </button>
//             </form>

//             {/* =========================================
//                 AVISO
//                 ========================================= */}

//             <div
//               className="
//                 mt-6
//                 rounded-lg
//                 bg-gray-50
//                 px-4
//                 py-3
//                 text-xs
//                 leading-relaxed
//                 text-gray-600
//               "
//             >
//               O acesso ao Termo de Retirada de Kit está sujeito à liberação da
//               organização e à confirmação do pagamento da inscrição.
//             </div>
//           </div>
//         )}

//         {/* =================================================
//             TERMO AUTORIZADO
//             ================================================= */}

//         {participante && (
//           <div>
//             <div
//               className="
//                 mb-6
//                 flex
//                 flex-col
//                 gap-3
//                 rounded-xl
//                 border
//                 border-green-200
//                 bg-green-50
//                 p-4
//                 md:flex-row
//                 md:items-center
//                 md:justify-between
//               "
//             >
//               <div>
//                 <p className="font-bold text-green-800">Acesso autorizado</p>

//                 <p className="text-sm text-green-700">
//                   Inscrição: {participante.numeroInscricao}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setParticipante(null);
//                   setErro("");
//                 }}
//                 className="
//                   rounded-lg
//                   border
//                   border-green-300
//                   bg-white
//                   px-4
//                   py-2
//                   text-sm
//                   font-semibold
//                   text-green-800
//                   hover:bg-green-100
//                 "
//               >
//                 Voltar
//               </button>
//             </div>

//             {/* =========================================
//                 DOCUMENTO
//                 ========================================= */}

//             {kitParticipante ? (
//               <TermoRetiradaKit
//                 participante={participante}
//                 kit={kitParticipante}
//                 evento={eventoConfig}
//               />
//             ) : (
//               <div
//                 className="
//                   rounded-xl
//                   border
//                   border-yellow-200
//                   bg-yellow-50
//                   p-5
//                   text-sm
//                   text-yellow-800
//                 "
//               >
//                 Não foi possível identificar a configuração do kit desta
//                 inscrição. Entre em contato com a organização do evento.
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
