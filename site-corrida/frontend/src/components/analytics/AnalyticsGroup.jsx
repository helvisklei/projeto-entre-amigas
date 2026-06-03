import AnalyticsTable from "./AnalyticsTable";

export default function AnalyticsGroup({ title, masculino, feminino }) {
  return (
    <div
      className="
        grid
        md:grid-cols-2
        gap-6
      "
    >
      <AnalyticsTable title={`${title} - Masculino`} data={masculino} />

      <AnalyticsTable title={`${title} - Feminino`} data={feminino} />
    </div>
  );
}
