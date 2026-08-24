/*
==========================================================
TERMO DE RETIRADA DE KIT
==========================================================

Responsabilidade:

✔ montar o termo de retirada;
✔ apresentar os dados do participante;
✔ apresentar o kit retirado;
✔ apresentar os itens entregues;
✔ disponibilizar impressão;
✔ permitir "Salvar como PDF" pelo navegador.

Este componente NÃO:

✘ consulta API;
✘ altera inscrição;
✘ altera pagamento;
✘ altera Analytics;
✘ grava dados;
✘ confirma retirada automaticamente.

==========================================================
*/

export default function TermoRetiradaKit({
  participante = {},
  kit = {},
  evento = {},
}) {
  /*
  ==========================================================
  DADOS DO PARTICIPANTE
  ==========================================================
  */

  const nomeParticipante =
    participante.nome ||
    participante.nomeCompleto ||
    "Participante não informado";

  const cpf = participante.cpf || participante.CPF || "Não informado";

  const numeroInscricao =
    participante.numeroInscricao ||
    participante.inscricao ||
    participante.id ||
    "Não informado";

  /*
  ==========================================================
  DADOS DO KIT
  ==========================================================
  */

  const nomeKit =
    typeof kit === "string"
      ? kit
      : kit?.nome || kit?.titulo || "Kit não informado";

  const itensKit = Array.isArray(kit?.itens) ? kit.itens : [];

  /*
  ==========================================================
  DADOS DO EVENTO
  ==========================================================
  */

  const nomeEvento = evento.nome || "Corrida Entre Amigas RUN";

  const dataEvento = evento.data || "Não informado";

  const localEvento = evento.local || "Não informado";

  /*
==========================================================
ANO DO EVENTO
==========================================================

Prioridade:

1. Ano informado explicitamente pelo evento;
2. Ano encontrado na data do evento;
3. Ano corrente como fallback.

Evita deixar o ano fixo no código.
==========================================================
*/

  const anoEvento =
    evento.ano ||
    String(dataEvento).match(/\b20\d{2}\b/)?.[0] ||
    new Date().getFullYear();

  const nomeEventoComAno = /\b20\d{2}\b/.test(String(nomeEvento))
    ? nomeEvento
    : `${nomeEvento} ${anoEvento}`;

  /*
==========================================================
PROTEÇÃO DOS DADOS INSERIDOS NO HTML
==========================================================
*/

  const escapeHtml = (valor) =>
    String(valor ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  /*
  ==========================================================
  IMPRESSÃO / PDF
  ==========================================================
  */

  const nomeSeguro = escapeHtml(nomeParticipante);

  const cpfSeguro = escapeHtml(cpf);

  const numeroInscricaoSeguro = escapeHtml(numeroInscricao);

  const nomeKitSeguro = escapeHtml(nomeKit);

  const nomeEventoComAnoSeguro = escapeHtml(nomeEventoComAno);

  const dataEventoSegura = escapeHtml(dataEvento);

  const localEventoSeguro = escapeHtml(localEvento);

  const imprimirTermo = () => {
    const dataEmissao = new Date();

    const dataEmissaoFormatada = dataEmissao.toLocaleDateString("pt-BR");

    const horaEmissaoFormatada = dataEmissao.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const janela = window.open("", "_blank", "width=900,height=1000");

    if (!janela) {
      alert(
        "Não foi possível abrir a janela de impressão. Verifique se o navegador bloqueou o pop-up.",
      );

      return;
    }

    const itensHtml =
      itensKit.length > 0
        ? itensKit
            .map(
              (item) => `
                <li>
                  ${escapeHtml(item)}
                </li>
              `,
            )
            .join("")
        : `
            <li>
              Itens conforme kit registrado no sistema.
            </li>
          `;

    janela.document.write(`
      <!DOCTYPE html>

      <html lang="pt-BR">

      <head>

        <meta charset="UTF-8" />

        <title>
          Termo de Retirada - ${nomeSeguro}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          @page {
            size: A4 portrait;
            margin: 10mm;
          }
            
          html,
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #222;
            background: #fff;
          }

          body {
            font-size: 11px;
          }

          .documento {
            width: 100%;
            max-width: none;
            margin: 0 auto;
          }

          .cabecalho {
            text-align: center;
            border-bottom: 2px solid #d946ef;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }

          .titulo {
            font-size: 19px;
            font-weight: 800;
            margin-bottom: 4px;
          }

          .evento {
            font-size: 13px;
            color: #555;
          }

          .secao {
            margin-top: 14px;
          }

          .registro-retirada {
            margin-top: 16px;
            margin-bottom: 70px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .secao-titulo {
            font-size: 12px;
            font-weight: 800;
            margin-bottom: 6px;
            color: #7e22ce;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
          }

          .campo {
            margin-bottom: 4px;
            font-size: 11px;
          }

          .campo strong {
            display: inline-block;
            min-width: 140px;
          }

          .kit {
            background: #faf5ff;
            border: 1px solid #e9d5ff;
            border-radius: 8px;
            padding: 8px 12px;
          }

          .kit-nome {
            font-size: 15px;
            font-weight: 800;
            margin-bottom: 5px;
            color: #7e22ce;
          }

          ul {
            margin: 4px 0 0;
            padding-left: 20px;
          }

          li {
            margin-bottom: 2px;
          }

          .declaracao {
            margin-top: 10px;
            line-height: 1.4;
            text-align: justify;
            font-size: 11px;
          }
          
          .declaracao p {
            margin: 0 0 6px;
          }

          .assinaturas {
            display: flex;
            justify-content: space-between;
            gap: 30px;
            margin-top: 0px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .assinatura {
            flex: 1;
            text-align: center;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .linha {
            border-top: 1px solid #222;
            margin-bottom: 8px;
          }

          .linha-data {
            display: inline-block;
            margin-left: 4px;
            color: #222;
            white-space: nowrap;
          }

          .linha-hora {
            display: inline-block;
            margin-left: 4px;
            color: #222;
            white-space: nowrap;
          }
            
          .assinatura small {
            font-size: 12px;
          }

          .rodape {
            margin-top: 12px;
            padding-top: 6px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 9px;
            color: #777;
          }

          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm;
            }

            html,
            body {
              width: 100%;
              margin: 0;
              padding: 0;
            }

            body {
              font-size: 11px;
            }

            .documento {
              width: 100%;
              max-width: none;
              margin: 0;
            }
          }

        </style>

      </head>

      <body>

        <div class="documento">

          <div class="cabecalho">

            <div class="titulo">
              TERMO DE RETIRADA DE KIT
            </div>

            <div class="evento">
              ${nomeEventoComAnoSeguro}
            </div>

          </div>


          <div class="secao">

            <div class="secao-titulo">
              DADOS DO PARTICIPANTE
            </div>

            <div class="campo">
              <strong>Nome:</strong>
              ${nomeSeguro}
            </div>

            <div class="campo">
              <strong>CPF:</strong>
              ${cpfSeguro}
            </div>

            <div class="campo">
              <strong>Nº da inscrição:</strong>
              ${numeroInscricaoSeguro}
            </div>

          </div>


          <div class="secao">

            <div class="secao-titulo">
              DADOS DO EVENTO
            </div>

            <div class="campo">
              <strong>Evento:</strong>
              ${nomeEventoComAnoSeguro}
            </div>

            <div class="campo">
              <strong>Data:</strong>
              ${dataEventoSegura}
            </div>

            <div class="campo">
              <strong>Local:</strong>
              ${localEventoSeguro}
            </div>

          </div>


          <div class="secao">

            <div class="secao-titulo">
              KIT PARA RETIRADA
            </div>

            <div class="kit">

              <div class="kit-nome">
                ${nomeKitSeguro}
              </div>

              <strong>
                Itens entregues:
              </strong>

              <ul>
                ${itensHtml}
              </ul>

            </div>

          </div>

          <div class="declaracao">

            <p>
              Declaro, para os devidos fins, que este documento
              corresponde ao kit destinado à minha inscrição no evento
              <strong>${nomeEventoComAnoSeguro}</strong> e será apresentado
              à organização no ato da retirada, para conferência dos dados
              da inscrição e entrega dos itens correspondentes.
            </p>

            <p>
              Declaro estar ciente de que a entrega do kit estará sujeita
              à conferência dos dados da inscrição e aos procedimentos
              estabelecidos pela organização do evento.
            </p>

            <p>
              Autorizo, ainda, que a retirada do kit possa ser realizada
              por terceiro devidamente identificado, mediante apresentação
              deste documento com minha autorização e de documento oficial
              de identificação do terceiro, ficando a entrega sujeita à
              conferência e aprovação pela organização do evento.
            </p>

          </div>

          <div class="secao">
          <div class="secao-titulo">
            EMISSÃO DO DOCUMENTO
          </div>

          <div class="campo">
            <strong>Data de emissão:</strong>
            ${dataEmissaoFormatada}
          </div>

          <div class="campo">
            <strong>Hora de emissão:</strong>
            ${horaEmissaoFormatada}
          </div>
        </div>

        <div class="secao registro-retirada">
          <div class="secao-titulo">
            REGISTRO DA RETIRADA
          </div>

          <div class="campo">
            <strong>Data da retirada:</strong>
            <span class="linha-data">____/____/________</span>
          </div>

          <div class="campo">
            <strong>Hora da retirada:</strong>
            <span class="linha-hora">____:____</span>
          </div>
        </div>

        <div class="assinaturas">

          <div class="assinatura">

            <div class="linha"></div>

            <strong>
              Participante
            </strong>

            <br />

            <small>
              Assinatura
            </small>

          </div>

          <div class="assinatura">

            <div class="linha"></div>

            <strong>
              Organização
            </strong>

            <br />

            <small>
              Responsável pela entrega
            </small>

          </div>

        </div>

        <div class="rodape">

            Documento gerado pelo sistema
            ${nomeEventoComAnoSeguro}.

          </div>

        </div>

      </body>

      </html>
    `);

    janela.document.close();

    janela.focus();

    setTimeout(() => {
      janela.print();
    }, 500);
  };

  /*
  ==========================================================
  INTERFACE
  ==========================================================
  */

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          📄 Termo de Retirada
        </h3>

        <p className="text-sm text-gray-500">
          Gere o documento para impressão ou salvamento em PDF.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-5">
        <div className="text-sm text-gray-600">Participante</div>

        <div className="font-bold text-gray-800">{nomeParticipante}</div>

        <div className="text-sm text-gray-600 mt-3">Kit</div>

        <div className="font-bold text-purple-700">{nomeKit}</div>
      </div>

      <button
        type="button"
        onClick={imprimirTermo}
        className="
          w-full
          bg-gradient-to-r
          from-pink-600
          to-purple-600
          text-white
          font-bold
          py-3
          px-5
          rounded-xl
          shadow-md
          transition-all
          duration-300
          hover:scale-[1.01]
          hover:shadow-lg
        "
      >
        📄 Gerar / Imprimir Termo
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Na janela de impressão, você poderá imprimir ou escolher
        <strong> Salvar como PDF</strong>.
      </p>
    </div>
  );
}
