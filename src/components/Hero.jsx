import { useRef, useEffect, useState } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const forgeRef = useRef(null)
  const plateRef = useRef(null)
  const canvasRef = useRef(null)
  const stateRef = useRef({ tx:0,ty:0,cx:0,cy:0,tr:0,cr:0,raf:null,primed:false,particles:[],live:false })
  const [heroOpacity, setHeroOpacity] = useState(1)

  const radius = () => {
    if (!plateRef.current) return 88
    return Math.max(88, plateRef.current.clientWidth * 0.27)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const mkParticle = (x, y, isEmber) => isEmber
      ? { x,y, vx:(Math.random()-.5)*2.4, vy:-Math.random()*2-1.2, size:Math.random()*2+1, alpha:1, decay:Math.random()*.025+.015, isEmber:true }
      : { x,y, vx:(Math.random()-.5)*.9, vy:-Math.random()*.7-.4, size:Math.random()*16+10, growth:Math.random()*.25+.15, alpha:Math.random()*.22+.12, decay:Math.random()*.006+.004, rotation:Math.random()*Math.PI*2, rotationSpeed:(Math.random()-.5)*.012, isEmber:false }

    const tick = () => {
      s.cx += (s.tx - s.cx) * .16
      s.cy += (s.ty - s.cy) * .16
      s.cr += (s.tr - s.cr) * .12
      if (forgeRef.current) {
        forgeRef.current.style.setProperty('--rx', s.cx.toFixed(1) + 'px')
        forgeRef.current.style.setProperty('--ry', s.cy.toFixed(1) + 'px')
        forgeRef.current.style.setProperty('--rr', s.cr.toFixed(1) + 'px')
      }
      const w = canvas.clientWidth, h = canvas.clientHeight
      ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.restore()
      if (!reduce && (s.live || s.particles.length)) {
        if (s.live) {
          if (Math.random() < .4) s.particles.push(mkParticle(s.cx, s.cy, false))
          if (Math.random() < .3) s.particles.push(mkParticle(s.cx, s.cy, true))
        }
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i]
          p.x += p.vx; p.y += p.vy; p.alpha -= p.decay
          if (!p.isEmber) { p.size += p.growth; p.rotation += p.rotationSpeed }
          if (p.alpha <= 0) { s.particles.splice(i,1); continue }
          ctx.save()
          if (p.isEmber) {
            ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
            ctx.fillStyle = `rgba(217,1,1,${p.alpha})`
            ctx.shadowColor = '#D90101'; ctx.shadowBlur = 6; ctx.fill()
          } else {
            ctx.translate(p.x,p.y); ctx.rotate(p.rotation)
            const g = ctx.createRadialGradient(0,0,0,0,0,p.size)
            g.addColorStop(0,`rgba(26,3,3,${p.alpha})`)
            g.addColorStop(.3,`rgba(140,2,2,${p.alpha*.5})`)
            g.addColorStop(1,'rgba(10,1,1,0)')
            ctx.beginPath(); ctx.arc(0,0,p.size,0,Math.PI*2)
            ctx.fillStyle = g; ctx.fill()
          }
          ctx.restore()
        }
      }
      const moving = Math.hypot(s.tx-s.cx,s.ty-s.cy)>.4||Math.abs(s.tr-s.cr)>.4||s.particles.length>0
      s.raf = moving ? requestAnimationFrame(tick) : null
    }
    const run = () => { if (!s.raf) s.raf = requestAnimationFrame(tick) }

    const track = (e) => {
      if (!plateRef.current) return
      const r = plateRef.current.getBoundingClientRect()
      s.tx = e.clientX - r.left; s.ty = e.clientY - r.top
      if (!s.primed) { s.cx = s.tx; s.cy = s.ty; s.primed = true; resize() }
      s.tr = radius(); s.live = true
      if (forgeRef.current) forgeRef.current.classList.add(styles.live)
      run()
    }
    const release = () => {
      s.tr = 0; s.live = false
      if (forgeRef.current) forgeRef.current.classList.remove(styles.live)
      run()
    }

    const forge = forgeRef.current
    forge.addEventListener('pointermove', track)
    forge.addEventListener('pointerdown', track)
    forge.addEventListener('pointerleave', release)
    forge.addEventListener('pointercancel', release)

    // touch drift
    if (!window.matchMedia('(hover:hover)').matches && !reduce) {
      const t0 = Date.now()
      const drift = () => {
        if (!plateRef.current) return
        const r = plateRef.current.getBoundingClientRect()
        const sec = (Date.now()-t0)/2600
        s.tx = r.width*(0.5+0.26*Math.sin(sec))
        s.ty = r.height*(0.44+0.16*Math.cos(sec*.8))
        if (!s.primed) { s.cx=s.tx; s.cy=s.ty; s.primed=true; resize() }
        s.tr = radius(); s.live = true
        if (forgeRef.current) forgeRef.current.classList.add(styles.live)
        run(); requestAnimationFrame(drift)
      }
      requestAnimationFrame(drift)
    }

    // hero fade on scroll
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      setHeroOpacity(+(1 - p * .85).toFixed(3))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      forge.removeEventListener('pointermove', track)
      forge.removeEventListener('pointerdown', track)
      forge.removeEventListener('pointerleave', release)
      forge.removeEventListener('pointercancel', release)
      if (s.raf) cancelAnimationFrame(s.raf)
    }
  }, [])

  return (
    <header className={styles.hero} id="top" style={{ opacity: heroOpacity }}>

      {/* Red radial atmosphere — always on hero root */}
      <div className={styles.field} aria-hidden="true" />

      {/* Forge image */}
      <div className={styles.center}>
        <div
          className={styles.forge}
          ref={forgeRef}
          style={{ '--rx':'50%','--ry':'42%','--rr':'0px' }}
        >
          <div className={styles.plate} ref={plateRef}>
            <div className={styles.ronin}>
              <img src="/samurai-ronin.webp" alt="Celjie Magbunag as samurai" fetchPriority="high" />
            </div>
            <div className={styles.reborn} id="reborn">
              <img src="/samurai-reborn.webp" alt="" aria-hidden="true" />
            </div>
            <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
            <p className={styles.hint}>Move your cursor to forge the armour</p>
          </div>
        </div>
      </div>

      {/* Text overlay — left / right flanking the image */}
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <div className={`${styles.name} ${styles.nameCeljie}`}>CELJIE</div>
            <div className={`${styles.name} ${styles.nameMag}`}>MAGBUNAG</div>
          </div>
          <blockquote className={styles.quote}>
            "Your vision deserves technology that works as hard as you do."
          </blockquote>
        </div>

        <div className={styles.right}>
          <h2 className={styles.slogan}>
            UNLOCK YOUR<br />
            NEXT DIGITAL<br />
            ADVANTAGE<br />
            TODAY.
          </h2>
          <div>
            <a className={styles.swordBtn} href="mailto:magbunagceljie@gmail.com">
              <span className={styles.hilt} />
              <span className={styles.btnText}>HIRE ME</span>
              <span className={styles.blade} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span>Gingoog City, Philippines</span>
          <span className={styles.pulse}><i aria-hidden="true" />Open to work</span>
        </div>
        <div className={styles.cta}>
          <a className="btn" href="https://github.com/cjieey" target="_blank" rel="noopener">GitHub</a>
          <a className="btn" href="https://www.linkedin.com/in/celjie-magbunag-a9a59b379/" target="_blank" rel="noopener">LinkedIn</a>
          <a className="btn" href="/resume.html" target="_blank" rel="noopener">Résumé</a>
        </div>
      </div>
    </header>
  )
}
