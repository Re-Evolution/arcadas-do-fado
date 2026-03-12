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

function buildEmailHtml(data: {
  name: string
  date: string
  time: string
  guests: number
  occasion?: string
  notes?: string
  locale: string
}): string {
  const dateFormatted = formatDatePT(data.date)
  const occasionMap: Record<string, string> = {
    birthday: 'Aniversário',
    honeymoon: 'Lua de mel',
    celebration: 'Celebração',
    other: 'Outro',
    none: '—',
  }
  const occasionLabel = data.occasion ? (occasionMap[data.occasion] ?? '—') : '—'

  return `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido de Reserva Recebido — Arcadas do Fado</title>
</head>
<body style="margin:0;padding:0;background:#F5EDD8;font-family:Georgia,serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD8;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#FDFAF6;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#2C1810;padding:32px;text-align:center;">
            <p style="color:#B5562A;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Arcadas do Fado</p>
            <h1 style="color:#FDFAF6;font-size:24px;font-weight:300;margin:0;line-height:1.3;">Pedido de Reserva Recebido</h1>
            <p style="color:#D4845A;font-size:13px;margin:8px 0 0;">Almancil, Algarve</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 32px;">
            <p style="color:#3D2314;font-size:18px;margin:0 0 20px;">Caro/a <strong>${sanitizeInput(data.name)}</strong>,</p>
            <p style="color:#5a3a28;font-size:16px;line-height:1.7;margin:0 0 24px;">
              Obrigado pelo seu pedido de reserva nas Arcadas do Fado. Recebemos o seu pedido e entraremos em contacto brevemente para confirmar a sua reserva.
            </p>

            <!-- Details box -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD8;border-radius:12px;padding:24px;margin:0 0 24px;">
              <tr><td>
                <p style="color:#7A3318;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">Detalhes da Reserva</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    ['📅 Data', dateFormatted],
                    ['🕗 Hora', data.time],
                    ['👥 Pessoas', String(data.guests)],
                    ['🎉 Ocasião', occasionLabel],
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

            <!-- Show reminder -->
            <div style="background:#B5562A;border-radius:12px;padding:16px 20px;margin:0 0 24px;text-align:center;">
              <p style="color:#FDFAF6;font-size:13px;margin:0;font-weight:500;">🎶 Espetáculo de Fado ao Vivo às 21h30 (Sextas e Sábados)</p>
            </div>

            <p style="color:#5a3a28;font-size:15px;line-height:1.7;margin:0 0 8px;">
              Para qualquer questão, contacte-nos:
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

async function sendTelegramNotification(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId || token === 'placeholder_substituir') return

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
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
  const cc = process.env.EMAIL_CC ?? 'geral@arcadasdofado.com'

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
    cc,
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
    const [emailResult, telegramResult] = await Promise.allSettled([
      sendConfirmationEmail(cleanData),
      sendTelegramNotification(buildTelegramMessage({ ...cleanData, phone: sanitizeInput(phone) })),
    ])
    if (emailResult.status === 'rejected') console.error('Email error:', emailResult.reason)
    if (telegramResult.status === 'rejected') console.error('Telegram error:', telegramResult.reason)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Reservation API error:', error)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
