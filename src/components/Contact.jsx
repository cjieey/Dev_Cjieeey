import { useState } from 'react'
import styles from './Sections.module.css'

const ACCESS_KEY = '5b22db49-dbe7-4b76-a1da-1636d86f74ff'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setSending(true); setStatus('')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          from_name: form.name,
          subject: `Portfolio Inquiry: ${form.subject}`,
          replyto: form.email,
          'Sender Name': form.name,
          'Sender Email': form.email,
          'Inquiry Subject': form.subject,
          'Message Content': form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('✓ Message sent!')
        setForm({ name:'', email:'', subject:'', message:'' })
      } else throw new Error()
    } catch {
      window.location.href = `mailto:magbunagceljie@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(form.message)}`
    } finally { setSending(false) }
  }

  return (
    <section id="contact" className={styles.contactSection}>
      <div className="wrap">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-kanji">六</span>Get in touch
          </p>
          <h2 className="section-title">Let's talk</h2>
          <p className="lede" style={{ margin: '0 auto 2.4rem' }}>
            Open to front-end, full-stack, and data-automation roles — and available for talks on
            software development and emerging technologies.
          </p>
          <a className={styles.mailto} href="mailto:magbunagceljie@gmail.com">
            magbunagceljie@gmail.com
          </a>
          <div className={styles.ctaRow}>
            <a className="btn btn--solid" href="mailto:magbunagceljie@gmail.com">Send an email</a>
            <a className="btn" href="https://www.linkedin.com/in/celjie-magbunag-a9a59b379/" target="_blank" rel="noopener">LinkedIn</a>
            <a className="btn" href="/resume.html" target="_blank" rel="noopener">Download résumé</a>
          </div>
        </div>

        <form className={`${styles.contactForm} reveal`} onSubmit={submit} style={{ '--d': '120ms' }}>
          {[
            { id:'name',    label:'Your Name',  type:'text',  ph:'Jane Smith' },
            { id:'email',   label:'Your Email', type:'email', ph:'jane@example.com' },
            { id:'subject', label:'Subject',    type:'text',  ph:'Project Inquiry / Job Opportunity' },
          ].map(f => (
            <div key={f.id}>
              <label className={styles.label}>{f.label}</label>
              <input
                type={f.type} required placeholder={f.ph}
                value={form[f.id]}
                onChange={set(f.id)}
                className={styles.input}
              />
            </div>
          ))}
          <div>
            <label className={styles.label}>Message</label>
            <textarea
              required rows={5} placeholder="Describe your project, role, or proposal..."
              value={form.message} onChange={set('message')}
              className={styles.input}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className={styles.formFooter}>
            {status && <span className={styles.formStatus}>{status}</span>}
            <button type="submit" className="btn btn--solid" disabled={sending}>
              {sending ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
