import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import Header from '@/components/ui/Header'
import Hero from '@/components/sections/Hero'

const Footer = dynamic(() => import('@/components/ui/Footer'))
const CookieBanner = dynamic(() => import('@/components/ui/CookieBanner'))
const Espaco = dynamic(() => import('@/components/sections/Espaco'))
const Fado = dynamic(() => import('@/components/sections/Fado'))
const Menu = dynamic(() => import('@/components/sections/Menu'))
const Reservas = dynamic(() => import('@/components/sections/Reservas'))
const Testemunhos = dynamic(() => import('@/components/sections/Testemunhos'))
const Contactos = dynamic(() => import('@/components/sections/Contactos'))

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  await getTranslations({ locale })

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Espaco />
        <Fado />
        <Menu />
        <Reservas />
<Testemunhos />
        <Contactos />
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
