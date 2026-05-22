import React, { useState } from 'react'
import { LayoutGrid, List, ChevronRight, Eye, Loader2 } from 'lucide-react'
import { useGitHubData } from '../../hooks/useGitHubData'

// Fallback data if GitHub fetch fails
const FALLBACK_PROJECTS = [
  { id: 1, name: 'Crystalline UI System', type: 'UI/UX Design', date: '2024', size: '2.4 MB', image: 'https://media.base44.com/images/public/69f85add879c4e167ad0c68b/39628d4a2_generated_878a69e4.png', description: 'A comprehensive design system built on the principles of transparency and layered depth.', role: 'Lead Designer', tools: 'Figma, After Effects, Three.js' },
  { id: 2, name: 'Verdant Brand Identity', type: 'Branding', date: '2024', size: '5.1 MB', image: 'https://media.base44.com/images/public/69f85add879c4e167ad0c68b/d2afdaa15_generated_4ced87e8.png', description: 'Complete brand identity for a sustainable architecture firm.', role: 'Creative Director', tools: 'Illustrator, InDesign, Cinema4D' },
  { id: 3, name: 'Aureate Experience Platform', type: 'Web Development', date: '2023', size: '3.8 MB', image: 'https://media.base44.com/images/public/69f85add879c4e167ad0c68b/60c4c01fb_generated_7a0ea75a.png', description: 'Full-stack experience platform for a luxury watchmaker.', role: 'Full-Stack Developer', tools: 'React, Three.js, GSAP, Node.js' },
  { id: 4, name: 'Construct Editorial', type: 'Editorial Design', date: '2023', size: '8.2 MB', image: 'https://media.base44.com/images/public/69f85add879c4e167ad0c68b/47aad5609_generated_96105fba.png', description: 'A 120-page editorial publication exploring architecture and digital art.', role: 'Art Director', tools: 'InDesign, Photoshop, Risograph' },
  { id: 5, name: 'Fold Motion Identity', type: 'Motion Design', date: '2023', size: '12.6 MB', image: 'https://media.base44.com/images/public/69f85add879c4e167ad0c68b/c2e85b50b_generated_dd1efabf.png', description: 'Dynamic visual identity system with generative motion graphics.', role: 'Motion Designer', tools: 'After Effects, Houdini, TouchDesigner' },
  { id: 6, name: 'Monolith Data Dashboard', type: 'Product Design', date: '2022', size: '4.3 MB', image: 'https://media.base44.com/images/public/69f85add879c4e167ad0c68b/2a9dc1f42_generated_9d9142c5.png', description: 'Enterprise data visualization dashboard with real-time analytics.', role: 'Product Designer', tools: 'Figma, D3.js, Mapbox, React' },
]

export default function WorkExplorer({ onOpenProject }) {
  const [viewMode, setViewMode] = useState('grid')
  const [selectedProject, setSelectedProject] = useState(null)
  const { data, loading } = useGitHubData('projects.json', FALLBACK_PROJECTS)
  const projects = data || FALLBACK_PROJECTS

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/8 bg-black/3">
        <div className="flex items-center gap-2 text-xs font-mono text-black/40">
          <span>~/work</span><ChevronRight className="w-3 h-3" /><span className="text-black/70">projects</span>
        </div>
        <div className="flex items-center gap-1">
          {loading && <Loader2 className="w-3 h-3 text-black/30 animate-spin mr-1" />}
          {[{ id: 'grid', icon: LayoutGrid }, { id: 'list', icon: List }].map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => setViewMode(id)} className={`p-1.5 rounded transition-colors ${viewMode === id ? 'bg-blue-600 text-white' : 'hover:bg-black/8 text-black/40'}`}>
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id}
                className={`group cursor-pointer rounded-lg overflow-hidden border transition-all duration-200 ${selectedProject === project.id ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-black/10 hover:border-black/20 hover:shadow-md'}`}
                onClick={() => setSelectedProject(project.id)}
                onDoubleClick={() => onOpenProject?.(project)}>
                <div className="aspect-[4/3] overflow-hidden bg-black/5 relative">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Eye className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-mono text-sm font-medium text-black/80 truncate">{project.name}</p>
                  <p className="font-mono text-[10px] text-black/40 mt-0.5">{project.type} — {project.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-mono text-black/30 uppercase tracking-wider border-b border-black/8">
              <span className="col-span-5">Name</span><span className="col-span-3">Type</span><span className="col-span-2">Date</span><span className="col-span-2 text-right">Size</span>
            </div>
            {projects.map((project) => (
              <div key={project.id}
                className={`grid grid-cols-12 gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${selectedProject === project.id ? 'bg-blue-50' : 'hover:bg-black/4'}`}
                onClick={() => setSelectedProject(project.id)}
                onDoubleClick={() => onOpenProject?.(project)}>
                <span className="col-span-5 text-sm font-mono font-medium text-black/70 truncate">{project.name}</span>
                <span className="col-span-3 text-xs font-mono text-black/40">{project.type}</span>
                <span className="col-span-2 text-xs font-mono text-black/40">{project.date}</span>
                <span className="col-span-2 text-xs font-mono text-black/40 text-right">{project.size}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-1.5 border-t border-black/8 bg-black/3 flex items-center justify-between">
        <span className="text-[10px] font-mono text-black/40">{projects.length} items</span>
        {selectedProject && <span className="text-[10px] font-mono text-black/40">Selected: {projects.find(p => p.id === selectedProject)?.name}</span>}
      </div>
    </div>
  )
}
