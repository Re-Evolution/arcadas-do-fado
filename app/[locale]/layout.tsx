import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { clientData } from '@/data/client-info'
import '../globals.css'

type Locale = 'pt' | 'en' | 'fr' | 'de' | 'es'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const localeNames: Record<Locale, string> = {
  pt: 'pt-PT',
  en: 'en-GB',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const siteUrl = clientData.seo.siteUrl

  const alternates: Record<string, string> = {}
  routing.locales.forEach((loc) => {
    alternates[loc] = `${siteUrl}/${loc}`
  })

  return {
    title: {
      default: t('title'),
      template: `%s | Arcadas do Fado`,
    },
    description: t('description'),
    keywords: t('keywords'),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      locale: localeNames[locale as Locale] ?? 'pt-PT',
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => localeNames[l as Locale]),
      url: `${siteUrl}/${locale}`,
      siteName: 'Arcadas do Fado',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: `${siteUrl}${clientData.seo.ogImage}`,
          width: 1200,
          height: 630,
          alt: 'Arcadas do Fado — Restaurante com Fado ao Vivo em Almancil, Algarve',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${siteUrl}${clientData.seo.twitterImage}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    icons: {
      icon: { url: '/images/logo/logo-black-no-background.png', type: 'image/png' },
      apple: { url: '/images/logo/logo-black-no-background.png', type: 'image/png' },
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  const schemaRestaurant = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Arcadas do Fado',
    description: 'Restaurante com fado ao vivo em Almancil, Algarve. Gastronomia portuguesa tradicional e espetáculo de fado ao vivo.',
    url: `${clientData.seo.siteUrl}/${locale}`,
    telephone: clientData.contact.phone,
    email: clientData.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. 5 de Outubro 85',
      postalCode: '8135-100',
      addressLocality: 'Almancil',
      addressRegion: 'Algarve',
      addressCountry: 'PT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.072,
      longitude: -8.163,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '20:00',
        closes: '23:45',
      },
    ],
    servesCuisine: 'Gastronomia Portuguesa',
    priceRange: '€€€',
    hasMap: clientData.contact.googleMaps,
    sameAs: [clientData.social.facebook, clientData.social.instagram],
    image: `${clientData.seo.siteUrl}${clientData.seo.ogImage}`,
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card',
  }

  const schemaEvent = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Fado ao Vivo — Arcadas do Fado',
    description: 'Espetáculo de fado ao vivo com fadistas convidados, dois guitarristas portugueses e Alexandra.',
    location: {
      '@type': 'Place',
      name: 'Arcadas do Fado',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. 5 de Outubro 85',
        postalCode: '8135-100',
        addressLocality: 'Almancil',
        addressCountry: 'PT',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Arcadas do Fado',
      url: clientData.seo.siteUrl,
    },
    eventSchedule: {
      '@type': 'Schedule',
      byDay: ['https://schema.org/Friday', 'https://schema.org/Saturday'],
      startTime: '21:30',
    },
    offers: {
      '@type': 'Offer',
      price: '5.00',
      priceCurrency: 'EUR',
      url: `${clientData.seo.siteUrl}/${locale}#reservas`,
    },
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaRestaurant) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEvent) }}
        />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Saltar para o conteúdo principal
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
