// ArchiveWindow.jsx
import React from 'react'
import { Clock, Folder } from 'lucide-react'
import { useGitHubData } from '../../hooks/useGitHubData'

const FALLBACK_ARCHIVE = [
  { year: '2022', projects: ['Urban Geometry App', 'Flux Brand System', 'Analog Zine Vol.3'] },
  { year: '2021', projects: ['Prisma Dashboard', 'Vanta Identity', 'Rhythm Festival'] },
  { year: '2020', projects: ['Mono Type Foundry', 'Terrain Mapping Tool', 'Solstice Campaign'] },
  { year: '2019', projects: ['Echo Social Platform', 'Drift Photography', 'Woven Textiles Web'] },
]

export default function ArchiveWindow() {
  const { data } = useGitHubData('archive.json', FALLBACK_ARCHIVE)
  const items = data || FALLBACK_ARCHIVE

  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-1">
        {items.map((group) => (
          <div key={group.year} className="mb-4">
            <div className="flex items-center gap-2 mb-2 px-2">
              <Clock className="w-3.5 h-3.5 text-black/30" />
              <span className="text-xs font-mono font-semibold text-black/60">{group.year}</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>
            {group.projects.map((name) => (
              <div key={name} className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-black/5 cursor-pointer transition-colors">
                <Folder className="w-4 h-4 text-black/30" />
                <span className="text-sm font-mono text-black/60">{name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-6 px-2">
        <p className="text-[10px] font-mono text-black/30 uppercase tracking-wider">
          {items.reduce((acc, g) => acc + g.projects.length, 0)} archived projects
        </p>
      </div>
    </div>
  )
}
