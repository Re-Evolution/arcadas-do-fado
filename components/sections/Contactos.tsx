'use client'

import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clientData } from '@/data/client-info'
import { trackPhone, trackWhatsApp, trackEmail, trackExternalLink } from '@/lib/analytics'

export default function Contactos() {
  const t = useTranslations('contactos')
  const tR = useTranslations('reservas')
const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  const infoItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      label: t('address'),
      content: <p className="font-body text-text/70 mt-1">{clientData.contact.address}</p>,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      label: t('phone'),
      content: (
        <a
          href={`tel:${clientData.contact.phoneClean}`}
          onClick={() => trackPhone('contactos')}
          className="font-body text-rust hover:text-rust-dark transition-colors duration-200 mt-1 block"
          aria-label={`Ligar para ${clientData.contact.phone}`}
        >
          {clientData.contact.phone}
        </a>
      ),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
      label: t('mobile'),
      content: (
        <a
          href={`https://wa.me/${clientData.contact.mobileClean}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp('contactos')}
          className="font-body text-rust hover:text-rust-dark transition-colors duration-200 mt-1 flex items-center gap-1.5"
          aria-label={`WhatsApp: ${clientData.contact.mobile}`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {clientData.contact.mobile}
        </a>
      ),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      label: t('email'),
      content: (
        <a
          href={`mailto:${clientData.contact.email}`}
          onClick={() => trackEmail('contactos')}
          className="font-body text-rust hover:text-rust-dark transition-colors duration-200 mt-1 block"
          aria-label={`Enviar email para ${clientData.contact.email}`}
        >
          {clientData.contact.email}
        </a>
      ),
    },
  ]

  const scheduleRows = [
    { dayKey: 'fridaySat', hoursKey: 'fridaySatHours' },
    { dayKey: 'tueThu', hoursKey: 'tueThuHours' },
    { dayKey: 'sunMon', hoursKey: 'sunMonHours' },
  ]

  return (
    <section id="contactos" className="py-24 lg:py-32 rust-aged-bg-pale" aria-label="Localização e Contactos">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="section-label">{t('sectionLabel')}</p>
          <h2 className="section-title">{t('title')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 rounded-2xl overflow-hidden border border-cream shadow-sm"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.0!2d-8.162!3d37.072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ab34d53dc8fcb%3A0xa1e53d2fb64a8b47!2sArcadas%20do%20Fado!5e0!3m2!1spt!2spt!4v1"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapTitle')}
              aria-label={t('mapTitle')}
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact details */}
            {infoItems.map((item, i) => (
              <div key={i} className="flex gap-3.5 items-start">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-cream shrink-0 text-rust">
                  {item.icon}
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider text-text/40">
                    {item.label}
                  </p>
                  {item.content}
                </div>
              </div>
            ))}

            {/* Horário */}
            <div className="pt-2">
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-text/40 mb-3">
                {t('hours')}
              </p>
              <table className="w-full" aria-label="Horário do restaurante">
                <tbody className="divide-y divide-cream">
                  {scheduleRows.map(({ dayKey, hoursKey }) => (
                    <tr key={dayKey}>
                      <td className="py-2.5 font-body text-text/80 text-sm pr-4">{tR(dayKey as Parameters<typeof tR>[0])}</td>
                      <td className="py-2.5 font-body text-text/60 text-sm text-right">{tR(hoursKey as Parameters<typeof tR>[0])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Social + directions */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={clientData.contact.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackExternalLink('google_maps', clientData.contact.googleMaps)}
                className="btn-outline text-sm px-5 py-2.5"
                aria-label="Ver no Google Maps"
              >
                {t('getDirections')}
              </a>
              <div className="flex gap-2 ml-auto">
                <a
                  href={clientData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLink('facebook', clientData.social.facebook)}
                  aria-label="Arcadas do Fado no Facebook"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-cream hover:bg-rust hover:text-white text-rust transition-colors duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={clientData.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLink('instagram', clientData.social.instagram)}
                  aria-label="Arcadas do Fado no Instagram"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-cream hover:bg-rust hover:text-white text-rust transition-colors duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
