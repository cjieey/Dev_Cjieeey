import { useEffect, useState } from 'react'
import styles from './Nav.module.css'

const links = [
  { href: '#about',      kanji: '一', label: 'About' },
  { href: '#skills',     kanji: '二', label: 'Skills' },
  { href: '#journey',    kanji: '三', label: 'Journey' },
  { href: '#work',       kanji: '四', label: 'Work' },
  { href: '#experience', kanji: '五', label: 'Experience' },
  { href: '#contact',    kanji: '六', label: 'Contact' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <nav className={`${styles.nav} ${solid ? styles.solid : ''}`}>
        <a className={styles.mark} href="#top" onClick={close}>
          <span className={styles.seal} aria-hidden="true">再</span>
          Celjie
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}><span className={styles.num}>{l.kanji}</span>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.right}>
          <a href="mailto:magbunagceljie@gmail.com" className={`btn btn--solid ${styles.hireBtn}`}>
            Hire me
          </a>
          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} aria-label="Navigation menu">
        <ul className={styles.drawerLinks}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={close}>
                <span className={styles.drawerNum}>{l.kanji}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:magbunagceljie@gmail.com"
          className={`btn btn--solid ${styles.drawerHire}`}
          onClick={close}
        >
          Hire me
        </a>

        <div className={styles.drawerFooter}>
          <a href="https://github.com/cjieey" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/in/celjie-magbunag-a9a59b379/" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </aside>
    </>
  )
}
