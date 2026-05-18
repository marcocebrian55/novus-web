import { useTranslation } from 'react-i18next'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

const STATS = [
  { raw: 20,  prefix: '+', suffix: '',   key: 'operations' },
  { raw: 30,  prefix: '',  suffix: '',   key: 'days' },
  { raw: 100, prefix: '',  suffix: '%',  key: 'conversion' },
  { raw: 5,   prefix: '+', suffix: '',   key: 'team' }
]

function AnimatedCounter({ raw, prefix, suffix }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true })

  useEffect(() => {
    if (inView) animate(count, raw, { duration: 1.8, ease: 'easeOut' })
  }, [inView, count, raw])

  return (
    <div ref={ref} className="stat-value">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </div>
  )
}

function StatCard({ stat, index }) {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <AnimatedCounter {...stat} />
      <div className="stat-label">{t(`about.stats.${stat.key}`)}</div>
    </motion.div>
  )
}

export default function About() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="nosotros" className="section-padding">
      <div className="container">
        <div className="row align-items-center g-5">
          <motion.div
            ref={ref}
            className="col-lg-6"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="label-tag">{t('about.title')}</span>
            <h2 className="section-heading">{t('about.subtitle')}</h2>
            <p className="about-text">{t('about.p1')}</p>
            <p className="about-text">{t('about.p2')}</p>
            <button
              className="btn-novus-gold mt-2"
              style={{ padding: '0.8rem 1.75rem', fontSize: '0.9rem' }}
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('contact.title')} →
            </button>
          </motion.div>

          <div className="col-lg-6">
            <div className="stats-grid">
              {STATS.map((stat, i) => (
                <StatCard key={stat.key} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
