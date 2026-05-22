import React from 'react'
import { MapPin, Mail, Github, Linkedin, ExternalLink } from 'lucide-react'
import { useGitHubData } from '../../hooks/useGitHubData'

const FALLBACK = {
  name: 'Mein Raum',
  title: 'Creative Developer & Designer',
  location: 'Berlin, Germany',
  bio: ['I design and build digital experiences at the intersection of precision engineering and creative expression. With over 8 years spanning UI/UX, brand identity, motion design, and full-stack development.', 'My work is rooted in spatial functionalism — the belief that digital spaces should be as carefully architected as physical ones.'],
  stats: [{ label: 'Years', value: '8+' }, { label: 'Projects', value: '50+' }, { label: 'Clients', value: '30+' }],
  links: [{ icon: 'mail', label: 'hello@meinraum.dev', href: 'mailto:hello@meinraum.dev' }, { icon: 'github', label: 'github.com/meinraum', href: '#' }, { icon: 'linkedin', label: 'linkedin.com/in/meinraum', href: '#' }]
}

const ICONS = { mail: Mail, github: Github, linkedin: Linkedin }

export default function AboutWindow() {
  const { data } = useGitHubData('profile.json', FALLBACK)
  const profile = data || FALLBACK

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-black/8 border border-black/10 flex items-center justify-center text-2xl font-mono font-light text-black/40 shrink-0">
            {profile.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-mono font-semibold text-black/80">{profile.name}</h1>
            <p className="text-sm font-mono text-black/40 mt-0.5">{profile.title}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-black/40">
              <MapPin className="w-3 h-3" /><span>{profile.location}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/30 mb-2">About</p>
          {(profile.bio || []).map((p, i) => (
            <p key={i} className="text-sm font-mono text-black/60 leading-[1.7] mt-3 first:mt-0">{p}</p>
          ))}
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/30 mb-3">Connect</p>
          <div className="space-y-1">
            {(profile.links || []).map(({ icon, label, href }) => {
              const Icon = ICONS[icon] || Mail
              return (
                <a key={label} href={href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-black/5 transition-colors group">
                  <Icon className="w-4 h-4 text-black/30" />
                  <span className="text-sm font-mono text-black/60">{label}</span>
                  <ExternalLink className="w-3 h-3 text-black/20 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(profile.stats || []).map(({ label, value }) => (
            <div key={label} className="p-4 rounded-lg bg-black/4 border border-black/8 text-center">
              <p className="text-2xl font-mono font-semibold text-black/70">{value}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-black/30 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
