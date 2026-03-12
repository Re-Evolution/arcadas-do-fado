import Link from 'next/link'
import CookieBanner from './CookieBanner'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
  locale: string
}

export default function LegalLayout({ title, lastUpdated, children, locale }: LegalLayoutProps) {
  return (
    <>
      <main id="main-content" className="pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 font-sans text-sm text-rust hover:text-rust-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao início
            </Link>
          </div>

          <article className="prose prose-lg max-w-none">
            <h1 className="font-display text-4xl md:text-5xl text-text font-light mb-3">{title}</h1>
            <p className="font-sans text-sm text-text/40 mb-10">Última atualização: {lastUpdated}</p>
            <div className="font-body text-text/80 leading-relaxed space-y-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-text [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-sans [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-6 [&_h3]:mb-2 [&_a]:text-rust [&_a]:underline [&_a]:hover:text-rust-dark [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1.5 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-cream [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-sans [&_th]:text-sm [&_th]:font-semibold [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-b [&_td]:border-cream [&_td]:text-sm">
              {children}
            </div>
          </article>
        </div>
      </main>
      <CookieBanner />
    </>
  )
}
