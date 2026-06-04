export default function KitRetiradaDashboard({ analytics }) {
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
