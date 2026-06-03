/***
 * REsponsavel CARD do dashboard, componente reutilizável para exibir métricas de forma consistente.
 * A card component for displaying dashboard metrics.
 * @param {string} title - The title of the card.
 * @param {string} value - The value to display in the card.
 * @returns {JSX.Element} The rendered card component.
 */
export default function DashboardCard({ title, value }) {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-lg
      p-6
      border
      border-gray-100
    "
    >
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

      <p
        className="
        text-3xl
        font-bold
        text-pink-600
      "
      >
        {value}
      </p>
    </div>
  );
}
