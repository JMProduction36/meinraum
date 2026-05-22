import React from 'react'

export default function CaseStudy({ project }) {
  if (!project) return null
  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="w-full md:w-72 lg:w-80 shrink-0 border-r border-black/10 p-6 flex flex-col gap-6 bg-black/3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/30 mb-1">Project</p>
          <h2 className="text-xl font-mono font-semibold text-black/70 leading-tight">{project.name}</h2>
        </div>
        <div className="space-y-4">
          {[['Category', project.type], ['Year', project.date], ['Role', project.role], ['Tools', project.tools]].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/30 mb-1">{label}</p>
              <p className="text-sm font-mono text-black/60">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-black/10">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/30 mb-2">Description</p>
          <p className="text-sm font-mono text-black/50 leading-relaxed">{project.description}</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden border border-black/10 shadow-sm">
            <img src={project.image} alt={project.name} className="w-full h-auto object-cover" />
          </div>
          {[['Additional project imagery', 'Process documentation & deliverables'], ['Final presentation view', 'Contextual mockups']].map(([title, sub]) => (
            <div key={title} className="rounded-lg overflow-hidden border border-black/10 shadow-sm aspect-video bg-black/3 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-mono text-black/30">{title}</p>
                <p className="text-xs font-mono text-black/20 mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
