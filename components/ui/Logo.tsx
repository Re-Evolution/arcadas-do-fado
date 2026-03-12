interface LogoProps {
  className?: string
  isDark?: boolean
}

export default function Logo({ className = 'h-12', isDark = false }: LogoProps) {
  const src = isDark
    ? '/images/logo/logo-white-no-background.png'
    : '/images/logo/logo-black-no-background.png'

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Arcadas do Fado"
      className={`w-auto object-contain ${className}`}
    />
  )
}
