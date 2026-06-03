const API_URL = process.env.REACT_APP_API_URL;

export async function exportExcel() {
  try {
    const response = await fetch(`${API_URL}?action=export-excel`);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Erro ao exportar Excel.");
    }

    if (!data.url) {
      throw new Error("URL de exportação não encontrada.");
    }

    window.open(data.url, "_blank");
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);

    alert("Erro ao exportar Excel.");
  }
}

/* const API_URL = process.env.REACT_APP_API_URL;

export async function exportExcel() {
  try {
    window.open(
      `${API_URL}?action=export-excel`,

      "_blank",
    );
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);
  }
}
 */
// const API_URL = process.env.REACT_APP_API_URL;

// /**
//  * Exporta os dados do relatório em formato Excel de forma segura.
//  * Baixa o arquivo diretamente como um Blob, evitando bloqueadores de pop-up.
//  *
//  * @returns {Promise<void>}
//  * @throws {Error} Se o usuário não estiver autenticado ou a geração falhar.
//  */
// export async function exportExcel() {
//   try {
//     // 1. Recupera o token de segurança
//     const token = localStorage.getItem("user_token");
//     if (!token) {
//       throw new Error("Usuário não autenticado para exportar dados.");
//     }

//     // 2. Faz a requisição esperando um arquivo (Blob), não um JSON
//     const response = await fetch(`${API_URL}?action=export-excel`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`, // Garante a segurança no Back-end
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 401 || response.status === 403) {
//         throw new Error("Você não tem permissão para exportar este relatório.");
//       }
//       throw new Error("Erro no servidor ao gerar o arquivo Excel.");
//     }

//     // 3. Transforma a resposta em um arquivo binário bruto
//     const blob = await response.blob();

//     // 4. Cria um link invisível no HTML para forçar o download nativo
//     // Isso ignora COMPLETAMENTE o bloqueador de pop-ups dos navegadores
//     const urlAleatoria = window.URL.createObjectURL(blob);
//     const linkTemporario = document.createElement("a");

//     linkTemporario.href = urlAleatoria;

//     // Define o nome padrão do arquivo que o usuário vai receber ao baixar
//     const dataAtual = new Date().toISOString().split("T")[0];
//     linkTemporario.setAttribute(
//       "download",
//       `relatorio_inscritos_${dataAtual}.xlsx`,
//     );

//     // Adiciona o link na página, clica nele programaticamente e o remove
//     document.body.appendChild(linkTemporario);
//     linkTemporario.click();

//     // Limpeza de memória do navegador
//     document.body.removeChild(linkTemporario);
//     window.URL.revokeObjectURL(urlAleatoria);
//   } catch (error) {
//     console.error("Erro ao exportar Excel:", error.message);
//     // Repassa o erro traduzido para que a sua UI (ex: um toast de notificação) exiba ao usuário
//     throw error;
//   }
// }
