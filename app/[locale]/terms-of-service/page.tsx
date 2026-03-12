import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'

export const metadata: Metadata = {
  title: 'Termos de Serviço',
  description: 'Termos e Condições de utilização do website e serviços do restaurante Arcadas do Fado.',
  robots: { index: false },
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function TermsOfService({ params }: PageProps) {
  const { locale } = await params

  return (
    <LegalLayout title="Termos de Serviço" lastUpdated="Janeiro 2025" locale={locale}>
      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao aceder e utilizar o website das Arcadas do Fado (<a href="https://arcadasdofado.com">arcadasdofado.com</a>), declara ter lido, compreendido e aceite os presentes Termos de Serviço. Se não concordar com estes termos, não deverá utilizar o nosso website.
      </p>

      <h2>2. Descrição dos Serviços</h2>
      <p>
        O website das Arcadas do Fado disponibiliza informação sobre o restaurante, o espetáculo de fado ao vivo, a ementa, o horário de funcionamento e permite efetuar pedidos de reserva. A Arcadas do Fado é um restaurante com espetáculo de fado ao vivo, localizado na Av. 5 de Outubro 85, 8135-100 Almancil, Algarve, Portugal.
      </p>

      <h2>3. Sistema de Reservas</h2>
      <h3>3.1 Pedidos de reserva</h3>
      <p>
        O formulário de reserva disponível no website constitui um <strong>pedido de reserva</strong> e não uma reserva confirmada. A reserva só fica confirmada após contacto da nossa parte (por WhatsApp, telefone ou email).
      </p>

      <h3>3.2 Horário e disponibilidade</h3>
      <ul>
        <li><strong>Sexta e Sábado:</strong> 20h00 – 23h45 (espetáculo de fado às 21h30)</li>
        <li><strong>Terça a Quinta:</strong> reservas exclusivamente para grupos com 20 ou mais pessoas</li>
        <li><strong>Domingo e Segunda:</strong> encerrado</li>
      </ul>

      <h3>3.3 Cancelamentos</h3>
      <p>
        Em caso de necessidade de cancelamento ou alteração da reserva, pedimos que nos contacte com a maior antecedência possível, preferencialmente com pelo menos 24 horas de antecedência. Para grupos, consulte a nossa <a href={`/${locale}/cancellation-policy`}>Política de Cancelamento</a>.
      </p>

      <h2>4. Espetáculo de Fado</h2>
      <p>
        O espetáculo de fado ao vivo realiza-se às Sextas e Sábados com início às 21h30, sujeito a um cover charge de 5,00&nbsp;€ por pessoa. A programação dos artistas poderá ser alterada por razões de força maior. A Arcadas do Fado não se responsabiliza por quaisquer expectativas não satisfeitas relativamente à programação artística.
      </p>

      <h2>5. Uso do Website</h2>
      <p>O utilizador compromete-se a não:</p>
      <ul>
        <li>Utilizar o website para fins ilegais ou não autorizados</li>
        <li>Submeter informações falsas nos formulários</li>
        <li>Tentar aceder a áreas restritas do website</li>
        <li>Interferir com o funcionamento normal do website</li>
        <li>Utilizar meios automatizados (bots, scrapers) sem autorização prévia</li>
      </ul>

      <h2>6. Propriedade Intelectual</h2>
      <p>
        Todo o conteúdo do website — textos, imagens, logótipos, design, código — é propriedade da Arcadas do Fado ou dos seus licenciadores e está protegido pela legislação de propriedade intelectual aplicável. É proibida a reprodução, distribuição ou utilização sem autorização prévia por escrito.
      </p>

      <h2>7. Limitação de Responsabilidade</h2>
      <p>
        A Arcadas do Fado não garante a disponibilidade ininterrupta do website. Não nos responsabilizamos por danos resultantes de erros, omissões ou interrupções do website. As informações presentes no website são fornecidas a título informativo e poderão ser alteradas sem aviso prévio.
      </p>

      <h2>8. Lei Aplicável e Jurisdição</h2>
      <p>
        Os presentes Termos de Serviço são regidos pela lei portuguesa. Quaisquer litígios emergentes da utilização do website ou dos nossos serviços serão submetidos à jurisdição exclusiva dos Tribunais da Comarca de Loulé, com expressa renúncia a qualquer outra jurisdição.
      </p>

      <h2>9. Alterações aos Termos</h2>
      <p>
        Reservamo-nos o direito de alterar estes Termos de Serviço a qualquer momento. As alterações serão publicadas nesta página com a respetiva data de atualização. O uso continuado do website após a publicação das alterações implica a aceitação dos novos termos.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para qualquer questão relacionada com estes Termos:<br />
        Email: <a href="mailto:geral@arcadasdofado.com">geral@arcadasdofado.com</a><br />
        Telefone: <a href="tel:+351289398113">+351 289 398 113</a>
      </p>
    </LegalLayout>
  )
}
