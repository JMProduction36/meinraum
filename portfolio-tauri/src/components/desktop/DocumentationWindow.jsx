import React, { useState } from 'react';
import { FileText, ChevronLeft, ExternalLink, BookOpen, Download } from 'lucide-react';

const BASE_RAW = 'https://raw.githubusercontent.com/JMProduction36/meinraum/main/Documentation/';

const DOCS = [
  {
    id: 'doc01',
    title: 'VirtualBox – Install Win10 + Debian',
    category: 'Virtualisation',
    description: 'Installation de VirtualBox avec machines virtuelles Windows 10 et Debian.',
    file: 'Doc01_VirtualBox_Install_Win10%2BDebian.pdf',
    badge: 'VM',
    color: '#0078D4',
  },
  {
    id: 'doc02',
    title: 'pfSense – Config Routeur LAN/WAN',
    category: 'Réseau',
    description: 'Configuration d\'un routeur pfSense avec interfaces LAN et WAN.',
    file: 'Doc02_pfSense_Config_Routeur_LAN_WAN.pdf',
    badge: 'Net',
    color: '#22c55e',
  },
  {
    id: 'doc03',
    title: 'Windows Server 2008 – Config Disques RAID',
    category: 'Stockage',
    description: 'Configuration des disques et RAID sous Windows Server 2008.',
    file: 'Doc03_WinServer2008_Config_Disques_RAID.pdf',
    badge: 'HDD',
    color: '#f97316',
  },
  {
    id: 'doc04',
    title: 'Debian 12 – Déploiement GLPI Agent',
    category: 'GLPI',
    description: 'Déploiement et configuration de l\'agent GLPI sur Debian 12.',
    file: 'Doc04_Debian12_Deploiement_GLPI_Agent.pdf',
    badge: 'GLPI',
    color: '#9b59b6',
  },
  {
    id: 'doc05',
    title: 'Windows Server 2012 – AD / DNS / DHCP / Samba',
    category: 'Infrastructure',
    description: 'Mise en place d\'une infrastructure complète AD, DNS, DHCP et Samba.',
    file: 'Doc05_WinServer2012_Infra_AD_DNS_DHCP_Samba.pdf',
    badge: 'AD',
    color: '#e11d48',
  },
  {
    id: 'doc06',
    title: 'GLPI – Automatisation Sauvegarde FTP & Cron',
    category: 'Automatisation',
    description: 'Automatisation des sauvegardes GLPI via FTP et tâches Cron.',
    file: 'Doc06_GLPI_Automatisation_Sauvegarde_FTP_Cron.pdf.pdf',
    badge: 'Cron',
    color: '#38bdf8',
  },
  {
    id: 'doc07',
    title: 'Debian – Infra LDAP / PowerDNS / Samba',
    category: 'Infrastructure',
    description: 'Déploiement d\'une infrastructure LDAP, PowerDNS et Samba sous Debian.',
    file: 'Doc07_Debian_Infra_LDAP_PowerDNS_Samba.pdf',
    badge: 'LDAP',
    color: '#78c078',
  },
  {
    id: 'doc08',
    title: 'Debian 12 – Tunneling & Sécurisation SSH',
    category: 'Sécurité',
    description: 'Mise en place de tunnels SSH et sécurisation des accès sur Debian 12.',
    file: 'Doc08_Debian12_Tunneling_et_Securisation_SSH.pdf',
    badge: 'SSH',
    color: '#facc15',
  },
  {
    id: 'doc09',
    title: 'Win10 – Double Auth YubiKey',
    category: 'Sécurité',
    description: 'Configuration de la double authentification YubiKey sous Windows 10.',
    file: 'Doc09_Win10_Double_Authentification_YubiKey.pdf',
    badge: '2FA',
    color: '#ef4444',
  },
  {
    id: 'doc_aux',
    title: 'pfSense – Proxy Squid & ACL',
    category: 'Réseau',
    description: 'Configuration du proxy Squid avec règles ACL sur pfSense.',
    file: 'DocAUX_pfSense_Config_Proxy_Squid_ACL.pdf',
    badge: 'Proxy',
    color: '#22c55e',
  },
];

export default function DocumentationWindow() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const pdfUrl = BASE_RAW + selected.file;
    const githubUrl = `https://github.com/JMProduction36/meinraum/blob/main/Documentation/${selected.file}`;

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 bg-secondary/20 shrink-0">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Retour
          </button>
          <div className="w-px h-4 bg-border/50" />
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-mono text-foreground truncate">{selected.title}</span>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={pdfUrl}
              download
              className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="w-3 h-3" />
              Télécharger
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              GitHub
            </a>
          </div>
        </div>

        {/* PDF Viewer via Google Docs embed */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
            title={selected.title}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-secondary/20 sticky top-0">
        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground">{DOCS.length} documents disponibles</span>
        <a
          href="https://github.com/JMProduction36/meinraum/tree/main/Documentation"
          target="_blank"
          rel="noreferrer"
          className="ml-auto flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          GitHub
        </a>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DOCS.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelected(doc)}
            className="text-left p-4 rounded-lg border border-border/40 bg-card hover:bg-secondary/40 hover:border-border/70 transition-all group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-[11px] font-mono font-bold"
                style={{ background: doc.color + '33', color: doc.color }}
              >
                {doc.badge}
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-1 shrink-0" />
            </div>
            <h3 className="text-sm font-sans font-medium text-foreground leading-tight mb-1">{doc.title}</h3>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">{doc.description}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: doc.color + '22', color: doc.color }}
              >
                {doc.category}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
