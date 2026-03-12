'use client'

import { useTranslations } from 'next-intl'

export default function FooterCookieButton() {
  const t = useTranslations('footer')

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as Window & { openCookieSettings?: () => void }).openCookieSettings) {
      (window as Window & { openCookieSettings?: () => void }).openCookieSettings!()
    }
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className="font-body text-white/70 hover:text-white transition-colors duration-200 text-sm text-left"
      >
        {t('cookieSettings')}
      </button>
    </li>
  )
}
