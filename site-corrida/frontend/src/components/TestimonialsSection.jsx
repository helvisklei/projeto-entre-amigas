import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentEventId] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/testimonials/${currentEventId}`
      );
      setTestimonials(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar depoimentos:', err); 
      /*'1º lugar feminino'*/      
      setTestimonials([
        {
          id: 1,
          nome: 'Dayana',
          categoria: 'Feminino', 
          depoimento: 'Eu conheci a família entre amigas através das redes sociais. Resolvi entrar em contato e obtive um retorno imediato. Denise que é a responsável  me acolheu e explicou tudo direitinho. Através do grupo consegui melhorar minha ansiedade e hoje sou uma pessoa extremamente ativa. Me sinto orgulhosa em saber que agora estou inspirando outras mulheres a correr..',
          genero: 'F',
          posicao: 1
        },
        {
          id: 2,
          nome: 'Carlos Santos',
          categoria: 'Masculino',
          depoimento: 'Uma corrida repleta de energia e solidariedade. Voltarei com certeza!',
          genero: 'M',
          posicao: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [currentEventId]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Carregando depoimentos...</p>
      </div>
    );
  }

  return (
    <section id= "depoimentos" className="py-12 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-purple-600">
          ⭐ Depoimentos dos Atletas   {/*Depoimentos dos Vencedores*/}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Destaque dos atletas {/*Destaque dos atletas que chegaram em 1º lugar*/}
        </p>

        {testimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>Nenhum depoimento disponível ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials
              .filter((t) => t.posicao === 1)
              .sort((a, b) => {
                if (a.genero === 'F' && b.genero !== 'F') return -1;
                if (a.genero !== 'F' && b.genero === 'F') return 1;
                return 0;
              })
              .map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-yellow-400"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {testimonial.genero === 'F' ? '👩' : '👨'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-600">
                        {testimonial.nome}
                      </h3>
                      <p className="text-sm text-yellow-600 font-semibold">
                        🏃‍♀️ {testimonial.categoria} {/*🏆*/}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 italic text-lg leading-relaxed">
                    "{testimonial.depoimento}"
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
