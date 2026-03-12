import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt', 'en', 'fr', 'de', 'es'],
  defaultLocale: 'pt',
  localePrefix: 'always',
})
