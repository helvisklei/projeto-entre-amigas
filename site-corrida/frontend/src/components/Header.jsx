import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="hidden sm:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Entre Amigas
          </h1>
          {/* <p className="text-xs text-gray-600">5ª Edição 2026</p> */} {/* Commented out for future use */}
        </div>

        {/* Navigation (Future) */}
        <nav className="hidden lg:flex gap-6 text-gray-700">
          <a href="#sobre" className="hover:text-pink-600 transition">
            Sobre
          </a>
          <a href="#eventos" className="hover:text-pink-600 transition">
            Eventos
          </a>  
          <a href="#depoimentos" className="hover:text-pink-600 transition">
            Depoimentos
          </a>
          <a href="#contato" className="hover:text-pink-600 transition">
            Contato
          </a>
          <a href="#regras" className="hover:text-pink-600 transition">
            Regras
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-gray-700 hover:text-pink-600"
          title="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-pink-50 to-purple-50 px-4 py-4 border-t border-pink-200">
          <a href="#sobre" className="block py-2 text-gray-700 hover:text-pink-600">
            Sobre
          </a>
          <a href="#eventos" className="block py-2 text-gray-700 hover:text-pink-600">
            Eventos
          </a>
          <a href="#depoimentos" className="block py-2 text-gray-700 hover:text-pink-600">
            Depoimentos
          </a>
          <a href="#contato" className="block py-2 text-gray-700 hover:text-pink-600">
            Contato
          </a>
          <a href="#regras" className="block py-2 text-gray-700 hover:text-pink-600">
            Regras
          </a>
        </div>
      )}
    </header>
  );
}
