'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const spaceImages = [
  { src: '/images/space/exterior.jpg', alt: 'Exterior do restaurante Arcadas do Fado em Almancil, Algarve', wide: true },
  { src: '/images/space/sala-1.jpg', alt: 'Sala de jantar do restaurante Arcadas do Fado com mesas preparadas', wide: false },
  { src: '/images/space/sala-2.jpg', alt: 'Interior elegante das Arcadas do Fado com iluminação ambiente', wide: false },
  { src: '/images/space/romantic-corner.jpg', alt: 'Canto romântico do restaurante Arcadas do Fado', wide: false },
  { src: '/images/space/sala-4.jpg', alt: 'Detalhes da decoração do restaurante Arcadas do Fado', wide: false },
]

export default function Espaco() {
  const t = useTranslations('espaco')
  const tR = useTranslations('reservas')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section id="espaco" className="py-24 lg:py-32 rust-aged-bg-pale" aria-label="O Espaço">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label">{t('sectionLabel')}</p>
            <h2 className="section-title mb-8">{t('title')}</h2>

            <div className="space-y-5">
              <p className="font-body text-text/80 text-lg leading-relaxed">{t('p1')}</p>
              <p className="font-body text-text/80 text-lg leading-relaxed">{t('p2')}</p>
            </div>

            {/* Stats + note */}
            <div className="mt-10 border-t border-cream pt-8">
              <div className="flex gap-10 items-center">
                <div>
                  <p className="font-display text-4xl text-rust font-light">60</p>
                  <p className="font-sans text-xs font-medium tracking-wider uppercase text-text/50 mt-1">{t('capacity')}</p>
                </div>
                <div className="w-px self-stretch bg-cream" aria-hidden="true" />
                <div>
                  <p className="font-display text-4xl text-rust font-light">21<span className="text-2xl">h30</span></p>
                  <p className="font-sans text-xs font-medium tracking-wider uppercase text-text/50 mt-1">Espetáculo</p>
                </div>
                <div className="w-px self-stretch bg-cream" aria-hidden="true" />
                <div>
                  <p className="font-display text-4xl text-rust font-light">📋</p>
                  <p className="font-sans text-xs font-medium tracking-wider uppercase text-text/50 mt-1">{tR('reservationsRequired')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image grid — 1 wide + 6 squares */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="grid grid-cols-2 gap-3"
          >
            {spaceImages.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl ${
                  img.wide ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
