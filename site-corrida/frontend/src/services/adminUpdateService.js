const API_URL = process.env.REACT_APP_API_URL;

export async function updateInscrito(row, payload) {
  try {
    const response = await fetch(
      `${API_URL}?action=update-inscrito`,

      {
        method: "POST",

        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },

        body: JSON.stringify({
          row,
          payload,
        }),
      },
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Erro ao atualizar inscrito.");
    }

    return data;
  } catch (error) {
    console.error("Erro update inscrito:", error);

    throw error;
  }
}
