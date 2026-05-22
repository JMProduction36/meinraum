import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function DesktopIcon({ icon, label, onDoubleClick, index = 0 }) {
  const [selected, setSelected] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`flex flex-col items-center gap-1.5 w-20 p-2 rounded-lg cursor-pointer select-none transition-colors ${selected ? 'bg-blue-500/10' : 'hover:bg-white/8'}`}
      onClick={() => setSelected(true)}
      onDoubleClick={() => { setSelected(false); onDoubleClick?.() }}
      tabIndex={0}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${selected ? 'bg-blue-500/15 scale-105' : 'bg-white/10 shadow-sm border border-white/10'}`}>
        {icon}
      </div>
      <span className={`text-[11px] font-mono leading-tight text-center ${selected ? 'bg-blue-500 text-white px-1.5 py-0.5 rounded-sm' : 'text-white/70'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        {label}
      </span>
    </motion.div>
  )
}
