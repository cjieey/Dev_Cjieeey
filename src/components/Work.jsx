import { useState, useEffect } from 'react'
import { DEFAULT_PROJECTS } from '../data/projects'
import styles from './Work.module.css'

export default function Work() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [activeProject, setActiveProject] = useState(null)

  useEffect(() => {
    try {
      let stored = JSON.parse(localStorage.getItem('portfolio_projects') || 'null')
      if (!stored) {
        setProjects(DEFAULT_PROJECTS)
      } else {
        if (!stored.some(p => p.id === 'evecurls')) {
          stored = [...DEFAULT_PROJECTS, ...stored]
          localStorage.setItem('portfolio_projects', JSON.stringify(stored))
        }
        setProjects(stored)
      }
    } catch {}
  }, [])

  return (
    <section id="work">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow"><span className="eyebrow-kanji">四</span>Work<span className="eyebrow-line" /></p>
          <h2 className="section-title">Featured projects</h2>
          <p className="lede" style={{ marginBottom: '2.6rem' }}>Open any card for the full case study.</p>
        </div>
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <a
              key={p.id}
              href={p.url || '#work'}
              onClick={(e) => {
                e.preventDefault();
                setActiveProject(p);
                document.body.style.overflow = 'hidden';
              }}
              className={`${styles.card} ${p.featured ? styles.wide : ''} reveal`}
              style={{ '--d': `${i * 60}ms` }}
            >
              {p.image
                ? <img src={p.image} alt={p.name} className={styles.cardImg} />
                : <div className={styles.cardGrad} style={{ background: p.gradient }} aria-hidden="true" />
              }
              <div className={styles.cardBody}>
                <p className={styles.tags}>
                  {p.tags.map((t, ti) => (
                    <span key={ti} className={ti === 0 ? styles.tagBold : ''}>{t}</span>
                  ))}
                </p>
                <p className={styles.cardName}>{p.name}</p>
                <p className={styles.cardDesc}>{p.desc}</p>
                <span className={styles.cardGo}>Open case study →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
      {activeProject && (
        <div className={styles.modalOverlay} onClick={() => { setActiveProject(null); document.body.style.overflow = ''; }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => { setActiveProject(null); document.body.style.overflow = ''; }}>×</button>
            {activeProject.image
              ? <img src={activeProject.image} alt={activeProject.name} className={styles.modalImg} />
              : <div className={styles.modalGrad} style={{ background: activeProject.gradient }} aria-hidden="true" />
            }
            <div className={styles.modalBody}>
              <h3 className={styles.modalName}>{activeProject.name}</h3>
              <p className={styles.tags}>
                {activeProject.tags.map((t, ti) => (
                  <span key={ti} className={ti === 0 ? styles.tagBold : ''}>{t}</span>
                ))}
              </p>
              <p className={styles.modalDesc}>{activeProject.desc}</p>
              {activeProject.url && activeProject.url !== '#work' && (
                <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className={styles.modalLink}>
                  Visit Project →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
