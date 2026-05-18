import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function StepItem({ step, index }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className="step-item"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="step-num">{String(index + 1).padStart(2, '0')}</div>
      <h4>{step.title}</h4>
      <p>{step.desc}</p>
    </motion.div>
  )
}

export default function HowItWorks() {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true })
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="como-funciona" className="section-padding bg-dark">
      <div className="container">
        <motion.div
          ref={ref}
          className="text-center mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label-tag">{t('howItWorks.title')}</span>
          <h2 className="section-heading light">{t('howItWorks.subtitle')}</h2>
        </motion.div>

        <div className="steps-wrapper">
          {steps.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
