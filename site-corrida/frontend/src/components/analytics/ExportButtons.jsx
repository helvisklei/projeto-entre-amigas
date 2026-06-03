import { exportPdf } from "../../services/pdfService";

export default function ExportButtons() {
  const API_URL = process.env.REACT_APP_API_URL;

  const openExport = (action) => {
    window.open(`${API_URL}?action=${action}`, "_blank");
  };

  return (
    <div
      className="
        grid
        md:grid-cols-3
        gap-4
      "
    >
      <button
        onClick={() => openExport("export-seguro-atleta")}
        className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-bold
          py-4
          px-6
          rounded-2xl
          shadow-lg
          transition
        "
      >
        🛡️ Seguro Atleta
      </button>

      <button
        onClick={() => openExport("export-compras")}
        className="
          bg-green-600
          hover:bg-green-700
          text-white
          font-bold
          py-4
          px-6
          rounded-2xl
          shadow-lg
          transition
        "
      >
        🛒 Relatório Compras
      </button>

      <button
        onClick={() => openExport({ exportPdf })}
        className="
          bg-red-600
          hover:bg-red-700
          text-white
          font-bold
          py-4
          px-6
          rounded-2xl
          shadow-lg
          transition
        "
      >
        📄 Exportar PDF
      </button>
    </div>
  );
}
