import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import {
  sanitizeInput,
  isPastDate,
  isClosed,
  formatDatePT,
  formatPhoneForWhatsApp,
} from '@/lib/validations'
import { checkRateLimit } from '@/lib/rate-limit'

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

const emailI18n: Record<string, {
  title: string
  headerTitle: string
  greeting: (name: string) => string
  bodyText: string
  detailsLabel: string
  dateLabel: string
  timeLabel: string
  guestsLabel: string
  occasionLabel: string
  notesLabel: string
  showReminder: string
  contactText: string
  occasionMap: Record<string, string>
  waMessage: (name: string, guests: number, date: string, time: string) => string
}> = {
  pt: {
    title: 'Pedido de Reserva Recebido — Arcadas do Fado',
    headerTitle: 'Pedido de Reserva Recebido',
    greeting: (name) => `Caro/a <strong>${name}</strong>,`,
    bodyText: 'Obrigado pelo seu pedido de reserva nas Arcadas do Fado. Recebemos o seu pedido e entraremos em contacto brevemente para confirmar a sua reserva.',
    detailsLabel: 'Detalhes da Reserva',
    dateLabel: '📅 Data',
    timeLabel: '🕗 Hora',
    guestsLabel: '👥 Pessoas',
    occasionLabel: '🎉 Ocasião',
    notesLabel: '📝 Observações',
    showReminder: '🎶 Espetáculo de Fado ao Vivo às 21h30 (Sextas e Sábados)',
    contactText: 'Para qualquer questão, contacte-nos:',
    occasionMap: { birthday: 'Aniversário', honeymoon: 'Lua de mel', celebration: 'Celebração', other: 'Outro', none: '—' },
    waMessage: (name, guests, date, time) => `Olá ${name}! As Arcadas do Fado confirmam a sua reserva para ${guests} pessoas no dia ${date} às ${time}. Aguardamos a sua visita! ♪♫`,
  },
  en: {
    title: 'Reservation Request Received — Arcadas do Fado',
    headerTitle: 'Reservation Request Received',
    greeting: (name) => `Dear <strong>${name}</strong>,`,
    bodyText: 'Thank you for your reservation request at Arcadas do Fado. We have received your request and will contact you shortly to confirm your reservation.',
    detailsLabel: 'Reservation Details',
    dateLabel: '📅 Date',
    timeLabel: '🕗 Time',
    guestsLabel: '👥 Guests',
    occasionLabel: '🎉 Occasion',
    notesLabel: '📝 Notes',
    showReminder: '🎶 Live Fado Show at 9:30 PM (Fridays & Saturdays)',
    contactText: 'For any questions, please contact us:',
    occasionMap: { birthday: 'Birthday', honeymoon: 'Honeymoon', celebration: 'Celebration', other: 'Other', none: '—' },
    waMessage: (name, guests, date, time) => `Hello ${name}! Arcadas do Fado confirms your reservation for ${guests} guests on ${date} at ${time}. We look forward to welcoming you! ♪♫`,
  },
  fr: {
    title: 'Demande de Réservation Reçue — Arcadas do Fado',
    headerTitle: 'Demande de Réservation Reçue',
    greeting: (name) => `Cher/Chère <strong>${name}</strong>,`,
    bodyText: 'Merci pour votre demande de réservation aux Arcadas do Fado. Nous avons bien reçu votre demande et vous contacterons prochainement pour confirmer votre réservation.',
    detailsLabel: 'Détails de la Réservation',
    dateLabel: '📅 Date',
    timeLabel: '🕗 Heure',
    guestsLabel: '👥 Personnes',
    occasionLabel: '🎉 Occasion',
    notesLabel: '📝 Remarques',
    showReminder: '🎶 Spectacle de Fado en Direct à 21h30 (Vendredis & Samedis)',
    contactText: 'Pour toute question, n\'hésitez pas à nous contacter :',
    occasionMap: { birthday: 'Anniversaire', honeymoon: 'Lune de miel', celebration: 'Célébration', other: 'Autre', none: '—' },
    waMessage: (name, guests, date, time) => `Bonjour ${name} ! Les Arcadas do Fado confirment votre réservation pour ${guests} personnes le ${date} à ${time}. Nous vous attendons avec impatience ! ♪♫`,
  },
  de: {
    title: 'Reservierungsanfrage Erhalten — Arcadas do Fado',
    headerTitle: 'Reservierungsanfrage Erhalten',
    greeting: (name) => `Sehr geehrte/r <strong>${name}</strong>,`,
    bodyText: 'Vielen Dank für Ihre Reservierungsanfrage im Arcadas do Fado. Wir haben Ihre Anfrage erhalten und werden uns in Kürze mit Ihnen in Verbindung setzen, um Ihre Reservierung zu bestätigen.',
    detailsLabel: 'Reservierungsdetails',
    dateLabel: '📅 Datum',
    timeLabel: '🕗 Uhrzeit',
    guestsLabel: '👥 Personen',
    occasionLabel: '🎉 Anlass',
    notesLabel: '📝 Anmerkungen',
    showReminder: '🎶 Live-Fado-Show um 21:30 Uhr (Freitag & Samstag)',
    contactText: 'Bei Fragen stehen wir Ihnen gerne zur Verfügung:',
    occasionMap: { birthday: 'Geburtstag', honeymoon: 'Flitterwochen', celebration: 'Feier', other: 'Sonstiges', none: '—' },
    waMessage: (name, guests, date, time) => `Hallo ${name}! Das Arcadas do Fado bestätigt Ihre Reservierung für ${guests} Personen am ${date} um ${time}. Wir freuen uns auf Ihren Besuch! ♪♫`,
  },
  es: {
    title: 'Solicitud de Reserva Recibida — Arcadas do Fado',
    headerTitle: 'Solicitud de Reserva Recibida',
    greeting: (name) => `Estimado/a <strong>${name}</strong>,`,
    bodyText: 'Gracias por su solicitud de reserva en Arcadas do Fado. Hemos recibido su solicitud y nos pondremos en contacto con usted a la brevedad para confirmar su reserva.',
    detailsLabel: 'Detalles de la Reserva',
    dateLabel: '📅 Fecha',
    timeLabel: '🕗 Hora',
    guestsLabel: '👥 Personas',
    occasionLabel: '🎉 Ocasión',
    notesLabel: '📝 Observaciones',
    showReminder: '🎶 Espectáculo de Fado en Directo a las 21:30 (Viernes y Sábados)',
    contactText: 'Para cualquier consulta, contáctenos:',
    occasionMap: { birthday: 'Cumpleaños', honeymoon: 'Luna de miel', celebration: 'Celebración', other: 'Otro', none: '—' },
    waMessage: (name, guests, date, time) => `¡Hola ${name}! Arcadas do Fado confirma su reserva para ${guests} personas el ${date} a las ${time}. ¡Le esperamos! ♪♫`,
  },
}

