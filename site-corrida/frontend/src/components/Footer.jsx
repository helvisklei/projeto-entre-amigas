export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="text-center md:text-left">
            <img
              src="/logoEntreAmigas.webp"
              alt="Entre Amigas Logo"
              className="h-24 w-auto mx-auto md:mx-0 mb-4 drop-shadow-lg"
              title="Entre Amigas - Corrida de Mulheres"
            />
            <h3 className="text-2xl font-bold mb-2 drop-shadow">Entre Amigas</h3>
            <p className="text-pink-100 text-sm">
              Celebrando amizade, saúde e superação desde 2022.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="text-center">
            <h4 className="font-bold mb-4 text-white drop-shadow text-lg">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-pink-50">
              <li>
                <a href="#about" className="hover:text-white transition font-semibold">
                  Sobre o Evento
                </a>
              </li>
              <li>
                <a href="#eventos" className="hover:text-white transition font-semibold">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#regras" className="hover:text-white transition font-semibold">
                  Regras
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition font-semibold">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="text-center md:text-right">
            <h4 className="font-bold mb-4 text-white drop-shadow text-lg">Siga-nos</h4>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="#instagram"
                className="text-white hover:text-yellow-200 transition text-3xl drop-shadow"
                title="Instagram"
              >
                📱
              </a>
              <a
                href="#facebook"
                className="text-white hover:text-yellow-200 transition text-3xl drop-shadow"
                title="Facebook"
              >
                👥
              </a>
              <a
                href="#whatsapp"
                className="text-white hover:text-yellow-200 transition text-3xl drop-shadow"
                title="WhatsApp"
              >
                💬
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-pink-400 pt-8 text-center text-sm text-pink-100">
          <p>
            © 2025 <strong className="text-white drop-shadow">Entre Amigas</strong>. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            Desenvolvido por <strong className="text-yellow-200 drop-shadow">HVK PRODUÇÃO - Helvisklei</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
