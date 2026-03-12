'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import {
  hasConsent,
  acceptAll,
  acceptNecessary,
  rejectAll,
  setConsent,
  initConsent,
  getConsent,
  type CookieConsent,
} from '@/lib/cookie-consent'

export default function CookieBanner() {
  const t = useTranslations('cookies')
  const locale = useLocale()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [prefs, setPrefs] = useState<Omit<CookieConsent, 'timestamp' | 'version'>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    initConsent()
    if (!hasConsent()) {
      setTimeout(() => setShow(true), 1000)
    }
    // Expose function to reopen from footer
    if (typeof window !== 'undefined') {
      (window as Window & { openCookieSettings?: () => void }).openCookieSettings = () => {
        const existing = getConsent()
        if (existing) {
          setPrefs({ necessary: true, functional: existing.functional, analytics: existing.analytics, marketing: existing.marketing })
        }
        setShowModal(true)
        setShow(false)
      }
    }
  }, [])

  const handleAcceptAll = () => {
    acceptAll()
    setShow(false)
    setShowModal(false)
  }

  const handleAcceptNecessary = () => {
    acceptNecessary()
    setShow(false)
    setShowModal(false)
  }

  const handleRejectAll = () => {
    rejectAll()
    setShow(false)
    setShowModal(false)
  }

  const handleSavePrefs = () => {
    setConsent(prefs)
    setShow(false)
    setShowModal(false)
  }

  const openSettings = () => {
    const existing = getConsent()
    if (existing) {
      setPrefs({ necessary: true, functional: existing.functional, analytics: existing.analytics, marketing: existing.marketing })
    }
    setShowModal(true)
    setShow(false)
  }

  return (
    <>
      {/* Banner */}
      <AnimatePresence>
        {show && !showModal && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={t('bannerTitle')}
          >
            <div className="max-w-4xl mx-auto bg-charcoal/95 backdrop-blur-sm text-white rounded-2xl shadow-2xl p-6 border border-white/10">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-display text-lg text-white mb-1">{t('bannerTitle')}</h2>
                  <p className="font-body text-white/70 text-sm leading-relaxed">
                    {t('bannerText')}{' '}
                    <Link
                      href={`/${locale}/cookie-policy`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rust-light underline hover:text-white transition-colors"
                    >
                      {t('close')}
                    </Link>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={openSettings}
                    className="px-4 py-2 font-sans text-sm font-medium text-white/70 hover:text-white border border-white/20 rounded-full transition-colors duration-200"
                  >
                    {t('settings')}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 font-sans text-sm font-medium text-white/70 hover:text-white border border-white/20 rounded-full transition-colors duration-200"
                  >
                    {t('rejectAll')}
                  </button>
                  <button
                    onClick={handleAcceptNecessary}
                    className="px-4 py-2 font-sans text-sm font-medium text-white/70 hover:text-white border border-white/20 rounded-full transition-colors duration-200"
                  >
                    {t('acceptNecessary')}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2 font-sans text-sm font-semibold bg-rust hover:bg-rust-dark text-white rounded-full transition-colors duration-200"
                  >
                    {t('acceptAll')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={t('modalTitle')}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-cream">
                <h2 className="font-display text-2xl text-text">{t('modalTitle')}</h2>
                <button
                  onClick={() => { setShowModal(false); if (!hasConsent()) setShow(true) }}
                  aria-label={t('close')}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
                >
                  <svg className="w-4 h-4 text-text/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {[
                  { key: 'necessary' as const, always: true },
                  { key: 'functional' as const, always: false },
                  { key: 'analytics' as const, always: false },
                  { key: 'marketing' as const, always: false },
                ].map(({ key, always }) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-sans text-sm font-semibold text-text">{t(key)}</p>
                      <p className="font-body text-text/60 text-sm mt-0.5">{t(`${key}Desc` as Parameters<typeof t>[0])}</p>
                    </div>
                    {always ? (
                      <span className="shrink-0 font-sans text-xs text-rust font-medium mt-1">{t('alwaysActive')}</span>
                    ) : (
                      <button
                        role="switch"
                        aria-checked={prefs[key]}
                        onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                        className={`shrink-0 relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 ${
                          prefs[key] ? 'bg-rust' : 'bg-text/20'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                            prefs[key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-cream flex flex-col sm:flex-row gap-3">
                <button onClick={handleRejectAll} className="flex-1 px-4 py-2.5 font-sans text-sm font-medium text-text/70 hover:text-text border border-cream hover:border-text/30 rounded-full transition-colors">
                  {t('rejectAll')}
                </button>
                <button onClick={handleAcceptAll} className="flex-1 px-4 py-2.5 font-sans text-sm font-medium text-white/70 hover:text-white bg-charcoal hover:bg-text rounded-full transition-colors">
                  {t('acceptAll')}
                </button>
                <button onClick={handleSavePrefs} className="flex-1 px-4 py-2.5 font-sans text-sm font-semibold text-white bg-rust hover:bg-rust-dark rounded-full transition-colors">
                  {t('save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
