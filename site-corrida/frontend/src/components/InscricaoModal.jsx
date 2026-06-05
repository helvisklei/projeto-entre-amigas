import React, { useMemo, useState } from "react";
import { maskCpf, maskTelefone } from "../utils/masks";

import { calculatePricing } from "../services/pricingService";
import { getFrontendConfig } from "../services/configService";
import { useInscricao } from "../hooks/useInscricao";
import { useRef } from "react";
import { validarInscricao } from "../validators/inscricaoValidator";

//import { getPaymentLinks } from "../services/paymentService";

const cidades = [
  "Abreu e Lima",
  "Cabo de Santo Agostinho",
  "Goiana",
  "Igarassu",
  "Itapissuma",
  "Jaboatão dos Guararapes",
  "Olinda",
  "Paulista",
  "Recife",
  "Outros",
];

const tamanhosCamisa = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "XG",
  "Infantil P",
  "Infantil M",
  "Infantil G",
];

const distancias = ["5 KM"]; //"3 KM"
const formasPagamento = ["PIX", "CARTÃO"]; //"DINHEIRO"
const sexos = ["Feminino", "Masculino"];

const comoConheceuOpcoes = [
  "Amigos",
  "Brabras do Asfalto",
  "Correr é melhor que lasanha",
  "Facebook",
  "Instagram",
  "Milayne",
  "Race Running",
  "Raquel",
  "Site",
  "Whatsapp",
  "Outros",
];

