'use client'

import { useState, Fragment } from 'react'
import { useTranslations, useMessages } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { menuData } from '@/data/client-info'
import { formatPrice } from '@/lib/utils'

type MenuTab = 'entradas' | 'saladas' | 'vegetariano' | 'peixe' | 'carne' | 'sobremesas'

const tabs: MenuTab[] = ['entradas', 'saladas', 'vegetariano', 'peixe', 'carne', 'sobremesas']

const menuContent: Record<MenuTab, { name: string; price: number }[]> = {
  entradas: menuData.entradas,
  saladas: menuData.saladas,
  vegetariano: menuData.vegetariano,
  peixe: menuData.peixe,
  carne: menuData.carne,
  sobremesas: menuData.sobremesas,
}

const entradasSections = [
  { key: 'couvert', items: menuData.couvert },
  { key: 'entradas', items: menuData.entradas },
]

export default function Menu() {
  const t = useTranslations('menu')
  const messages = useMessages()
  const [activeTab, setActiveTab] = useState<MenuTab>('entradas')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  const getItemName = (tab: string, i: number, fallback: string): string => {
    const translated = (messages.menu as Record<string, unknown> | undefined)
      ?.items as Record<string, Record<string, string>> | undefined
    return translated?.[tab]?.[String(i)] ?? fallback
  }

  return (
    <section id="menu" className="relative py-24 lg:py-32 overflow-hidden" aria-label="Menu">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/space/sala-1.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/55" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="section-label !text-cream/60">{t('sectionLabel')}</p>
          <h2 className="section-title !text-cream mb-4">{t('title')}</h2>
          <p className="font-body text-cream/60 text-lg">{t('subtitle')}</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
          role="tablist"
          aria-label="Categorias do menu"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`menu-panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 font-sans text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-cream text-rust shadow-md'
                  : 'bg-white/10 text-cream/70 hover:text-cream hover:bg-white/20 border border-white/20'
              }`}
            >
              {t(`tabs.${tab}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </motion.div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`menu-panel-${activeTab}`}
            role="tabpanel"
            aria-label={t(`tabs.${activeTab}` as Parameters<typeof t>[0])}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-cream/60 shadow-sm overflow-hidden"
          >
            {activeTab === 'entradas' ? (
              <ul className="divide-y divide-cream/70" role="list">
                {entradasSections.map((section) => (
                  <Fragment key={section.key}>
                    <li className="px-6 py-3 bg-cream/40">
                      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-rust/70">
                        {t(`tabs.${section.key}` as Parameters<typeof t>[0])}
                      </span>
                    </li>
                    {section.items.map((item, i) => (
                      <li key={`${section.key}-${i}`} className="flex items-baseline justify-between gap-4 px-6 py-5 hover:bg-cream/20 transition-colors duration-150">
                        <span className="font-body text-text text-lg leading-snug flex-1">
                          {getItemName(section.key, i, item.name)}
                        </span>
                        <span className="font-display text-xl text-rust font-medium shrink-0 tabular-nums">
                          {formatPrice(item.price)}
                        </span>
                      </li>
                    ))}
                  </Fragment>
                ))}
              </ul>
            ) : (
              <ul className="divide-y divide-cream/70" role="list">
                {menuContent[activeTab].map((item, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-4 px-6 py-5 hover:bg-cream/20 transition-colors duration-150">
                    <span className="font-body text-text text-lg leading-snug flex-1">
                      {getItemName(activeTab, i, item.name)}
                    </span>
                    <span className="font-display text-xl text-rust font-medium shrink-0 tabular-nums">
                      {formatPrice(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* VAT note */}
            <div className="px-6 py-4 bg-cream/30 border-t border-cream/70">
              <p className="font-sans text-text/40 text-xs text-center">{t('vatNote')}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
