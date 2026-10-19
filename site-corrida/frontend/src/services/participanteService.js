const API_URL = process.env.REACT_APP_API_URL;

const MENSAGEM_ERRO_CONSULTA =
  "Não foi possível consultar o Termo de Retirada. Tente novamente.";

/**
 * =========================================================
 * PARTICIPANTE SERVICE
 * =========================================================
 *
 * Responsabilidade:
 * - consultar o termo pelo CPF;
 * - validar os dados mínimos antes da requisição;
 * - interpretar a resposta do Apps Script;
 * - preservar os códigos de erro retornados pelo backend.
 *
 * A autorização da retirada e a validação do participante
 * continuam sendo responsabilidade do backend.
 *
 * =========================================================
 */

/**
 * Consulta os dados autorizados do participante pelo CPF.
 *
 * @param {string} cpf CPF com ou sem máscara.
 * @returns {Promise<Object>} Dados autorizados do participante.
 */
export async function getDadosTermo(cpf) {
  try {
    if (!API_URL) {
      throw new Error("O serviço de consulta não está configurado.");
    }

    // Aceita CPF com ou sem máscara.
    const cpfInformado = String(cpf ?? "").replace(/\D/g, "");

    if (cpfInformado.length !== 11) {
      const error = new Error("Informe um CPF válido com 11 dígitos.");
      error.code = "CPF_INVALIDO";
      throw error;
    }

    const params = new URLSearchParams({
      action: "participante-termo",
      cpf: cpfInformado,
    });

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Falha HTTP ${response.status}.`);
    }

    const data = await response.json();

    if (!data || data.success !== true || !data.participante) {
      const error = new Error(
        data?.message || "Não foi possível validar os dados do participante.",
      );

      error.code = data?.code || "CONSULTA_NAO_AUTORIZADA";
      throw error;
    }

    return data.participante;
  } catch (error) {
    // Preserva erros de validação e mensagens conhecidas do backend.
    if (error.code) {
      throw error;
    }

    console.error("Erro participanteService:", error);

    // Evita expor detalhes técnicos ao participante.
    throw new Error(MENSAGEM_ERRO_CONSULTA);
  }
}

// const API_URL = process.env.REACT_APP_API_URL;

// /**
//  * =========================================================
//  * PARTICIPANTE SERVICE
//  * =========================================================
//  *
//  * Responsabilidade:
//  *
//  * - consultar o Termo de Retirada de Kit;
//  * - enviar número da inscrição + CPF para a API;
//  * - interpretar respostas da API;
//  * - não manipular a interface;
//  * - não gerar PDF;
//  * - não acessar diretamente a planilha.
//  *
//  * Fluxo:
//  *
//  * RetiradaKit.jsx
//  *      ↓
//  * participanteService.js
//  *      ↓
//  * API Apps Script
//  *      ↓
//  * ParticipanteService.gs
//  *
//  * =========================================================
//  */

// /**
//  * Consulta os dados autorizados do participante
//  * para geração do Termo de Retirada de Kit.
//  *
//  * @param {string} numeroInscricao
//  * @param {string} cpf
//  * @returns {Promise<Object>}
//  */
// export async function getDadosTermo(numeroInscricao, cpf) {
//   try {
//     const inscricao = String(numeroInscricao || "").trim();
//     const cpfInformado = String(cpf || "").trim();

//     /*
//     =========================================================
//     VALIDAÇÃO FRONTEND
//     =========================================================
//     */
//     if (!inscricao || !cpfInformado) {
//       throw new Error("Informe o número da inscrição e o CPF.");
//     }

//     /*
//     =========================================================
//     CONSULTA API
//     =========================================================
//     */
//     const params = new URLSearchParams({
//       action: "participante-termo",
//       numeroInscricao: inscricao,
//       cpf: cpfInformado,
//     });

//     const response = await fetch(`${API_URL}?${params.toString()}`);

//     /*
//     =========================================================
//     VALIDAÇÃO HTTP
//     =========================================================
//     */
//     if (!response.ok) {
//       throw new Error("Não foi possível consultar os dados do participante.");
//     }

//     /*
//     =========================================================
//     RESPOSTA API
//     =========================================================
//     */
//     const data = await response.json();

//     /*
//     =========================================================
//     RESPOSTA NEGATIVA
//     =========================================================
//     */
//     if (!data.success) {
//       const error = new Error(
//         data.message || "Não foi possível validar os dados.",
//       );

//       // Mantém o código retornado pelo backend
//       error.code = data.code || "";

//       throw error;
//     }

//     /*
//     =========================================================
//     RESPOSTA POSITIVA
//     =========================================================
//     */
//     return data.participante;
//   } catch (error) {
//     console.error("Erro participanteService:", error);

//     // Se já for um erro tratado acima, apenas repassa
//     if (
//       error.code ||
//       error.message === "Informe o número da inscrição e o CPF."
//     ) {
//       throw error;
//     }

//     // Caso contrário, falha inesperada (rede, parse, etc.)
//     throw new Error(
//       "Não foi possível consultar o Termo de Retirada. Tente novamente.",
//     );
//   }
// }
