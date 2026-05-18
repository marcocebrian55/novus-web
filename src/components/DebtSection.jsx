import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const CHECK = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

function ScenarioItem({ text, index }) {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })
  return (
    <motion.li
      ref={ref}
      className="debt-scenario-item"
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      {CHECK}
      <span>{text}</span>
    </motion.li>
  )
}

export default function DebtSection() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true })
  const scenarios = t('debt.scenarios', { returnObjects: true })

  return (
    <section id="deuda" className="debt-section">
      {/* fondo textura sutil */}
      <div className="debt-bg-texture" />

      <div className="container" ref={ref}>
        <div className="row align-items-center g-5">

          {/* Columna izquierda — copy emocional */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65 }}
            >
              <span className="label-tag label-tag--light">{t('debt.label')}</span>

              <h2 className="debt-title">
                {t('debt.title')}
                <br />
                <span className="debt-title-accent">{t('debt.titleAccent')}</span>
              </h2>

              <p className="debt-subtitle">{t('debt.subtitle')}</p>

              <ul className="debt-scenarios">
                {scenarios.map((s, i) => (
                  <ScenarioItem key={i} text={s.text} index={i} />
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Columna derecha — callout + CTA */}
          <div className="col-lg-5 offset-lg-1">
            <motion.div
              className="debt-callout-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.2 }}
            >
              <div className="debt-callout-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>

              <p className="debt-callout-text">{t('debt.callout')}</p>

              <button
                className="btn-novus-gold w-100"
                style={{ fontSize: '0.95rem', padding: '1rem' }}
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('debt.cta')}
              </button>

              <p className="debt-callout-note">{t('debt.ctaNote')}</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