const localeName: Record<string, string> = {
  pt: 'Português 🇵🇹',
  en: 'Inglês 🇬🇧',
  fr: 'Francês 🇫🇷',
  de: 'Alemão 🇩🇪',
  es: 'Espanhol 🇪🇸',
}

function buildEmailHtml(data: {
  name: string
  date: string
  time: string
  guests: number
  occasion?: string
  notes?: string
  locale: string
}): string {
  const locale = data.locale in emailI18n ? data.locale : 'pt'
  const i18n = emailI18n[locale]
  const dateFormatted = formatDatePT(data.date)
  const occasionLabel = data.occasion ? (i18n.occasionMap[data.occasion] ?? '—') : '—'

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${i18n.title}</title>
</head>
<body style="margin:0;padding:0;background:#F5EDD8;font-family:Georgia,serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD8;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#FDFAF6;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#2C1810;padding:32px;text-align:center;">
            <p style="color:#B5562A;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Arcadas do Fado</p>
            <h1 style="color:#FDFAF6;font-size:24px;font-weight:300;margin:0;line-height:1.3;">${i18n.headerTitle}</h1>
            <p style="color:#D4845A;font-size:13px;margin:8px 0 0;">Almancil, Algarve</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 32px;">
            <p style="color:#3D2314;font-size:18px;margin:0 0 20px;">${i18n.greeting(sanitizeInput(data.name))}</p>
            <p style="color:#5a3a28;font-size:16px;line-height:1.7;margin:0 0 24px;">
              ${i18n.bodyText}
            </p>

            <!-- Details box -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD8;border-radius:12px;padding:24px;margin:0 0 24px;">
              <tr><td>
                <p style="color:#7A3318;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">${i18n.detailsLabel}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    [i18n.dateLabel, dateFormatted],
                    [i18n.timeLabel, data.time],
                    [i18n.guestsLabel, String(data.guests)],
                    [i18n.occasionLabel, occasionLabel],
                    data.notes ? [i18n.notesLabel, sanitizeInput(data.notes)] : null,
                  ].filter(Boolean).map((row) => `
                    <tr>
                      <td style="color:#7A3318;font-size:13px;font-weight:600;padding:6px 12px 6px 0;width:130px;vertical-align:top;">${row![0]}</td>
                      <td style="color:#3D2314;font-size:14px;padding:6px 0;">${row![1]}</td>
                    </tr>
                  `).join('')}
                </table>
              </td></tr>
            </table>

            <!-- Show reminder -->
            <div style="background:#B5562A;border-radius:12px;padding:16px 20px;margin:0 0 24px;text-align:center;">
              <p style="color:#FDFAF6;font-size:13px;margin:0;font-weight:500;">${i18n.showReminder}</p>
            </div>

            <p style="color:#5a3a28;font-size:15px;line-height:1.7;margin:0 0 8px;">
              ${i18n.contactText}
            </p>
            <p style="color:#5a3a28;font-size:14px;margin:0;">
              📞 <a href="tel:+351289398113" style="color:#B5562A;">+351 289 398 113</a><br>
              📱 <a href="https://wa.me/351919457238" style="color:#B5562A;">+351 919 457 238 (WhatsApp)</a><br>
              ✉️ <a href="mailto:geral@arcadasdofado.com" style="color:#B5562A;">geral@arcadasdofado.com</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F5EDD8;padding:20px 32px;text-align:center;border-top:1px solid #e8d9b8;">
            <p style="color:#9a7a64;font-size:12px;margin:0;">
              Arcadas do Fado · Av. 5 de Outubro 85, 8135-100 Almancil<br>
              © 2025 Arcadas do Fado. Todos os direitos reservados.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildTelegramMessage(data: {
  name: string
  date: string
  time: string
  guests: number
  phone: string
  email: string
  occasion?: string
  notes?: string
}): string {
  const dateFormatted = formatDatePT(data.date)
  const phoneClean = formatPhoneForWhatsApp(data.phone)
  const confirmMsg = encodeURIComponent(
    `Olá ${data.name}! As Arcadas do Fado confirmam a sua reserva para ${data.guests} pessoas no dia ${dateFormatted} às ${data.time}. Aguardamos a sua visita! 🎶`
  )
  const waLink = `https://wa.me/${phoneClean}?text=${confirmMsg}`

  return `🍽️ *NOVA RESERVA — Arcadas do Fado*

👤 *Nome:* ${sanitizeInput(data.name)}
📅 *Data:* ${dateFormatted}
🕗 *Hora:* ${data.time}
👥 *Pessoas:* ${data.guests}
🎉 *Ocasião:* ${data.occasion || '—'}
📞 *Telefone:* ${data.phone}
📧 *Email:* ${data.email}
📝 *Observações:* ${data.notes || '—'}

✅ *Confirmar via WhatsApp:*
${waLink}

❌ Se não tiver disponibilidade, contacte diretamente o cliente.`
}

