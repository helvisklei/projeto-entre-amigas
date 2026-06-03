const API_URL = process.env.REACT_APP_API_URL;

export async function getFrontendConfig() {
  const response = await fetch(`${API_URL}?action=frontend-config`);

  const data = await response.json();

  if (!data.success) {
    throw new Error("Erro ao carregar configurações.");
  }

  return data.config;
}
