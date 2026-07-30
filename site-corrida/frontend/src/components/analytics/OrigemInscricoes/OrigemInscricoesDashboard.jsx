/*
==========================================================
ORIGEM DAS INSCRIÇÕES
==========================================================

Este componente apresenta como os participantes
conheceram o evento.

Os dados são produzidos exclusivamente pelo backend
(AnalyticsOrigemService).

Este componente:

✔ não realiza cálculos de negócio;
✔ não altera analytics;
✔ não consulta API;
✔ não modifica dados;
✔ apenas organiza e apresenta as informações.

==========================================================
*/

export default function OrigemInscricoesDashboard({ analytics }) {
  if (!analytics) {
    return null;
  }

  const origem = analytics.origemInscricoes || {};

  const totalOrigens = Number(origem.totalOrigens || 0);

  const medalhas = ["🥇", "🥈", "🥉"];

  const configuracaoOrigens = {
    Instagram: {
      icone: "📷",
    },

    Amigos: {
      icone: "👥",
    },

    "Race Running": {
      icone: "🏃",
    },

    WhatsApp: {
      icone: "💬",
    },

    Site: {
      icone: "🌐",
    },

    Parceiros: {
      icone: "🤝",
    },

    Outros: {
      icone: "📌",
    },

    "Não informado": {
      icone: "❓",
    },
  };

  const itens = [
    origem.instagram,
    origem.amigos,
    origem.raceRunning,
    origem.whatsapp,
    origem.site,
    origem.parceiros,
    origem.outros,
    origem.naoInformado,
  ]
    .filter(Boolean)
    .sort((a, b) => b.total - a.total);

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        mb-6
      "
    >
      <div className="mb-6">
        <h2
          className="
            text-2xl
            font-bold
            text-gray-800
          "
        >
          📣 Origem das Inscrições
        </h2>

        <p className="text-gray-500">
          <strong>{totalOrigens}</strong> participantes responderam como
          conheceram o evento.
        </p>
      </div>

      <div className="space-y-5">
        {itens.map((item, index) => {
          const percentual =
            totalOrigens > 0 ? (item.total / totalOrigens) * 100 : 0;

          const medalha = medalhas[index] || "";

          const estiloRanking =
            index === 0
              ? {
                  card: "border-yellow-300 bg-yellow-50",
                  badge: "bg-yellow-100 text-yellow-800",
                  barra: "bg-yellow-500",
                }
              : index === 1
                ? {
                    card: "border-gray-300 bg-gray-50",
                    badge: "bg-gray-200 text-gray-700",
                    barra: "bg-gray-500",
                  }
                : index === 2
                  ? {
                      card: "border-orange-300 bg-orange-50",
                      badge: "bg-orange-100 text-orange-700",
                      barra: "bg-orange-500",
                    }
                  : {
                      card: "border-gray-200 bg-white",
                      badge: "bg-slate-100 text-slate-600",
                      barra: "bg-blue-600",
                    };

          const info = configuracaoOrigens[item.nome] || {};

          const icone = info.icone || "📍";

          return (
            <div
              key={item.nome}
              className={`
              border
              rounded-xl
              p-4
              transition-all
              duration-300
              cursor-pointer
              hover:shadow-xl
              hover:-translate-y-1
              ${estiloRanking.card}
              `}
            >
              <div
                className="
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-3
                "
              >
                <div>
                  <h3
                    className="
                      text-lg
                      font-bold
                      text-gray-800
                    "
                  >
                    <span className="text-2xl mr-2">{medalha}</span>

                    <span className="mr-2">{icone}</span>

                    {item.nome}
                  </h3>

                  <strong className="text-2xl text-gray-800">
                    {item.total}
                  </strong>

                  <p className="text-sm text-gray-500">inscrições</p>
                </div>

                <div
                  className="
                    flex
                    flex-col
                    items-end
                    gap-2
                  "
                >
                  <div
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      ${estiloRanking.badge}
                    `}
                  >
                    #{index + 1}
                  </div>

                  <div
                    className="
                      flex
                      gap-6
                      text-sm
                    "
                  >
                    <div className="text-center">
                      <p className="text-gray-500">Pagos</p>

                      <strong className="text-emerald-700">{item.pagos}</strong>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-500">Pendentes</p>

                      <strong className="text-orange-600">
                        {item.pendentes}
                      </strong>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-500">% do Total</p>

                      <strong className="text-blue-700">
                        {percentual.toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/*                 <div
                  className="
                    flex
                    gap-6
                    text-sm
                  "
                >
                  <div className="text-center">
                    <p className="text-gray-500">Pagos</p>

                    <strong className="text-emerald-700">{item.pagos}</strong>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-500">Pendentes</p>

                    <strong className="text-orange-600">
                      {item.pendentes}
                    </strong>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-500">% do Total</p>

                    <strong className="text-blue-700">
                      {percentual.toFixed(1)}%
                    </strong>
                  </div>
                </div> */}
              </div>

              <div
                className="
                  mt-4
                  w-full
                  bg-gray-200
                  rounded-full
                  h-3
                "
              >
                <div
                  className={`
                    h-3
                    rounded-full
                    transition-all
                    duration-700
                    ease-out
                    ${estiloRanking.barra}
                  `}
                  style={{
                    width: `${percentual}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
