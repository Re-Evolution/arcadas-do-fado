import { getTranslations } from 'next-intl/server'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import CookieBanner from '@/components/ui/CookieBanner'
import Hero from '@/components/sections/Hero'
import Espaco from '@/components/sections/Espaco'
import Fado from '@/components/sections/Fado'
import Menu from '@/components/sections/Menu'
import Reservas from '@/components/sections/Reservas'
import Testemunhos from '@/components/sections/Testemunhos'
import Contactos from '@/components/sections/Contactos'

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
