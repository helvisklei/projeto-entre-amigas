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
      : kit.nome || kit.titulo || "Kit não informado";

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
  DATA DA RETIRADA
  ==========================================================
  */

  const dataAtual = new Date();

  const dataRetirada = dataAtual.toLocaleDateString("pt-BR");

  const horaRetirada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /*
  ==========================================================
  IMPRESSÃO / PDF
  ==========================================================
  */

  const imprimirTermo = () => {
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
                  ${item}
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
          Termo de Retirada - ${nomeParticipante}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 40px;
            font-family: Arial, Helvetica, sans-serif;
            color: #222;
            background: #fff;
          }

          .documento {
            max-width: 800px;
            margin: 0 auto;
          }

          .cabecalho {
            text-align: center;
            border-bottom: 2px solid #d946ef;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .titulo {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 8px;
          }

          .evento {
            font-size: 16px;
            color: #555;
          }

          .secao {
            margin-top: 25px;
          }

          .secao-titulo {
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 12px;
            color: #7e22ce;
            border-bottom: 1px solid #ddd;
            padding-bottom: 6px;
          }

          .campo {
            margin-bottom: 8px;
            font-size: 14px;
          }

          .campo strong {
            display: inline-block;
            min-width: 160px;
          }

          .kit {
            background: #faf5ff;
            border: 1px solid #e9d5ff;
            border-radius: 10px;
            padding: 18px;
          }

          .kit-nome {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 12px;
            color: #7e22ce;
          }

          ul {
            margin-top: 8px;
            padding-left: 25px;
          }

          li {
            margin-bottom: 7px;
          }

          .declaracao {
            margin-top: 30px;
            line-height: 1.7;
            text-align: justify;
            font-size: 14px;
          }

          .assinaturas {
            display: flex;
            justify-content: space-between;
            gap: 50px;
            margin-top: 90px;
          }

          .assinatura {
            flex: 1;
            text-align: center;
          }

          .linha {
            border-top: 1px solid #222;
            margin-bottom: 8px;
          }

          .assinatura small {
            font-size: 12px;
          }

          .rodape {
            margin-top: 50px;
            padding-top: 12px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #777;
          }

          @media print {

            body {
              padding: 20px;
            }

            .documento {
              max-width: none;
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
              ${nomeEvento}
            </div>

          </div>


          <div class="secao">

            <div class="secao-titulo">
              DADOS DO PARTICIPANTE
            </div>

            <div class="campo">
              <strong>Nome:</strong>
              ${nomeParticipante}
            </div>

            <div class="campo">
              <strong>CPF:</strong>
              ${cpf}
            </div>

            <div class="campo">
              <strong>Nº da inscrição:</strong>
              ${numeroInscricao}
            </div>

          </div>


          <div class="secao">

            <div class="secao-titulo">
              DADOS DO EVENTO
            </div>

            <div class="campo">
              <strong>Evento:</strong>
              ${nomeEvento}
            </div>

            <div class="campo">
              <strong>Data:</strong>
              ${dataEvento}
            </div>

            <div class="campo">
              <strong>Local:</strong>
              ${localEvento}
            </div>

          </div>


          <div class="secao">

            <div class="secao-titulo">
              KIT RETIRADO
            </div>

            <div class="kit">

              <div class="kit-nome">
                ${nomeKit}
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
              Declaro, para os devidos fins, que recebi o kit
              correspondente à minha inscrição no evento
              <strong>${nomeEvento}</strong>,
              conferindo os itens relacionados neste documento.
            </p>

            <p>
              Após a conferência, declaro estar ciente de que a
              retirada registrada neste termo corresponde ao kit
              entregue pela organização do evento.
            </p>

          </div>


          <div class="secao">

            <div class="secao-titulo">
              REGISTRO DA RETIRADA
            </div>

            <div class="campo">
              <strong>Data:</strong>
              ${dataRetirada}
            </div>

            <div class="campo">
              <strong>Horário:</strong>
              ${horaRetirada}
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
            ${nomeEvento}.

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
