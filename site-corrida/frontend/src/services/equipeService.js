const API_URL = process.env.REACT_APP_API_URL;

/**
 * Recupera as credenciais da sessão operacional.
 */
function obterCredenciaisEquipe() {
  const user = sessionStorage.getItem("equipe_user");
  const password = sessionStorage.getItem("equipe_password");

  if (!user || !password) {
    throw new Error("Sessão da equipe não encontrada.");
  }

  return { user, password };
}

/**
 * Executa uma solicitação autenticada ao Apps Script.
 */
async function requisicaoEquipe(action, mensagemErro, dadosAdicionais = {}) {
  if (!API_URL) {
    throw new Error("URL da API não configurada.");
  }

  const credenciais = obterCredenciaisEquipe();

  const response = await fetch(`${API_URL}?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({ ...credenciais, ...dadosAdicionais }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || mensagemErro);
  }

  return data;
}

/**
 * =========================================================
 * CONFIRMAR ENTREGA DE KIT PELA EQUIPE
 * =========================================================
 *
 * Envia a identificação do participante e as credenciais
 * da sessão operacional.
 *
 * A API possui uma rota específica que permite somente
 * atualizar KIT_RETIRADO.
 * =========================================================
 */
export async function entregarKitEquipe(row) {
  if (!row || !Number.isInteger(Number(row))) {
    throw new Error("Identificação do participante inválida.");
  }

  return requisicaoEquipe(
    "equipe-entregar-kit",
    "Erro ao confirmar a entrega do kit.",
    {
      row: Number(row),
    },
  );
}

/**
 * Busca os indicadores do painel operacional.
 */
export async function getEquipeDashboard() {
  return requisicaoEquipe(
    "equipe-dashboard",
    "Erro ao carregar painel da equipe.",
  );
}

/**
 * Busca a relação individual dos inscritos.
 */
export async function getEquipeInscritos() {
  return requisicaoEquipe(
    "equipe-inscritos",
    "Erro ao carregar a lista de inscritos.",
  );
}
export async function desfazerEntregaKitEquipe(row) {
  if (!Number.isInteger(Number(row)) || Number(row) < 2) {
    throw new Error("Identificação do participante inválida.");
  }

  return requisicaoEquipe(
    "equipe-desfazer-kit",
    "Erro ao desfazer a retirada do kit.",
    { row: Number(row) },
  );
}

/* const API_URL = process.env.REACT_APP_API_URL;

export async function getEquipeDashboard() {
  const user = sessionStorage.getItem("equipe_user");
  const password = sessionStorage.getItem("equipe_password");

  if (!user || !password) {
    throw new Error("Sessão da equipe não encontrada.");
  }

  const response = await fetch(`${API_URL}?action=equipe-dashboard`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      user,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Erro ao carregar painel da equipe.");
  }

  return data;
}
 */