async function sendTelegramNotification(_message: string): Promise<void> {
  // Telegram temporariamente congelado — notificações via email interno
  return
}

function buildInternalEmailHtml(data: {
  name: string
  date: string
  time: string
  guests: number
  phone: string
  email: string
  occasion?: string
  notes?: string
  locale: string
  waLink: string
}): string {
  const locale = data.locale in emailI18n ? data.locale : 'pt'
  const i18n = emailI18n[locale]
  const dateFormatted = formatDatePT(data.date)
  const occasionLabel = data.occasion ? (i18n.occasionMap[data.occasion] ?? '—') : '—'
  const clientLanguage = localeName[locale] ?? locale

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Reserva — Arcadas do Fado</title>
</head>
<body style="margin:0;padding:0;background:#F5EDD8;font-family:Georgia,serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD8;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#FDFAF6;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#2C1810;padding:32px;text-align:center;">
            <p style="color:#B5562A;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Arcadas do Fado · Gestão</p>
            <h1 style="color:#FDFAF6;font-size:24px;font-weight:300;margin:0;line-height:1.3;">Nova Reserva Recebida</h1>
            <p style="color:#D4845A;font-size:13px;margin:8px 0 0;">Almancil, Algarve</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 32px;">
            <p style="color:#3D2314;font-size:16px;line-height:1.7;margin:0 0 24px;">
              Foi recebido um novo pedido de reserva. Consulte os detalhes abaixo e confirme a disponibilidade com o cliente.
            </p>

            <!-- Details box -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD8;border-radius:12px;padding:24px;margin:0 0 24px;">
              <tr><td>
                <p style="color:#7A3318;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">Detalhes da Reserva</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    ['👤 Nome', sanitizeInput(data.name)],
                    ['📅 Data', dateFormatted],
                    ['🕗 Hora', data.time],
                    ['👥 Pessoas', String(data.guests)],
                    ['🎉 Ocasião', occasionLabel],
                    ['📞 Telefone', data.phone],
                    ['📧 Email', data.email],
                    ['🌐 Língua', clientLanguage],
                    data.notes ? ['📝 Observações', sanitizeInput(data.notes)] : null,
                  ].filter(Boolean).map((row) => `
                    <tr>
                      <td style="color:#7A3318;font-size:13px;font-weight:600;padding:6px 12px 6px 0;width:130px;vertical-align:top;">${row![0]}</td>
                      <td style="color:#3D2314;font-size:14px;padding:6px 0;">${row![1]}</td>
                    </tr>
                  `).join('')}
                </table>
              </td></tr>
            </table>

            <!-- WhatsApp confirm button -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
              <tr><td align="center">
                <a href="${data.waLink}" style="display:inline-block;background:#25D366;color:#ffffff;font-family:Georgia,serif;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
                  ✅ Confirmar Reserva via WhatsApp
                </a>
              </td></tr>
            </table>

            <!-- No availability warning -->
            <div style="background:#FDF3E7;border:1px solid #e8c99a;border-radius:12px;padding:16px 20px;text-align:center;">
              <p style="color:#7A3318;font-size:13px;margin:0;font-weight:500;">
                ❌ Sem disponibilidade? Contacte o cliente diretamente:<br>
                <a href="tel:${data.phone}" style="color:#B5562A;font-weight:600;">${data.phone}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${data.email}" style="color:#B5562A;font-weight:600;">${data.email}</a>
              </p>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F5EDD8;padding:20px 32px;text-align:center;border-top:1px solid #e8d9b8;">
            <p style="color:#9a7a64;font-size:12px;margin:0;">
              Arcadas do Fado · Av. 5 de Outubro 85, 8135-100 Almancil<br>
              © 2025 Arcadas do Fado. Todos os direitos reservados.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

