import styles from './Sections.module.css'

const STEPS = [
  { yr: '4th Year College', what: 'Capstone · GCC AI Smart Companion', note: 'Laravel · Groq API' },
  { yr: '3rd Year College', what: 'Medisync · ICU Management', note: 'Laravel · MySQL' },
  { yr: '2nd Year', what: 'Web Fundamentals', note: 'HTML · CSS · JS · PHP' },
  { yr: '1st Year', what: 'Programming Logic', note: 'Python · C++ · Java' },
  { yr: 'High School', what: 'Gingoog City Comprehensive NHS', note: 'Pre-BSIT track' },
]

export default function Journey() {
  return (
    <section id="journey">
      <div className={`wrap ${styles.split}`}>
        <div className="reveal">
          <p className="eyebrow"><span className="eyebrow-kanji">三</span>Journey<span className="eyebrow-line" /></p>
          <h2 className="section-title">Education</h2>
          <p className="lede">Read bottom-up — each year added a layer.</p>
        </div>
        <ol className={`${styles.path} reveal`} style={{ '--d': '120ms' }}>
          {STEPS.map(s => (
            <li key={s.yr}>
              <span className={styles.pathYr}>{s.yr}</span>
              <p className={styles.pathWhat}>{s.what}</p>
              <p className={styles.pathNote}>{s.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
