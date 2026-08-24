const API_URL = process.env.REACT_APP_API_URL;

/**
 * =========================================================
 * PARTICIPANTE SERVICE
 * =========================================================
 *
 * Responsabilidade:
 *
 * - consultar o Termo de Retirada de Kit;
 * - enviar número da inscrição + CPF para a API;
 * - interpretar respostas da API;
 * - não manipular a interface;
 * - não gerar PDF;
 * - não acessar diretamente a planilha.
 *
 * Fluxo:
 *
 * RetiradaKit.jsx
 *      ↓
 * participanteService.js
 *      ↓
 * API Apps Script
 *      ↓
 * ParticipanteService.gs
 *
 * =========================================================
 */

/**
 * Consulta os dados autorizados do participante
 * para geração do Termo de Retirada de Kit.
 *
 * @param {string} numeroInscricao
 * @param {string} cpf
 * @returns {Promise<Object>}
 */
export async function getDadosTermo(numeroInscricao, cpf) {
  try {
    const inscricao = String(numeroInscricao || "").trim();
    const cpfInformado = String(cpf || "").trim();

    /*
    =========================================================
    VALIDAÇÃO FRONTEND
    =========================================================
    */
    if (!inscricao || !cpfInformado) {
      throw new Error("Informe o número da inscrição e o CPF.");
    }

    /*
    =========================================================
    CONSULTA API
    =========================================================
    */
    const params = new URLSearchParams({
      action: "participante-termo",
      numeroInscricao: inscricao,
      cpf: cpfInformado,
    });

    const response = await fetch(`${API_URL}?${params.toString()}`);

    /*
    =========================================================
    VALIDAÇÃO HTTP
    =========================================================
    */
    if (!response.ok) {
      throw new Error("Não foi possível consultar os dados do participante.");
    }

    /*
    =========================================================
    RESPOSTA API
    =========================================================
    */
    const data = await response.json();

    /*
    =========================================================
    RESPOSTA NEGATIVA
    =========================================================
    */
    if (!data.success) {
      const error = new Error(
        data.message || "Não foi possível validar os dados.",
      );

      // Mantém o código retornado pelo backend
      error.code = data.code || "";

      throw error;
    }

    /*
    =========================================================
    RESPOSTA POSITIVA
    =========================================================
    */
    return data.participante;
  } catch (error) {
    console.error("Erro participanteService:", error);

    // Se já for um erro tratado acima, apenas repassa
    if (
      error.code ||
      error.message === "Informe o número da inscrição e o CPF."
    ) {
      throw error;
    }

    // Caso contrário, falha inesperada (rede, parse, etc.)
    throw new Error(
      "Não foi possível consultar o Termo de Retirada. Tente novamente.",
    );
  }
}