async function sendInternalNotificationEmail(data: {
  name: string
  date: string
  time: string
  guests: number
  phone: string
  email: string
  occasion?: string
  notes?: string
  locale: string
}): Promise<void> {
  const host = process.env.EMAIL_SMTP_HOST
  const user = process.env.EMAIL_SMTP_USER
  const pass = process.env.EMAIL_SMTP_PASS
  const from = process.env.EMAIL_FROM ?? 'reservas@arcadasdofado.com'

  if (!host || host === 'placeholder_substituir' || !user || !pass) return

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_SMTP_PORT ?? '465'),
    secure: parseInt(process.env.EMAIL_SMTP_PORT ?? '465') === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  const locale = data.locale in emailI18n ? data.locale : 'pt'
  const i18n = emailI18n[locale]
  const dateFormatted = formatDatePT(data.date)
  const phoneClean = formatPhoneForWhatsApp(data.phone)
  const waLink = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
    i18n.waMessage(data.name, data.guests, dateFormatted, data.time)
  )}`

  await transporter.sendMail({
    from: `Arcadas do Fado <${from}>`,
    to: 'geral@arcadasdofado.com',
    subject: `🍽️ Nova Reserva — ${sanitizeInput(data.name)} · ${dateFormatted} · ${data.guests} pax`,
    html: buildInternalEmailHtml({ ...data, locale, waLink }),
  })
}

async function sendConfirmationEmail(data: {
  name: string
  email: string
  date: string
  time: string
  guests: number
  occasion?: string
  notes?: string
  locale: string
}): Promise<void> {
  const host = process.env.EMAIL_SMTP_HOST
  const user = process.env.EMAIL_SMTP_USER
  const pass = process.env.EMAIL_SMTP_PASS
  const from = process.env.EMAIL_FROM ?? 'reservas@arcadasdofado.com'
  const cc = process.env.EMAIL_CC || undefined

  if (!host || host === 'placeholder_substituir' || !user || !pass) return

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_SMTP_PORT ?? '465'),
    secure: parseInt(process.env.EMAIL_SMTP_PORT ?? '465') === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })

  await transporter.sendMail({
    from: `Arcadas do Fado <${from}>`,
    to: data.email,
    ...(cc && { cc }),
    subject: 'Pedido de Reserva Recebido — Arcadas do Fado',
    html: buildEmailHtml(data),
  })
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req)
    const { allowed, reason } = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: reason === 'daily_limit' ? 'daily_limit' : 'rate_limit' },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Honeypot check
    if (body.honeypot || body.website) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Handle event inquiry (different endpoint usage)
    if (body.type === 'event_inquiry') {
      const telegramMsg = `📋 *PEDIDO DE EVENTO PRIVADO — Arcadas do Fado*\n\n👤 *Nome:* ${sanitizeInput(body.name ?? '')}\n📧 *Email:* ${sanitizeInput(body.email ?? '')}\n🎪 *Evento:* ${sanitizeInput(body.eventType ?? '')}\n📅 *Data:* ${body.date || '—'}\n👥 *Pessoas:* ${body.guests || '—'}\n📝 *Mensagem:* ${sanitizeInput(body.message ?? '')}`
      await sendTelegramNotification(telegramMsg)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Reservation form
    const { name, email, phone, date, time, guests, occasion, notes, consent, locale } = body

    if (!consent) {
      return NextResponse.json({ error: 'consent_required' }, { status: 400 })
    }

    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    // Date validations
    if (isPastDate(date)) {
      return NextResponse.json({ error: 'past_date' }, { status: 400 })
    }

    if (isClosed(date)) {
      return NextResponse.json({ error: 'closed_day' }, { status: 400 })
    }

    if (guests > 60) {
      return NextResponse.json({ error: 'max_guests' }, { status: 400 })
    }

    const cleanData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      date,
      time,
      guests: parseInt(String(guests)),
      occasion: occasion && occasion !== 'none' ? sanitizeInput(occasion) : undefined,
      notes: notes ? sanitizeInput(notes).slice(0, 300) : undefined,
      locale: locale ?? 'pt',
    }

    // Send notifications in parallel (don't fail the response if they fail)
    const [emailResult, internalEmailResult] = await Promise.allSettled([
      sendConfirmationEmail(cleanData),
      sendInternalNotificationEmail({ ...cleanData, phone: sanitizeInput(phone) }),
    ])
    if (emailResult.status === 'rejected') console.error('Email error:', emailResult.reason)
    if (internalEmailResult.status === 'rejected') console.error('Internal email error:', internalEmailResult.reason)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Reservation API error:', error)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
