const API_URL = process.env.REACT_APP_API_URL;

export async function getAdminInscritos() {
  try {
    const response = await fetch(`${API_URL}?action=admin-inscritos`);

    if (!response.ok) {
      throw new Error("Erro ao carregar inscritos.");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Erro ao carregar inscritos.");
    }

    return data.inscritos || [];
  } catch (error) {
    console.error("Erro adminService:", error);

    throw error;
  }
}

export async function resendEmail(row) {
  const response = await fetch(`${API_URL}?action=resend-email`, {
    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },

    body: JSON.stringify({
      row,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
}

export async function cancelarInscricao(row) {
  const response = await fetch(`${API_URL}?action=cancelar-inscricao`, {
    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },

    body: JSON.stringify({
      row,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Erro ao cancelar inscrição.");
  }

  return data;
}

export async function trocarInscricao(row, numeroInscricaoOriginal, payload) {
  const response = await fetch(`${API_URL}?action=trocar-inscricao`, {
    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },

    body: JSON.stringify({
      row,
      numeroInscricaoOriginal,
      payload,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Erro ao trocar inscrição.");
  }

  return data;
}
