import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto" className="section-padding" style={{ background: 'var(--cream)' }}>
      <div className="container">
        <motion.div
          className="text-center mb-5"
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label-tag">{t('contact.title')}</span>
          <h2 className="section-heading">{t('contact.subtitle')}</h2>
        </motion.div>

        <div className="row justify-content-center g-4">
          {/* Panel de promesa */}
          <motion.div
            className="col-lg-4"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <div className="contact-promise-panel">
              <div className="contact-promise-icon">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="contact-promise-text">{t('contact.promise')}</p>

              <div className="contact-promise-divider" />

              <div className="contact-promise-items">
                {[
                  { icon: '🔒', text: 'Consulta 100% confidencial' },
                  { icon: '⏱', text: 'Respuesta en menos de 24h' },
                  { icon: '✓',  text: 'Sin compromiso' },
                  { icon: '📋', text: 'Análisis gratuito de tu caso' }
                ].map(({ icon, text }) => (
                  <div key={text} className="contact-promise-item">
                    <span className="contact-promise-item-icon">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/34674505282"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-100 mt-4"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.527 5.849L.057 23.475a.75.75 0 00.918.919l5.726-1.485A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.711 9.711 0 01-4.937-1.345l-.355-.21-3.676.953.979-3.574-.228-.367A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                {t('contact.whatsapp')}
              </a>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <div className="contact-wrapper">
              {sent ? (
                <div className="alert-success-novus text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ color: '#16a34a', marginBottom: '1rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{t('contact.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" name="name" className="novus-input" placeholder={t('contact.name')} value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" name="email" className="novus-input" placeholder={t('contact.email')} value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="tel" name="phone" className="novus-input" placeholder={t('contact.phone')} value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <select name="service" className="novus-input" value={form.service} onChange={handleChange} required>
                        <option value="">{t('contact.selectService')}</option>
                        <option value="sell">{t('contact.services.sell')}</option>
                        <option value="buy">{t('contact.services.buy')}</option>
                        <option value="advisory">{t('contact.services.advisory')}</option>
                        <option value="other">{t('contact.services.other')}</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea name="message" className="novus-input" rows="5" placeholder={t('contact.message')} value={form.message} onChange={handleChange} required style={{ resize: 'vertical' }} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn-novus-gold w-100 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm" />}
                        {t('contact.send')}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
