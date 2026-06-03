const API_URL = process.env.REACT_APP_API_URL;

export async function calculatePricing(payload) {
  // 1. AbortController para evitar requisições infinitas (Enterprise standard)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(`${API_URL}?action=pricing`, {
      method: "POST",
      cache: "no-cache",
      signal: controller.signal,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    clearTimeout(timeoutId);

    // 2. Verificação robusta de status
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    // 3. Parsing seguro
    const data = await response.json();

    if (!data.success) {
      const publicMessage =
        data.publicMessage || "Não foi possível calcular o valor da inscrição.";

      throw new Error(publicMessage);
      //throw new Error(data.message || "Erro no processamento dos dados.");
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Erro: A requisição excedeu o tempo limite.");
    } else {
      console.error("Erro na chamada de pricing:", error.message);
    }
    throw error; // Re-throw para o componente UI tratar o estado de erro
  }
}

/* const API_URL = process.env.REACT_APP_API_URL;

export async function calculatePricing(payload) {
  const response = await fetch(`${API_URL}?action=pricing`, {
    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Erro ao calcular valor.");
  }

  return data;
}
 */
