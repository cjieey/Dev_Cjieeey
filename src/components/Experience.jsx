import styles from './Sections.module.css'

export default function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow"><span className="eyebrow-kanji">五</span>Experience<span className="eyebrow-line" /></p>
          <h2 className="section-title">Professional experience</h2>
        </div>

        <article className={`${styles.role} reveal`} style={{ '--d': '80ms' }}>
          <div className={styles.roleTop}>
            <h3 className={styles.roleTitle}>E-commerce Data &amp; Automation Specialist</h3>
            <span className={styles.roleWhen}>2026 — Present</span>
          </div>
          <p className={styles.roleWhere}>Evecurls · Remote</p>
          <p className={styles.roleBody}>
            Developing automation workflows and centralized dashboards that transform data from multiple
            e-commerce platforms into actionable business insights — integrating APIs, automating
            reporting, and building dashboards for near <strong>real-time visibility</strong>.
          </p>
          <div className={styles.facts}>
            <div className={styles.fact}><b>Multi-platform sync</b><span>Shopify, Triple Whale, Gorgias, Meta Ads, GA4 via BigQuery.</span></div>
            <div className={styles.fact}><b>Process automation</b><span>Automates data collection and reporting to reduce manual latency.</span></div>
            <div className={styles.fact}><b>BI KPI dashboards</b><span>Sales, marketing, support, inventory, and regional performance.</span></div>
          </div>
          <div className="chips">
            {['Shopify','BigQuery','Supabase','Google Sheets BI','REST APIs','OpenAI','HTML · CSS · JS'].map(c =>
              <span key={c} className="chip">{c}</span>
            )}
          </div>
        </article>

        <article className={`${styles.role} reveal`} style={{ '--d': '160ms' }}>
          <div className={styles.roleTop}>
            <h3 className={styles.roleTitle}>Software Developer Intern</h3>
            <span className={styles.roleWhen}>2025 — Present</span>
          </div>
          <p className={styles.roleWhere}>Local Civil Registrar's Office (LCRO) · Gingoog City · On-site</p>
          <p className={styles.roleBody}>
            Building a system that <strong>scans birth certificates with AI</strong> and extracts
            printed text into structured fields. Turns a manual transcription job that took minutes
            per record into a near-instant review-and-confirm step.
          </p>
          <div className={styles.facts}>
            <div className={styles.fact}><b>AI OCR pipeline</b><span>Image-to-text tuned for handwritten and printed certificates.</span></div>
            <div className={styles.fact}><b>Smart autofill</b><span>Maps extracted text into the registry's existing fields.</span></div>
            <div className={styles.fact}><b>Faster workflow</b><span>Cuts manual entry time and reduces transcription errors.</span></div>
          </div>
          <div className="chips">
            {['AI / OCR','Laravel','Python','MySQL','Government tech'].map(c =>
              <span key={c} className="chip">{c}</span>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
