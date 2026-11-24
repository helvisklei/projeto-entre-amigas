import ExecutiveSummary from "./ExecutiveSummary";
import ExportButtons from "./ExportButtons";
import LogisticsSection from "../logistics/LogisticsSection";
import OrigemInscricoesDashboard from "./OrigemInscricoes/OrigemInscricoesDashboard";
import ResumoInscricoesOperacional from "./ResumoInscricoesOperacional";
import { useState } from "react";

export default function AnalyticsSection({ analytics, children }) {
  const [mostrarCupons, setMostrarCupons] = useState(false);

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* RESUMO EXECUTIVO */}
      <ExecutiveSummary analytics={analytics} />
      <ResumoInscricoesOperacional analytics={analytics} />
      <OrigemInscricoesDashboard analytics={analytics} />

      {/* RESUMO DE KITS */}
      <section className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-700">
              🎽 Resumo de Kits
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Acompanhamento de pagamentos e retiradas.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
            Total: {analytics.kitsPendentes ?? 0} kits
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-sm font-medium text-green-700">Pagos</p>
            <h3 className="text-2xl md:text-3xl font-bold text-green-800 mt-1">
              {analytics.kitsPagos ?? 0}
            </h3>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <p className="text-sm font-medium text-yellow-700">Pendentes</p>
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-800 mt-1">
              {analytics.kitsPendentesPagamento ?? 0}
            </h3>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm font-medium text-blue-700">Retirados</p>
            <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mt-1">
              {analytics.kitsRetirados ?? 0}
            </h3>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <p className="text-sm font-medium text-orange-700">A retirar</p>
            <h3 className="text-2xl md:text-3xl font-bold text-orange-800 mt-1">
              {analytics.kitsPendentes ?? 0}
            </h3>
          </div>
        </div>
      </section>

      {/* KITS POR TIPO / PLANEJAMENTO */}
      <LogisticsSection analytics={analytics} />

      {/* SLOT: CONTROLE DE RETIRADA VEM DO ADMIN */}
      {children}

      {/* CUPONS */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">
          🎟 Controle de Cupons
        </h2>

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
          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition font-medium mb-4"
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">
          📋 Operacional
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
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
    </div>
  );
}

// import ExecutiveSummary from "./ExecutiveSummary";
// import ExportButtons from "./ExportButtons";
// import LogisticsSection from "../logistics/LogisticsSection";
// import OrigemInscricoesDashboard from "./OrigemInscricoes/OrigemInscricoesDashboard";
// import ResumoInscricoesOperacional from "./ResumoInscricoesOperacional";
// import { useState } from "react";

// //import LogisticsSection from "./LogisticsSection";

// export default function AnalyticsSection({ analytics }) {
//   const [mostrarCupons, setMostrarCupons] = useState(false);
//   if (!analytics) {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       {/* RESUMO EXECUTIVO */}
//       <ExecutiveSummary analytics={analytics} />
//       <ResumoInscricoesOperacional analytics={analytics} />
//       <OrigemInscricoesDashboard analytics={analytics} />
//       <LogisticsSection analytics={analytics} />

//       {/* RESUMO DE KITS */}
//       <section className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mt-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
//           <div>
//             <h2 className="text-xl md:text-2xl font-bold text-green-700">
//               🎽 Resumo de Kits
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Acompanhamento de pagamentos e retiradas.
//             </p>
//           </div>

//           <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
//             Total: {analytics.kitsPendentes ?? 0} kits
//           </span>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//           <div className="bg-green-50 rounded-xl p-4 border border-green-100">
//             <p className="text-sm font-medium text-green-700">Pagos</p>
//             <h3 className="text-2xl md:text-3xl font-bold text-green-800 mt-1">
//               {analytics.kitsPagos ?? 0}
//             </h3>
//           </div>

//           <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
//             <p className="text-sm font-medium text-yellow-700">Pendentes</p>
//             <h3 className="text-2xl md:text-3xl font-bold text-yellow-800 mt-1">
//               {analytics.kitsPendentesPagamento ?? 0}
//             </h3>
//           </div>

//           <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
//             <p className="text-sm font-medium text-blue-700">Retirados</p>
//             <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mt-1">
//               {analytics.kitsRetirados ?? 0}
//             </h3>
//           </div>

//           <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
//             <p className="text-sm font-medium text-orange-700">A retirar</p>
//             <h3 className="text-2xl md:text-3xl font-bold text-orange-800 mt-1">
//               {analytics.kitsPendentes ?? 0}
//             </h3>
//           </div>
//         </div>
//       </section>

//       {/* CUPONS */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="text-2xl font-bold text-emerald-700 mb-4">
//           🎟 Controle de Cupons
//         </h2>

//         {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//           <div className="bg-emerald-50 rounded-xl p-4">
//             <p className="text-gray-500">Cupom</p>

