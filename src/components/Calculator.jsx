import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// ── Fórmulas ─────────────────────────────────────────────────
function calcMortgage(principal, annualRate, years) {
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return { monthly: principal / n, total: principal, interest: 0 }
  const monthly  = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const total    = monthly * n
  const interest = total - principal
  return {
    monthly:  Math.round(monthly  * 100) / 100,
    total:    Math.round(total    * 100) / 100,
    interest: Math.round(interest * 100) / 100
  }
}

function calcShortening(principal, annualRate, years, extra) {
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return { monthsSaved: 0, interestSaved: 0, newMonths: n, stdMonthly: principal / n }

  const stdMonthly = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const stdInterest = stdMonthly * n - principal

  if (extra <= 0) return { monthsSaved: 0, interestSaved: 0, newMonths: n, stdMonthly }

  const newMonthly = stdMonthly + extra
  let balance = principal
  let months = 0
  let interestPaid = 0

  while (balance > 0.01 && months < n * 2) {
    const interestMonth = balance * r
    const principalMonth = Math.min(newMonthly - interestMonth, balance)
    if (principalMonth <= 0) break
    interestPaid += interestMonth
    balance -= principalMonth
    months++
  }

  return {
    stdMonthly:   Math.round(stdMonthly),
    monthsSaved:  Math.max(0, n - months),
    newMonths:    months,
    interestSaved: Math.round(Math.max(0, stdInterest - interestPaid))
  }
}

function fmt(n) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

