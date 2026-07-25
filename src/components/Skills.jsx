import styles from './Sections.module.css'

const SKILLS = [
  { head: 'Data & Automation', chips: ['Shopify','BigQuery','Supabase','Google Sheets BI','REST APIs'] },
  { head: 'Full Stack & MERN', chips: ['MongoDB','Express.js','React','Node.js','Tailwind CSS'] },
  { head: 'Backend & Languages', chips: ['Laravel','PHP','Python','Java','C++','C#'] },
  { head: 'AI Tools & Workflow', chips: ['Claude Code','Arduino','Figma','Git'] },
]

export default function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow"><span className="eyebrow-kanji">二</span>Skills<span className="eyebrow-line" /></p>
          <h2 className="section-title">Technical proficiency</h2>
          <p className="lede" style={{ marginBottom: '2.6rem' }}>
            Comfortable jumping into a new framework or tool when a project calls for it.
          </p>
        </div>
        <div className={styles.grid4}>
          {SKILLS.map((s, i) => (
            <div key={s.head} className="panel reveal" style={{ '--d': `${i * 80}ms` }}>
              <p className={styles.panelHead}>{s.head}</p>
              <div className="chips">
                {s.chips.map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
