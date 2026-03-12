import { z } from 'zod'

export const reservationSchema = z.object({
  name: z.string().min(2, 'required').max(100),
  email: z.string().email('invalidEmail'),
  phone: z.string().min(7, 'invalidPhone').max(30).regex(/^[\d\s+\-().]+$/, 'invalidPhone'),
  date: z.string().min(1, 'required'),
  time: z.enum(['20:00', '20:30', '21:00'], { required_error: 'required' }),
  guests: z.number().min(1, 'minGuests').max(60, 'maxGuests'),
  occasion: z.enum(['none', 'birthday', 'honeymoon', 'celebration', 'other']).optional(),
  notes: z.string().max(300, 'maxNotes').optional(),
  honeypot: z.string().max(0).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'consentRequired' }) }),
})

export type ReservationFormData = z.infer<typeof reservationSchema>

export const eventInquirySchema = z.object({
  name: z.string().min(2, 'required').max(100),
  email: z.string().email('invalidEmail'),
  eventType: z.string().min(2, 'required').max(100),
  date: z.string().optional(),
  guests: z.number().min(1).max(200).optional(),
  message: z.string().min(10, 'required').max(1000),
  honeypot: z.string().max(0).optional(),
})

export type EventInquiryFormData = z.infer<typeof eventInquirySchema>

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export const isWeekend = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  const day = date.getDay()
  return day === 5 || day === 6 // Friday = 5, Saturday = 6
}

export const isClosed = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  const day = date.getDay()
  return day === 0 || day === 1 // Sunday = 0, Monday = 1
}

export const isPastDate = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export const formatPhoneForWhatsApp = (phone: string): string => {
  return phone.replace(/[\s+\-().]/g, '')
}

export const formatDatePT = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
