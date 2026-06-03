const API_URL = process.env.REACT_APP_API_URL;

export async function exportPdf() {
  try {
    window.open(
      `${API_URL}?action=export-pdf`,

      "_blank",
    );
  } catch (error) {
    console.error("Erro PDF:", error);
  }
}
