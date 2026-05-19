import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

const LANGS = [
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' }
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar navbar-expand-lg fixed-top novus-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#inicio" onClick={() => scrollTo('inicio')} style={{ textDecoration: 'none' }}>
          <img src="/logo.svg" alt="Novus" height="38" />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.08em' }}>NOVUS</div>
            <div style={{ color: 'rgba(201,168,76,0.85)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Pre Ibérica S.L.</div>
          </div>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {[
              { key: 'nav.home', id: 'inicio' },
              { key: 'nav.services', id: 'servicios' },
              { key: 'nav.calc', id: 'calculadora' },
              { key: 'nav.howItWorks', id: 'como-funciona' },
              { key: 'nav.about', id: 'nosotros' },
              { key: 'nav.contact', id: 'contacto' }
            ].map(({ key, id }) => (
              <li className="nav-item" key={id}>
                <button className="nav-link btn btn-link" onClick={() => scrollTo(id)}>
                  {t(key)}
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center ms-lg-4 mt-3 mt-lg-0 gap-1">
            {LANGS.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => i18n.changeLanguage(code)}
                className={`btn btn-sm lang-btn ${i18n.language === code ? 'active' : ''}`}
              >
                <span className="me-1">{flag}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
