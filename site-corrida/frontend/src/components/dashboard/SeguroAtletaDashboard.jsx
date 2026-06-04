function getTotalCategoria(categoria) {
  return Object.values(categoria || {}).reduce(
    (total, valor) => total + valor,
    0,
  );
}

export default function SeguroAtletaDashboard({ analytics }) {
  if (!analytics) {
    return null;
  }

  const masculino = getTotalCategoria(analytics?.categorias?.masculino);

  const feminino = getTotalCategoria(analytics?.categorias?.feminino);

  const sessentaMaisMasculino = getTotalCategoria(
    analytics?.sessentaMais?.masculino,
  );

  const sessentaMaisFeminino = getTotalCategoria(
    analytics?.sessentaMais?.feminino,
  );

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
          text-blue-700
          mb-6
        "
      >
        🛡 Seguro Atleta
      </h2>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-5
          gap-4
        "
      >
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Segurados</p>

          <h3 className="text-3xl font-bold text-blue-700">
            {analytics.totalInscritos}
          </h3>
        </div>

        <div className="bg-cyan-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Masculino</p>

          <h3 className="text-3xl font-bold text-cyan-700">{masculino}</h3>
        </div>

        <div className="bg-pink-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Feminino</p>

          <h3 className="text-3xl font-bold text-pink-700">{feminino}</h3>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Masculino 60+</p>

          <h3 className="text-3xl font-bold text-orange-700">
            {sessentaMaisMasculino}
          </h3>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Feminino 60+</p>

          <h3 className="text-3xl font-bold text-yellow-700">
            {sessentaMaisFeminino}
          </h3>
        </div>
      </div>
    </div>
  );
}
