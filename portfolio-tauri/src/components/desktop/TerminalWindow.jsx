import React, { useMemo, useRef, useState } from 'react'
import { useVfs } from '../../context/VfsContext'
import { createPowerShell } from '../../lib/powershell'

const INITIAL_LINES = [
  {
    prompt: '',
    text: 'Windows PowerShell simulé — environnement isolé, aucune commande système exécutée.\nSaisissez Get-Help pour les commandes disponibles.',
  },
]

export default function TerminalWindow() {
  const fs = useVfs()
  const ps = useMemo(() => createPowerShell(fs), [fs])
  const [lines, setLines] = useState(INITIAL_LINES)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const inputRef = useRef(null)
  const endRef = useRef(null)

  const submit = (event) => {
    event.preventDefault()
    const result = ps.run(value)

    setLines((current) =>
      result.clear
        ? []
        : [
            ...current,
            {
              prompt: `PS ${ps.cwd}> ${value}`,
              text: result.output.join('\n'),
            },
          ],
    )

    if (value.trim()) {
      const nextHistory = [...history, value]
      setHistory(nextHistory)
      setHistoryIndex(nextHistory.length)
    }

    setValue('')
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHistoryIndex((currentIndex) => {
        const nextIndex = Math.max(0, currentIndex - 1)
        setValue(history[nextIndex] ?? '')
        return nextIndex
      })
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHistoryIndex((currentIndex) => {
        const nextIndex = Math.min(history.length, currentIndex + 1)
        setValue(history[nextIndex] ?? '')
        return nextIndex
      })
    } else if (event.key === 'Tab') {
      event.preventDefault()
      setValue(ps.complete(value))
    }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-head">
        Windows PowerShell <span>— Simulé (VFS)</span>
      </div>
      <div className="terminal-scroll">
        {lines.map((line, index) => (
          <div key={index}>
            {line.prompt && <div className="ps-prompt">{line.prompt}</div>}
            <pre>{line.text}</pre>
          </div>
        ))}
        <form onSubmit={submit}>
          <label>PS {ps.cwd}&gt; </label>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck="false"
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  )
}
