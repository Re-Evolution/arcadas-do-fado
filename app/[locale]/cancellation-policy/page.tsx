import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de Cancelamento',
  description: 'Política de cancelamento de reservas do restaurante Arcadas do Fado em Almancil.',
  robots: { index: false },
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function CancellationPolicy({ params }: PageProps) {
  const { locale } = await params

  return (
    <LegalLayout title="Política de Cancelamento" lastUpdated="Janeiro 2025" locale={locale}>
      <h2>1. Cancelamento de Reservas Individuais</h2>

      <h3>Aviso com antecedência mínima de 24 horas</h3>
      <p>
        Solicitamos que qualquer cancelamento ou alteração de reserva seja comunicado com pelo menos <strong>24 horas de antecedência</strong>, por forma a permitirmos a gestão adequada do espaço e da nossa equipa.
      </p>

      <h3>Como cancelar</h3>
      <p>O cancelamento pode ser feito através de:</p>
      <ul>
        <li>WhatsApp: <a href="https://wa.me/351919457238">+351 919 457 238</a></li>
        <li>Telefone: <a href="tel:+351289398113">+351 289 398 113</a></li>
        <li>Email: <a href="mailto:geral@arcadasdofado.com">geral@arcadasdofado.com</a></li>
      </ul>

      <h2>2. Política de No-Show</h2>
      <p>
        Em caso de não comparência sem aviso prévio (no-show), a mesa reservada poderá ser cedida a outros clientes após 30 minutos do horário de reserva confirmado. Reservamo-nos o direito de registar clientes com histórico de no-show e recusar futuras reservas.
      </p>

      <h2>3. Eventos Privados</h2>
      <h3>Reservas de grupo (20 ou mais pessoas) — Terça a Quinta</h3>
      <p>
        Para reservas de grupos de 20 ou mais pessoas em dias de semana (Terça a Quinta), aplicam-se condições especiais:
      </p>
      <ul>
        <li>Cancelamento com mais de <strong>72 horas</strong> de antecedência: sem encargos</li>
        <li>Cancelamento com menos de 72 horas: poderá ser cobrada uma taxa administrativa</li>
        <li>No-show para grupos: poderá ser faturado um valor mínimo correspondente a 50% do menu acordado</li>
      </ul>

      <h3>Eventos privados exclusivos</h3>
      <p>
        Para eventos privados que impliquem a reserva exclusiva do espaço (casamentos, eventos empresariais, etc.), as condições de cancelamento específicas serão acordadas e formalizadas no momento da reserva. Recomendamos a contratação de um seguro de evento.
      </p>

      <h2>4. Força Maior</h2>
      <p>
        Em situações de força maior (calamidade, doença grave documentada, etc.), analisaremos cada caso individualmente e procuraremos encontrar a melhor solução para ambas as partes — nomeadamente reagendamento da reserva sem encargos.
      </p>

      <h2>5. Alterações pelo Restaurante</h2>
      <p>
        Em caso de encerramento imprevisto por razões de força maior ou situações fora do nosso controlo, contactaremos os clientes com reserva com a máxima brevidade possível e, sempre que possível, proporemos datas alternativas.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para qualquer questão sobre cancelamentos ou alterações:<br />
        WhatsApp/Telemóvel: <a href="https://wa.me/351919457238">+351 919 457 238</a><br />
        Telefone: <a href="tel:+351289398113">+351 289 398 113</a><br />
        Email: <a href="mailto:geral@arcadasdofado.com">geral@arcadasdofado.com</a>
      </p>
    </LegalLayout>
  )
}
