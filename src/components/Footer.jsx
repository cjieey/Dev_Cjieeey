import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.foot}>
      <div className="wrap">
        <div className={styles.inner}>
          <span>© 2026 Celjie Magbunag · Crafted with care</span>
          <div className={styles.links}>
            <a href="https://github.com/cjieey" target="_blank" rel="noopener">GitHub</a>
            <a href="https://www.linkedin.com/in/celjie-magbunag-a9a59b379/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="mailto:magbunagceljie@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
