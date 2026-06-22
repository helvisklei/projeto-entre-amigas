const API_URL = process.env.REACT_APP_API_URL;

console.log("API_URL carregada:", API_URL);

export async function criarInscricao(payload) {
  try {
    console.log("Payload enviado:", payload);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const text = await response.text();

    console.log("Resposta RAW:", text);

    let data = null;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Resposta inválida do servidor.");
    }

    if (!data.success) {
      throw new Error(data.message || "Erro ao processar inscrição.");
    }

    console.log("RESPOSTA INSCRICAO:", data);

    return data;
  } catch (error) {
    console.error("Erro completo:", error);

    throw error;
  }
}

/* const API_URL = process.env.REACT_APP_API_URL;

console.log("API_URL carregada:", API_URL);

export async function criarInscricao(payload) {
  try {
    console.log("Payload enviado:", payload);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    console.log("Status resposta:", response.status);

    const text = await response.text();

    console.log("Resposta RAW:", text);

    const data = JSON.parse(text);

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("Erro completo:", error);

    throw new Error("Erro ao enviar inscrição.");
  }
} */

// a chave está aqui do google form, mas não é mais usada, pois agora temos uma API própria para receber as inscrições. Deixei aqui para referência futura, caso seja necessário voltar a usar o google forms por algum motivo.
