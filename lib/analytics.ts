'use client'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    clarity: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

export const trackCTA = (button: string, section: string, destination?: string) => {
  trackEvent('click_cta', {
    button_label: button,
    section,
    destination: destination ?? 'internal',
    timestamp: new Date().toISOString(),
  })
}

export const trackFormStart = (formName: string) => {
  trackEvent('form_start', { form_name: formName })
}

export const trackFormSubmit = (formName: string, success: boolean, errorType?: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    success,
    error_type: errorType,
  })
}

export const trackReservationStart = () => {
  trackEvent('reservation_start')
}

export const trackReservationSubmit = (success: boolean, errorType?: string) => {
  trackEvent('reservation_submit', { success, error_type: errorType })
}

export const trackPhone = (section: string) => {
  trackEvent('click_phone', { section })
}

export const trackWhatsApp = (section: string) => {
  trackEvent('click_whatsapp', { section })
}

export const trackEmail = (section: string) => {
  trackEvent('click_email', { section })
}

export const trackLanguageChange = (from: string, to: string) => {
  trackEvent('change_language', { from_locale: from, to_locale: to })
}

export const trackNavigation = (link: string) => {
  trackEvent('navigation_click', { link_label: link })
}

export const trackExternalLink = (platform: string, url: string) => {
  trackEvent('external_link_click', { platform, url })
}

export const initScrollDepth = () => {
  if (typeof window === 'undefined') return

  const depths = [25, 50, 75, 100]
  const fired = new Set<number>()

  const onScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    depths.forEach((depth) => {
      if (scrollPercent >= depth && !fired.has(depth)) {
        fired.add(depth)
        trackEvent('scroll_depth', { depth_percent: depth })
      }
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}
