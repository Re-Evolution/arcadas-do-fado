'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

type SpaceItem =
  | { type: 'image'; src: string; alt: string; wide: boolean }
  | { type: 'video'; src: string; alt: string; wide: boolean; startOffset?: number }

const spaceItems: SpaceItem[] = [
  { type: 'image', src: '/images/space/exterior.jpg', alt: 'Exterior do restaurante Arcadas do Fado em Almancil, Algarve', wide: true },
  { type: 'image', src: '/images/space/romantic-corner.jpg', alt: 'Canto romântico do restaurante Arcadas do Fado', wide: false },
  { type: 'video', src: '/videos/profiteroles.mp4', alt: 'Profiteroles das Arcadas do Fado', wide: false, startOffset: 0 },
  { type: 'video', src: '/videos/cordeiro-de-leite.mp4', alt: 'Prato de cordeiro de leite das Arcadas do Fado', wide: false, startOffset: 2 },
  { type: 'image', src: '/images/space/sala-4.jpg', alt: 'Detalhes da decoração do restaurante Arcadas do Fado', wide: false },
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

          {/* Image/video grid — 1 wide + 4 items */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="grid grid-cols-2 gap-3"
          >
            {spaceItems.map((item, i) =>
              item.type === 'video' ? (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl ${item.wide ? 'col-span-2' : ''}`}
                >
                  <video
                    src={item.src}
                    aria-label={item.alt}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={(e) => {
                      if (item.startOffset) (e.currentTarget as HTMLVideoElement).currentTime = item.startOffset
                    }}
                    className={`w-full object-cover block ${item.wide ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
                  />
                </div>
              ) : (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl ${
                    item.wide ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    loading="lazy"
                  />
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
