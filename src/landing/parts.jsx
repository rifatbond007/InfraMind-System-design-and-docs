// Small shared pieces for the landing page: logo, theme control, dot-matrix numerals,
// copyable command, scroll reveal.
import { useEffect, useRef, useState } from 'react'

export const DOCS = '/system-design/'

export function Logo({ size = 22 }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="logo-bg" />
      <path d="M10 11 L16 22 M22 11 L16 22" className="logo-edge" />
      <circle cx="10" cy="11" r="3" className="logo-dot" />
      <circle cx="22" cy="11" r="3" className="logo-dot dim" />
      <circle cx="16" cy="22" r="3.5" className="logo-dot" />
    </svg>
  )
}

// Theme: 'light' | 'dark' stored in localStorage (the docs page reads the same key);
// 'system' removes the key and follows prefers-color-scheme.
function readTheme() {
  try {
    const t = localStorage.getItem('theme')
    if (t === 'light' || t === 'dark') return t
  } catch {}
  return 'system'
}

export function useTheme() {
  const [theme, setTheme] = useState(readTheme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      delete root.dataset.theme
      try { localStorage.removeItem('theme') } catch {}
    } else {
      root.dataset.theme = theme
      try { localStorage.setItem('theme', theme) } catch {}
    }
  }, [theme])
  return [theme, setTheme]
}

function isDark(theme) {
  if (theme !== 'system') return theme === 'dark'
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeIconButton({ theme, setTheme }) {
  const dark = isDark(theme)
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
      )}
    </button>
  )
}

export function ThemeSegment({ theme, setTheme }) {
  return (
    <div className="segment" role="group" aria-label="Theme">
      {['system', 'light', 'dark'].map(t => (
        <button key={t} type="button" className={theme === t ? 'on' : ''} onClick={() => setTheme(t)}>
          {t[0].toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  )
}

// 5×7 dot-matrix glyphs.
const GLYPHS = {
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
}

export function DotNumber({ value, dot = 5, gap = 2 }) {
  const chars = String(value).split('')
  const step = dot + gap
  const glyphW = 5 * step
  const W = chars.length * glyphW + (chars.length - 1) * step
  const H = 7 * step
  return (
    <svg className="dotnum" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={String(value)}>
      {chars.map((c, ci) =>
        (GLYPHS[c] || []).flatMap((row, r) =>
          row.split('').map((on, x) => on === '1' && (
            <circle key={`${ci}-${r}-${x}`} cx={ci * (glyphW + step) + x * step + dot / 2} cy={r * step + dot / 2} r={dot / 2} style={{ '--d': `${(r + x) * 30}ms` }} />
          )),
        ),
      )}
    </svg>
  )
}

export function Command({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }
  return (
    <div className="command">
      <span className="prompt">$</span>
      <code>{text}</code>
      <button type="button" className="copy" onClick={copy} aria-label="Copy command">
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
        )}
      </button>
    </div>
  )
}

// Adds `in` to elements with [data-reveal] as they scroll into view.
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach(e => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [])
}

export function useScrolled(px = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > px)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [px])
  return scrolled
}

// Cycles 0..n-1 every `ms` while the element is on screen; `pause` stops it (hover / focus).
export function useCycle(n, ms = 2600) {
  const ref = useRef(null)
  const [i, setI] = useState(0)
  const [pause, setPause] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (pause || !visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI(v => (v + 1) % n), ms)
    return () => clearInterval(t)
  }, [pause, visible, n, ms])
  return { ref, i, setI, setPause }
}
