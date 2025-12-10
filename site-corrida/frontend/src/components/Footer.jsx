export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="text-center md:text-left">
            <img
              src="/logoEntreAmigas.webp"
              alt="Entre Amigas Logo"
              className="h-16 w-auto mx-auto md:mx-0 mb-4"
              title="Entre Amigas - Corrida de Mulheres"
            />
            <h3 className="text-xl font-bold mb-2">Entre Amigas</h3>
            <p className="text-gray-400 text-sm">
              Celebrando amizade, saúde e superação desde 2022.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="text-center">
            <h4 className="font-bold mb-4 text-pink-400">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#about" className="hover:text-pink-400 transition">
                  Sobre o Evento
                </a>
              </li>
              <li>
                <a href="#eventos" className="hover:text-pink-400 transition">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#regras" className="hover:text-pink-400 transition">
                  Regras
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-pink-400 transition">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="text-center md:text-right">
            <h4 className="font-bold mb-4 text-pink-400">Siga-nos</h4>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="#instagram"
                className="text-gray-400 hover:text-pink-400 transition text-2xl"
                title="Instagram"
              >
                📱
              </a>
              <a
                href="#facebook"
                className="text-gray-400 hover:text-pink-400 transition text-2xl"
                title="Facebook"
              >
                👥
              </a>
              <a
                href="#whatsapp"
                className="text-gray-400 hover:text-pink-400 transition text-2xl"
                title="WhatsApp"
              >
                💬
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            © 2025 <strong className="text-white">Entre Amigas</strong>. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            Desenvolvido por <strong className="text-pink-400">HVK PRODUÇÃO - Helvisklei</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