//             <h3 className="font-bold">{analytics.cupom?.nome || "-"}</h3>
//           </div>

//           <div className="bg-blue-50 rounded-xl p-4">
//             <p className="text-gray-500">Utilizados</p>

//             <h3 className="text-2xl font-bold text-blue-700">
//               {analytics.cupom?.utilizados ?? 0}
//             </h3>
//           </div>

//           <div className="bg-yellow-50 rounded-xl p-4">
//             <p className="text-gray-500">Aguardando</p>

//             <h3 className="text-2xl font-bold text-yellow-700">
//               {analytics.cupom?.aguardando ?? 0}
//             </h3>
//           </div>

//           <div className="bg-orange-50 rounded-xl p-4">
//             <p className="text-gray-500">Restantes</p>

//             <h3 className="text-2xl font-bold text-orange-700">
//               {analytics.cupom?.restantes ?? 0}
//             </h3>
//           </div>

//           <div className="bg-purple-50 rounded-xl p-4">
//             <p className="text-gray-500">Limite</p>

//             <h3 className="text-2xl font-bold text-purple-700">
//               {analytics.cupom?.limite ?? 0}
//             </h3>
//           </div>
//         </div>

//         <button
//           onClick={() => setMostrarCupons(!mostrarCupons)}
//           className="
//             px-4
//             py-2
//             bg-emerald-100
//             text-emerald-700
//             rounded-lg
//             hover:bg-emerald-200
//             transition
//             font-medium
//             mb-4
//           "
//         >
//           {mostrarCupons
//             ? "▲ Ocultar participantes"
//             : `▼ Ver participantes (${analytics.listaCupons?.length ?? 0})`}
//         </button>

//         {mostrarCupons && (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left py-2">Inscrição</th>
//                   <th className="text-left py-2">Nome</th>
//                   <th className="text-left py-2">Cupom</th>
//                   <th className="text-center py-2">Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {(analytics.listaCupons || []).map((item) => (
//                   <tr key={item.numero} className="border-b hover:bg-gray-50">
//                     <td className="py-2">{item.numero}</td>

//                     <td>{item.nome}</td>

//                     <td>
//                       <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
//                         {item.cupom}
//                       </span>
//                     </td>

//                     <td className="text-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           item.status === "VALIDADO"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* EXPORTAÇÕES */}

//       <ExportButtons />

//       {/* OPERACIONAL */}
//       {/* <Card Operacional /> */}

//       <div
//         className="
//           bg-white
//           rounded-2xl
//           shadow-lg
//           p-6
//         "
//       >
//         <h2
//           className="
//             text-2xl
//             font-bold
//             text-slate-700
//             mb-4
//           "
//         >
//           📋 Operacional
//         </h2>

//         <div
//           className="
//             grid
//             grid-cols-2
//             md:grid-cols-4
//             gap-4
//           "
//         >
//           <div className="bg-slate-50 rounded-xl p-4">
//             <p>Equipe</p>
//             <h3 className="text-2xl font-bold">{analytics.totalEquipe}</h3>
//           </div>

//           <div className="bg-slate-50 rounded-xl p-4">
//             <p>Parceria</p>
//             <h3 className="text-2xl font-bold">{analytics.totalParceria}</h3>
//           </div>

//           <div className="bg-slate-50 rounded-xl p-4">
//             <p>Divulgação</p>
//             <h3 className="text-2xl font-bold">{analytics.totalDivulgacao}</h3>
//           </div>

//           <div className="bg-slate-50 rounded-xl p-4">
//             <p>Cortesia</p>
//             <h3 className="text-2xl font-bold">{analytics.totalCortesia}</h3>
//           </div>
//         </div>
//       </div>

//       {/* CAMISAS */}

//       <div
//         className="
//           bg-white
//           rounded-2xl
//           shadow-lg
//           p-6
//         "
//       >
//         <h2
//           className="
//             text-2xl
//             font-bold
//             text-purple-700
//             mb-4
//           "
//         >
//           👕 Controle de Camisas
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b">
//                 <th className="text-left py-2">Tamanho</th>
//                 <th className="text-center py-2">Pagos</th>
//                 <th className="text-center py-2">Pendentes</th>
//                 <th className="text-center py-2">Total</th>
//               </tr>
//             </thead>

//             <tbody>
//               {Object.keys(analytics.camisas || {}).map((tamanho) => (
//                 <tr key={tamanho} className="border-b">
//                   <td className="py-2 font-medium">{tamanho}</td>

//                   <td className="text-center">
//                     {analytics.camisasPagas?.[tamanho] || 0}
//                   </td>

//                   <td className="text-center">
//                     {analytics.camisasPendentes?.[tamanho] || 0}
//                   </td>

//                   <td className="text-center font-bold">
//                     {analytics.camisas?.[tamanho] || 0}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
