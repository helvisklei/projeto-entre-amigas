function somenteNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function validarCpfBasico(cpf) {
  if (!cpf) return false;
  const cpfLimpo = somenteNumeros(cpf);
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpfLimpo)) return false;
  return true;
}

export function validarInscricao(data) {
  const errors = {};

  /*
  ==========================================
  1. VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
  ==========================================
  */
  const obrigatorios = [
    { campo: "nomeCompleto", nome: "Nome completo" },
    { campo: "cpf", nome: "CPF" },
    { campo: "email", nome: "E-mail" },
    { campo: "telefone", nome: "Telefone" },
    { campo: "cidade", nome: "Cidade" },
    { campo: "distancia", nome: "Distância" },
    { campo: "tipoKit", nome: "Tipo de kit" },
    { campo: "formaPagamento", nome: "Forma de pagamento" },
    { campo: "sexo", nome: "Sexo" },
    { campo: "tamanhoCamisa", nome: "Tamanho da camisa" },
  ];

  obrigatorios.forEach((item) => {
    const valor = data[item.campo];
    if (!valor || String(valor).trim() === "") {
      errors[item.campo] = `${item.nome} é obrigatório.`;
    }
  });

  // Validação manual da idade (pois pode vir como número ou string)
  const idadeStr = data.idade?.toString().trim();
  if (!idadeStr) {
    errors.idade = "Idade é obrigatória.";
  }

  // Validação manual do checkbox de declaração
  if (!data.declaracao) {
    errors.declaracao = "Aceite obrigatório.";
  }

  if (!data.aceiteRegulamento) {
    errors.aceiteRegulamento = "É obrigatório aceitar o regulamento.";
  }

  /*
  ==========================================
  2. VALIDAÇÕES CONDICIONAIS (Novas Regras)
  ==========================================
  Se as condições de negócio forem ativadas, tornam seus respectivos campos obrigatórios
  */
  if (
    data.cidade === "Outros" &&
    (!data.cidadeOutra || String(data.cidadeOutra).trim() === "")
  ) {
    errors.cidadeOutra = "Informe sua cidade.";
  }

  if (
    data.restricoesMedicas === "SIM" &&
    (!data.descricaoRestricao || String(data.descricaoRestricao).trim() === "")
  ) {
    errors.descricaoRestricao = "Informe a restrição médica.";
  }

  /*
  ==========================================
  3. VALIDAÇÕES FORMATO/REGRAS (Se não houver erro de obrigatoriedade)
  ==========================================
  */
  if (!errors.cpf && !validarCpfBasico(data.cpf)) {
    errors.cpf = "CPF inválido.";
  }

  if (!errors.idade) {
    const idade = parseInt(data.idade, 10);
    if (isNaN(idade) || idade < 1 || idade > 120) {
      errors.idade = "Idade inválida.";
    }
  }

  /*
  ==========================================
  4. LANÇAMENTO DO ERRO ESTRUTURADO
  ==========================================
  */
  if (Object.keys(errors).length > 0) {
    const error = new Error("Preencha os campos obrigatórios corretamente.");
    error.fieldErrors = errors;
    throw error;
  }

  return true;
}
