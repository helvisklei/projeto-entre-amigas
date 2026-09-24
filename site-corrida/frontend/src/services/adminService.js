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

export function exportSeguroAtletaPdf() {
  return new Promise((resolve, reject) => {
    const callbackName = `exportSeguroAtletaPdf_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;

    const script = document.createElement("script");

    const timeout = setTimeout(() => {
      cleanup();

      reject(new Error("Tempo limite ao gerar o PDF do Seguro Atleta."));
    }, 60000);

    const cleanup = () => {
      clearTimeout(timeout);

      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    window[callbackName] = (data) => {
      cleanup();

      if (!data?.success) {
        reject(
          new Error(data?.message || "Erro ao gerar PDF do Seguro Atleta."),
        );

        return;
      }

      resolve(data);
    };

    script.onerror = () => {
      cleanup();

      reject(new Error("Não foi possível acessar o serviço do Seguro Atleta."));
    };

    script.src =
      `${API_URL}?action=export-seguro-atleta-pdf` +
      `&callback=${encodeURIComponent(callbackName)}`;

    document.body.appendChild(script);
  });
}
/* export async function exportSeguroAtletaPdf() {
  try {
    const response = await fetch(`${API_URL}?action=export-seguro-atleta-pdf`);

    if (!response.ok) {
      throw new Error("Erro ao gerar PDF do Seguro Atleta.");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Erro ao gerar PDF do Seguro Atleta.");
    }

    return data;
  } catch (error) {
    console.error("Erro ao exportar PDF do Seguro Atleta:", error);

    throw error;
  }
} */