export default function InscricaoModal({
  isOpen,
  onClose,
  onSuccess,
  paymentType,
}) {
  const {
    loading,
    error: backendError,
    fieldErrors: backendFieldErrors,
    success,
    pricing,
    setPricing,
    submitInscricao,
  } = useInscricao();

  /*
  =========================================================
  LEGADO MP FIXO
  =========================================================
  Será removido após migração completa
  para MercadoPagoService dinâmico.
  =========================================================
  */

  // const [paymentLinks, setPaymentLinks] = useState({});
  const [systemConfig, setSystemConfig] = useState(null);

  /* Erros locais para validação do frontend antes de bater na API */
  const [localGeneralError, setLocalGeneralError] = useState("");
  const [localFieldErrors, setLocalFieldErrors] = useState({});
  const [pricingError, setPricingError] = useState("");

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    telefone: "",
    cidade: "",
    cidadeOutra: "",
    tamanhoCamisa: "",
    corridas: "",
    restricoesMedicas: "NÃO",
    descricaoRestricao: "",
    declaracao: false,
    aceiteRegulamento: false,
    distancia: "",
    comoConheceu: "",
    idade: "",
    tipoKit: "KIT COMPLETO",
    formaPagamento: paymentType === "credito" ? "CARTÃO" : "PIX",
    cupom: "",
    //isIdoso: false,
    isPcd: false,
    isTea: false,
    sexo: "",
    website: "",
    createdAt: Date.now(),
  });

  const pricingRequestRef =
    useRef(
      0,
    ); /* Referência para controlar requisições concorrentes de pricing */

  /* Mescla os erros locais (validador) e externos (API) de forma reativa */
  const activeFieldErrors = useMemo(
    () => ({
      ...backendFieldErrors,
      ...localFieldErrors,
    }),
    [backendFieldErrors, localFieldErrors],
  );

  const activeGeneralError = backendError || localGeneralError;

  /* Efeito isolado para gerenciar o comportamento de scroll da página sem travar o app */
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /* Reseta os erros de validação locais ao fechar/abrir o modal */
  React.useEffect(() => {
    if (!isOpen) {
      setLocalGeneralError("");
      setLocalFieldErrors({});
    }
  }, [isOpen]);

  /*
  =========================================================
  LEGADO LINKS FIXOS MP
  =========================================================
  Migração em andamento para
  MercadoPagoService dinâmico.
  =========================================================
  */

  /* React.useEffect(() => {
    async function loadLinks() {
      try {
        const links = await getPaymentLinks();
        setPaymentLinks(links);
      } catch (error) {
        console.error(error);
      }
    }
    loadLinks();
  }, []); */

  React.useEffect(() => {
    async function loadConfig() {
      try {
        const config = await getFrontendConfig();
        setSystemConfig(config);

        setFormData((prev) => ({
          ...prev,
          corridas: config.corridaAtiva,
        }));
      } catch (error) {
        console.error(error);
      }
    }
    loadConfig();
  }, []);

  /*
  =========================================================
  = REALTIME PRICING
  =========================================================
  */

  React.useEffect(() => {
    /*
    =========================================================
    = VALIDA CAMPOS MÍNIMOS
    =========================================================
    */

    if (!formData.tipoKit || !formData.formaPagamento) {
      return;
    }

    /*
    =========================================================
    = DEBOUNCE
    =========================================================
    */

    const timeout = setTimeout(async () => {
      const requestId = ++pricingRequestRef.current;

      try {
        setPricingError("");

        const pricingResponse = await calculatePricing({
          tipoKit: formData.tipoKit,

          formaPagamento: formData.formaPagamento,

          idade: formData.idade,

          isPcd: formData.isPcd,

          isTea: formData.isTea,

          cupom: formData.cupom,
        });

        if (requestId !== pricingRequestRef.current) {
          return;
        }

        setPricing(pricingResponse);
      } catch (error) {
        if (requestId !== pricingRequestRef.current) {
          return;
        }

        console.error("Erro pricing realtime:", error);

        setPricing(null);

        setPricingError(error?.message || "Não foi possível calcular o preço.");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    formData.tipoKit,
    formData.formaPagamento,
    formData.idade,
    formData.isPcd,
    formData.isTea,
    formData.cupom,
    setPricing,
  ]);

  /*   const valorCalculado = useMemo(() => {
    const tipo = formData.tipoKit;
    const pagamento = formData.formaPagamento;

    if (tipo === "KIT COMPLETO") {
      return pagamento === "CARTÃO" ? "115" : "105";
    }
    if (tipo === "MEIO KIT") {
      return pagamento === "CARTÃO" ? "65" : "55";
    }
    if (tipo === "SÓ CAMISA") return "30";
    if (tipo === "LANCHE") return "25";

    return "";
  }, [formData.tipoKit, formData.formaPagamento]); */

  const kitsDisponiveis = useMemo(() => {
    if (!systemConfig || !systemConfig.kits) {
      return ["KIT COMPLETO", "MEIO KIT", "SÓ CAMISA", "LANCHE"];
    }

    const kits = [];
    if (systemConfig.kits.kitCompleto) kits.push("KIT COMPLETO");
    if (systemConfig.kits.meioKit) kits.push("MEIO KIT");
    if (systemConfig.kits.camisa) kits.push("SÓ CAMISA");
    if (systemConfig.kits.lanche) kits.push("LANCHE");

    return kits;
  }, [systemConfig]);

  /*   const pixKey =
    "00020126330014br.gov.bcb.pix0111079447264845204000053039865406105.005802BR5921Denize Jaques Valenca6009Sao Paulo610901227-20062230519daqr1745725661741916304042E"; */

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    let finalValue = value;

    if (name === "cpf") {
      finalValue = maskCpf(value);
    }
    if (name === "telefone") {
      finalValue = maskTelefone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : finalValue,
    }));

    /*
    =====================================================
    REMOVE ERRO DO CAMPO AO DIGITAR
    =====================================================
    */

    setLocalFieldErrors((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[name];

      return updated;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    /*
    ==========================================
    = ANTI DUPLO SUBMIT
    ==========================================
    */

    if (loading) {
      return;
    }

    /* Reseta estados de validação locais para novos testes */
    setLocalGeneralError("");
    setLocalFieldErrors({});

    try {
      /* Validação do formulário local */
      validarInscricao(formData);

      const payload = {
        ...formData,
        cidade:
          formData.cidade === "Outros" ? formData.cidadeOutra : formData.cidade,
        //valorPago: pricing?.valor || 0, //valorCalculado,
      };

      const response = await submitInscricao(payload);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error(err);
      /* Captura o objeto de erro estruturado lançado pelo validador do frontend */
      if (err.fieldErrors) {
        setLocalFieldErrors(err.fieldErrors);

        /*
        =====================================================
        FOCA NO PRIMEIRO CAMPO COM ERRO
        =====================================================
        */

        const firstField = Object.keys(err.fieldErrors)[0];

        const element = document.querySelector(`[name="${firstField}"]`);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          element.focus();
        }
      } else {
        setLocalGeneralError(err.message || "Erro ao realizar inscrição.");
      }
    }
  }

  /*   async function handleCopyPix() {
    try {
      await navigator.clipboard.writeText(pixKey);
      alert("Chave PIX copiada com sucesso.");
    } catch {
      alert("Erro ao copiar chave PIX.");
    }
  } */

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto p-8 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-600">
            🎯 Inscrição Entre Amigas Run
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-2xl hover:text-gray-700 transition-colors"
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Inscrição Realizada!
            </h2>
            <p className="mb-2">Número da inscrição:</p>
            <p className="text-2xl font-bold text-purple-600 mb-6">
              {success.numeroInscricao}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  //window.location.href = paymentLinks[valorCalculado];
                  window.location.href = success.paymentLink; // Link dinâmico retornado pela API
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                💳 Pagar com Mercado Pago
              </button>

              <button
                onClick={onClose}
                className="w-full text-gray-600 py-3 hover:text-gray-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* O Grid mantém o comportamento em telas maiores, e cada div protege a sua própria célula */}
            <div className="hidden">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                autoComplete="off"
                tabIndex="-1"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  name="nomeCompleto"
                  placeholder="Nome completo"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.nomeCompleto
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {activeFieldErrors.nomeCompleto && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.nomeCompleto}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.cpf ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {activeFieldErrors.cpf && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.cpf}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {activeFieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.telefone
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {activeFieldErrors.telefone && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.telefone}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.cidade
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Cidade</option>
                  {cidades.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
                {activeFieldErrors.cidade && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.cidade}
                  </p>
                )}
              </div>

              {formData.cidade === "Outros" && (
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="cidadeOutra"
                    placeholder="Digite sua cidade"
                    value={formData.cidadeOutra}
                    onChange={handleChange}
                    className={`border rounded-lg p-3 ${
                      activeFieldErrors.cidadeOutra
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {activeFieldErrors.cidadeOutra && (
                    <p className="text-red-500 text-sm mt-1">
                      {activeFieldErrors.cidadeOutra}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col">
                <input
                  type="number"
                  name="idade"
                  min="1"
                  max="120"
                  placeholder="Idade"
                  value={formData.idade}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.idade
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {activeFieldErrors.idade && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.idade}
                  </p>
                )}
              </div>

              {/* Correção estrutural do select de sexo: Erro movido para fora da tag select */}
              <div className="flex flex-col">
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.sexo
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Sexo</option>
                  {sexos.map((sexo) => (
                    <option key={sexo} value={sexo}>
                      {sexo}
                    </option>
                  ))}
                </select>
                {activeFieldErrors.sexo && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.sexo}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  name="tamanhoCamisa"
                  value={formData.tamanhoCamisa}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.tamanhoCamisa
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Tamanho da camisa</option>
                  {tamanhosCamisa.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {activeFieldErrors.tamanhoCamisa && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.tamanhoCamisa}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  name="distancia"
                  value={formData.distancia}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.distancia
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Distância</option>
                  {distancias.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {activeFieldErrors.distancia && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.distancia}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  name="tipoKit"
                  value={formData.tipoKit}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.tipoKit
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {kitsDisponiveis.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {activeFieldErrors.tipoKit && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.tipoKit}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  name="formaPagamento"
                  value={formData.formaPagamento}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.formaPagamento
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {formasPagamento.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {activeFieldErrors.formaPagamento && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.formaPagamento}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  value={
                    pricing?.valor ? `R$ ${pricing.valor}` : "Calculando..."
                  }
                  //value={`R$ ${pricing?.valor || valorCalculado}`} // value={`R$ ${valorCalculado}`}
                  disabled
                  className="border rounded-lg p-3 bg-gray-100 font-bold"
                />
                {pricingError && (
                  <p
                    className="
                      text-red-500
                      text-sm
                      mt-1
                    "
                  >
                    {pricingError}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  name="cupom"
                  placeholder="Cupom promocional"
                  value={formData.cupom}
                  onChange={handleChange}
                  className="
                  border
                  border-gray-300
                  rounded-lg
                  p-3
                "
                />

                <span
                  className="
                  text-xs
                  text-gray-500
                  mt-1
                "
                >
                  Caso possua cupom promocional, informe aqui.
                </span>
              </div>

              <div
                className="
                  border
                  border-yellow-200
                  bg-yellow-50
                  rounded-xl
                  p-4
                  space-y-3
                "
              >
                {Number(formData.idade) >= 60 && (
                  <div
                    className="
                        bg-green-100
                        border
                        border-green-300
                        text-green-800
                        rounded-lg
                        p-3
                        text-sm
                      "
                  >
                    ✅ Benefício legal 60+ identificado automaticamente.
                    <br />
                    <br />
                    Envie documento comprobatório para:
                    <br />
                    <strong>corrida.entre.amigas@gmail.com</strong>
                  </div>
                )}

                <label
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <input
                    type="checkbox"
                    name="isPcd"
                    checked={formData.isPcd}
                    onChange={handleChange}
                  />

                  <span
                    className="
                      text-sm
                      text-gray-700
                    "
                  >
                    Sou PCD e desejo solicitar o benefício legal de 50% mediante
                    validação documental.
                  </span>
                </label>

                <label
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <input
                    type="checkbox"
                    name="isTea"
                    checked={formData.isTea}
                    onChange={handleChange}
                  />

                  <span
                    className="
                      text-sm
                      text-gray-700
                    "
                  >
                    Sou TEA (Transtorno do Espectro Autista) e desejo solicitar
                    o benefício legal mediante validação documental.
                  </span>
                </label>

                {/* =====================================================
                    INSTRUÇÃO DOCUMENTAL
                ===================================================== */}

                <div
                  className="
                    text-xs
                    text-red-600
                    leading-relaxed
                  "
                >
                  ⚠️ Para validação do benefício legal (60+ ou PCD), envie
                  documento comprobatório para:
                  <br />
                  <br />
                  <strong>corrida.entre.amigas@gmail.com</strong>
                  <br />
                  <br />A validação será realizada manualmente pela organização.
                </div>
              </div>

              <div className="flex flex-col">
                <select
                  name="comoConheceu"
                  value={formData.comoConheceu}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 ${
                    activeFieldErrors.comoConheceu
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Como conheceu?</option>
                  {comoConheceuOpcoes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {activeFieldErrors.comoConheceu && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.comoConheceu}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block mb-2 font-semibold">
                Restrições médicas?
              </label>
              <select
                name="restricoesMedicas"
                value={formData.restricoesMedicas}
                onChange={handleChange}
                className={`border rounded-lg p-3 w-full ${
                  activeFieldErrors.restricoesMedicas
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="NÃO">NÃO</option>
                <option value="SIM">SIM</option>
              </select>
              {activeFieldErrors.restricoesMedicas && (
                <p className="text-red-500 text-sm mt-1">
                  {activeFieldErrors.restricoesMedicas}
                </p>
              )}
            </div>

            {formData.restricoesMedicas === "SIM" && (
              <div className="flex flex-col">
                <textarea
                  name="descricaoRestricao"
                  placeholder="Informe as restrições médicas"
                  value={formData.descricaoRestricao}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 w-full ${
                    activeFieldErrors.descricaoRestricao
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {activeFieldErrors.descricaoRestricao && (
                  <p className="text-red-500 text-sm mt-1">
                    {activeFieldErrors.descricaoRestricao}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declaracao"
                  checked={formData.declaracao}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  Declaro que estou ciente de que devo realizar o pagamento da
                  inscrição e enviar o comprovante com antecedência.
                </span>
              </label>
              {activeFieldErrors.declaracao && (
                <p className="text-red-500 text-sm mt-1">
                  {activeFieldErrors.declaracao}
                </p>
              )}
            </div>

            <div
              className="
                border
                border-gray-200
                rounded-xl
                p-4
                bg-gray-50
                max-h-64
                overflow-y-auto
                text-sm
                leading-relaxed
              "
            >
              <h3 className="font-bold text-lg mb-3">
                📌 Regulamento – Corrida Entre Amigas Run
              </h3>

              <p>
                A inscrição é pessoal e intransferível, salvo autorização da
                organização.
              </p>

              <br />

              <p>
                Cancelamentos possuem regras específicas e prazo limite de até
                15 dias antes do evento.
              </p>

              <br />

              <p>
                A medalha será entregue apenas para atletas que concluírem
                oficialmente o percurso.
              </p>

              <br />

              <p>
                Ao participar do evento, o atleta autoriza gratuitamente o uso
                de imagem em materiais promocionais.
              </p>

              <br />

              <p>
                O regulamento completo poderá ser atualizado pela organização
                por motivos técnicos, operacionais ou de segurança.
              </p>
            </div>

            <label
              className="
                flex
                items-start
                gap-3
                mt-4
                cursor-pointer
              "
            >
              <input
                type="checkbox"
                name="aceiteRegulamento"
                checked={formData.aceiteRegulamento}
                onChange={handleChange}
                className="mt-1"
              />

              <span className="text-sm text-gray-700">
                Declaro que li e aceito integralmente o regulamento da corrida.
              </span>
            </label>

            {activeFieldErrors.aceiteRegulamento && (
              <p className="text-red-500 text-sm mt-1">
                {activeFieldErrors.aceiteRegulamento}
              </p>
            )}

            <div
              className="
                bg-yellow-50
                border
                border-yellow-200
                rounded-xl
                p-4
                text-sm
                text-yellow-800
              "
            >
              <strong>Atenção:</strong>
              <br />
              Participantes 60+ e PCD devem enviar o comprovante elegível para:
              <br />
              <br />
              <strong>corrida.entre.amigas@gmail.com</strong>
              <br />
              <br />
              A organização fará a validação manual do benefício.
              <br />
              <br />
              <em>
                Nota: Caso a documentação não seja enviada ou seja considerada
                inválida, o desconto será desconsiderado e o valor integral da
                inscrição será cobrado para a efetivação da vaga.
              </em>
            </div>

            {activeGeneralError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 animate-shake">
                {activeGeneralError}
              </div>
            )}

            {loading && (
              <div
                className="
                  bg-blue-50
                  border
                  border-blue-200
                  text-blue-700
                  rounded-xl
                  p-4
                  text-center
                  mb-4
                "
              >
                ⏳ Aguarde...
                <br />
                Estamos gerando seu link de pagamento. Não feche esta página.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full
                rounded-xl
                py-4
                font-bold
                shadow-lg
                transition-all
                duration-200

                ${
                  loading
                    ? `
                      bg-gray-400
                      cursor-not-allowed
                      text-white
                    `
                    : `
                      bg-gradient-to-r
                      from-pink-500
                      to-purple-500
                      hover:scale-[1.01]
                      hover:opacity-95
                      text-white
                    `
                }
              `}
            >
              {loading
                ? "⏳ Gerando link de pagamento..."
                : "🎯 Finalizar Inscrição"}
            </button>

            {/*             <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-lg shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {loading ? "⏳ Enviando..." : "🎯 Finalizar Inscrição"}
            </button> */}
          </form>
        )}
      </div>
    </div>
  );
}
