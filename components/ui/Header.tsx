'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'
import { trackNavigation, trackCTA } from '@/lib/analytics'

const navItems = [
  { key: 'espaco', href: '#espaco' },
  { key: 'fado', href: '#fado' },
  { key: 'reservas', href: '#reservas' },
  { key: 'contactos', href: '#contactos' },
]

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, key: string, href: string) => {
    e.preventDefault()
    trackNavigation(key)
    // Immediately clear body overflow so the page can scroll to the anchor
    document.body.style.overflow = ''
    setMenuOpen(false)
    // Small delay so the menu closes before scrolling
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const handleReserve = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    trackCTA('Reservar Mesa', 'header', '#reservas')
    document.body.style.overflow = ''
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.querySelector('#reservas')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'top-3 mx-4 sm:mx-8 lg:mx-16 rounded-2xl header-blur bg-white/60 border border-cream/50 shadow-2xl py-2'
          : menuOpen
            ? 'top-0 header-blur bg-white/90 border-b border-cream/60 shadow-sm py-2'
            : 'top-0 bg-transparent py-4'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            aria-label="Arcadas do Fado — Página inicial"
            onClick={() => trackNavigation('logo')}
          >
            <Logo
              className={`transition-all duration-500 ${scrolled ? 'h-14' : menuOpen ? 'h-16' : 'h-24'}`}
              isDark={!scrolled && !menuOpen}
            />
          </Link>

          {/* Mobile CTA — absolutely centered relative to header width */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:hidden">
            <a
              href="#reservas"
              onClick={handleReserve}
              className="btn-primary text-sm px-4 py-2"
              aria-label="Reservar mesa no restaurante Arcadas do Fado"
            >
              {t('reservarMesa')}
            </a>
          </div>

          {/* Desktop nav */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1">
            {navItems.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={(e) => handleNavClick(e, key, href)}
                className={`px-4 py-2 font-sans text-xl lg:text-2xl font-medium rounded-lg transition-colors duration-200 ${
                  scrolled
                    ? 'text-text/70 hover:text-text hover:bg-cream/60'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {t(key as keyof ReturnType<typeof t>)}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher isDark={!scrolled && !menuOpen} className="hidden sm:block" />

            <a
              href="#reservas"
              onClick={handleReserve}
              className="btn-primary text-sm px-5 py-2.5 hidden sm:inline-flex"
              aria-label="Reservar mesa no restaurante Arcadas do Fado"
            >
              {t('reservarMesa')}
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                scrolled || menuOpen
                  ? 'text-text hover:bg-cream'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="sr-only">{menuOpen ? 'Fechar' : 'Menu'}</span>
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white border-t border-cream/60"
          >
            <nav
              aria-label="Menu mobile"
              className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1"
            >
              {navItems.map(({ key, href }, i) => (
                <motion.a
                  key={key}
                  href={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={(e) => handleNavClick(e, key, href)}
                  className="px-4 py-3 font-sans text-base font-medium text-text/80 hover:text-text hover:bg-cream/40 rounded-xl transition-colors duration-200"
                >
                  {t(key as keyof ReturnType<typeof t>)}
                </motion.a>
              ))}

              <div className="mt-4 pt-4 border-t border-cream flex flex-col gap-3">
                <a
                  href="#reservas"
                  onClick={handleReserve}
                  className="btn-primary w-full text-center"
                >
                  {t('reservarMesa')}
                </a>
                <LanguageSwitcher variant="inline" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
