import { useRef, useEffect, useState } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const forgeRef   = useRef(null)
  const plateRef   = useRef(null)
  const canvasRef  = useRef(null)   // trail + ember sparks
  const revealRef  = useRef(null)   // persistent reveal canvas (painted glow map)
  const rebornRef  = useRef(null)   // the armoured image layer
  const [heroOpacity, setHeroOpacity] = useState(1)

  const radius = () => {
    if (!plateRef.current) return 100
    return Math.max(100, plateRef.current.clientWidth * 0.30)
  }

  useEffect(() => {
    const canvas  = canvasRef.current
    const revCvs  = revealRef.current
    if (!canvas || !revCvs) return

    const ctx    = canvas.getContext('2d')
    const revCtx = revCvs.getContext('2d')

    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches

    // ── shared state ─────────────────────────────────────────────────
    const s = {
      tx:0, ty:0,        // raw pointer target
      cx:0, cy:0,        // smoothed cursor
      live: false,
      primed: false,
      raf: null,
      // trail sparks
      embers: [],
      lastX:0, lastY:0,
      // for fade loop even after leave
      lastPaint: 0,
    }

    // ── resize both canvases ─────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      ;[canvas, revCvs].forEach(c => {
        c.width  = c.clientWidth  * dpr
        c.height = c.clientHeight * dpr
      })
      ctx.scale(dpr, dpr)
      revCtx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // ── paint a glow blob onto the reveal canvas ─────────────────────
    const paintReveal = (x, y, r) => {
      const g = revCtx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0,    'rgba(255,255,255, 0.38)')
      g.addColorStop(0.35, 'rgba(255,255,255, 0.22)')
      g.addColorStop(0.65, 'rgba(255,255,255, 0.09)')
      g.addColorStop(1,    'rgba(255,255,255, 0)')
      revCtx.beginPath()
      revCtx.arc(x, y, r, 0, Math.PI * 2)
      revCtx.fillStyle = g
      revCtx.fill()
    }

    // ── spawn ember sparks ───────────────────────────────────────────
    const spawnEmbers = (x, y) => {
      const dist = Math.hypot(x - s.lastX, y - s.lastY)
      if (dist < 5) return
      s.lastX = x; s.lastY = y
      const n = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < n; i++) {
        s.embers.push({
          x, y,
          vx: (Math.random() - 0.5) * 3.2,
          vy: -Math.random() * 2.8 - 0.8,
          size:  Math.random() * 2.5 + 0.8,
          alpha: Math.random() * 0.8 + 0.5,
          decay: Math.random() * 0.028 + 0.018,
        })
      }
    }

    // ── main loop ────────────────────────────────────────────────────
    const tick = () => {
      // smooth cursor
      s.cx += (s.tx - s.cx) * 0.18
      s.cy += (s.ty - s.cy) * 0.18

      // ---- reveal canvas: fade everything very slowly ----
      // multiply-alpha trick: draw a semi-transparent dark rect over entire canvas
      // this makes every painted pixel slowly dim toward 0
      revCtx.save()
      revCtx.setTransform(1,0,0,1,0,0)
      revCtx.globalCompositeOperation = 'destination-in'
      // 0.985 per frame @ 60fps ≈ full fade in ~4s
      revCtx.fillStyle = 'rgba(0,0,0, 0.985)'
      revCtx.fillRect(0, 0, revCvs.width, revCvs.height)
      revCtx.restore()

      // while hovering: continuously paint glow blobs at cursor
      if (s.live) {
        paintReveal(s.cx, s.cy, radius())
        spawnEmbers(s.cx, s.cy)
        s.lastPaint = Date.now()
      }

      // apply reveal canvas as the mask on .reborn via canvas-to-dataURL
      // — but that's too slow. Instead we just show/hide .reborn via opacity
      // and use the reveal canvas AS a CSS mask via object-url trick.
      // Simplest cross-browser: use the reveal canvas pixels as a luminance mask
      // by drawing it over .reborn using mix-blend-mode on the canvas element.

      // ---- spark canvas: clear & draw embers ----
      ctx.save()
      ctx.setTransform(1,0,0,1,0,0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      for (let i = s.embers.length - 1; i >= 0; i--) {
        const e = s.embers[i]
        e.x += e.vx; e.y += e.vy
        e.vy += 0.08
        e.alpha -= e.decay
        if (e.alpha <= 0) { s.embers.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,120,30,${e.alpha.toFixed(3)})`
        ctx.shadowColor = '#ff4400'
        ctx.shadowBlur  = 10
        ctx.fill()
        ctx.shadowBlur  = 0
      }

      // keep loop alive while: hovering OR embers exist OR reveal still has pixels (recent paint)
      const revealStillFading = Date.now() - s.lastPaint < 6000
      const busy = s.live || s.embers.length > 0 || revealStillFading
      s.raf = busy ? requestAnimationFrame(tick) : null
    }

    const run = () => { if (!s.raf) s.raf = requestAnimationFrame(tick) }

    // ── pointer events ───────────────────────────────────────────────
    const track = (e) => {
      if (!plateRef.current) return
      const r = plateRef.current.getBoundingClientRect()
      s.tx = e.clientX - r.left
      s.ty = e.clientY - r.top
      if (!s.primed) {
        s.cx = s.tx; s.cy = s.ty
        s.lastX = s.tx; s.lastY = s.ty
        s.primed = true; resize()
      }
      s.live = true
      if (forgeRef.current) forgeRef.current.classList.add(styles.live)
      run()
    }

    const release = () => {
      s.live = false
      s.lastPaint = Date.now() // start the 6s fade window
      if (forgeRef.current) forgeRef.current.classList.remove(styles.live)
      run()
    }

    const forge = forgeRef.current
    forge.addEventListener('pointermove', track)
    forge.addEventListener('pointerdown', track)
    forge.addEventListener('pointerleave', release)
    forge.addEventListener('pointercancel', release)

    // no-hover touch drift
    if (!window.matchMedia('(hover:hover)').matches && !reduce) {
      const t0 = Date.now()
      const drift = () => {
        if (!plateRef.current) return
        const r   = plateRef.current.getBoundingClientRect()
        const sec = (Date.now() - t0) / 2600
        s.tx = r.width  * (0.5 + 0.26 * Math.sin(sec))
        s.ty = r.height * (0.44 + 0.16 * Math.cos(sec * 0.8))
        if (!s.primed) { s.cx=s.tx; s.cy=s.ty; s.lastX=s.tx; s.lastY=s.ty; s.primed=true; resize() }
        s.live = true
        if (forgeRef.current) forgeRef.current.classList.add(styles.live)
        run()
        requestAnimationFrame(drift)
      }
      requestAnimationFrame(drift)
    }

    // scroll fade
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      setHeroOpacity(+(1 - p * 0.85).toFixed(3))
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
      <div className={styles.field} aria-hidden="true" />

      <div className={styles.center}>
        <div className={styles.forge} ref={forgeRef}>
          <div className={styles.plate} ref={plateRef}>

            {/* greyscale base */}
            <div className={styles.ronin}>
              <img src="/samurai-ronin.webp" alt="Celjie Magbunag as samurai" fetchPriority="high" />
            </div>

            {/* coloured layer — reveal canvas is used as luminance mask */}
            <div className={styles.rebornWrap} ref={rebornRef}>
              <img
                src="/samurai-reborn.webp"
                alt=""
                aria-hidden="true"
                className={styles.rebornImg}
              />
              {/* reveal canvas sits on top of the coloured image, blend mode = destination-in mask */}
              <canvas
                ref={revealRef}
                className={styles.revealCanvas}
                aria-hidden="true"
              />
            </div>

            {/* ember sparks canvas */}
            <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
            <p className={styles.hint}>Move your cursor to forge the armour</p>
          </div>
        </div>
      </div>

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
