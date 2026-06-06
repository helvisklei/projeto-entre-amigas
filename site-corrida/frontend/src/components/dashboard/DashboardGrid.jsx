import DashboardCard from "./DashboardCard";

export default function DashboardGrid({ dashboard }) {
  if (!dashboard) {
    return null;
  }

  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-6
      mb-8
    "
    >
      <DashboardCard title="Total Inscritos" value={dashboard.totalInscritos} />

      <DashboardCard title="Pagos" value={dashboard.totalPago} />

      <DashboardCard title="Pendentes" value={dashboard.totalPendente} />

      <DashboardCard
        title="Vendas Totais" //Arrecadado
        value={`R$ ${dashboard.totalArrecadado}`}
      />

      <DashboardCard title="Masculino" value={dashboard.masculino} />

      <DashboardCard title="Feminino" value={dashboard.feminino} />

      <DashboardCard title="3 KM" value={dashboard.corrida3km} />

      <DashboardCard title="5 KM" value={dashboard.corrida5km} />
    </div>
  );
}
