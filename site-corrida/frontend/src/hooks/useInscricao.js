import { criarInscricao } from "../services/inscricaoService";
import { useState } from "react";

export function useInscricao() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  const [success, setSuccess] = useState(null);

  const [pricing, setPricing] = useState(null);

  async function submitInscricao(formData) {
    try {
      setLoading(true);

      setError("");

      setFieldErrors({});

      setSuccess(null);

      const response = await criarInscricao(formData);

      /*
        =========================================================
        = PRICING OFICIAL BACKEND
        =========================================================
        */

      setPricing({
        valor: response.valorCalculado,

        valorOriginal: response.valorOriginal,

        lote: response.lote,

        tipoDesconto: response.tipoDesconto,

        cupomAplicado: response.cupomAplicado,
      });

      setSuccess(response);

      return response;
    } catch (err) {
      console.error(err);

      /*
      ==========================================
      MENSAGEM GERAL
      ==========================================
      */

      const mensagem = err?.message || "Erro ao realizar inscrição.";

      setError(mensagem);

      /*
      ==========================================
      ERROS DE CAMPOS
      ==========================================
      */

      if (err?.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,

    error,

    fieldErrors,

    success,

    pricing,
    setPricing,

    submitInscricao,
  };
}
