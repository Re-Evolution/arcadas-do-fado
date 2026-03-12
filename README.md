# Arcadas do Fado — Website

Landing page profissional para o restaurante Arcadas do Fado em Almancil, Algarve.
Desenvolvido por [Re-Evolution](https://re-evolution.pt).

---

## Stack Tecnológico

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS 3**
- **Framer Motion** (animações)
- **next-intl** (i18n — PT, EN, FR, DE, ES)
- **react-hook-form + Zod** (validação de formulários)
- **Nodemailer** (envio de email)

---

## Instalação

```bash
# Clonar / entrar na pasta
cd arcadas-do-fado

# Instalar dependências
npm install

# Configurar environment variables
cp .env.local .env.local.example
# Editar .env.local com os dados reais (ver docs/AUTOMATIONS_SETUP.md)

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm start
```

---

## Environment Variables

Ver `.env.local` para a lista completa. As variáveis críticas são:

| Variável | Descrição |
|----------|-----------|
| `TELEGRAM_BOT_TOKEN` | Token do bot Telegram para notificações |
| `TELEGRAM_CHAT_ID` | Chat ID do Telegram do gestor |
| `EMAIL_SMTP_HOST` | Servidor SMTP para emails |
| `EMAIL_SMTP_USER` | Utilizador SMTP |
| `EMAIL_SMTP_PASS` | Password SMTP |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID do Google Analytics 4 |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Chave pública reCAPTCHA v3 |
| `RECAPTCHA_SECRET_KEY` | Chave secreta reCAPTCHA v3 |

**Ver `docs/AUTOMATIONS_SETUP.md` para instruções detalhadas.**

---

## Estrutura do Projeto

```
/app/
  /[locale]/          → Páginas com routing i18n
    layout.tsx        → Layout principal (metadados, Schema.org)
    page.tsx          → Homepage
    /privacy-policy/
    /terms-of-service/
    /cookie-policy/
    /cancellation-policy/
  /api/reservations/  → API route de reservas
  /robots.txt/        → robots.txt dinâmico
  /sitemap.xml/       → Sitemap automático com hreflang
/components/
  /sections/          → Secções da homepage
  /ui/                → Componentes reutilizáveis
/data/
  client-info.ts      → Dados do cliente e menu
/lib/
  analytics.ts        → Google Analytics 4
  cookie-consent.ts   → Gestão RGPD de cookies
  validations.ts      → Schemas Zod
  rate-limit.ts       → Rate limiting
  utils.ts            → Utilitários
/messages/
  pt.json, en.json, fr.json, de.json, es.json
/i18n/
  routing.ts          → Configuração de rotas i18n
  request.ts          → Server-side i18n
/public/images/       → Imagens (substituir placeholders)
/docs/                → Documentação técnica
```

---

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
npm start        # Servidor de produção
npm run lint     # ESLint
```

---

## Deploy

Ver `docs/DEPLOYMENT.md` para instruções completas de deploy na Vercel.

---

## Imagens

As imagens atuais são placeholders do Unsplash. Para substituir pelas fotos reais do cliente, ver `docs/IMAGE_SETUP.md`.

---

## Documentação

- [`docs/AUTOMATIONS_SETUP.md`](docs/AUTOMATIONS_SETUP.md) — Configuração Telegram, SMTP, reCAPTCHA
- [`docs/IMAGE_SETUP.md`](docs/IMAGE_SETUP.md) — Gestão de imagens
- [`docs/SECURITY.md`](docs/SECURITY.md) — Medidas de segurança implementadas
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Deploy na Vercel
