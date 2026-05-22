import React from 'react'
import { FlaskConical } from 'lucide-react'

export default function LaboratoryWindow() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 p-8">
      <FlaskConical className="w-12 h-12 text-black/20" strokeWidth={1} />
      <div className="text-center">
        <p className="text-sm font-mono font-medium text-black/50">Laboratory</p>
        <p className="text-xs font-mono text-black/30 mt-1">Experiments & prototypes coming soon.</p>
      </div>
    </div>
  )
}
