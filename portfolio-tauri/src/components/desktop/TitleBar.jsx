import React, { useState } from 'react'
import { useOsTheme } from '../../lib/ThemeContext'

// Tauri window API — graceful fallback in browser dev
let tauriWindow = null
try {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  tauriWindow = getCurrentWindow()
} catch (_) {}

const winAction = (action) => {
  if (!tauriWindow) return
  if (action === 'minimize') tauriWindow.minimize()
  if (action === 'maximize') tauriWindow.toggleMaximize()
  if (action === 'close') tauriWindow.close()
}

export default function TitleBar({ onOpenWindow }) {
  const { osTheme, setOsTheme } = useOsTheme()
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const fmtDate = (d) => d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })

  if (osTheme === 'debian') return <DebianTitleBar fmt={fmt} fmtDate={fmtDate} time={time} setOsTheme={setOsTheme} osTheme={osTheme} />
  return <Win11TitleBar fmt={fmt} fmtDate={fmtDate} time={time} setOsTheme={setOsTheme} osTheme={osTheme} />
}

function Win11TitleBar({ fmt, fmtDate, time, setOsTheme, osTheme }) {
  return (
    <>
      {/* Top menubar */}
      <div
        data-tauri-drag-region
        className="fixed top-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-2 select-none"
        style={{ background: 'rgba(20,20,28,0.96)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-mono text-[12px] font-semibold px-2 tracking-widest">MR</span>
        </div>
        <div className="flex items-center gap-3">
          <OsSwitcher osTheme={osTheme} setOsTheme={setOsTheme} />
          {/* Native window controls */}
          <div className="flex items-center">
            <button onClick={() => winAction('minimize')} className="w-11 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm">─</button>
            <button onClick={() => winAction('maximize')} className="w-11 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors text-xs">◻</button>
            <button onClick={() => winAction('close')} className="w-11 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-red-600 transition-colors text-xs font-bold">✕</button>
          </div>
        </div>
      </div>
      {/* Taskbar bottom — no window controls here, managed by Desktop */}
      <div
        className="fixed bottom-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-4"
        style={{ background: 'rgba(20,20,28,0.88)', backdropFilter: 'blur(40px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
            <span className="text-xl text-white">⊞</span>
          </button>
        </div>
        <div id="taskbar-windows" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1" />
        <div className="flex items-center gap-2 text-white/60 text-[11px] font-mono">
          <div className="text-right border-l border-white/10 pl-2">
            <div className="text-white text-[11px] leading-none">{fmt(time)}</div>
            <div className="text-[9px] text-white/40 mt-0.5">{fmtDate(time)}</div>
          </div>
        </div>
      </div>
    </>
  )
}

function DebianTitleBar({ fmt, fmtDate, time, setOsTheme, osTheme }) {
  return (
    <>
      <div
        data-tauri-drag-region
        className="fixed top-0 left-0 right-0 h-7 z-50 flex items-center justify-between px-1 select-none"
        style={{ background: '#3c3b37', borderBottom: '2px solid #1a1a18' }}
      >
        <div className="flex items-center gap-1">
          <span className="px-2 text-xs font-mono font-bold text-[#78c078]">🐧 MATE</span>
          <OsSwitcher osTheme={osTheme} setOsTheme={setOsTheme} />
        </div>
        <div className="flex items-center gap-2 text-[#d4d4d4] font-mono pr-1">
          <span className="text-[10px]">{fmt(time)}</span>
          {/* Window controls */}
          <button onClick={() => winAction('minimize')} className="w-6 h-5 text-[10px] text-white/60 hover:bg-white/10 rounded-sm">─</button>
          <button onClick={() => winAction('maximize')} className="w-6 h-5 text-[10px] text-white/60 hover:bg-white/10 rounded-sm">◻</button>
          <button onClick={() => winAction('close')} className="w-6 h-5 text-[10px] text-white/60 hover:bg-red-600/80 rounded-sm font-bold">✕</button>
        </div>
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 h-8 z-50 flex items-center px-1 gap-1"
        style={{ background: '#3c3b37', borderTop: '2px solid #1a1a18' }}
      >
        <div id="taskbar-windows" className="flex items-center gap-0.5 flex-1" />
      </div>
    </>
  )
}

function OsSwitcher({ osTheme, setOsTheme }) {
  return (
    <div className="flex items-center gap-0.5 rounded p-0.5" style={{ background: 'rgba(0,0,0,0.2)' }}>
      {[{ id: 'win11', label: '⊞ Win11' }, { id: 'debian', label: '🐧 Debian' }].map(t => (
        <button
          key={t.id}
          onClick={() => setOsTheme(t.id)}
          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${osTheme === t.id ? 'bg-white/90 text-gray-900 font-semibold' : 'text-white/50 hover:text-white hover:bg-white/15'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
