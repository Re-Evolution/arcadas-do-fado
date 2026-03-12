'use client'

export default function CookieSettingsLink() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as Window & { openCookieSettings?: () => void }).openCookieSettings) {
      (window as Window & { openCookieSettings?: () => void }).openCookieSettings!()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="text-rust underline hover:text-rust-dark transition-colors cursor-pointer"
    >
      Definições de Cookies
    </button>
  )
}
