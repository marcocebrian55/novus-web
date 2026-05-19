import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1], delay }
})

export default function Hero() {
  const { t } = useTranslation()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="inicio" className="hero-section">
      <motion.div
        className="hero-bg"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
      />
      <div className="hero-gradient" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="container hero-content">
        <div className="row">
          <div className="col-lg-8 col-xl-7">

            <motion.div className="hero-badge" {...fadeUp(0.2)}>
              Novus Pre Ibérica S.L.
            </motion.div>

            <motion.h1 className="hero-title" {...fadeUp(0.4)}>
              {t('hero.tagline1')}{' '}
              <span className="gold-word">{t('hero.taglineGold')}</span>
              <br />{t('hero.tagline2')}
            </motion.h1>

            <motion.div className="hero-divider" {...fadeUp(0.55)} />

            <motion.p className="hero-subtitle" {...fadeUp(0.6)}>
              {t('hero.subtitle')}
            </motion.p>

            <motion.div className="hero-ctas" {...fadeUp(0.75)}>
              <button className="btn-novus-gold" onClick={() => scrollTo('servicios')}>
                {t('hero.cta')}
              </button>
              <button className="btn-novus-outline" onClick={() => scrollTo('contacto')}>
                {t('hero.ctaSecondary')}
              </button>
            </motion.div>

          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-mouse" />
        <span>Scroll</span>
      </div>
    </section>
  )
}
