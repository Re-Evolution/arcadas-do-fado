import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'
import CookieSettingsLink from '@/components/ui/CookieSettingsLink'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de Cookies do website das Arcadas do Fado — informação sobre cookies utilizados e como geri-los.',
  robots: { index: false },
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function CookiePolicy({ params }: PageProps) {
  const { locale } = await params

  return (
    <LegalLayout title="Política de Cookies" lastUpdated="Janeiro 2025" locale={locale}>
      <p>
        O website das Arcadas do Fado utiliza cookies e tecnologias similares para melhorar a sua experiência de navegação. Esta política explica o que são cookies, quais utilizamos e como pode geri-los.
      </p>

      <h2>1. O que são cookies?</h2>
      <p>
        Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website. Permitem que o site recorde as suas preferências e informações, tornando a navegação mais eficiente e personalizada.
      </p>

      <h2>2. Cookies que utilizamos</h2>

      <h3>2.1 Estritamente Necessários (sempre ativos)</h3>
      <p>Essenciais para o funcionamento básico do site. Não requerem consentimento.</p>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Fornecedor</th>
            <th>Finalidade</th>
            <th>Duração</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>arcadas_cookie_consent</td>
            <td>Arcadas do Fado</td>
            <td>Armazena as preferências de cookies do utilizador</td>
            <td>1 ano</td>
          </tr>
          <tr>
            <td>NEXT_LOCALE</td>
            <td>Arcadas do Fado</td>
            <td>Memoriza a língua selecionada</td>
            <td>Sessão</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 Analíticos (requerem consentimento)</h3>
      <p>Permitem-nos compreender como os visitantes utilizam o site.</p>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Fornecedor</th>
            <th>Finalidade</th>
            <th>Duração</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga, _ga_*</td>
            <td>Google Analytics 4</td>
            <td>Análise de tráfego e comportamento dos utilizadores</td>
            <td>2 anos</td>
          </tr>
          <tr>
            <td>_gcl_au</td>
            <td>Google</td>
            <td>Medição de conversões</td>
            <td>3 meses</td>
          </tr>
          <tr>
            <td>_clck, _clsk, CLID</td>
            <td>Microsoft Clarity</td>
            <td>Heatmaps e análise de sessões</td>
            <td>1 ano / sessão</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Como gerir os cookies</h2>

      <h3>3.1 Nas definições do site</h3>
      <p>
        Pode alterar as suas preferências de cookies a qualquer momento clicando em <CookieSettingsLink /> abaixo ou no rodapé do site.
      </p>

      <h3>3.2 No seu browser</h3>
      <p>Pode também configurar o seu browser para bloquear ou eliminar cookies:</p>
      <ul>
        <li><strong>Chrome:</strong> Definições → Privacidade e segurança → Cookies</li>
        <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies</li>
        <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
        <li><strong>Edge:</strong> Definições → Privacidade → Cookies</li>
      </ul>
      <p>
        Note que desativar cookies essenciais pode afetar o funcionamento do site.
      </p>

      <h2>4. Do Not Track (DNT)</h2>
      <p>
        Respeitamos o sinal Do Not Track (DNT) configurado no seu browser. Se tiver o DNT ativo, não carregaremos cookies analíticos ou de marketing, independentemente do consentimento dado.
      </p>

      <h2>5. Transferências internacionais</h2>
      <p>
        Alguns dos nossos fornecedores de cookies (Google, Microsoft) estão estabelecidos nos EUA. As transferências realizam-se ao abrigo de mecanismos adequados, conforme descrito na nossa <a href={`/${locale}/privacy-policy`}>Política de Privacidade</a>.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para questões sobre cookies ou esta política:<br />
        Email: <a href="mailto:geral@arcadasdofado.com">geral@arcadasdofado.com</a>
      </p>
    </LegalLayout>
  )
}
