import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OsThemeProvider, useOsTheme } from '../lib/ThemeContext';
import TopBar from '../components/desktop/TopBar';
import Window from '../components/desktop/Window';
import DesktopIcon from '../components/desktop/DesktopIcon';
import WorkExplorer from '../components/desktop/WorkExplorer';
import CaseStudy from '../components/desktop/CaseStudy';
import TerminalWindow from '../components/desktop/TerminalWindow';
import AboutWindow from '../components/desktop/AboutWindow';
import ContactWindow from '../components/desktop/ContactWindow';
import ArchiveWindow from '../components/desktop/ArchiveWindow';
import LaboratoryWindow from '../components/desktop/LaboratoryWindow';
import DocumentationWindow from '../components/desktop/DocumentationWindow';
import { Briefcase, Archive, FlaskConical, Terminal, User, Mail, BookOpen } from 'lucide-react';

const WINDOW_CONFIGS = {
  work:       { title: '~/work/projects',           icon: '📁', size: { w: 750, h: 500 }, pos: { x: 80,  y: 60 } },
  archive:    { title: '~/archive',                 icon: '🗄️', size: { w: 500, h: 420 }, pos: { x: 200, y: 80 } },
  laboratory: { title: '~/laboratory',              icon: '⚗️', size: { w: 520, h: 440 }, pos: { x: 250, y: 90 } },
  terminal:   { title: 'Terminal — meinraum@system',icon: '⬛', size: { w: 600, h: 380 }, pos: { x: 150, y: 120} },
  about:      { title: 'About — Mein Raum',         icon: '👤', size: { w: 520, h: 520 }, pos: { x: 300, y: 70 } },
  contact:    { title: 'Contact',                   icon: '✉️', size: { w: 460, h: 520 }, pos: { x: 350, y: 80 } },
  docs:       { title: 'Documentation',              icon: '📚', size: { w: 700, h: 520 }, pos: { x: 180, y: 60 } },
};

const desktopIcons = [
  { id: 'work',       icon: <Briefcase   className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />, label: 'Work' },
  { id: 'archive',    icon: <Archive     className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />, label: 'Archive' },
  { id: 'laboratory', icon: <FlaskConical className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />, label: 'Laboratory' },
  { id: 'terminal',   icon: <Terminal    className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />, label: 'Terminal' },
  { id: 'about',      icon: <User        className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />, label: 'Info' },
  { id: 'contact',    icon: <Mail        className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />, label: 'Contact' },
  { id: 'docs',       icon: <BookOpen    className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />, label: 'Docs' },
];

function DesktopApp() {
  const { osTheme } = useOsTheme();
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [caseStudyProjects, setCaseStudyProjects] = useState({});
  const [nextZ, setNextZ] = useState(10);

  const openWindow = useCallback((id) => {
    if (minimizedWindows.includes(id)) {
      setMinimizedWindows(prev => prev.filter(w => w !== id));
      setActiveWindowId(id);
      return;
    }
    if (windows.find(w => w.id === id)) {
      setActiveWindowId(id);
      setNextZ(prev => prev + 1);
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ + 1 } : w));
      return;
    }
    const config = WINDOW_CONFIGS[id];
    if (!config) return;
    const offset = (windows.length % 5) * 30;
    setWindows(prev => [...prev, {
      id, ...config,
      pos: { x: config.pos.x + offset, y: config.pos.y + offset },
      zIndex: nextZ,
    }]);
    setNextZ(prev => prev + 1);
    setActiveWindowId(id);
  }, [windows, minimizedWindows, nextZ]);

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setMinimizedWindows(prev => prev.filter(w => w !== id));
    if (activeWindowId === id) setActiveWindowId(null);
    if (id.startsWith('case-')) {
      setCaseStudyProjects(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id) => {
    setMinimizedWindows(prev => [...prev, id]);
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const focusWindow = useCallback((id) => {
    setActiveWindowId(id);
    setNextZ(prev => prev + 1);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ + 1 } : w));
  }, [nextZ]);

  const openProject = useCallback((project) => {
    const id = `case-${project.id}`;
    const offset = (windows.length % 5) * 25;
    setCaseStudyProjects(prev => ({ ...prev, [id]: project }));
    setWindows(prev => [...prev.filter(w => w.id !== id), {
      id,
      title: `${project.name} — Case Study`,
      icon: '📄',
      size: { w: 800, h: 520 },
      pos: { x: 120 + offset, y: 50 + offset },
      zIndex: nextZ,
    }]);
    setNextZ(prev => prev + 1);
    setActiveWindowId(id);
  }, [windows, nextZ]);

  const renderWindowContent = (w) => {
    switch (w.id) {
      case 'work':       return <WorkExplorer onOpenProject={openProject} />;
      case 'archive':    return <ArchiveWindow />;
      case 'laboratory': return <LaboratoryWindow />;
      case 'terminal':   return <TerminalWindow />;
      case 'about':      return <AboutWindow />;
      case 'contact':    return <ContactWindow />;
      case 'docs':       return <DocumentationWindow />;
      default:
        if (w.id.startsWith('case-') && caseStudyProjects[w.id])
          return <CaseStudy project={caseStudyProjects[w.id]} />;
        return null;
    }
  };

  // OS-specific desktop background
  const getDesktopBg = () => {
    if (osTheme === 'win11') return 'linear-gradient(135deg, #0f2b6b 0%, #1e3a8a 40%, #1d4ed8 70%, #7c3aed 100%)';
    return 'linear-gradient(160deg, #1a3520 0%, #2d5a3d 50%, #1a3520 100%)';
  };

  // Top offset for desktop icons
  const iconTop = osTheme === 'win11' ? 'top-10' : 'top-9';

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none bg-background"
      style={getDesktopBg() ? { background: getDesktopBg() } : undefined}
    >
      <div className="grain-overlay" />

      <TopBar
        windows={windows}
        minimizedWindows={minimizedWindows}
        onOpenWindow={openWindow}
      />

      {/* Desktop Icons */}
      <div className={`absolute ${iconTop} left-4 flex flex-col gap-1`}>
        {desktopIcons.map((item, i) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            index={i}
            onDoubleClick={() => openWindow(item.id)}
          />
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((windowData) => (
          <Window
            key={windowData.id}
            id={windowData.id}
            title={windowData.title}
            icon={windowData.icon}
            initialPos={windowData.pos}
            initialSize={windowData.size}
            zIndex={windowData.zIndex}
            isActive={activeWindowId === windowData.id}
            isMinimized={minimizedWindows.includes(windowData.id)}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
          >
            {renderWindowContent(windowData)}
          </Window>
        ))}
      </AnimatePresence>


    </div>
  );
}

export default function Desktop() {
  return (
    <OsThemeProvider>
      <DesktopApp />
    </OsThemeProvider>
  );
}
