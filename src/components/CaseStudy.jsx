import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function CaseStep({ step, index }) {
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className="case-step"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <span className="case-step-num">{step.num}</span>
      <div>
        <p className="case-step-title">{step.title}</p>
        <p className="case-step-desc">{step.desc}</p>
      </div>
    </motion.div>
  )
}

export default function CaseStudy() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true })
  const steps = t('case.steps', { returnObjects: true })

  return (
    <section id="caso-real" className="case-section">
      <div className="container" ref={ref}>

        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label-tag">{t('case.label')}</span>
        </motion.div>

        <div className="case-card">
          {/* Lado izquierdo — stat grande */}
          <motion.div
            className="case-stat-side"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="case-stat-value">{t('case.stat')}</p>
            <p className="case-stat-desc">{t('case.statDesc')}</p>

            <div className="case-divider" />

            <h3 className="case-title">
              {t('case.title').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h3>
          </motion.div>

          {/* Lado derecho — pasos */}
          <motion.div
            className="case-steps-side"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {steps.map((step, i) => (
              <CaseStep key={i} step={step} index={i} />
            ))}
          </motion.div>
        </div>

        {/* CTA + disclaimer */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            className="btn-novus-gold"
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('case.cta')} →
          </button>
          <p className="case-disclaimer">{t('case.disclaimer')}</p>
        </motion.div>

      </div>
    </section>
  )
}
