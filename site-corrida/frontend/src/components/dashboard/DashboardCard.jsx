/**
 * =========================================================
 * DASHBOARD CARD
 * =========================================================
 *
 * Componente reutilizável responsável exclusivamente
 * pela apresentação de indicadores do dashboard.
 *
 * Propriedades:
 *
 * title
 * → título principal do indicador;
 *
 * value
 * → valor principal apresentado no card;
 *
 * description
 * → informação complementar opcional.
 *
 * Este componente:
 *
 * - não realiza cálculos;
 * - não altera dados;
 * - não acessa a API;
 * - não conhece regras do backend;
 * - não conhece regras financeiras;
 * - não altera a planilha;
 * - mantém compatibilidade com os usos anteriores.
 * =========================================================
 */

export default function DashboardCard({
  title,

  value,

  description,
}) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        border
        border-gray-100
        min-w-0
      "
    >
      {/*
      ======================================================
      TÍTULO
      ======================================================
      */}

      <h3
        className="
          text-gray-500
          text-sm
          font-medium
          mb-2
        "
      >
        {title}
      </h3>

      {/*
      ======================================================
      VALOR PRINCIPAL
      ======================================================
      */}

      <p
        className="
          text-3xl
          font-bold
          text-pink-600
          break-words
        "
      >
        {value}
      </p>

      {/*
      ======================================================
      INFORMAÇÃO COMPLEMENTAR
      ======================================================

      Renderizada somente quando description for enviada.

      Dessa forma, os componentes antigos que utilizam
      apenas title e value continuam funcionando.
      ======================================================
      */}

      {description && (
        <p
          className="
              mt-3
              text-sm
              text-gray-500
            "
        >
          {description}
        </p>
      )}
    </div>
  );
}

// /***
//  * REsponsavel CARD do dashboard, componente reutilizável para exibir métricas de forma consistente.
//  * A card component for displaying dashboard metrics.
//  * @param {string} title - The title of the card.
//  * @param {string} value - The value to display in the card.
//  * @returns {JSX.Element} The rendered card component.
//  */
// export default function DashboardCard({ title, value }) {
//   return (
//     <div
//       className="
//       bg-white
//       rounded-2xl
//       shadow-lg
//       p-6
//       border
//       border-gray-100
//     "
//     >
//       <h3
//         className="
//         text-gray-500
//         text-sm
//         font-medium
//         mb-2
//       "
//       >
//         {title}
//       </h3>

//       <p
//         className="
//         text-3xl
//         font-bold
//         text-pink-600
//       "
//       >
//         {value}
//       </p>
//     </div>
//   );
// }
