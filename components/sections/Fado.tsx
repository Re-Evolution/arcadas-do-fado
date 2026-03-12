'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { trackCTA } from '@/lib/analytics'

const showItems = [
  { icon: '🕘', timeKey: 'show1Time' as const, labelKey: 'show1Label' as const, descKey: null },
  { icon: '🎤', timeKey: null,           labelKey: 'show2Label' as const, descKey: 'show2Desc' as const },
  { icon: '🎸', timeKey: null,           labelKey: 'show3Label' as const, descKey: 'show3Desc' as const },
  { icon: '✨', timeKey: null,           labelKey: 'show4Label' as const, descKey: 'show4Desc' as const },
]

export default function Fado() {
  const t = useTranslations('fado')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section id="fado" className="py-24 lg:py-32 rust-aged-bg" aria-label="O Fado">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-rust-light mb-3">
            {t('sectionLabel')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-5">
            {t('title')}
          </h2>
          <p className="font-body text-xl text-white/60 font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Main content: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">

          {/* History */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <h3 className="font-display text-2xl text-white font-light mb-6 after:block after:w-12 after:h-px after:bg-rust after:mt-3">
              {t('historyTitle')}
            </h3>
            <div className="space-y-5">
              <p className="font-body text-white/70 text-lg leading-relaxed">{t('historyP1')}</p>
              <p className="font-body text-white/70 text-lg leading-relaxed">{t('historyP2')}</p>
            </div>
          </motion.div>

          {/* Alexandra bio */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 items-start bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden">
              <Image
                src="/images/fado/alexandra.jpeg"
                alt="Alexandra, fadista principal das Arcadas do Fado em Almancil"
                fill
                className="object-cover object-top"
                sizes="128px"
                loading="lazy"
              />
            </div>
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-rust-light mb-2">
                Fadista Principal
              </p>
              <h3 className="font-display text-2xl text-white font-light mb-3">
                {t('alexandraTitle')}
              </h3>
              <p className="font-body text-white/65 text-sm leading-relaxed">
                {t('alexandraBio')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Photo gallery — 6 fotos, retratos nos cantos */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-[200px]">

            {/* Retrato esquerdo — col 1, rows 1-2 */}
            <div className="md:row-span-2 relative rounded-xl overflow-hidden">
              <Image
                src="/images/fado/alexandra-canta-bw.jpg"
                alt="Alexandra a cantar (preto e branco)"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

            {/* Destaque centro — col 2, rows 1-2 */}
            <div className="md:row-span-2 relative rounded-2xl overflow-hidden">
              <Image
                src="/images/fado/alexandra-amalia.jpg"
                alt="Alexandra — homenagem a Amália"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

            {/* Retrato direito — col 3, rows 1-2 */}
            <div className="md:row-span-2 relative rounded-xl overflow-hidden">
              <Image
                src="/images/fado/alexandra-canta-1.jpg"
                alt="Alexandra em espetáculo"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

            {/* Linha de baixo — 3 fotos landscape */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/images/fado/alexandra-canta.jpg"
                alt="Alexandra a cantar"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/images/fado/alexandra-guitarra-1.jpg"
                alt="Alexandra com guitarra portuguesa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/images/fado/alexandra-guitarra-2.jpg"
                alt="Alexandra e a guitarra"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

          </div>
        </motion.div>

        {/* Show structure */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <h3 className="font-display text-2xl text-white font-light text-center mb-6">
            {t('showStructureTitle')}
          </h3>

          {/* Compact info strip */}
          <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-10">
            {showItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 flex-1">
                <span className="text-xl shrink-0" aria-hidden="true">{item.icon}</span>
                <div className="min-w-0">
                  {item.timeKey && (
                    <p className="font-display text-lg text-rust-light leading-none">
                      {t(item.timeKey)}
                    </p>
                  )}
                  <p className="font-sans text-sm font-semibold text-white leading-snug">
                    {t(item.labelKey)}
                  </p>
                  {item.descKey && (
                    <p className="font-body text-xs text-white/50 leading-snug mt-0.5 truncate">
                      {t(item.descKey)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#reservas"
              onClick={() => trackCTA(t('cta'), 'fado', '#reservas')}
              className="btn-primary"
              aria-label="Reservar mesa para espetáculo de fado"
            >
              {t('cta')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
