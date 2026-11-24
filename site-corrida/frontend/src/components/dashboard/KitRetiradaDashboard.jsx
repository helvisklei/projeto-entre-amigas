export default function KitRetiradaDashboard({
  analytics,
  retirados,
  pendentes,
  onVisualizarPendentes,
}) {
  if (!analytics) {
    return null;
  }

  const totalRetirados = Number(retirados ?? analytics.kitsRetirados ?? 0);
  const totalPendentes = Number(pendentes ?? analytics.kitsPendentes ?? 0);

  const total = totalRetirados + totalPendentes;

  const percentual =
    total > 0 ? ((totalRetirados / total) * 100).toFixed(1) : "0.0";

  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-green-700">
        🎽 Retirada de Kits
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-gray-500">Retirados</p>
          <h3 className="text-3xl font-bold text-green-700">
            {totalRetirados}
          </h3>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">A retirar</p>

          <h3 className="text-3xl font-bold text-orange-700">
            {totalPendentes}
          </h3>

          {onVisualizarPendentes && (
            <button
              type="button"
              onClick={onVisualizarPendentes}
              disabled={totalPendentes === 0}
              className="
                mt-3 inline-flex items-center gap-2
                rounded-lg border border-orange-200 bg-white
                px-3 py-2 text-xs font-semibold text-orange-700
                transition hover:bg-orange-100
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              👁️ Visualizar participantes
            </button>
          )}
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-gray-500">Taxa de retirada</p>
          <h3 className="text-3xl font-bold text-blue-700">{percentual}%</h3>
        </div>
      </div>
    </section>
  );
}

/* export default function KitRetiradaDashboard({
  analytics,
  onVisualizarPendentes,
}) {
  if (!analytics) {
    return null;
  }

  const retirados = analytics.kitsRetirados || 0;
  const pendentes = analytics.kitsPendentes || 0;
  const total = retirados + pendentes;

  const percentual = total > 0 ? ((retirados / total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        🎽 Retirada de Kits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Retirados</p>

          <h3 className="text-3xl font-bold text-green-700">{retirados}</h3>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Pendentes</p>

          <h3 className="text-3xl font-bold text-orange-700">{pendentes}</h3>

          {onVisualizarPendentes && (
            <button
              type="button"
              onClick={onVisualizarPendentes}
              disabled={pendentes === 0}
              className="
                mt-3
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-orange-200
                bg-white
                px-3
                py-2
                text-xs
                font-semibold
                text-orange-700
                transition
                hover:bg-orange-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span>👁️</span>
              Visualizar participantes
            </button>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Taxa de Retirada</p>

          <h3 className="text-3xl font-bold text-blue-700">{percentual}%</h3>
        </div>
      </div>
    </div>
  );
} */

/* export default function KitRetiradaDashboard({ analytics }) {
  if (!analytics) {
    return null;
  }

  const retirados = analytics.kitsRetirados || 0;

  const pendentes = analytics.kitsPendentes || 0;

  const total = retirados + pendentes;

  const percentual = total > 0 ? ((retirados / total) * 100).toFixed(1) : 0;

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
      <h2
        className="
          text-2xl
          font-bold
          text-green-700
          mb-6
        "
      >
        🎽 Retirada de Kits
      </h2>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >
        <div
          className="
            bg-green-50
            rounded-xl
            p-4
          "
        >
          <p className="text-sm text-gray-500">Retirados</p>

          <h3
            className="
              text-3xl
              font-bold
              text-green-700
            "
          >
            {retirados}
          </h3>
        </div>

        <div
          className="
            bg-orange-50
            rounded-xl
            p-4
          "
        >
          <p className="text-sm text-gray-500">Pendentes</p>

          <h3
            className="
              text-3xl
              font-bold
              text-orange-700
            "
          >
            {pendentes}
          </h3>
        </div>

        <div
          className="
            bg-blue-50
            rounded-xl
            p-4
          "
        >
          <p className="text-sm text-gray-500">Taxa de Retirada</p>

          <h3
            className="
              text-3xl
              font-bold
              text-blue-700
            "
          >
            {percentual}%
          </h3>
        </div>
      </div>
    </div>
  );
}
 */
