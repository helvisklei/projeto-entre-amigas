import ExecutiveSummary from "./ExecutiveSummary";
import ExportButtons from "./ExportButtons";
import { useState } from "react";

export default function AnalyticsSection({ analytics }) {
  const [mostrarCupons, setMostrarCupons] = useState(false);
  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* RESUMO EXECUTIVO */}
      <ExecutiveSummary analytics={analytics} />

      {/* CUPONS */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">
          🎟 Controle de Cupons
        </h2>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-gray-500">Cupom</p>

            <h3 className="font-bold">{analytics.cupom?.nome || "-"}</h3>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-gray-500">Utilizados</p>

            <h3 className="text-2xl font-bold text-blue-700">
              {analytics.cupom?.utilizados ?? 0}
            </h3>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-gray-500">Aguardando</p>

            <h3 className="text-2xl font-bold text-yellow-700">
              {analytics.cupom?.aguardando ?? 0}
            </h3>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-gray-500">Restantes</p>

            <h3 className="text-2xl font-bold text-orange-700">
              {analytics.cupom?.restantes ?? 0}
            </h3>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-gray-500">Limite</p>

            <h3 className="text-2xl font-bold text-purple-700">
              {analytics.cupom?.limite ?? 0}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setMostrarCupons(!mostrarCupons)}
          className="
            px-4
            py-2
            bg-emerald-100
            text-emerald-700
            rounded-lg
            hover:bg-emerald-200
            transition
            font-medium
            mb-4
          "
        >
          {mostrarCupons
            ? "▲ Ocultar participantes"
            : `▼ Ver participantes (${analytics.listaCupons?.length ?? 0})`}
        </button>

        {mostrarCupons && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Inscrição</th>
                  <th className="text-left py-2">Nome</th>
                  <th className="text-left py-2">Cupom</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {(analytics.listaCupons || []).map((item) => (
                  <tr key={item.numero} className="border-b hover:bg-gray-50">
                    <td className="py-2">{item.numero}</td>

                    <td>{item.nome}</td>

                    <td>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.cupom}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "VALIDADO"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EXPORTAÇÕES */}

      <ExportButtons />

      {/* OPERACIONAL */}
      {/* <Card Operacional /> */}

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
            text-slate-700
            mb-4
          "
        >
          📋 Operacional
        </h2>

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
        >
          <div className="bg-slate-50 rounded-xl p-4">
            <p>Equipe</p>
            <h3 className="text-2xl font-bold">{analytics.totalEquipe}</h3>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p>Parceria</p>
            <h3 className="text-2xl font-bold">{analytics.totalParceria}</h3>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p>Divulgação</p>
            <h3 className="text-2xl font-bold">{analytics.totalDivulgacao}</h3>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p>Cortesia</p>
            <h3 className="text-2xl font-bold">{analytics.totalCortesia}</h3>
          </div>
        </div>
      </div>

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
          👕 Controle de Camisas
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Tamanho</th>
                <th className="text-center py-2">Pagos</th>
                <th className="text-center py-2">Pendentes</th>
                <th className="text-center py-2">Total</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(analytics.camisas || {}).map((tamanho) => (
                <tr key={tamanho} className="border-b">
                  <td className="py-2 font-medium">{tamanho}</td>

                  <td className="text-center">
                    {analytics.camisasPagas?.[tamanho] || 0}
                  </td>

                  <td className="text-center">
                    {analytics.camisasPendentes?.[tamanho] || 0}
                  </td>

                  <td className="text-center font-bold">
                    {analytics.camisas?.[tamanho] || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*  <div
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
      </div>*/}

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

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          mt-6
        "
      >
        <div className="bg-green-50 rounded-xl p-4">
          <p>Pagos</p>
          <h3>{analytics.kitsPagos}</h3>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4">
          <p>Pendentes</p>
          <h3>{analytics.kitsPendentesPagamento}</h3>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p>Retirados</p>
          <h3>{analytics.kitsRetirados}</h3>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <p>A Retirar</p>
          <h3>{analytics.kitsPendentes}</h3>
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
