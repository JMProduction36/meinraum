import React, { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { OsThemeProvider, useOsTheme } from '../lib/ThemeContext'
import TitleBar from '../components/desktop/TitleBar'
import Window from '../components/desktop/Window'
import DesktopIcon from '../components/desktop/DesktopIcon'
import WorkExplorer from '../components/desktop/WorkExplorer'
import CaseStudy from '../components/desktop/CaseStudy'
import TerminalWindow from '../components/desktop/TerminalWindow'
import AboutWindow from '../components/desktop/AboutWindow'
import ContactWindow from '../components/desktop/ContactWindow'
import ArchiveWindow from '../components/desktop/ArchiveWindow'
import LaboratoryWindow from '../components/desktop/LaboratoryWindow'
import { Briefcase, Archive, FlaskConical, Terminal, User, Mail } from 'lucide-react'

const WINDOW_CONFIGS = {
  work:       { title: '~/work/projects',            icon: '📁', size: { w: 750, h: 500 }, pos: { x: 80,  y: 60  } },
  archive:    { title: '~/archive',                  icon: '🗄️', size: { w: 500, h: 420 }, pos: { x: 200, y: 80  } },
  laboratory: { title: '~/laboratory',               icon: '⚗️', size: { w: 520, h: 440 }, pos: { x: 250, y: 90  } },
  terminal:   { title: 'Terminal — meinraum@system', icon: '⬛', size: { w: 600, h: 380 }, pos: { x: 150, y: 120 } },
  about:      { title: 'About — Mein Raum',          icon: '👤', size: { w: 520, h: 520 }, pos: { x: 300, y: 70  } },
  contact:    { title: 'Contact',                    icon: '✉️', size: { w: 460, h: 520 }, pos: { x: 350, y: 80  } },
}

const DESKTOP_ICONS = [
  { id: 'work',       icon: <Briefcase    className="w-6 h-6 text-white/70" strokeWidth={1.5} />, label: 'Work'       },
  { id: 'archive',    icon: <Archive      className="w-6 h-6 text-white/70" strokeWidth={1.5} />, label: 'Archive'    },
  { id: 'laboratory', icon: <FlaskConical className="w-6 h-6 text-white/70" strokeWidth={1.5} />, label: 'Laboratory' },
  { id: 'terminal',   icon: <Terminal     className="w-6 h-6 text-white/70" strokeWidth={1.5} />, label: 'Terminal'   },
  { id: 'about',      icon: <User         className="w-6 h-6 text-white/70" strokeWidth={1.5} />, label: 'Info'       },
  { id: 'contact',    icon: <Mail         className="w-6 h-6 text-white/70" strokeWidth={1.5} />, label: 'Contact'    },
]

function DesktopApp() {
  const { osTheme } = useOsTheme()
  const [windows, setWindows] = useState([])
  const [activeWindowId, setActiveWindowId] = useState(null)
  const [minimizedWindows, setMinimizedWindows] = useState([])
  const [caseStudyProjects, setCaseStudyProjects] = useState({})
  const [nextZ, setNextZ] = useState(10)

  const openWindow = useCallback((id) => {
    if (minimizedWindows.includes(id)) {
      setMinimizedWindows(prev => prev.filter(w => w !== id))
      setActiveWindowId(id)
      return
    }
    if (windows.find(w => w.id === id)) {
      setActiveWindowId(id)
      setNextZ(prev => prev + 1)
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ + 1 } : w))
      return
    }
    const config = WINDOW_CONFIGS[id]
    if (!config) return
    const offset = (windows.length % 5) * 30
    setWindows(prev => [...prev, { id, ...config, pos: { x: config.pos.x + offset, y: config.pos.y + offset }, zIndex: nextZ }])
    setNextZ(prev => prev + 1)
    setActiveWindowId(id)
  }, [windows, minimizedWindows, nextZ])

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    setMinimizedWindows(prev => prev.filter(w => w !== id))
    if (activeWindowId === id) setActiveWindowId(null)
    if (id.startsWith('case-')) setCaseStudyProjects(prev => { const n = { ...prev }; delete n[id]; return n })
  }, [activeWindowId])

  const minimizeWindow = useCallback((id) => {
    setMinimizedWindows(prev => [...prev, id])
    if (activeWindowId === id) setActiveWindowId(null)
  }, [activeWindowId])

  const focusWindow = useCallback((id) => {
    setActiveWindowId(id)
    setNextZ(prev => prev + 1)
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ + 1 } : w))
  }, [nextZ])

  const openProject = useCallback((project) => {
    const id = `case-${project.id}`
    const offset = (windows.length % 5) * 25
    setCaseStudyProjects(prev => ({ ...prev, [id]: project }))
    setWindows(prev => [...prev.filter(w => w.id !== id), { id, title: `${project.name} — Case Study`, icon: '📄', size: { w: 800, h: 520 }, pos: { x: 120 + offset, y: 50 + offset }, zIndex: nextZ }])
    setNextZ(prev => prev + 1)
    setActiveWindowId(id)
  }, [windows, nextZ])

  const renderWindowContent = (w) => {
    switch (w.id) {
      case 'work':       return <WorkExplorer onOpenProject={openProject} />
      case 'archive':    return <ArchiveWindow />
      case 'laboratory': return <LaboratoryWindow />
      case 'terminal':   return <TerminalWindow />
      case 'about':      return <AboutWindow />
      case 'contact':    return <ContactWindow />
      default:
        if (w.id.startsWith('case-') && caseStudyProjects[w.id]) return <CaseStudy project={caseStudyProjects[w.id]} />
        return null
    }
  }

  const getDesktopBg = () => {
    if (osTheme === 'win11') return 'linear-gradient(135deg, #0f2b6b 0%, #1e3a8a 40%, #1d4ed8 70%, #7c3aed 100%)'
    return 'linear-gradient(160deg, #1a3520 0%, #2d5a3d 50%, #1a3520 100%)'
  }

  const iconTop = osTheme === 'win11' ? 'top-10' : 'top-9'

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ background: getDesktopBg() }}>
      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <TitleBar onOpenWindow={openWindow} />

      {/* Desktop icons */}
      <div className={`absolute ${iconTop} left-4 flex flex-col gap-1`}>
        {DESKTOP_ICONS.map((item, i) => (
          <DesktopIcon key={item.id} icon={item.icon} label={item.label} index={i} onDoubleClick={() => openWindow(item.id)} />
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((w) => (
          <Window key={w.id} id={w.id} title={w.title} icon={w.icon} initialPos={w.pos} initialSize={w.size} zIndex={w.zIndex}
            isActive={activeWindowId === w.id} isMinimized={minimizedWindows.includes(w.id)}
            onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focusWindow}>
            {renderWindowContent(w)}
          </Window>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function Desktop() {
  return (
    <OsThemeProvider>
      <DesktopApp />
    </OsThemeProvider>
  )
}
