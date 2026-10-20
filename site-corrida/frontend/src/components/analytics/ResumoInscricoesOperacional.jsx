const STATUS_PAGAMENTO = [
  { chave: "PAGO", titulo: "Pagas" },
  { chave: "PENDENTE", titulo: "Pendentes" },
];

const STATUS_INSCRICAO = ["ATIVA", "CANCELADA"];

const formatarNumero = (valor) => (Number(valor) || 0).toLocaleString("pt-BR");

function obterTipos(resumo) {
  const tipos = new Set();

  STATUS_PAGAMENTO.forEach(({ chave }) => {
    STATUS_INSCRICAO.forEach((status) => {
      const grupo = resumo?.[chave]?.[status] || {};

      Object.keys(grupo).forEach((tipo) => tipos.add(tipo));
    });
  });

  return [...tipos].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function contarTipo(resumo, pagamento, situacao, tipo) {
  return Number(resumo?.[pagamento]?.[situacao]?.[tipo]) || 0;
}

function contarGrupo(resumo, pagamento, situacao) {
  const grupo = resumo?.[pagamento]?.[situacao] || {};

  return Object.values(grupo).reduce(
    (total, valor) => total + (Number(valor) || 0),
    0,
  );
}

export default function ResumoInscricoesOperacional({ analytics }) {
  const resumo = analytics?.resumoInscricoesOperacional;

  if (!resumo) {
    return null;
  }

  const tipos = obterTipos(resumo);

  const totalGeral = Number(resumo.totais?.geral) || 0;
  const totalAtivas = Number(resumo.totais?.ATIVA) || 0;
  const totalCanceladas = Number(resumo.totais?.CANCELADA) || 0;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h2 className="text-xl font-bold text-emerald-700">
            Resumo operacional das inscrições (Número de Peito)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quantidade por pagamento, tipo e situação da inscrição.
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Total geral:{" "}
          <strong className="text-gray-900">
            {formatarNumero(totalGeral)}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Total de inscrições</p>
          <p className="text-2xl font-bold text-gray-800">
            {formatarNumero(totalGeral)}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
          <p className="text-xs text-emerald-700">Ativas</p>
          <p className="text-2xl font-bold text-emerald-800">
            {formatarNumero(totalAtivas)}
          </p>
        </div>

        <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
          <p className="text-xs text-rose-700">Canceladas</p>
          <p className="text-2xl font-bold text-rose-800">
            {formatarNumero(totalCanceladas)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-[620px] w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Pagamento</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 text-right font-semibold">Ativa</th>
              <th className="px-4 py-3 text-right font-semibold">Cancelada</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {STATUS_PAGAMENTO.map(({ chave, titulo }) => {
              const totalAtivasGrupo = contarGrupo(resumo, chave, "ATIVA");
              const totalCanceladasGrupo = contarGrupo(
                resumo,
                chave,
                "CANCELADA",
              );
              const totalGrupo = totalAtivasGrupo + totalCanceladasGrupo;

              return (
                <>
                  <tr key={`${chave}-cabecalho`} className="bg-emerald-50/70">
                    <td
                      colSpan={2}
                      className="px-4 py-3 font-bold text-gray-800"
                    >
                      {titulo}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatarNumero(totalAtivasGrupo)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatarNumero(totalCanceladasGrupo)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      {formatarNumero(totalGrupo)}
                    </td>
                  </tr>

                  {tipos.map((tipo) => {
                    const ativa = contarTipo(resumo, chave, "ATIVA", tipo);
                    const cancelada = contarTipo(
                      resumo,
                      chave,
                      "CANCELADA",
                      tipo,
                    );

                    if (ativa === 0 && cancelada === 0) {
                      return null;
                    }

                    return (
                      <tr key={`${chave}-${tipo}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-500">{chave}</td>
                        <td className="px-4 py-2 pl-6 text-gray-700">{tipo}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {formatarNumero(ativa)}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {formatarNumero(cancelada)}
                        </td>
                        <td className="px-4 py-2 text-right font-medium tabular-nums">
                          {formatarNumero(ativa + cancelada)}
                        </td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>

          <tfoot className="bg-gray-100 border-t-2 border-gray-200">
            <tr className="font-bold text-gray-900">
              <td colSpan={2} className="px-4 py-3">
                Total geral
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatarNumero(totalAtivas)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatarNumero(totalCanceladas)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatarNumero(totalGeral)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Os valores são calculados com base nos dados retornados pelo backend. A
        tabela não altera os indicadores financeiros ou logísticos existentes.
      </p>
    </section>
  );
}
