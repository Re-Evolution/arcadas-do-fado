'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations, useLocale } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { reservationSchema, type ReservationFormData } from '@/lib/validations'
import { trackFormStart, trackFormSubmit, trackReservationSubmit } from '@/lib/analytics'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const scheduleItems = [
  { dayKey: 'fridaySat', hoursKey: 'fridaySatHours', icon: '🎶' },
  { dayKey: 'tueThu', hoursKey: 'tueThuHours', icon: '👥' },
  { dayKey: 'sunMon', hoursKey: 'sunMonHours', icon: '🔒' },
]

export default function Reservas() {
  const t = useTranslations('reservas')
  const tErrors = useTranslations('errors')
  const locale = useLocale()
  const [status, setStatus] = useState<FormStatus>('idle')
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const successRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  useEffect(() => {
    if (status === 'success') {
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [status])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
  })

  const onFocus = () => {
    if (!started) {
      setStarted(true)
      trackFormStart('reservation')
    }
  }

  const onSubmit = async (data: ReservationFormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      })

      if (res.ok) {
        setStatus('success')
        trackFormSubmit('reservation', true)
        trackReservationSubmit(true)
        reset()
      } else {
        const err = await res.json()
        setStatus('error')
        trackFormSubmit('reservation', false, err.error ?? 'unknown')
        trackReservationSubmit(false, err.error)
      }
    } catch {
      setStatus('error')
      trackFormSubmit('reservation', false, 'network')
      trackReservationSubmit(false, 'network')
    }
  }

  const guestOptions = Array.from({ length: 60 }, (_, i) => i + 1)

  return (
    <section
      id="reservas"
      className="py-24 lg:py-32 rust-aged-bg-pale"
      aria-label="Reservas"
    >
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="section-label">{t('sectionLabel')}</p>
          <h2 className="section-title mb-4">{t('title')}</h2>
          <p className="inline-flex items-center gap-2 font-sans text-sm font-medium text-rust bg-rust/10 px-4 py-2 rounded-full">
            <span aria-hidden="true">🎶</span> {t('note')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Schedule sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <h3 className="font-display text-2xl text-text font-light mb-6">
              {t('scheduleTitle')}
            </h3>
            <div className="space-y-4">
              {/* Info boxes — em primeiro */}
              <div className="flex gap-3 items-center p-4 bg-white rounded-xl border border-cream shadow-sm">
                <span className="text-xl shrink-0" aria-hidden="true">📋</span>
                <p className="font-sans text-sm font-semibold text-text">
                  {t('reservationsRequired')}
                </p>
              </div>
              <div className="flex gap-3 items-center p-4 bg-white rounded-xl border border-cream shadow-sm">
                <span className="text-xl shrink-0" aria-hidden="true">💵</span>
                <p className="font-sans text-sm font-semibold text-text">
                  {t('paymentMethod')}
                </p>
              </div>

              {scheduleItems.map(({ dayKey, hoursKey, icon }) => (
                <div key={dayKey} className="flex gap-3 items-start p-4 bg-white rounded-xl border border-cream shadow-sm">
                  <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-text">
                      {t(dayKey as Parameters<typeof t>[0])}
                    </p>
                    <p className="font-body text-text/60 text-sm mt-0.5">
                      {t(hoursKey as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-2"
          >
            {status === 'success' ? (
              <div ref={successRef} className="bg-white rounded-2xl border border-cream shadow-sm p-10 text-center">
                <span className="text-5xl block mb-5" aria-hidden="true">✉️</span>
                <h3 className="font-display text-2xl text-text mb-3">{t('success')}</h3>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-outline mt-6"
                >
                  Nova Reserva
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="bg-white rounded-2xl border border-cream shadow-sm p-6 sm:p-8 space-y-5"
                aria-label="Formulário de reserva"
              >
                {/* Honeypot — hidden */}
                <div className="hidden" aria-hidden="true">
                  <input
                    {...register('honeypot')}
                    tabIndex={-1}
                    autoComplete="off"
                    type="text"
                    name="website"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="res-name" className="input-label">
                      {t('form.name')} <span className="text-rust" aria-label="obrigatório">*</span>
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      autoComplete="name"
                      placeholder={t('form.namePlaceholder')}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'res-name-error' : undefined}
                      className="input-field"
                      onFocus={onFocus}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p id="res-name-error" className="input-error" role="alert">
                        {tErrors(errors.name.message as Parameters<typeof tErrors>[0])}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="res-email" className="input-label">
                      {t('form.email')} <span className="text-rust" aria-label="obrigatório">*</span>
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('form.emailPlaceholder')}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'res-email-error' : undefined}
                      className="input-field"
                      onFocus={onFocus}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p id="res-email-error" className="input-error" role="alert">
                        {tErrors(errors.email.message as Parameters<typeof tErrors>[0])}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div>
                    <label htmlFor="res-phone" className="input-label">
                      {t('form.phone')} <span className="text-rust" aria-label="obrigatório">*</span>
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder={t('form.phonePlaceholder')}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'res-phone-error' : undefined}
                      className="input-field"
                      onFocus={onFocus}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p id="res-phone-error" className="input-error" role="alert">
                        {tErrors(errors.phone.message as Parameters<typeof tErrors>[0])}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label htmlFor="res-date" className="input-label">
                      {t('form.date')} <span className="text-rust" aria-label="obrigatório">*</span>
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      aria-required="true"
                      aria-invalid={!!errors.date}
                      aria-describedby={errors.date ? 'res-date-error' : undefined}
                      className="input-field"
                      onFocus={onFocus}
                      min={new Date().toISOString().split('T')[0]}
                      {...register('date')}
                    />
                    {errors.date && (
                      <p id="res-date-error" className="input-error" role="alert">
                        {tErrors(errors.date.message as Parameters<typeof tErrors>[0])}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Time */}
                  <div>
                    <label htmlFor="res-time" className="input-label">
                      {t('form.time')} <span className="text-rust" aria-label="obrigatório">*</span>
                    </label>
                    <select
                      id="res-time"
                      aria-required="true"
                      aria-invalid={!!errors.time}
                      className="input-field"
                      onFocus={onFocus}
                      {...register('time')}
                    >
                      <option value="">{t('form.timeSelect')}</option>
                      <option value="20:00">{t('form.time2000')}</option>
                      <option value="20:30">{t('form.time2030')}</option>
                      <option value="21:00">{t('form.time2100')}</option>
                    </select>
                    {errors.time && (
                      <p className="input-error" role="alert">
                        {tErrors('required')}
                      </p>
                    )}
                  </div>

                  {/* Guests */}
                  <div>
                    <label htmlFor="res-guests" className="input-label">
                      {t('form.guests')} <span className="text-rust" aria-label="obrigatório">*</span>
                    </label>
                    <select
                      id="res-guests"
                      aria-required="true"
                      aria-invalid={!!errors.guests}
                      className="input-field"
                      onFocus={onFocus}
                      {...register('guests', { valueAsNumber: true })}
                    >
                      <option value="">{t('form.guestsSelect')}</option>
                      {guestOptions.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    {errors.guests && (
                      <p className="input-error" role="alert">
                        {tErrors(errors.guests.message as Parameters<typeof tErrors>[0])}
                      </p>
                    )}
                  </div>

                  {/* Occasion */}
                  <div>
                    <label htmlFor="res-occasion" className="input-label">
                      {t('form.occasion')}
                    </label>
                    <select
                      id="res-occasion"
                      className="input-field"
                      onFocus={onFocus}
                      {...register('occasion')}
                    >
                      <option value="none">{t('form.occasionNone')}</option>
                      <option value="birthday">{t('form.occasionBirthday')}</option>
                      <option value="honeymoon">{t('form.occasionHoneymoon')}</option>
                      <option value="celebration">{t('form.occasionCelebration')}</option>
                      <option value="other">{t('form.occasionOther')}</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="res-notes" className="input-label">
                    {t('form.notes')}
                  </label>
                  <textarea
                    id="res-notes"
                    rows={3}
                    placeholder={t('form.notesPlaceholder')}
                    maxLength={300}
                    className="input-field resize-none"
                    onFocus={onFocus}
                    {...register('notes')}
                  />
                  {errors.notes && (
                    <p className="input-error" role="alert">
                      {tErrors(errors.notes.message as Parameters<typeof tErrors>[0])}
                    </p>
                  )}
                </div>

                {/* Consent */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 accent-rust rounded shrink-0"
                      aria-required="true"
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? 'res-consent-error' : undefined}
                      {...register('consent')}
                    />
                    <span className="font-sans text-sm text-text/70">
                      {t('form.consent')}{' '}
                      <Link href={`/${locale}/privacy-policy`} className="text-rust underline hover:text-rust-dark">
                        {t('form.consentLink')}
                      </Link>{' '}
                      {t('form.consentAnd')}
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="res-consent-error" className="input-error mt-1" role="alert">
                      {tErrors('consentRequired')}
                    </p>
                  )}
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
                    <p className="font-sans text-sm text-red-700">{t('error')}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-busy={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('form.submitting')}
                    </>
                  ) : (
                    t('form.submit')
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