// ── Slider ───────────────────────────────────────────────────
function Slider({ label, value, min, max, step, unit, onChange, formatVal, hint }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="calc-slider-wrap">
      <div className="calc-slider-header">
        <span className="calc-slider-label">{label}</span>
        <span className="calc-slider-value">{formatVal ? formatVal(value) : value}{unit}</span>
      </div>
      {hint && <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', margin: '-4px 0 6px' }}>{hint}</p>}
      <div className="calc-slider-track">
        <div className="calc-slider-fill" style={{ width: `${pct}%` }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="calc-range"
        />
      </div>
    </div>
  )
}

function ResultRow({ label, value, accent }) {
  return (
    <div className={`calc-result-row ${accent ? 'accent' : ''}`}>
      <span className="calc-result-label">{label}</span>
      <span className="calc-result-value">{value}</span>
    </div>
  )
}

// ── Calculadora 1: Negociación ────────────────────────────────
function CalcNeg({ scrollToContact }) {
  const { t } = useTranslation()
  const [principal,   setPrincipal]   = useState(150000)
  const [currentRate, setCurrentRate] = useState(3.5)
  const [newRate,     setNewRate]     = useState(2.2)
  const [years,       setYears]       = useState(20)

  const current    = calcMortgage(principal, currentRate, years)
  const negotiated = calcMortgage(principal, newRate, years)
  const savingsMonthly = Math.max(0, current.monthly - negotiated.monthly)
  const savingsTotal   = Math.max(0, current.interest - negotiated.interest)
  const hasSavings     = savingsMonthly > 0.5

  return (
    <div className="row g-4 justify-content-center">
      <div className="col-lg-5">
        <div className="calc-panel">
          <p className="calc-panel-title">{t('calc.yourMortgage')}</p>
          <Slider label={t('calc.capital')} value={principal} min={30000} max={600000} step={5000}
            unit="€" formatVal={fmt} onChange={setPrincipal} />
          <Slider label={t('calc.currentRate')} value={currentRate} min={0.5} max={8} step={0.1}
            unit="%" formatVal={v => v.toFixed(1)} onChange={setCurrentRate} />
          <Slider label={t('calc.years')} value={years} min={5} max={35} step={1}
            unit={` ${t('calc.yearsUnit')}`} onChange={setYears} />
          <div className="calc-divider" />
          <p className="calc-panel-title" style={{ color: 'var(--gold)' }}>{t('calc.afterNovus')}</p>
          <Slider label={t('calc.newRate')} value={newRate} min={0.5} max={currentRate} step={0.1}
            unit="%" formatVal={v => v.toFixed(1)}
            onChange={v => setNewRate(Math.min(v, currentRate))} />
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.5rem', lineHeight: 1.5 }}>
            {t('calc.disclaimer')}
          </p>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="calc-results">
          <div className="calc-scenario">
            <p className="calc-scenario-label">{t('calc.scenarioCurrent')}</p>
            <ResultRow label={t('calc.monthly')}   value={`${fmt(current.monthly)} €/mes`} />
            <ResultRow label={t('calc.totalCost')} value={`${fmt(current.total)} €`} />
            <ResultRow label={t('calc.interest')}  value={`${fmt(current.interest)} €`} />
          </div>
          <div className="calc-scenario">
            <p className="calc-scenario-label" style={{ color: 'var(--gold)' }}>{t('calc.scenarioNew')}</p>
            <ResultRow label={t('calc.monthly')}   value={`${fmt(negotiated.monthly)} €/mes`} />
            <ResultRow label={t('calc.totalCost')} value={`${fmt(negotiated.total)} €`} />
            <ResultRow label={t('calc.interest')}  value={`${fmt(negotiated.interest)} €`} />
          </div>
          <AnimatePresence>
            {hasSavings && (
              <motion.div className="calc-savings-box"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <div className="calc-savings-row">
                  <span>{t('calc.savingsMonthly')}</span>
                  <strong>{fmt(savingsMonthly)} €/mes</strong>
                </div>
                <div className="calc-savings-row main">
                  <span>{t('calc.savingsTotal')}</span>
                  <strong>{fmt(savingsTotal)} €</strong>
                </div>
                <p className="calc-savings-note">{t('calc.savingsNote')}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="btn-novus-gold w-100 mt-3" onClick={scrollToContact}>
            {t('calc.cta')} →
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem' }}>
            {t('calc.ctaNote')}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Calculadora 2: Acortamiento ───────────────────────────────
function CalcShort({ scrollToContact }) {
  const { t } = useTranslation()
  const [principal, setPrincipal] = useState(150000)
  const [rate,      setRate]      = useState(3.5)
  const [years,     setYears]     = useState(20)
  const [extra,     setExtra]     = useState(0)

  const result = calcShortening(principal, rate, years, extra)
  const hasSavings = extra > 0 && result.monthsSaved > 0

  const yearsSaved  = Math.floor(result.monthsSaved / 12)
  const monthsRest  = result.monthsSaved % 12
  const timeSavedTxt = yearsSaved > 0
    ? `${yearsSaved} año${yearsSaved > 1 ? 's' : ''}${monthsRest > 0 ? ` y ${monthsRest} mes${monthsRest > 1 ? 'es' : ''}` : ''}`
    : `${result.monthsSaved} mes${result.monthsSaved !== 1 ? 'es' : ''}`

  return (
    <div className="row g-4 justify-content-center">
      <div className="col-lg-5">
        <div className="calc-panel">
          <p className="calc-panel-title">{t('calc.short.panelTitle')}</p>
          <Slider label={t('calc.capital')} value={principal} min={30000} max={600000} step={5000}
            unit="€" formatVal={fmt} onChange={setPrincipal} />
          <Slider label={t('calc.currentRate')} value={rate} min={0.5} max={8} step={0.1}
            unit="%" formatVal={v => v.toFixed(1)} onChange={setRate} />
          <Slider label={t('calc.years')} value={years} min={5} max={35} step={1}
            unit={` ${t('calc.yearsUnit')}`} onChange={setYears} />
          <div className="calc-divider" />
          <p className="calc-panel-title" style={{ color: 'var(--gold)' }}>{t('calc.short.extra')}</p>
          <Slider
            label={t('calc.short.extra')}
            hint={t('calc.short.extraHint')}
            value={extra} min={0} max={1000} step={25}
            unit="€/mes" formatVal={fmt} onChange={setExtra}
          />
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.5rem', lineHeight: 1.5 }}>
            {t('calc.short.disclaimer')}
          </p>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="calc-results">
          {/* Cuota estándar */}
          <div className="calc-scenario">
            <p className="calc-scenario-label">{t('calc.scenarioCurrent')}</p>
            <ResultRow label={t('calc.monthly')}  value={`${fmt(result.stdMonthly)} €/mes`} />
            <ResultRow label={t('calc.years')}    value={`${years} ${t('calc.yearsUnit')}`} />
          </div>

          {/* Con pago extra */}
          <div className="calc-scenario">
            <p className="calc-scenario-label" style={{ color: 'var(--gold)' }}>
              {extra > 0 ? `Pagando ${fmt(result.stdMonthly + extra)} €/mes` : 'Con pago extra'}
            </p>
            <ResultRow
              label={t('calc.short.newTerm')}
              value={hasSavings ? `${result.newMonths} ${t('calc.short.months')}` : `${years * 12} ${t('calc.short.months')}`}
            />
            <ResultRow
              label={t('calc.short.timeSaved')}
              value={hasSavings ? timeSavedTxt : '—'}
              accent={hasSavings}
            />
          </div>

          <AnimatePresence>
            {hasSavings ? (
              <motion.div className="calc-savings-box"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <div className="calc-savings-row">
                  <span>{t('calc.short.timeSaved')}</span>
                  <strong>{timeSavedTxt}</strong>
                </div>
                <div className="calc-savings-row main">
                  <span>{t('calc.short.interestSaved')}</span>
                  <strong>{fmt(result.interestSaved)} €</strong>
                </div>
                <p className="calc-savings-note">{t('calc.short.savingsNote')}</p>
              </motion.div>
            ) : (
              <motion.div
                className="calc-no-savings"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p>{t('calc.short.noSavings')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="btn-novus-gold w-100 mt-3" onClick={scrollToContact}>
            {t('calc.short.cta')} →
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem' }}>
            {t('calc.short.ctaNote')}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function Calculator() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true })
  const [activeTab, setActiveTab] = useState('neg')

  const scrollToContact = useCallback(() => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section id="calculadora" className="section-padding" style={{ background: 'var(--dark)', position: 'relative', overflow: 'hidden' }}>
      {/* orbs decorativos */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" ref={ref}>
        {/* Cabecera */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label-tag">{t('calc.label')}</span>
          <h2 className="section-heading" style={{ color: '#fff' }}>{t('calc.title')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto', fontSize: '0.97rem' }}>
            {t('calc.subtitle')}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="calc-tabs-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <button
            className={`calc-tab-btn ${activeTab === 'neg' ? 'active' : ''}`}
            onClick={() => setActiveTab('neg')}
          >
            {t('calc.tabNeg')}
          </button>
          <button
            className={`calc-tab-btn ${activeTab === 'short' ? 'active' : ''}`}
            onClick={() => setActiveTab('short')}
          >
            {t('calc.tabShort')}
          </button>
        </motion.div>

        {/* Contenido */}
        <AnimatePresence mode="wait">
          {activeTab === 'neg' ? (
            <motion.div key="neg"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <CalcNeg scrollToContact={scrollToContact} />
            </motion.div>
          ) : (
            <motion.div key="short"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <CalcShort scrollToContact={scrollToContact} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
