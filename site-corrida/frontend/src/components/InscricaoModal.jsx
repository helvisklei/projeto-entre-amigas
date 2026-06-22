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
  "Infantil 02",
  "Infantil 04",
  "Infantil 06",
  "Infantil 08",
  "Infantil 10",
  "Infantil 12",
  "Infantil 14",
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "XG",
];

const distancias = ["5 KM"]; //"3 KM"
const formasPagamento = ["PIX", "CARTÃO"]; //"DINHEIRO"
const sexos = ["Feminino", "Masculino"];

const comoConheceuOpcoes = [
  "Site",
  "Instagram",
  "Amigos",
  "Afogados Ordinário",
  "Danny Oliveira",
  "Jacy",
  "Pahkarina",
  "Pina Ordinário",
  "Race Running",
  "Ray Lins",
  "Robsotero",
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

  // Estado para controlar a abertura da imagem da tabela de medidas de forma isolada
  const [isMedidasOpen, setIsMedidasOpen] = useState(false);
  const [systemConfig, setSystemConfig] = useState(null);

  /* Erros locais para validação do frontend antes de bater na API */
  const [localGeneralError, setLocalGeneralError] = useState("");
  const [localFieldErrors, setLocalFieldErrors] = useState({});
  const [pricingError, setPricingError] = useState("");
  const [mensagemAcolhimento, setMensagemAcolhimento] = useState("");

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
    isPcd: false,
    isTea: false,
    sexo: "",
    website: "",
    createdAt: Date.now(),
  });

  const pricingRequestRef = useRef(0);

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

  /* REALTIME PRICING */
  React.useEffect(() => {
    if (!formData.tipoKit || !formData.formaPagamento) {
      return;
    }

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

        if (pricingResponse?.tipoDesconto === "ACOLHIMENTO") {
          setMensagemAcolhimento(
            "💜 Estamos com você nesta jornada. Sua força inspira todos ao seu redor. Conte conosco e aproveite este benefício especial preparado com carinho.",
          );
        } else {
          setMensagemAcolhimento("");
        }
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

    setLocalFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLocalGeneralError("");
    setLocalFieldErrors({});

    try {
      // testar o erro depois retirar TESTAR conole log
      // console.log("=== FORMDATA ANTES DA VALIDACAO ===");
      //console.log(formData);
      validarInscricao(formData);

      const payload = {
        ...formData,
        cidade:
          formData.cidade === "Outros" ? formData.cidadeOutra : formData.cidade,
      };
      // testar o erro depois retirar TESTAR conole log
      //console.log("=== PAYLOAD FINAL ===");
      //console.log(payload);

      const response = await submitInscricao(payload);

      if (response?.tipoDesconto === "ACOLHIMENTO") {
        setMensagemAcolhimento(
          "💜 Estamos com você nesta jornada. Sua força inspira todos ao seu redor. Conte conosco e aproveite este benefício especial preparado com carinho.",
        );
      } else {
        setMensagemAcolhimento("");
      }

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error("ERRO COMPLETO:", err);
      if (err.fieldErrors) {
        //console.error("FIELD ERRORS:", err.fieldErrors); // retirar esse console log depois TESTAR
        setLocalFieldErrors(err.fieldErrors);

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
    // console.error(err); // retirar depois TESTAR
  }

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

            {mensagemAcolhimento && (
              <div
                className="
                  mt-4
                  mb-6
                  rounded-xl
                  border
                  border-purple-200
                  bg-purple-50
                  p-4
                  text-left
                "
              >
                <p className="text-sm text-purple-800 leading-relaxed">
                  {mensagemAcolhimento}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => {
                  window.location.href = success.paymentLink;
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

              {/* SEÇÃO DA CAMISA E TABELA OTIMIZADA */}
              <div className="flex flex-col justify-between">
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
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setIsMedidasOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                  >
                    📏 Ver tabela de medidas infantil
                  </button>
                </div>
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
                  disabled
                  className="border rounded-lg p-3 bg-gray-100 font-bold"
                />
                {pricingError && (
                  <p className="text-red-500 text-sm mt-1">{pricingError}</p>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="cupom"
                  placeholder="Cupom promocional"
                  value={formData.cupom}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <span className="text-xs text-gray-500 mt-1">
                  Caso possua cupom promocional, informe aqui.
                </span>

                {mensagemAcolhimento && (
                  <div
                    className="
                      mt-3
                      rounded-xl
                      border
                      border-purple-200
                      bg-purple-50
                      p-4
                    "
                  >
                    <p className="text-purple-800 text-sm">
                      💜 Estamos com você nesta jornada. Sua força inspira todos
                      ao seu redor. Conte conosco e aproveite este benefício
                      especial preparado com carinho.
                    </p>

                    <p className="mt-3 text-xs text-purple-700">
                      📄 Para validação do benefício, envie documentação para:
                      <br />
                      <strong>(81) 98467-1327</strong>
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 space-y-3">
                {Number(formData.idade) >= 60 && (
                  <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg p-3 text-sm">
                    ✅ Benefício legal 60+ identificado automaticamente.
                    <br />
                    <br />
                    Envie documento comprobatório para:
                    <br />
                    <strong>(81) 98467-1327</strong>
                  </div>
                )}

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="isPcd"
                    checked={formData.isPcd}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-700">
                    Sou PCD e desejo solicitar o benefício legal de 50% mediante
                    validação documental.
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="isTea"
                    checked={formData.isTea}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-700">
                    Sou TEA (Transtorno do Espectro Autista) e desejo solicitar
                    o benefício legal mediante validação documental.
                  </span>
                </label>

                <div className="text-xs text-red-600 leading-relaxed">
                  ⚠️ Para validação do benefício legal (60+, TEA e PCD), envie
                  document comprobatório para:
                  <br />
                  <br />
                  <strong>(81) 98467-1327</strong>
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
                border border-gray-200
                rounded-xl
                p-5
                bg-slate-50
                max-h-72
                overflow-y-auto
                text-sm
                leading-relaxed
                text-gray-700
                shadow-inner
              "
            >
              <div className="text-center border-b border-gray-200 pb-3 mb-4">
                <h3 className="font-extrabold text-base text-gray-950 tracking-tight">
                  📋 REGULAMENTO OFICIAL
                </h3>
                <p className="text-xs text-pink-600 font-bold mt-0.5">
                  6ª CORRIDA ENTRE AMIGAS RUN – RECIFE/PE
                </p>
              </div>

              <div className="space-y-5 text-[13px]">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">1. DO EVENTO</h4>
                  <p>
                    A 6ª Corrida Entre Amigas RUN acontecerá no dia{" "}
                    <strong>29 de novembro de 2026</strong>, em Brasília Teimosa
                    – Recife/PE.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-600">
                    <li>
                      O percurso será de 5 km, nas modalidades corrida e
                      caminhada.
                    </li>
                    <li>
                      Caso o participante não deseje concluir os 5 km, poderá
                      finalizar sua participação no percurso de 3 km.
                    </li>
                    <li>
                      Ao realizar sua inscrição, o atleta declara estar apto
                      fisicamente para participar do evento.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    2. DAS INSCRIÇÕES
                  </h4>
                  <p>
                    A inscrição garante o direito ao kit oficial do evento. As
                    inscrições serão encerradas na data divulgada pela
                    organização ou quando o limite de vagas for atingido.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    3. DO REPASSE DE INSCRIÇÃO
                  </h4>
                  <p>
                    O repasse da inscrição é de responsabilidade exclusiva do
                    atleta inscrito. A organização não realizará intermediação
                    de vendas, cobranças ou negociações entre participantes.
                  </p>
                  <p className="mt-1 text-red-600 font-medium">
                    ⚠️ O prazo para solicitar a alteração cadastral é de até 30
                    dias antes do evento, ou seja, até 29 de outubro de 2026.
                    Após essa data não serão realizadas alterações de
                    titularidade, tamanho de camisa ou dados cadastrais.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    4. CANCELAMENTO E REEMBOLSO
                  </h4>
                  <p>
                    O cancelamento poderá ser solicitado até 30 dias antes da
                    prova. Nesses cafes, será realizado reembolso correspondente
                    a 50% do valor pago pela inscrição.
                  </p>
                  <p className="mt-1">
                    Após esse prazo não haverá devolução de valores, devido aos
                    compromissos assumidos com fornecedores, produção de kits,
                    medalhas, seguro atleta e demais serviços do evento. O
                    cancelamento deverá ser solicitado pelo titular através dos
                    canais oficiais da organização.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    5. ENTREGA DOS KITS
                  </h4>
                  <p>
                    Local, datas e horários serão divulgados pela organização.
                    Para retirada será obrigatória a apresentação de documento
                    oficial com foto.
                  </p>
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5 mt-2">
                    <span className="font-semibold text-xs text-gray-900 block mb-1">
                      O seu kit poderá conter:
                    </span>
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-gray-600 pl-2 list-inside">
                      <li>✓ Camisa oficial do evento</li>
                      <li>✓ Número de peito</li>
                      <li>✓ Medalha de participação</li>
                      <li>✓ Viseira personalizada</li>
                      <li>✓ Seguro atleta</li>
                      <li>✓ Café da manhã</li>
                      <li>✓ Estrutura de apoio e hidratação</li>
                    </ul>
                  </div>
                  <p className="mt-2 text-xs text-amber-700 font-medium">
                    ⚠️ Participantes que não retirarem seus kits nas datas
                    divulgadas perderão o direito aos itens, sem reembolso da
                    inscrição.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    6. GUARDA-VOLUME
                  </h4>
                  <p className="text-gray-600">
                    ⚠️ A organização da 6ª Corrida Entre Amigas RUN não
                    disponibilizará serviço de guarda-volume. Cada participante
                    será responsável pelos seus pertences antes, durante e após
                    o evento. A organização não se responsabiliza por objetos
                    perdidos, esquecidos, danificados ou furtados nas
                    dependências do evento. Recomenda-se evitar levar objetos de
                    valor.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    7. IDENTIFICAÇÃO DO PARTICIPANTE
                  </h4>
                  <p>
                    📌 O uso do número de peito é obrigatório durante toda a
                    prova, devendo permanecer visível na parte frontal do corpo.
                    A medalha de participação será entregue apenas aos atletas
                    regularmente inscritos que concluírem o percurso e estiverem
                    devidamente identificados com o número de peito. Atletas sem
                    número de peito não poderão receber medalha, participar da
                    classificação, premiações ou usufruir dos benefícios
                    oferecidos aos participantes identificados. A organização
                    não se responsabiliza por números de peito perdidos,
                    esquecidos ou danificados após a entrega do kit.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">8. PREMIAÇÃO</h4>
                  <p>
                    As categorias de premiação serão: Geral Masculino (5 km),
                    Geral Feminino (5 km), Categoria PCD (5 km) e Categoria 60+
                    (5 km).
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Havendo quantidade suficiente de inscritos, as categorias
                    PCD e 60+ poderão ter premiação separada para Masculino e
                    Feminino. Não havendo quantitativo suficiente de inscritos,
                    a premiação será realizada em categoria única,
                    independentemente do gênero. A organização reserva-se o
                    direito de criar, unificar, dividir ou ajustar categorias de
                    premiação conforme a quantidade de participantes inscritos.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    9. RESPONSABILIDADES DO PARTICIPANTE
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-600">
                    <li>
                      Respeitar o percurso e as orientações da organização.
                    </li>
                    <li>
                      Seguir as recomendações da equipe de apoio e dos agentes
                      de trânsito.
                    </li>
                    <li>
                      Atalhos, fraudes ou condutas inadequadas poderão resultar
                      em desclassificação.
                    </li>
                    <li>
                      Todos os participantes inscritos estarão cobertos pelo
                      seguro atleta contratado pela organização.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    10. DISPOSIÇÕES GERAIS
                  </h4>
                  <p>
                    Ao efetuar sua inscrição, o participante declara estar de
                    acordo com este regulamento. A organização poderá realizar
                    ajustes necessários por motivos de segurança, logística,
                    determinação dos órgãos públicos ou casos de força maior. Os
                    casos omissos serão analisados e decididos exclusivamente
                    pela organização da 6ª Corrida Entre Amigas RUN.
                  </p>
                  <p className="mt-2 text-pink-600 font-semibold text-center text-xs">
                    💖 Nosso objetivo é proporcionar uma experiência segura,
                    acolhedora, inclusiva e inesquecível para todos os
                    participantes.
                  </p>
                </div>
              </div>
            </div>

            {activeGeneralError && (
              <p className="text-red-500 text-center font-semibold">
                {activeGeneralError}
              </p>
            )}

            <div className="flex flex-col">
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="aceiteRegulamento"
                  checked={formData.aceiteRegulamento}
                  onChange={handleChange}
                  className="mt-1"
                />

                <span className="text-sm text-gray-700">
                  Declaro que li e aceito integralmente o regulamento da
                  corrida.
                </span>
              </label>

              {activeFieldErrors.aceiteRegulamento && (
                <p className="text-red-500 text-sm mt-1">
                  {activeFieldErrors.aceiteRegulamento}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? "Processando..." : "Confirmar Inscrição"}
            </button>
          </form>
        )}
      </div>

      {/* MODAL INTERNO DA TABELA DE MEDIDAS (Renderiza sobre o modal atual sem quebrar layouts) */}
      {/* MODAL INTERNO DA TABELA DE MEDIDAS (Renderiza sobre o modal atual sem quebrar layouts) */}
      {isMedidasOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMedidasOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                📏 Tabela de Medidas Infantil
              </h3>
              <button
                type="button"
                onClick={() => setIsMedidasOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="p-4 bg-gray-50 flex justify-center items-center max-h-[60vh] overflow-y-auto">
              {/* Ajustado de /Medidas.jpg para /Medidas.jpeg para bater com sua pasta public */}
              <img
                src="/Medidas.jpeg"
                alt="Tabela de Medidas"
                className="rounded-lg max-w-full h-auto shadow-sm object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x400?text=Tabela+de+Medidas";
                }}
              />
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMedidasOpen(false)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors w-full"
              >
                Voltar para o Formulário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
