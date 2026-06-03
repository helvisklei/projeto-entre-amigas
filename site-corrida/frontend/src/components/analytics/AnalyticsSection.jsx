import ExecutiveSummary from "./ExecutiveSummary";
import ExportButtons from "./ExportButtons";

export default function AnalyticsSection({ analytics }) {
  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* RESUMO EXECUTIVO */}

      <ExecutiveSummary analytics={analytics} />

      {/* EXPORTAÇÕES */}

      <ExportButtons />

      {/* CAMISAS */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          p-6
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            text-purple-700
            mb-4
          "
        >
          👕 Quantidade por Camisa
        </h2>

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
        >
          {Object.entries(analytics.camisas || {}).map(([k, v]) => (
            <div
              key={k}
              className="
                  bg-purple-50
                  rounded-xl
                  p-4
                "
            >
              <p className="text-gray-500">{k}</p>

              <h3
                className="
                    text-2xl
                    font-bold
                    text-purple-700
                  "
              >
                {v}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* KITS */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          p-6
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            text-green-700
            mb-4
          "
        >
          🎽 Quantidade de Kits
        </h2>

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-4
          "
        >
          {Object.entries(analytics.kits || {}).map(([k, v]) => (
            <div
              key={k}
              className="
                  bg-green-50
                  rounded-xl
                  p-4
                "
            >
              <p className="text-gray-500">{k}</p>

              <h3
                className="
                    text-2xl
                    font-bold
                    text-green-700
                  "
              >
                {v}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* DISTÂNCIAS */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          p-6
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            text-blue-700
            mb-4
          "
        >
          🏃 Números de Peito
        </h2>

        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >
          {Object.entries(analytics.distancias || {}).map(([k, v]) => (
            <div
              key={k}
              className="
                  bg-blue-50
                  rounded-xl
                  p-4
                "
            >
              <p className="text-gray-500">{k}</p>

              <h3
                className="
                    text-2xl
                    font-bold
                    text-blue-700
                  "
              >
                {v}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
