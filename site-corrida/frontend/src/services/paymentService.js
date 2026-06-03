const API_URL = process.env.REACT_APP_API_URL;

export async function getPaymentLinks() {
  const response = await fetch(`${API_URL}?action=payment-links`);

  const data = await response.json();

  if (!data.success) {
    throw new Error("Erro ao carregar pagamentos.");
  }

  return data.links;
}
