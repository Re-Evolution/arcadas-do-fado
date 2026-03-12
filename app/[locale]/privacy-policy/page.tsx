import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade do restaurante Arcadas do Fado em conformidade com o RGPD.',
  robots: { index: false },
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPolicy({ params }: PageProps) {
  const { locale } = await params

  return (
    <LegalLayout title="Política de Privacidade" lastUpdated="Janeiro 2025" locale={locale}>
      <h2>1. Identificação do Responsável pelo Tratamento</h2>
      <p>
        <strong>Arcadas do Fado</strong><br />
        Av. 5 de Outubro 85, 8135-100 Almancil, Portugal<br />
        Email: <a href="mailto:geral@arcadasdofado.com">geral@arcadasdofado.com</a><br />
        Telefone: <a href="tel:+351289398113">+351 289 398 113</a>
      </p>

      <h2>2. Dados Pessoais Recolhidos</h2>
      <h3>2.1 Dados fornecidos através do formulário de reserva:</h3>
      <ul>
        <li>Nome completo</li>
        <li>Endereço de email</li>
        <li>Número de telefone / WhatsApp</li>
        <li>Data e hora da reserva pretendida</li>
        <li>Número de pessoas</li>
        <li>Ocasião especial (opcional)</li>
        <li>Observações / pedidos especiais (opcional)</li>
      </ul>

      <h3>2.2 Dados recolhidos automaticamente:</h3>
      <ul>
        <li>Endereço IP (para segurança e rate limiting)</li>
        <li>Dados de navegação via cookies analíticos (com consentimento)</li>
        <li>Idioma e preferências do browser</li>
      </ul>

      <h2>3. Finalidade e Base Legal do Tratamento</h2>
      <ul>
        <li>
          <strong>Processamento de reservas:</strong> Base legal — execução de contrato (Art.&nbsp;6.º, n.º&nbsp;1, al.&nbsp;b) do RGPD). Os seus dados são necessários para processar e confirmar a sua reserva.
        </li>
        <li>
          <strong>Analytics e melhoria do site:</strong> Base legal — consentimento (Art.&nbsp;6.º, n.º&nbsp;1, al.&nbsp;a) do RGPD). Apenas após obter o seu consentimento explícito através do banner de cookies.
        </li>
        <li>
          <strong>Segurança:</strong> Base legal — interesse legítimo (Art.&nbsp;6.º, n.º&nbsp;1, al.&nbsp;f) do RGPD). Proteção contra spam e ataques.
        </li>
      </ul>

      <h2>4. Destinatários e Subcontratantes</h2>
      <p>Os seus dados poderão ser partilhados com os seguintes prestadores de serviços, exclusivamente para os fins indicados:</p>
      <ul>
        <li><strong>Vercel Inc.</strong> (EUA) — Alojamento do website</li>
        <li><strong>Google LLC</strong> (EUA) — Google Analytics 4 (apenas com consentimento)</li>
        <li><strong>Microsoft Corporation</strong> (EUA) — Microsoft Clarity (apenas com consentimento)</li>
        <li><strong>Telegram Messenger Inc.</strong> — Notificações internas de reservas</li>
        <li><strong>Fornecedor SMTP</strong> — Envio de emails de confirmação</li>
      </ul>

      <h2>5. Transferências Internacionais</h2>
      <p>
        Alguns dos nossos subcontratantes estão estabelecidos nos EUA. As transferências realizam-se ao abrigo de mecanismos adequados, nomeadamente cláusulas contratuais tipo aprovadas pela Comissão Europeia (Art.&nbsp;46.º do RGPD) ou no âmbito do Data Privacy Framework EU-EUA.
      </p>

      <h2>6. Prazo de Conservação</h2>
      <ul>
        <li>Dados de reservas: 12 meses após a data da reserva</li>
        <li>Dados analíticos: conforme política de retenção do Google Analytics (14 meses)</li>
        <li>Registos de segurança (IPs): 30 dias</li>
      </ul>

      <h2>7. Direitos do Titular dos Dados</h2>
      <p>Nos termos do RGPD, tem direito a:</p>
      <ul>
        <li><strong>Acesso:</strong> obter confirmação sobre o tratamento dos seus dados e aceder aos mesmos</li>
        <li><strong>Retificação:</strong> corrigir dados inexatos ou incompletos</li>
        <li><strong>Apagamento:</strong> solicitar a eliminação dos seus dados ("direito a ser esquecido")</li>
        <li><strong>Limitação:</strong> restringir o tratamento dos seus dados em determinadas circunstâncias</li>
        <li><strong>Portabilidade:</strong> receber os seus dados num formato estruturado e legível por máquina</li>
        <li><strong>Oposição:</strong> opor-se ao tratamento baseado em interesses legítimos</li>
        <li><strong>Retirar consentimento:</strong> a qualquer momento, sem prejuízo da licitude do tratamento efetuado até essa data</li>
      </ul>
      <p>
        Para exercer os seus direitos, contacte-nos através de <a href="mailto:geral@arcadasdofado.com">geral@arcadasdofado.com</a>. Responderemos no prazo de 30 dias.
      </p>
      <p>
        Tem ainda o direito de apresentar reclamação à <strong>CNPD — Comissão Nacional de Proteção de Dados</strong> (<a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">www.cnpd.pt</a>).
      </p>

      <h2>8. Segurança</h2>
      <p>
        Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados, incluindo: transmissão HTTPS, cabeçalhos de segurança HTTP, rate limiting, sanitização de inputs e honeypot anti-spam.
      </p>

      <h2>9. Menores</h2>
      <p>
        O nosso site não se destina a menores de 16 anos. Não recolhemos conscientemente dados pessoais de menores. Se tiver conhecimento de que um menor nos forneceu dados, contacte-nos para que possamos proceder à sua eliminação.
      </p>

      <h2>10. Alterações à Política de Privacidade</h2>
      <p>
        Podemos atualizar esta Política de Privacidade periodicamente. As alterações significativas serão comunicadas através de aviso no site. Recomendamos que consulte esta página regularmente.
      </p>
    </LegalLayout>
  )
}
