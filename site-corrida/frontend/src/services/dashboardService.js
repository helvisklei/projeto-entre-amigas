const API_URL = process.env.REACT_APP_API_URL;

/***
 * Fetches the dashboard data from the API.
 * REsponsavel pela centralização consumo da API para o dashboard, facilitando manutenção e reutilização.
 * @returns {Promise<any>} The dashboard data.
 */
export async function getDashboardData() {
  const response = await fetch(`${API_URL}?action=dashboard`);

  if (!response.ok) {
    throw new Error("Erro ao carregar dashboard.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Erro ao carregar métricas.");
  }

  return data.dashboard;
}
