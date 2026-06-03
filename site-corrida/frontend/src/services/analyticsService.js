const API_URL = process.env.REACT_APP_API_URL;

export async function getAnalytics() {
  try {
    const response = await fetch(`${API_URL}?action=analytics`);

    if (!response.ok) {
      throw new Error("Erro ao carregar analytics.");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Erro analytics.");
    }

    return data.analytics;
  } catch (error) {
    console.error("Erro analytics:", error);

    throw error;
  }
}

// const API_URL = process.env.REACT_APP_API_URL;

// /**
//  * Busca os dados de analytics do sistema de forma segura.
//  * @returns {Promise<any>} Dados de analytics.
//  * @throws {Error} Se a requisição falhar ou o token for inválido.
//  */
// export async function getAnalytics() {
//   // 1. Controle de Timeout (Interrompe após 8 segundos)
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 8000);

//   try {
//     // 2. Recuperação segura do Token (Ajuste conforme sua autenticação: localStorage, cookies, etc.)
//     const token = localStorage.getItem("user_token");

//     if (!token) {
//       throw new Error("Usuário não autenticado.");
//     }

//     const response = await fetch(`${API_URL}?action=analytics`, {
//       method: "GET",
//       signal: controller.signal, // Vincula o timeout
//       headers: {
//         "Content-Type": "application/json",
//         // 3. Passando o token de segurança no Header (Padrão mais seguro que na URL)
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Limpa o timeout se a requisição respondeu a tempo
//     clearTimeout(timeoutId);

//     if (!response.ok) {
//       // Evita mensagens genéricas se o erro for de permissão
//       if (response.status === 401 || response.status === 403) {
//         throw new Error("Você não tem permissão para acessar estes dados.");
//       }
//       throw new Error("Erro ao carregar analytics no servidor.");
//     }

//     const data = await response.json();

//     if (!data.success) {
//       throw new Error(
//         data.message || "Erro interno no processamento do analytics.",
//       );
//     }

//     return data.analytics;
//   } catch (error) {
//     clearTimeout(timeoutId); // Garante a limpeza em caso de erro interno

//     // 4. Log limpo para produção (sem expor o objeto de erro cru para o usuário final)
//     if (error.name === "AbortError") {
//       console.error("Erro analytics: Tempo limite da requisição esgotado.");
//     } else {
//       console.error("Erro analytics:", error.message);
//     }

//     // Se tiver uma ferramenta de monitoramento (Sentry, LogRocket), envie o erro completo para lá:
//     // Sentry.captureException(error);

//     throw error;
//   }
// }
