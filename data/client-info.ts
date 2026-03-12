export const clientData = {
  business: {
    name: 'Arcadas do Fado',
    type: 'Restaurante com Fado ao Vivo',
    tagline: 'Uma Noite de Fado no Algarve',
    taglineSub: 'Gastronomia portuguesa e fado ao vivo em Almancil',
    capacity: 60,
  },
  contact: {
    address: 'Av. 5 de Outubro 85, 8135-100 Almancil',
    phone: '+351 289 398 113',
    phoneClean: '351289398113',
    mobile: '+351 919 457 238',
    mobileClean: '351919457238',
    email: 'geral@arcadasdofado.com',
    googleMaps: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0xd1ab34d53dc8fcb:0xa1e53d2fb64a8b47',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3178.5!2d-8.163!3d37.072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ab34d53dc8fcb%3A0xa1e53d2fb64a8b47!2sArcadas%20do%20Fado!5e0!3m2!1spt!2spt!4v1',
  },
  hours: {
    fridaySaturday: '20h00 – 23h45',
    tuesdayToThursday: 'Reservas para grupos ≥ 20 pessoas',
    sundayMonday: 'Encerrado',
  },
  social: {
    facebook: 'https://www.facebook.com/arcadasdofado',
    instagram: 'https://www.instagram.com/arcadasdofado/',
  },
  show: {
    startTime: '21h30',
    coverCharge: 5.00,
    days: ['Sexta-feira', 'Sábado'],
    description: 'Fado ao vivo com fadistas convidados, dois guitarristas portugueses e Alexandra',
  },
  artist: {
    name: 'Alexandra',
    fullName: 'Maria José Canhoto',
    born: '25 de abril de 1950, Soalheira, Fundão',
  },
  seo: {
    siteUrl: 'https://arcadasdofado.com',
    ogImage: '/images/og-image.jpg',
    twitterImage: '/images/twitter-image.jpg',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: process.env.TELEGRAM_CHAT_ID ?? '',
  },
  email: {
    smtpFrom: process.env.EMAIL_FROM ?? 'reservas@arcadasdofado.com',
    notificationCc: process.env.EMAIL_CC ?? 'geral@arcadasdofado.com',
  },
}

export const menuData = {
  couvert: [
    { name: 'Pão, manteiga, azeitonas e cenouras', price: 4.00 },
  ],
  entradas: [
    { name: 'Cogumelos salteados com bacon e queijo', price: 15.00 },
    { name: 'Camarão frito ao alhinho', price: 17.00 },
  ],
  saladas: [
    { name: 'Salada mista', price: 6.00 },
    { name: 'Salada de tomate com queijo e ervas', price: 7.00 },
    { name: 'Salada fresca de salmão fumado com queijo de cabra, molho gengibre, mel e mostarda', price: 21.00 },
  ],
  vegetariano: [
    { name: 'Lasanha de vegetais', price: 21.00 },
  ],
  peixe: [
    { name: 'Filetes de robalo com molho cremoso de laranja, estragão e laminado de amêndoa torrada', price: 24.00 },
    { name: 'Bacalhau à Brás', price: 22.00 },
    { name: 'Açorda de camarão à Arcadas do Fado', price: 25.00 },
    { name: 'Lulinhas à Arcadas do Fado', price: 24.00 },
  ],
  carne: [
    { name: 'Cordeiro de leite com esmagado de batata, legumes, molho de figo e cogumelos', price: 29.00 },
    { name: 'Bochechas de porco em cama de esmagado de batata com molho de figos e cogumelos', price: 26.00 },
    { name: 'Arroz de Pato', price: 24.00 },
  ],
  sobremesas: [
    { name: 'Arroz doce cremoso', price: 9.00 },
    { name: 'Brownie de chocolate com gelado', price: 10.00 },
    { name: 'Petit Gâteau com gelado', price: 10.00 },
    { name: 'Profiteroles recheados com gelado cobertos com chocolate quente', price: 10.00 },
    { name: 'Taça de gelado', price: 8.00 },
    { name: 'Fruta', price: 6.00 },
  ],
  espetaculo: [
    { name: 'Cover charge fado ao vivo', price: 5.00 },
  ],
}

export const testimonials = [
  // Alternating Google / TheFork
  {
    name: 'Tiger Martin',
    role: 'Guia local · 44 críticas',
    rating: 5,
    ratingMax: 5 as const,
    text: 'Wow! What a place! So beautiful and elegant. The staff are fantastic! Food is great and the wine menu has been chosen with care. Really a hidden gem and such a special place! Alexandra, the famous Fadista, serenading with her immaculate voice is the cherry on the cake of this amazing experience. You must book!',
    source: 'Google' as const,
    date: undefined as string | undefined,
  },
  {
    name: 'Alexandra B.',
    role: '2 avaliações',
    rating: 10,
    ratingMax: 10 as const,
    text: 'Serviço muito atencioso. Comida tradicional portuguesa muito boa. Experiência incrível.',
    source: 'TheFork' as const,
    date: '21 de novembro de 2025',
  },
  {
    name: 'Madeleine Hicks',
    role: 'Guia local · 15 críticas',
    rating: 5,
    ratingMax: 5 as const,
    text: 'Great food, amazing voices, inspiring architectures. The atmosphere was electric. Thank you for a wonderful cultural experience.',
    source: 'Google' as const,
    date: undefined as string | undefined,
  },
  {
    name: 'Tiago O.',
    role: '6 avaliações',
    rating: 8,
    ratingMax: 10 as const,
    text: 'Qualidade da comida. Serviço, sala e ambiente muito bom! Perfeito para uma noite diferente.',
    source: 'TheFork' as const,
    date: '14 de novembro de 2025',
  },
  {
    name: 'Callista van Wienen',
    role: '6 críticas',
    rating: 5,
    ratingMax: 5 as const,
    text: 'The place is beautiful! The service was the best we\'ve seen our whole vacation, good food and the fado music was excellent, the rice pudding for dessert was also a favourite. I would definitely come here again.',
    source: 'Google' as const,
    date: undefined as string | undefined,
  },
  {
    name: 'Isabel B.',
    role: '1 avaliação',
    rating: 10,
    ratingMax: 10 as const,
    text: 'Se procura um momento de qualidade desde o atendimento ao final do show aconselho. Atendimento muito bom mesmo, comer 5 estrelas e sem deixar de falar nos fadistas exelentes. Aconselho, vão gostar.',
    source: 'TheFork' as const,
    date: '1 de agosto de 2025',
  },
  {
    name: 'Rui C.',
    role: '3 avaliações',
    rating: 10,
    ratingMax: 10 as const,
    text: 'Um espaço muito bonito. A menina Sara é muito simpática, a comida muito boa, os guitarristas e o fadista muito bons e de ressalvar a anfitriã Alexandra que demonstrou que é uma predestinada para o fado. Recomendo.',
    source: 'TheFork' as const,
    date: '28 de junho de 2025',
  },
  {
    name: 'Marcia B.',
    role: '1 avaliação',
    rating: 10,
    ratingMax: 10 as const,
    text: 'Foi uma noite maravilhosa. Ótima comida, ótimo serviço, a Sarah é muito divertida. E o melhor de tudo foi a apresentação da Alexandra, muito emocionante, ela é espetacular.',
    source: 'TheFork' as const,
    date: '7 de junho de 2025',
  },
]

export type Testimonial = typeof testimonials[number]
