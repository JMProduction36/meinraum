import React, { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Open mailto — works natively in Tauri
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body = encodeURIComponent(form.message)
    window.open(`mailto:hello@meinraum.dev?subject=${subject}&body=${body}`)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-mono font-semibold text-black/70">Get in Touch</h2>
          <p className="text-sm font-mono text-black/40 mt-1">Have a project in mind? Let's create something exceptional.</p>
        </div>
        {sent ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p className="text-sm font-mono font-medium text-black/70">Opening your mail client…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ key: 'name', label: 'Name', type: 'text' }, { key: 'email', label: 'Email', type: 'email' }].map(({ key, label, type }) => (
              <div key={key}>
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/30">{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-black/10 bg-white text-sm font-mono text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" required />
              </div>
            ))}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/30">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-black/10 bg-white text-sm font-mono text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none" required />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-black/80 text-white text-sm font-mono font-medium hover:bg-black transition-colors">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
