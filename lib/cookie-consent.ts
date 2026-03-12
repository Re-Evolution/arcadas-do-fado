'use client'

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing'

export interface CookieConsent {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
  version: string
}

const CONSENT_KEY = 'arcadas_cookie_consent'
const CONSENT_VERSION = '1.0'

export const getConsent = (): CookieConsent | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return null
    const consent = JSON.parse(stored) as CookieConsent
    if (consent.version !== CONSENT_VERSION) return null
    return consent
  } catch {
    return null
  }
}

export const setConsent = (consent: Omit<CookieConsent, 'timestamp' | 'version'>) => {
  if (typeof window === 'undefined') return
  const full: CookieConsent = {
    ...consent,
    necessary: true,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(full))
  applyConsent(full)
}

export const acceptAll = () => {
  setConsent({ necessary: true, functional: true, analytics: true, marketing: true })
}

export const acceptNecessary = () => {
  setConsent({ necessary: true, functional: false, analytics: false, marketing: false })
}

export const rejectAll = () => {
  setConsent({ necessary: true, functional: false, analytics: false, marketing: false })
}

export const hasConsent = (): boolean => {
  return getConsent() !== null
}

export const hasAnalyticsConsent = (): boolean => {
  return getConsent()?.analytics === true
}

const applyConsent = (consent: CookieConsent) => {
  if (typeof window === 'undefined') return

  if (consent.analytics) {
    loadGoogleAnalytics()
    loadMicrosoftClarity()
  }
}

const loadGoogleAnalytics = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!gaId || gaId === 'placeholder_substituir') return
  if (document.querySelector(`script[src*="googletagmanager"]`)) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', gaId, { anonymize_ip: true })
}

const loadMicrosoftClarity = () => {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
  if (!clarityId || clarityId === 'placeholder_substituir') return
  if (document.querySelector(`script[src*="clarity"]`)) return

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
  `
  document.head.appendChild(script)
}

export const initConsent = () => {
  const consent = getConsent()
  if (consent) {
    applyConsent(consent)
  }
}
