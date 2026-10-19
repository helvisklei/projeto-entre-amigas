import { useEffect, useMemo, useState } from "react";

import { getAdminConfig } from "../services/analyticsService";
import { useNavigate } from "react-router-dom";

export default function ConfigAdmin() {
  const navigate = useNavigate();

  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminUser = localStorage.getItem("admin_user") || "Admin";

  /**
   * Carrega as configurações administrativas.
   *
   * Nesta primeira etapa a tela é somente leitura.
   */
  useEffect(() => {
    let ativo = true;

    async function carregarConfiguracoes() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminConfig();

        if (!ativo) {
          return;
        }

        setConfigs(data || {});
      } catch (error) {
        console.error("Erro ao carregar configurações administrativas:", error);

        if (ativo) {
          setError("Não foi possível carregar as configurações.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarConfiguracoes();

    return () => {
      ativo = false;
    };
  }, []);

  /**
   * Organiza os campos por categoria.
   */
  const categorias = useMemo(() => {
    const agrupadas = {};

    Object.entries(configs).forEach(([key, field]) => {
      const categoria = field?.categoria || "Outras";

      if (!agrupadas[categoria]) {
        agrupadas[categoria] = [];
      }

      agrupadas[categoria].push({
        key,
        ...field,
      });
    });

    return agrupadas;
  }, [configs]);

  /**
   * Converte valores do tipo lista em itens visuais.
   */
  const obterItensLista = (field) => {
    if (field?.tipo !== "list" || typeof field.valor !== "string") {
      return [];
    }

    const separador = field.separador || "|";

    return field.valor
      .split(separador)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  /**
   * Renderiza o valor de acordo com o tipo definido
   * pelo ConfigAdminSchema.
   */
  const renderValor = (field) => {
    if (field?.tipo === "list") {
      const itens = obterItensLista(field);

      if (itens.length === 0) {
        return <span className="text-slate-400">Nenhum item configurado</span>;
      }

      return (
        <div className="flex flex-wrap gap-2">
          {itens.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-3
                py-1
                text-xs
                font-medium
                text-slate-700
              "
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (field?.tipo === "textarea") {
      return (
        <div
          className="
            whitespace-pre-wrap
            rounded-lg
            bg-slate-50
            border
            border-slate-100
            px-3
            py-2.5
            text-sm
            leading-6
            text-slate-700
          "
        >
          {field.valor || <span className="text-slate-400">Não informado</span>}
        </div>
      );
    }

    return (
      <div
        className="
          rounded-lg
          bg-slate-50
          border
          border-slate-100
          px-3
          py-2.5
          text-sm
          text-slate-700
          break-words
        "
      >
        {field?.valor || <span className="text-slate-400">Não informado</span>}
      </div>
    );
  };

  /**
   * Estado de carregamento.
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header
          className="
            bg-white
            border-b
            border-slate-200
            sticky
            top-0
            z-40
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              lg:px-8
              h-16
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h1 className="text-base font-bold text-slate-900">
                Configurações
              </h1>

              <p className="text-xs text-slate-500">
                Carregando configurações...
              </p>
            </div>

            <div
              className="
                h-9
                w-24
                rounded-lg
                bg-slate-100
                animate-pulse
              "
            />
          </div>
        </header>

        <main
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-8
          "
        >
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  bg-white
                  rounded-xl
                  border
                  border-slate-200
                  p-6
                  shadow-sm
                  animate-pulse
                "
              >
                <div className="h-5 w-40 bg-slate-200 rounded mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((field) => (
                    <div key={field}>
                      <div className="h-3 w-28 bg-slate-200 rounded mb-2" />
                      <div className="h-10 bg-slate-100 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          bg-white
          border-b
          border-slate-200
          sticky
          top-0
          z-40
          backdrop-blur-md
          bg-white/95
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            h-16
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-indigo-600
                flex
                items-center
                justify-center
                shadow-sm
              "
            >
              <img
                src="/logoEntreAmigas.webp"
                alt="Entre Amigas Run"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div>
              <h1 className="text-base font-bold text-slate-900">
                Configurações
              </h1>

              <p className="text-xs text-slate-500 font-medium">
                Operador: {adminUser}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              text-sm
              font-semibold
              text-slate-700
              bg-slate-100
              hover:bg-slate-200
              px-3.5
              py-2
              transition
            "
          >
            ← Voltar ao painel
          </button>
        </div>
      </header>

      {/* =====================================================
          MENU
      ====================================================== */}

      <div
        className="
          bg-slate-100
          border-b
          border-slate-200
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-2.5
            flex
            gap-2
            overflow-x-auto
            whitespace-nowrap
          "
        >
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="
              text-slate-600
              hover:text-slate-900
              text-xs
              font-semibold
              px-4
              py-1.5
              rounded-lg
              transition
            "
          >
            📋 Inscrições
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
            className="
              text-slate-600
              hover:text-slate-900
              text-xs
              font-semibold
              px-4
              py-1.5
              rounded-lg
              transition
            "
          >
            ⚙️ Gerenciar Admins
          </button>

          <button
            type="button"
            className="
              bg-white
              text-slate-800
              border
              border-slate-200
              shadow-sm
              text-xs
              font-semibold
              px-4
              py-1.5
              rounded-lg
            "
          >
            🛠️ Configurações
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              text-slate-600
              hover:text-slate-900
              text-xs
              font-semibold
              px-4
              py-1.5
              rounded-lg
              transition
              ml-auto
            "
          >
            🏠 Voltar para Home
          </button>
        </div>
      </div>

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-8
          space-y-6
        "
      >
        {/* Título */}

        <section>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                Configurações do sistema
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Parâmetros informativos atualmente utilizados pelo evento.
              </p>
            </div>

            <div
              className="
                hidden
                sm:inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-emerald-700
              "
            >
              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-emerald-500
                "
              />
              Somente leitura
            </div>
          </div>
        </section>

        {/* Erro */}

        {error && (
          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-700
            "
          >
            ⚠️ {error}
          </div>
        )}

        {/* Categorias */}

        {Object.entries(categorias).map(([categoria, fields]) => (
          <section
            key={categoria}
            className="
                bg-white
                rounded-xl
                border
                border-slate-200
                shadow-sm
                overflow-hidden
              "
          >
            {/* Cabeçalho da categoria */}

            <div
              className="
                  px-5
                  sm:px-6
                  py-4
                  border-b
                  border-slate-200
                  bg-slate-50
                "
            >
              <h3
                className="
                    text-base
                    font-bold
                    text-slate-900
                  "
              >
                {categoria}
              </h3>

              <p
                className="
                    mt-0.5
                    text-xs
                    text-slate-500
                  "
              >
                {fields.length}{" "}
                {fields.length === 1 ? "configuração" : "configurações"}
              </p>
            </div>

            {/* Campos */}

            <div
              className="
                  p-5
                  sm:p-6
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-5
                "
            >
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="
                      rounded-xl
                      border
                      border-slate-200
                      p-4
                      bg-white
                    "
                >
                  <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                        mb-2
                      "
                  >
                    <div>
                      <label
                        className="
                            block
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                      >
                        {field.label}
                      </label>

                      <span
                        className="
                            block
                            mt-0.5
                            text-[11px]
                            text-slate-400
                            font-mono
                          "
                      >
                        {field.key}
                      </span>
                    </div>
                  </div>

                  {renderValor(field)}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
