import styles from './Sections.module.css'

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={`wrap ${styles.split}`}>
        <div className="reveal">
          <p className="eyebrow"><span className="eyebrow-kanji">一</span>About<span className="eyebrow-line" /></p>
          <h2 className="section-title">Two blades,<br />one discipline</h2>
        </div>
        <div>
          <p className="lede reveal" style={{ '--d': '80ms' }}>
            I'm an aspiring Software Developer and a fresh Information Technology graduate from{' '}
            <strong>Gingoog City Colleges</strong>. I love building clean, user-friendly applications
            that work as well as they look. My focus has been on front-end development and full-stack
            systems using <strong>Laravel</strong>, the <strong>MERN stack</strong>, and modern web tooling.
          </p>
          <p className="lede reveal" style={{ '--d': '160ms', marginTop: '1.4rem' }}>
            I've shipped real-world projects — loan management systems, mobile-responsive dashboards,
            and AI-assisted tools — and I genuinely enjoy turning rough ideas into polished,
            production-ready software. As I begin my career, I'm excited to grow as a Front-End
            Developer while continuing to sharpen my back-end and system-design skills.
          </p>
          <div className={`${styles.grid2} reveal`} style={{ marginTop: '2.2rem', '--d': '240ms' }}>
            <div className="panel">
              <p className={styles.panelHead}>Beyond coding</p>
              <p style={{ color: 'var(--bone-dim)', fontSize: '.94rem', marginBottom: '1rem' }}>
                Exploring emerging technologies, minimalism, and startup culture — small things, done well.
              </p>
              <div className="chips">
                {['Music','Reading','Photography','Travel'].map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </div>
            <div className="panel">
              <p className={styles.panelHead}>Now exploring</p>
              <p style={{ fontFamily: 'var(--display)', fontWeight: 500, fontSize: '1.02rem', marginBottom: '.5rem' }}>
                AI integration &amp; computer vision
              </p>
              <p style={{ color: 'var(--bone-faint)', fontSize: '.9rem' }}>
                Sharpening my AI/OCR workflow at LCRO and learning more about modern model deployment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
