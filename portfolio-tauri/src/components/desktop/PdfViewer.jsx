import React, { useMemo, useState } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'

export default function PdfViewer({ src }) {
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const pdfUrl = useMemo(() => `${src}#page=${page}&zoom=${zoom}`, [src, page, zoom])

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <button aria-label="Page précédente" onClick={() => setPage((current) => Math.max(1, current - 1))}>‹</button>
        <label>Page <input aria-label="Numéro de page" type="number" min="1" value={page} onChange={(event) => setPage(Math.max(1, Number(event.target.value) || 1))} /></label>
        <button aria-label="Zoom arrière" onClick={() => setZoom((current) => Math.max(50, current - 10))}><Minus size={15} /></button>
        <span>{zoom}%</span>
        <button aria-label="Zoom avant" onClick={() => setZoom((current) => Math.min(200, current + 10))}><Plus size={15} /></button>
        <button aria-label="Réinitialiser le zoom" onClick={() => { setPage(1); setZoom(100) }}><RotateCcw size={15} /></button>
        <a href={src} target="_blank" rel="noreferrer">Ouvrir dans un nouvel onglet</a>
      </div>
      <iframe key={pdfUrl} title="Visionneuse PDF" src={pdfUrl} />
    </div>
  )
}
