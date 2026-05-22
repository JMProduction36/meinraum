import React, { useState, useEffect, useRef } from 'react'

const INTRO_LINES = [
  { text: '> system.boot("mein-raum", v2.4.1)', delay: 0 },
  { text: '  [OK] Initializing spatial environment...', delay: 600 },
  { text: '  [OK] Loading creative modules...', delay: 1200 },
  { text: '  [OK] Portfolio data mounted.', delay: 1800 },
  { text: '', delay: 2200 },
  { text: '  ╔══════════════════════════════════════╗', delay: 2400 },
  { text: '  ║         MEIN RAUM — Terminal         ║', delay: 2600 },
  { text: '  ║     Creative Developer & Designer     ║', delay: 2800 },
  { text: '  ╚══════════════════════════════════════╝', delay: 3000 },
  { text: '', delay: 3200 },
  { text: '  Type "help" for available commands.', delay: 3600 },
  { text: '', delay: 3800 },
]

const COMMANDS = {
  help: ['  Available commands:', '  ─────────────────────', '  hello     → Contact info', '  resume    → Skills & experience', '  projects  → List all projects', '  clear     → Clear terminal', '  about     → About this system'],
  hello: ['  ┌─ Contact ──────────────────────┐', '  │  Email: hello@meinraum.dev    │', '  │  GitHub: @meinraum            │', '  │  LinkedIn: /in/meinraum       │', '  │  Location: Berlin, DE         │', '  └────────────────────────────────┘'],
  resume: ['  ┌─ Skills ───────────────────────┐', '  │  Design: UI/UX · Brand · Motion │', '  │  Dev: React · TS · GLSL · Node │', '  │  Experience: 8+ years          │', '  │  Projects delivered: 50+       │', '  └────────────────────────────────┘'],
  projects: ['  01. Crystalline UI System', '  02. Verdant Brand Identity', '  03. Aureate Experience Platform', '  04. Construct Editorial', '  05. Fold Motion Identity', '  06. Monolith Data Dashboard'],
  about: ['  Mein Raum OS v2.4.1', '  Built with React + Tauri', '  Data: GitHub raw API', '  © 2024 Mein Raum'],
}

export default function TerminalWindow() {
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [ready, setReady] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    INTRO_LINES.forEach(({ text, delay }) => {
      setTimeout(() => setLines(prev => [...prev, text]), delay)
    })
    setTimeout(() => setReady(true), 4000)
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    setLines(prev => [...prev, `> ${cmd}`])
    if (trimmed === 'clear') { setLines([]); return }
    const response = COMMANDS[trimmed]
    if (response) {
      response.forEach((line, i) => setTimeout(() => setLines(prev => [...prev, line]), i * 40))
    } else if (trimmed) {
      setLines(prev => [...prev, `  Command not found: "${trimmed}". Type "help".`])
    }
  }

  return (
    <div className="h-full flex flex-col font-mono text-sm" style={{ background: '#0d0d0d', color: '#e8e8e8' }} onClick={() => inputRef.current?.focus()}>
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed whitespace-pre" style={{ color: line.startsWith('>') ? '#0066ff' : line.includes('[OK]') ? '#28c840' : '#e8e8e8' }}>{line}</div>
        ))}
        {ready && (
          <div className="flex items-center gap-1 mt-1">
            <span style={{ color: '#0066ff' }}>{'>'}</span>
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleCommand(input); setInput('') } }}
              className="flex-1 bg-transparent outline-none text-sm caret-white" style={{ color: '#e8e8e8' }} autoFocus />
            <span style={{ color: '#0066ff', animation: 'blink 1s step-end infinite' }}>▋</span>
          </div>
        )}
      </div>
    </div>
  )
}
