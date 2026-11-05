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
async function requisicaoEquipe(action, mensagemErro) {
  if (!API_URL) {
    throw new Error("URL da API não configurada.");
  }

  const credenciais = obterCredenciaisEquipe();

  const response = await fetch(`${API_URL}?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(credenciais),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || mensagemErro);
  }

  return data;
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
