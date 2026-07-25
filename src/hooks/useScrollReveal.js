import { useEffect } from 'react'

export function useScrollReveal(selector = '.reveal') {
  useEffect(() => {
    const check = () => {
      const els = document.querySelectorAll(`${selector}:not(.visible)`)
      const vh = window.innerHeight
      els.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < vh * 0.93 && rect.bottom > 0) {
          el.classList.add('visible')
        }
      })
    }

    check() // run on mount
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [selector])
}
