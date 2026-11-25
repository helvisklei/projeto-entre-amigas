export default function RegulamentoCorrida({ compact = false }) {
  return (
    <div
      className={`
        border border-gray-200
        rounded-xl
        p-5
        bg-slate-50
        ${compact ? "max-h-72" : "max-h-[65vh]"}
        overflow-y-auto
        text-sm
        leading-relaxed
        text-gray-700
        shadow-inner
      `}
    >
      {/* COLE AQUI O CONTEÚDO INTERNO DO REGULAMENTO ORIGINAL */}

      {/* Comece pelo cabeçalho: */}
      <div className="text-center border-b border-gray-200 pb-3 mb-4">
        <h3 className="font-extrabold text-base text-gray-950 tracking-tight">
          📋 REGULAMENTO OFICIAL
        </h3>

        <p className="text-xs text-pink-600 font-bold mt-0.5">
          6ª CORRIDA ENTRE AMIGAS RUN – RECIFE/PE
        </p>
      </div>

      <div className="space-y-5 text-[13px]">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">1. DO EVENTO</h4>
          <p>
            A 6ª Corrida Entre Amigas RUN acontecerá no dia{" "}
            <strong>29 de novembro de 2026</strong>, em Brasília Teimosa –
            Recife/PE.
          </p>
          <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-600">
            <li>
              O percurso será de 5 km, nas modalidades corrida e caminhada.
            </li>
            <li>
              Caso o participante não deseje concluir os 5 km, poderá finalizar
              sua participação no percurso de 3 km.
            </li>
            <li>
              Ao realizar sua inscrição, o atleta declara estar apto fisicamente
              para participar do evento.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">2. DAS INSCRIÇÕES</h4>
          <p>
            A inscrição garante o direito ao kit oficial do evento. As
            inscrições serão encerradas na data divulgada pela organização ou
            quando o limite de vagas for atingido.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            3. DO REPASSE DE INSCRIÇÃO
          </h4>
          <p>
            O repasse da inscrição é de responsabilidade exclusiva do atleta
            inscrito. A organização não realizará intermediação de vendas,
            cobranças ou negociações entre participantes.
          </p>
          <p className="mt-1 text-red-600 font-medium">
            ⚠️ O prazo para solicitar a alteração cadastral é de até 30 dias
            antes do evento, ou seja, até 29 de outubro de 2026. Após essa data
            não serão realizadas alterações de titularidade, tamanho de camisa
            ou dados cadastrais.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            4. CANCELAMENTO E REEMBOLSO
          </h4>
          <p>
            O cancelamento poderá ser solicitado até 30 dias antes da prova.
            Nesses casos, será realizado reembolso correspondente a 50% do valor
            pago pela inscrição.
          </p>
          <p className="mt-1">
            Após esse prazo não haverá devolução de valores, devido aos
            compromissos assumidos com fornecedores, produção de kits, medalhas,
            seguro atleta e demais serviços do evento. O cancelamento deverá ser
            solicitado pelo titular através dos canais oficiais da organização.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">5. ENTREGA DOS KITS</h4>

          <p>
            O local, as datas e os horários para retirada dos kits serão
            divulgados pelos canais oficiais da organização. A retirada deverá
            respeitar o período e os horários estabelecidos.
          </p>

          {/* Orientações para retirada pelo titular ou por terceiros */}
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <h5 className="mb-2 text-sm font-bold text-blue-900">
              📋 DOCUMENTOS NECESSÁRIOS PARA RETIRADA DO KIT
            </h5>

            <p className="mb-2 text-xs text-blue-900">
              Para garantir uma retirada organizada e segura, observe as
              orientações conforme cada situação:
            </p>

            <div className="space-y-3 text-xs text-gray-700">
              <div>
                <p className="mb-1 font-bold text-gray-900">
                  1. Retirada pelo próprio participante
                </p>

                <p>
                  O titular da inscrição deverá apresentar documento oficial de
                  identificação com foto e o Termo de Retirada de Kit
                  devidamente assinado.
                </p>
              </div>

              <div>
                <p className="mb-1 font-bold text-gray-900">
                  2. Retirada por outra pessoa (terceiros)
                </p>

                <p>
                  Caso o titular não possa comparecer, outra pessoa poderá
                  retirar o kit mediante apresentação do Termo de Retirada de
                  Kit, que deverá conter a autorização expressa do titular da
                  inscrição e estar devidamente assinado de forma eletrônica ou
                  manuscrita.
                </p>

                <p className="mt-1">
                  A pessoa autorizada também deverá apresentar documento oficial
                  de identificação com foto.
                </p>
              </div>

              <div>
                <p className="mb-1 font-bold text-gray-900">
                  3. Validação da assinatura eletrônica
                </p>

                <p>
                  Quando o termo for assinado eletronicamente, a organização
                  poderá verificar sua autenticidade por meio do portal oficial
                  do Instituto Nacional de Tecnologia da Informação (ITI):
                </p>

                <p className="mt-1">
                  <a
                    href="https://validar.iti.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 underline"
                  >
                    https://validar.iti.gov.br
                  </a>
                </p>

                <p className="mt-1">
                  Para essa conferência, deverá ser apresentado o arquivo PDF
                  original assinado eletronicamente.
                </p>
              </div>
            </div>
          </div>

          {/* MANTER INTEGRALMENTE O BLOCO EXISTENTE DE ITENS DO KIT */}
          <div className="bg-white border border-gray-200 rounded-lg p-2.5 mt-2">
            <span className="font-semibold text-xs text-gray-900 block mb-1">
              O seu kit poderá conter:
            </span>

            <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-gray-600 pl-2 list-inside">
              <li>✓ Camisa oficial do evento</li>
              <li>✓ Número de peito</li>
              <li>✓ Medalha de participação</li>
              <li>✓ Viseira personalizada</li>
              <li>✓ Seguro atleta</li>
              <li>✓ Café da manhã</li>
              <li>✓ Estrutura de apoio e hidratação</li>
            </ul>
          </div>

          <p className="mt-2 text-xs text-amber-700 font-medium">
            ⚠️ Participantes que não retirarem seus kits nas datas divulgadas
            perderão o direito aos itens, sem reembolso da inscrição.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">6. GUARDA-VOLUME</h4>
          <p className="text-gray-600">
            ⚠️ A organização da 6ª Corrida Entre Amigas RUN não disponibilizará
            serviço de guarda-volume. Cada participante será responsável pelos
            seus pertences antes, durante e após o evento. A organização não se
            responsabiliza por objetos perdidos, esquecidos, danificados ou
            furtados nas dependências do evento. Recomenda-se evitar levar
            objetos de valor.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            7. IDENTIFICAÇÃO DO PARTICIPANTE
          </h4>
          <p>
            📌 O uso do número de peito é obrigatório durante toda a prova,
            devendo permanecer visível na parte frontal do corpo. A medalha de
            participação será entregue apenas aos atletas regularmente inscritos
            que concluírem o percurso e estiverem devidamente identificados com
            o número de peito. Atletas sem número de peito não poderão receber
            medalha, participar da classificação, premiações ou usufruir dos
            benefícios oferecidos aos participantes identificados. A organização
            não se responsabiliza por números de peito perdidos, esquecidos ou
            danificados após a entrega do kit.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">8. PREMIAÇÃO</h4>
          <p>
            As categorias de premiação serão: Geral Masculino (5 km), Geral
            Feminino (5 km), Categoria PCD (5 km) e Categoria 60+ (5 km).
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Havendo quantidade suficiente de inscritos, as categorias PCD e 60+
            poderão ter premiação separada para Masculino e Feminino. Não
            havendo quantitativo suficiente de inscritos, a premiação será
            realizada em categoria única, independentemente do gênero. A
            organização reserva-se o direito de criar, unificar, dividir ou
            ajustar categorias de premiação conforme a quantidade de
            participantes inscritos.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            9. BENEFÍCIO LEGAL (60+, PCD e TEA)
          </h4>

          <p>
            Em conformidade com a legislação vigente, participantes enquadrados
            nas categorias Pessoa Idosa (60+), Pessoa com Deficiência (PCD) e
            Pessoa com Transtorno do Espectro Autista (TEA) poderão solicitar o
            benefício legal correspondente ao desconto previsto pela legislação.
          </p>

          <p className="mt-2">
            O benefício incide{" "}
            <strong>exclusivamente sobre o valor da inscrição do evento</strong>
            , não sendo aplicado aos itens físicos que compõem o kit do
            participante.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
            <p className="font-semibold text-amber-800 mb-2">
              O desconto não é aplicado sobre:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-amber-900">
              <li>Camisa oficial;</li>
              <li>Medalha;</li>
              <li>Número de peito;</li>
              <li>Ecobag;</li>
              <li>Viseira;</li>
              <li>Demais brindes e materiais do kit.</li>
            </ul>
          </div>

          <p className="mt-3">
            O valor final da inscrição será composto pela soma do valor da
            inscrição (com ou sem o benefício legal) acrescido do valor integral
            do kit escolhido pelo participante.
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Os valores apresentados durante a inscrição são calculados
            automaticamente conforme o lote vigente e os benefícios aplicáveis.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            10. RESPONSABILIDADES DO PARTICIPANTE
          </h4>
          <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-600">
            <li>Respeitar o percurso e as orientações da organização.</li>
            <li>
              Seguir as recomendações da equipe de apoio e dos agentes de
              trânsito.
            </li>
            <li>
              Atalhos, fraudes ou condutas inadequadas poderão resultar em
              desclassificação.
            </li>
            <li>
              Todos os participantes inscritos estarão cobertos pelo seguro
              atleta contratado pela organização.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            11. DISPOSIÇÕES GERAIS
          </h4>
          <p>
            Ao efetuar sua inscrição, o participante declara estar de acordo com
            este regulamento. A organização poderá realizar ajustes necessários
            por motivos de segurança, logística, determinação dos órgãos
            públicos ou casos de força maior. Os casos omissos serão analisados
            e decididos exclusivamente pela organização da 6ª Corrida Entre
            Amigas RUN.
          </p>
          <p className="mt-2 text-pink-600 font-semibold text-center text-xs">
            💖 Nosso objetivo é proporcionar uma experiência segura, acolhedora,
            inclusiva e inesquecível para todos os participantes.
          </p>
        </div>
      </div>
    </div>
  );
}
