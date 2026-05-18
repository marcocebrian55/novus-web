import { useTranslation } from 'react-i18next'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="novus-footer">
      <div className="container">
        <div className="row py-5 g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/logo.svg" alt="Novus" className="footer-logo" />
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em' }}>NOVUS</div>
                <div style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Capital Partners</div>
              </div>
            </div>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>

          <div className="col-lg-2 col-6">
            <p className="footer-heading">Navegación</p>
            <div className="d-flex flex-column gap-2">
              {[
                { key: 'nav.home', id: 'inicio' },
                { key: 'nav.services', id: 'servicios' },
                { key: 'nav.howItWorks', id: 'como-funciona' },
                { key: 'nav.about', id: 'nosotros' }
              ].map(({ key, id }) => (
                <button key={id} className="footer-link text-start" onClick={() => scrollTo(id)}>
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <p className="footer-heading">Servicios</p>
            <div className="d-flex flex-column gap-2">
              <button className="footer-link text-start" onClick={() => scrollTo('servicios')}>{t('services.buy.title')}</button>
              <button className="footer-link text-start" onClick={() => scrollTo('servicios')}>{t('services.sell.title')}</button>
              <button className="footer-link text-start" onClick={() => scrollTo('servicios')}>{t('services.advisory.title')}</button>
            </div>
          </div>

          <div className="col-lg-3">
            <p className="footer-heading">Contacto</p>
            <div className="d-flex flex-column gap-2">
              <a href="mailto:pablo.garcia@novus-iberica.com" className="footer-link">pablo.garcia@novus-iberica.com</a>
              <a href="https://wa.me/34674505282" target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp · +34 674 505 282</a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="row py-3 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <small className="footer-copy">© {new Date().getFullYear()} Novus Capital Partners S.L. — {t('footer.rights')}</small>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <a href="#" className="footer-link me-3"><small>{t('footer.legal')}</small></a>
            <a href="#" className="footer-link"><small>{t('footer.privacy')}</small></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
