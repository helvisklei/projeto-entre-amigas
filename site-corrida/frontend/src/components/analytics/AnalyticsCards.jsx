export default function AnalyticsCard({ title, value, icon }) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-5
        border
        border-gray-100
        hover:shadow-lg
        transition
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          mb-3
        "
      >
        <h3
          className="
            text-sm
            font-semibold
            text-gray-500
            uppercase
            tracking-wide
          "
        >
          {title}
        </h3>

        <span className="text-2xl">{icon}</span>
      </div>

      <p
        className="
          text-3xl
          font-bold
          text-purple-700
        "
      >
        {value}
      </p>
    </div>
  );
}

// import React, { useMemo } from "react";

// import PropTypes from "prop-types";

// /**
//  * =========================================================
//  * COMPONENTE DE ANALYTICS
//  * =========================================================
//  * Responsável por:
//  * - Exibir métricas principais
//  * - Formatar valores monetários
//  * - Garantir renderização segura
//  * - Evitar reprocessamentos desnecessários
//  * =========================================================
//  */
// function AnalyticsCards({ analytics }) {
//   /*
//   =========================================================
//   = VALORES PADRÃO DEFENSIVOS
//   =========================================================
//   */
//   const safeAnalytics = analytics || {};

//   /*
//   =========================================================
//   = FORMATADOR MONETÁRIO
//   =========================================================
//   */
//   const formatarMoeda = (valor) => {
//     const numero = Number(valor);

//     if (isNaN(numero)) {
//       return "R$ 0,00";
//     }

//     return new Intl.NumberFormat("pt-BR", {
//       style: "currency",
//       currency: "BRL",
//     }).format(numero);
//   };

//   /*
//   =========================================================
//   = FORMATADOR NUMÉRICO
//   =========================================================
//   */
//   const formatarNumero = (valor) => {
//     const numero = Number(valor);

//     return isNaN(numero) ? 0 : numero;
//   };

//   /*
//   =========================================================
//   = TOTAL DE KITS (MEMOIZADO)
//   =========================================================
//   */
//   const totalKits = useMemo(() => {
//     if (!safeAnalytics.kits || typeof safeAnalytics.kits !== "object") {
//       return 0;
//     }

//     return Object.values(safeAnalytics.kits).reduce((total, valor) => {
//       const numero = Number(valor);

//       return total + (isNaN(numero) ? 0 : numero);
//     }, 0);
//   }, [safeAnalytics.kits]);

//   /*
//   =========================================================
//   = EARLY RETURN SEGURO
//   =========================================================
//   */
//   if (!analytics) {
//     return null;
//   }

//   return (
//     <div
//       className="
//         grid
//         grid-cols-1
//         sm:grid-cols-2
//         md:grid-cols-4
//         gap-4
//         mb-8
//       "
//     >
//       {/* TOTAL INSCRITOS */}
//       <MetricCard
//         title="Total Inscritos"
//         value={formatarNumero(safeAnalytics.totalInscritos)}
//         borderColor="border-pink-500"
//         textColor="text-pink-600"
//       />

//       {/* TOTAL ARRECADADO */}
//       <MetricCard
//         title="Total Arrecadado"
//         value={formatarMoeda(safeAnalytics.totalArrecadado)}
//         borderColor="border-green-500"
//         textColor="text-green-600"
//       />

//       {/* VALOR DESENVOLVEDOR */}
//       <MetricCard
//         title="Valor Desenvolvedor"
//         value={formatarMoeda(safeAnalytics.valorDesenvolvedor)}
//         borderColor="border-blue-500"
//         textColor="text-blue-600"
//       />

//       {/* TOTAL KITS */}
//       <MetricCard
//         title="Total Kits"
//         value={totalKits}
//         borderColor="border-purple-500"
//         textColor="text-purple-600"
//       />
//     </div>
//   );
// }

// /**
//  * =========================================================
//  * COMPONENTE REUTILIZÁVEL DE CARD
//  * =========================================================
//  */
// const MetricCard = React.memo(function MetricCard({
//   title,
//   value,
//   borderColor,
//   textColor,
// }) {
//   return (
//     <div
//       className={`
//         bg-white
//         rounded-lg
//         shadow
//         p-6
//         border-l-4
//         ${borderColor}
//       `}
//     >
//       <h3
//         className="
//           text-gray-600
//           text-sm
//           font-semibold
//         "
//       >
//         {title}
//       </h3>

//       <p
//         className={`
//           text-3xl
//           font-bold
//           ${textColor}
//         `}
//       >
//         {value}
//       </p>
//     </div>
//   );
// });

// /*
// =========================================================
// = TIPAGEM
// =========================================================
// */
// AnalyticsCards.propTypes = {
//   analytics: PropTypes.shape({
//     totalInscritos: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

//     totalArrecadado: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

//     valorDesenvolvedor: PropTypes.oneOfType([
//       PropTypes.number,
//       PropTypes.string,
//     ]),

//     kits: PropTypes.object,
//   }),
// };

// MetricCard.propTypes = {
//   title: PropTypes.string.isRequired,

//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

//   borderColor: PropTypes.string.isRequired,

//   textColor: PropTypes.string.isRequired,
// };

// export default React.memo(AnalyticsCards);
