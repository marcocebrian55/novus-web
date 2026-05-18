import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const ICON_BUY = (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
  </svg>
)

const ICON_SELL = (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

const ICON_ADV = (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>
)

function SideCard({ icon, titleKey, descKey, index }) {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className="service-side-card"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12 }}
    >
      <div className="service-icon-wrap">{icon}</div>
      <h3 className="service-side-title">{t(titleKey)}</h3>
      <p className="service-side-desc">{t(descKey)}</p>
      <button
        className="service-link"
        onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
      >
        {t('services.cta')} →
      </button>
    </motion.div>
  )
}

export default function Services() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true })

  return (
    <section id="servicios" className="section-padding bg-cream">
      <div className="container">

        <motion.div
          ref={ref}
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="label-tag">{t('services.title')}</span>
          <h2 className="section-heading">{t('services.subtitle')}</h2>
        </motion.div>

        {/* Servicio estrella — deuda hipotecaria */}
        <motion.div
          className="service-featured-card"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="service-featured-badge">{t('services.featured')}</div>

          <div className="service-featured-inner">
            <div className="service-featured-icon">
              {ICON_SELL}
            </div>

            <div className="service-featured-body">
              <h3 className="service-featured-title">{t('services.sell.title')}</h3>
              <p className="service-featured-desc">{t('services.sell.desc')}</p>
            </div>

            <div className="service-featured-action">
              <div className="service-featured-tag">{t('services.sell.badge')}</div>
              <button
                className="btn-novus-gold"
                style={{ fontSize: '0.88rem', padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('services.cta')} →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Servicios secundarios */}
        <div className="services-secondary-grid">
          <SideCard icon={ICON_BUY} titleKey="services.buy.title" descKey="services.buy.desc" index={0} />
          <SideCard icon={ICON_ADV} titleKey="services.advisory.title" descKey="services.advisory.desc" index={1} />
        </div>

      </div>
    </section>
  )
}
