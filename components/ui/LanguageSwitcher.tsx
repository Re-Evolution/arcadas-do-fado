'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { trackLanguageChange } from '@/lib/analytics'

const languages = [
  { code: 'pt', flagCode: 'pt', label: 'PT', name: 'Português' },
  { code: 'en', flagCode: 'gb', label: 'EN', name: 'English' },
  { code: 'fr', flagCode: 'fr', label: 'FR', name: 'Français' },
  { code: 'de', flagCode: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'es', flagCode: 'es', label: 'ES', name: 'Español' },
]

function FlagImg({ code, name }: { code: string; name: string }) {
  return (
    <img
      src={`/images/icons/flag-${code}.png`}
      srcSet={`/images/icons/flag-${code}@2x.png 2x`}
      width={24}
      height={18}
      alt={name}
      className="rounded-sm object-cover shadow-sm"
    />
  )
}

interface LanguageSwitcherProps {
  className?: string
  isDark?: boolean
}

export default function LanguageSwitcher({ className = '', isDark = false }: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = languages.find((l) => l.code === locale) ?? languages[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: string) => {
    trackLanguageChange(locale, newLocale)
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  const textColor = isDark
    ? 'text-white/80 hover:text-white'
    : 'text-text/70 hover:text-text'

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Idioma: ${current.name}`}
        className={`flex items-center gap-2 font-sans text-sm font-medium transition-colors duration-200 ${textColor} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust rounded-md px-1 py-0.5`}
      >
        <FlagImg code={current.flagCode} name={current.name} />
        <span>{current.label}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Selecionar idioma"
          className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-cream/80 py-1 z-50 overflow-hidden"
        >
          {languages.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === locale}>
              <button
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 font-sans text-sm transition-colors duration-150 ${
                  lang.code === locale
                    ? 'bg-cream text-rust font-semibold'
                    : 'text-text hover:bg-cream/50'
                }`}
              >
                <FlagImg code={lang.flagCode} name={lang.name} />
                <span>{lang.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
