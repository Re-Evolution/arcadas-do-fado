'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { testimonials, type Testimonial } from '@/data/client-info'

const DURATION_MS = 480
const INTERVAL_MS = 4000

function getVisibleCount(): number {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth >= 1024) return 3
  if (window.innerWidth >= 640) return 2
  return 1
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} estrelas em 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 fill-current ${i < rating ? 'text-rust-light' : 'text-white/15'}`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="bg-black/25 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col h-full min-h-[300px]">
      {/* Rating */}
      <div className="mb-4">
        {testimonial.ratingMax === 10 ? (
          <div className="flex items-baseline gap-0.5" aria-label={`${testimonial.rating} em ${testimonial.ratingMax}`}>
            <span className="font-display text-3xl font-light text-rust-light leading-none">{testimonial.rating}</span>
            <span className="font-sans text-white/70 text-sm">/{testimonial.ratingMax}</span>
          </div>
        ) : (
          <StarRating rating={testimonial.rating} />
        )}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 mb-5">
        <p className="font-body text-white text-sm leading-relaxed italic line-clamp-6">
          &ldquo;{testimonial.text}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <footer className="border-t border-white/10 pt-4">
        <cite className="font-sans font-semibold text-white not-italic text-sm block">
          {testimonial.name}
        </cite>
        <p className="font-sans text-white/70 text-xs mt-0.5">{testimonial.role}</p>
        {testimonial.date && (
          <p className="font-sans text-white/60 text-xs mt-0.5">{testimonial.date}</p>
        )}
        <p className="font-sans text-white/50 text-[10px] mt-2 uppercase tracking-widest">
          {testimonial.source === 'Google' ? 'Google Maps' : 'TheFork'}
        </p>
      </footer>
    </article>
  )
}

export default function Testemunhos() {
  const t = useTranslations('testemunhos')
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef as React.RefObject<Element>, { once: true, margin: '-10% 0px' })

  const [visibleCount, setVisibleCount] = useState(3)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount())
    update()
    setMounted(true)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const n = testimonials.length

  // Extended array: clone last `visibleCount` at start, first `visibleCount` at end
  const { extended, total, offset } = useMemo(() => {
    const off = visibleCount
    const pre = testimonials.slice(-visibleCount)
    const post = testimonials.slice(0, visibleCount)
    return { extended: [...pre, ...testimonials, ...post], total: visibleCount * 2 + n, offset: off }
  }, [visibleCount, n])

  // current = index in extended array; starts at offset (first real card)
  const [current, setCurrent] = useState(offset)
  const [transitioning, setTransitioning] = useState(true)
  const [paused, setPaused] = useState(false)

  // Sync current when offset changes (screen resize)
  useEffect(() => {
    setTransitioning(false)
    setCurrent(offset)
    requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(true)))
  }, [offset])

  const next = useCallback(() => {
    setTransitioning(true)
    setCurrent(c => c + 1)
  }, [])

  const prev = useCallback(() => {
    setTransitioning(true)
    setCurrent(c => c - 1)
  }, [])

  // Infinite loop: reset when reaching clone zones
  useEffect(() => {
    if (!mounted) return
    if (current >= offset + n) {
      const t = setTimeout(() => {
        setTransitioning(false)
        setCurrent(c => c - n)
        requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(true)))
      }, DURATION_MS + 30)
      return () => clearTimeout(t)
    }
    if (current < offset) {
      const t = setTimeout(() => {
        setTransitioning(false)
        setCurrent(c => c + n)
        requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(true)))
      }, DURATION_MS + 30)
      return () => clearTimeout(t)
    }
  }, [current, offset, n, mounted])

  // Auto-advance
  useEffect(() => {
    if (paused || !mounted) return
    const timer = setInterval(next, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, next, mounted])

  const translateX = total > 0 ? -(current / total) * 100 : 0

  return (
    <section
      id="testemunhos"
      className="py-24 lg:py-32 rust-aged-bg"
      aria-label="Testemunhos"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white mb-3">
              {t('sectionLabel')}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">
              {t('title')}
            </h2>
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev button — fixed at left edge */}
          <button
            onClick={prev}
            aria-label="Testemunho anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/50 bg-black/30 backdrop-blur-sm transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Track container — padding makes room for side buttons */}
          <div className="overflow-hidden px-12" aria-live="polite" aria-atomic="true">
            <div
              style={{
                display: 'flex',
                width: `${(total / visibleCount) * 100}%`,
                transform: `translateX(${translateX}%)`,
                transition: transitioning ? `transform ${DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
                willChange: 'transform',
              }}
            >
              {extended.map((testimonial, idx) => (
                <div
                  key={idx}
                  style={{ width: `${100 / total}%`, flexShrink: 0, padding: '0 6px' }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Next button — fixed at right edge */}
          <button
            onClick={next}
            aria-label="Próximo testemunho"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/50 bg-black/30 backdrop-blur-sm transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
