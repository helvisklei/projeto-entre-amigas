import "../styles/loading-screen.css";

export default function LoadingScreen({ error = false, onRetry }) {
  return (
    <main className="loading-screen" aria-busy={!error} aria-live="polite">
      <picture className="loading-screen__picture">
        <source media="(max-width: 640px)" srcSet="/loading-mobile.png" />

        <img
          src="/loading-desktop.png"
          alt=""
          className="loading-screen__artwork"
          fetchPriority="high"
        />
      </picture>

      <div className="loading-screen__overlay">
        <header className="loading-screen__brand">
          <span className="loading-screen__brand-name">Entre Amigas Run</span>
          <span className="loading-screen__tagline">
            Entre amigas, cada passo é especial.
          </span>
        </header>

        <section className="loading-screen__message">
          {error ? (
            <>
              <h1>Estamos com uma dificuldade.</h1>
              <p>
                Não foi possível carregar as informações. Verifique sua conexão
                e tente novamente.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="loading-screen__button"
              >
                Tentar novamente
              </button>
            </>
          ) : (
            <>
              <h1>Estamos preparando tudo para você!</h1>
              <p>Aguarde só um instante.</p>
              <div
                className="loading-screen__progress"
                role="progressbar"
                aria-label="Carregando o site"
              >
                <span />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
