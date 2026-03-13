'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { trackCTA, initScrollDepth } from '@/lib/analytics'

const heroImages = [
  { src: '/images/space/romantic-corner.jpg', alt: 'Canto romântico do restaurante Arcadas do Fado' },
  { src: '/images/space/sala-1.jpg',          alt: 'Sala de jantar do restaurante Arcadas do Fado' },
  { src: '/images/space/sala-2.jpg',          alt: 'Interior elegante das Arcadas do Fado' },
  { src: '/images/space/sala-4.jpg',          alt: 'Detalhes da decoração do restaurante Arcadas do Fado' },
]

const SLIDE_INTERVAL = 5500

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const t = useTranslations('hero')
  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    cleanupRef.current = initScrollDepth()
    return () => cleanupRef.current?.()
  }, [])

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentImg((i) => (i + 1) % heroImages.length),
      SLIDE_INTERVAL,
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero — Arcadas do Fado"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImg}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            <Image
              src={heroImages[currentImg].src}
              alt={heroImages[currentImg].alt}
              fill
              className="object-cover object-center"
              priority={currentImg === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlay — less opaque so images breathe */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-charcoal/15" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center flex flex-col items-center">

        {/* Badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2.5 mb-8"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-rust-light animate-badge-pulse" aria-hidden="true" />
            <span className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-white/90">
              {t('badge')}
            </span>
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-tight mb-6"
        >
          {t('title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-body text-xl sm:text-2xl text-cream/90 max-w-2xl mx-auto mb-12 font-light"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#reservas"
            onClick={() => trackCTA(t('ctaPrimary'), 'hero', '#reservas')}
            className="btn-primary text-base px-10 py-4 w-full sm:w-auto sm:min-w-[200px]"
            aria-label="Reservar mesa no restaurante Arcadas do Fado"
          >
            {t('ctaPrimary')}
          </a>
          <a
            href="#menu"
            onClick={() => trackCTA(t('ctaSecondary'), 'hero', '#menu')}
            className="btn-secondary text-base px-10 py-4 w-full sm:w-auto sm:min-w-[200px]"
          >
            {t('ctaSecondary')}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — above the arch */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-sans text-white/60 text-xs tracking-widest uppercase">{t('scrollText')}</span>
        <div className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center">
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>

    </section>
  )
}
