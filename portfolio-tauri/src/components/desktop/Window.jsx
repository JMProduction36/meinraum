import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useOsTheme } from '../../lib/ThemeContext'

function useWindowDrag({ pos, setPos, isMaximized, setIsMaximized, size, id, onFocus }) {
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-control')) return
    onFocus?.(id)
    isDragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    const onMove = (e) => {
      if (!isDragging.current) return
      if (isMaximized) {
        setIsMaximized(false)
        setPos({ x: Math.max(0, e.clientX - size.w / 2), y: Math.max(32, e.clientY - 14) })
        dragOffset.current = { x: size.w / 2, y: 14 }
        return
      }
      setPos({ x: Math.max(0, e.clientX - dragOffset.current.x), y: Math.max(32, e.clientY - dragOffset.current.y) })
    }
    const onUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos, isMaximized, size, id, onFocus])

  return handleMouseDown
}

function Win11Titlebar({ title, icon, id, onClose, onMinimize, toggleMaximize, handleMouseDown, isActive }) {
  return (
    <div onMouseDown={handleMouseDown} onDoubleClick={toggleMaximize}
      className="h-8 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing"
      style={{ background: isActive ? '#f3f3f3' : '#efefef', borderBottom: '1px solid #e0e0e0' }}>
      <div className="flex items-center gap-2 px-3">
        {icon && <span className="text-xs">{icon}</span>}
        <span className="text-[12px] font-mono text-[#1a1a1a]/70 truncate max-w-[220px]">{title}</span>
      </div>
      <div className="flex items-center self-stretch ml-auto">
        <button className="window-control w-11 h-full flex items-center justify-center text-[#1a1a1a]/60 hover:bg-[#e5e5e5] transition-colors text-sm" onClick={() => onMinimize?.(id)}>─</button>
        <button className="window-control w-11 h-full flex items-center justify-center text-[#1a1a1a]/60 hover:bg-[#e5e5e5] transition-colors text-xs" onClick={toggleMaximize}>◻</button>
        <button className="window-control w-11 h-full flex items-center justify-center text-[#1a1a1a]/60 hover:bg-[#E63946] hover:text-white transition-colors text-xs font-bold" onClick={() => onClose?.(id)}>✕</button>
      </div>
    </div>
  )
}

function DebianTitlebar({ title, icon, id, onClose, onMinimize, toggleMaximize, handleMouseDown, isActive }) {
  return (
    <div onMouseDown={handleMouseDown} onDoubleClick={toggleMaximize}
      className="h-7 flex items-center justify-between px-1.5 shrink-0 cursor-grab active:cursor-grabbing"
      style={{ background: isActive ? 'linear-gradient(180deg,#78c078 0%,#4a8c4a 100%)' : 'linear-gradient(180deg,#888 0%,#666 100%)', borderBottom: '2px solid #2a4a2a' }}>
      <div className="flex items-center gap-1">
        <button className="window-control w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold text-white hover:brightness-90" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,0,0,0.4)' }} onClick={() => onClose?.(id)}>✕</button>
        <button className="window-control w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold text-white hover:brightness-90" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(0,0,0,0.4)' }} onClick={() => onMinimize?.(id)}>─</button>
        <button className="window-control w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold text-white hover:brightness-90" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(0,0,0,0.4)' }} onClick={toggleMaximize}>◻</button>
      </div>
      <div className="flex-1 flex items-center justify-center gap-1.5 px-2 overflow-hidden">
        {icon && <span className="text-xs">{icon}</span>}
        <span className="text-[11px] font-mono font-semibold text-white truncate" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.5)' }}>{title}</span>
      </div>
      <div className="w-16" />
    </div>
  )
}

export default function Window({ id, title, icon, children, initialPos = { x: 100, y: 60 }, initialSize = { w: 600, h: 450 }, onClose, onMinimize, onFocus, isActive = false, zIndex = 10, isMinimized = false }) {
  const { osTheme } = useOsTheme()
  const [pos, setPos] = useState(initialPos)
  const [size] = useState(initialSize)
  const [isMaximized, setIsMaximized] = useState(false)
  const [prevState, setPrevState] = useState(null)

  const handleMouseDown = useWindowDrag({ pos, setPos, isMaximized, setIsMaximized, size, id, onFocus })

  const toggleMaximize = () => {
    if (isMaximized) { if (prevState) setPos(prevState.pos); setIsMaximized(false) }
    else { setPrevState({ pos, size }); setIsMaximized(true) }
  }

  const topOffset = osTheme === 'win11' ? 32 : 28
  const bottomOffset = osTheme === 'win11' ? 48 : 32
  const currentPos = isMaximized ? { x: 0, y: topOffset } : pos
  const currentSize = isMaximized ? { w: window.innerWidth, h: window.innerHeight - topOffset - bottomOffset } : size

  if (isMinimized) return null

  const styles = {
    win11: {
      bg: 'rgba(243,243,243,0.97)',
      radius: '8px',
      border: isActive ? '1px solid #c8c8c8' : '1px solid #d8d8d8',
      shadow: isActive ? '0 8px 32px rgba(0,0,0,0.18),0 2px 4px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.1)',
    },
    debian: {
      bg: '#f0ede8',
      radius: '4px',
      border: isActive ? '2px solid #4a8c4a' : '2px solid #666',
      shadow: isActive ? '4px 4px 12px rgba(0,0,0,0.5)' : '3px 3px 8px rgba(0,0,0,0.3)',
    },
  }
  const s = styles[osTheme] || styles.win11
  const titlebarProps = { title, icon, id, onClose, onMinimize, toggleMaximize, handleMouseDown, isActive }

  return (
    <motion.div
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.88, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="fixed select-none"
      style={{ left: currentPos.x, top: currentPos.y, width: currentSize.w, height: currentSize.h, zIndex }}
      onMouseDown={() => onFocus?.(id)}
    >
      <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: s.bg, borderRadius: s.radius, border: s.border, boxShadow: s.shadow }}>
        {osTheme === 'win11' && <Win11Titlebar {...titlebarProps} />}
        {osTheme === 'debian' && <DebianTitlebar {...titlebarProps} />}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </motion.div>
  )
}
