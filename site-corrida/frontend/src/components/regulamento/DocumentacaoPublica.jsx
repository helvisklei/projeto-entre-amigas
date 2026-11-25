import RegulamentoCorrida from "./RegulamentoCorrida";
import { useState } from "react";

export default function DocumentacaoPublica() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      {/* Acesso permanente à documentação */}
      <section id="documentacao" className="bg-white px-4 py-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  📋
                </div>

                <div>
                  <h2 className="text-xl font-bold text-purple-800 md:text-2xl">
                    Regulamento e Documentação
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-700 md:text-base">
                    Consulte as condições oficiais da 6ª Corrida Entre Amigas
                    RUN, incluindo inscrições, entrega dos kits, premiação,
                    benefícios legais e responsabilidades dos participantes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAberto(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-3 font-bold text-white shadow-md transition hover:bg-purple-800"
              >
                <span aria-hidden="true">📖</span>
                Consultar regulamento
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Janela de consulta pública */}
      {aberto && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm md:p-6"
          onClick={() => setAberto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-regulamento-publico"
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2
                  id="titulo-regulamento-publico"
                  className="text-lg font-bold text-purple-800 md:text-xl"
                >
                  Regulamento Oficial
                </h2>

                <p className="text-xs text-gray-500">
                  6ª Corrida Entre Amigas RUN – Recife/PE
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar regulamento"
                className="rounded-lg px-3 py-1 text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                ×
              </button>
            </header>

            <div className="overflow-y-auto p-4 md:p-6">
              <RegulamentoCorrida />
            </div>

            <footer className="flex justify-end border-t border-gray-200 bg-gray-50 p-4">
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="rounded-lg bg-purple-700 px-6 py-2.5 font-semibold text-white transition hover:bg-purple-800"
              >
                Fechar consulta
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
