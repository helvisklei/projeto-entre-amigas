import DashboardCard from "./DashboardCard";

/*
==========================================================
DASHBOARD GRID
==========================================================

Responsável exclusivamente pela apresentação da visão
geral operacional das inscrições.

Esta seção apresenta:

- total de participantes inscritos;
- inscrições confirmadas;
- inscrições aguardando pagamento;
- participantes por percurso;
- cadastros sem percurso identificado.

Informações removidas desta seção:

- vendas totais:
  permanecem no Resumo Executivo;

- cupons utilizados:
  permanecem no Controle de Cupons;

- masculino e feminino:
  permanecem no Seguro Atleta.

Este componente:

- não realiza nova chamada à API;
- não altera o objeto dashboard;
- não altera a planilha;
- não realiza cálculos financeiros;
- não interfere no Resumo Executivo;
- não interfere no Seguro Atleta;
- não interfere na logística.
==========================================================
*/

export default function DashboardGrid({ dashboard }) {
  if (!dashboard) {
    return null;
  }

  /*
  ========================================================
  VALORES OPERACIONAIS
  ========================================================

  Number() protege a apresentação caso algum valor chegue
  como texto, vazio, nulo ou indefinido.
  ========================================================
  */

  const totalInscritos = Number(dashboard.totalInscritos || 0);

  const totalConfirmados = Number(dashboard.totalPago || 0);

  const totalPendentes = Number(dashboard.totalPendente || 0);

  const total3Km = Number(dashboard.corrida3km || 0);

  const total5Km = Number(dashboard.corrida5km || 0);

  /*
  ========================================================
  PERCURSO NÃO INFORMADO
  ========================================================

  Identifica participantes que estão no total geral,
  mas não aparecem classificados em 3 KM ou 5 KM.

  Não altera o backend.

  Não altera analytics.

  É apenas um indicador visual para conferência cadastral.
  ========================================================
  */

  const percursoNaoInformado = Math.max(
    totalInscritos - total3Km - total5Km,

    0,
  );

  /*
  ========================================================
  PERCENTUAIS OPERACIONAIS
  ========================================================

  Os percentuais são calculados somente para apresentação.

  Não alteram:

  - dashboard;
  - analytics;
  - backend;
  - planilha;
  - quantidade de chamadas à API.

  A validação de totalInscritos evita divisão por zero.
  ========================================================
  */

  const percentualConfirmados =
    totalInscritos > 0
      ? ((totalConfirmados / totalInscritos) * 100).toLocaleString(
          "pt-BR",

          {
            minimumFractionDigits: 1,

            maximumFractionDigits: 1,
          },
        )
      : "0,0";

  const percentualPendentes =
    totalInscritos > 0
      ? ((totalPendentes / totalInscritos) * 100).toLocaleString(
          "pt-BR",

          {
            minimumFractionDigits: 1,

            maximumFractionDigits: 1,
          },
        )
      : "0,0";

  return (
    <section
      className="
          mb-8
        "
    >
      {/*
        ====================================================
        CABEÇALHO
        ====================================================
        */}

      <div
        className="
            mb-5
          "
      >
        <h2
          className="
              text-2xl
              font-bold
              text-gray-800
            "
        >
          📋 Visão Geral das Inscrições
        </h2>

        <p
          className="
              mt-1
              text-sm
              text-gray-500
            "
        >
          Acompanhamento dos participantes, pagamentos e percursos cadastrados.
        </p>
      </div>

      {/*
        ====================================================
        CARDS OPERACIONAIS
        ====================================================
        */}

      <div
        className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
          "
      >
        <DashboardCard title="Total de Inscritos" value={totalInscritos} />

        <DashboardCard
          title="Inscrições Confirmadas"
          value={totalConfirmados}
          description={`${percentualConfirmados}% do total de inscritos`}
        />

        {/* <DashboardCard
          title="Inscrições Confirmadas"
          value={totalConfirmados}
        /> */}

        {/* <DashboardCard title="Aguardando Pagamento" value={totalPendentes} /> */}

        <DashboardCard
          title="Aguardando Pagamento"
          value={totalPendentes}
          description={`${percentualPendentes}% do total de inscritos`}
        />

        <DashboardCard title="Percurso 3 KM" value={total3Km} />

        <DashboardCard title="Percurso 5 KM" value={total5Km} />

        <DashboardCard
          title="Percurso Não Informado"
          value={percursoNaoInformado}
        />
      </div>
    </section>
  );
}

// import DashboardCard from "./DashboardCard";

// export default function DashboardGrid({ dashboard }) {
//   if (!dashboard) {
//     return null;
//   }

//   return (
//     <div
//       className="
//       grid
//       grid-cols-1
//       md:grid-cols-2
//       xl:grid-cols-4
//       gap-6
//       mb-8
//     "
//     >
//       <DashboardCard title="Total Inscritos" value={dashboard.totalInscritos} />

//       <DashboardCard title="Pagos" value={dashboard.totalPago} />

//       <DashboardCard title="Pendentes" value={dashboard.totalPendente} />

//       <DashboardCard
//         title="Vendas Totais" //Arrecadado
//         value={`R$ ${Number(dashboard.totalArrecadado || 0).toFixed(2)}`}
//       />

//       <DashboardCard
//         title="Cupons Utilizados"
//         value={`${dashboard.cupom.utilizados}/${dashboard.cupom.limite}`}
//       />

//       {/*       <DashboardCard
//         title="Cupons Restantes"
//         value={dashboard.cupom.restantes}
//       /> */}

//       <DashboardCard title="Masculino" value={dashboard.masculino} />

//       <DashboardCard title="Feminino" value={dashboard.feminino} />

//       <DashboardCard title="3 KM" value={dashboard.corrida3km} />

//       <DashboardCard title="5 KM" value={dashboard.corrida5km} />
//     </div>
//   );
// }
