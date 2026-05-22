# Mein Raum — Portfolio OS (Tauri)

Application de portfolio native, légère (~5MB), qui charge son contenu depuis GitHub.

---

## Structure des repos

```
github.com/toi/mein-raum          ← ce repo (l'app Tauri)
github.com/toi/portfolio-data     ← données JSON (public)
```

---

## Setup en 4 étapes

### 1. Créer le repo de données

1. Crée un nouveau repo GitHub public : `portfolio-data`
2. Copie les fichiers du dossier `portfolio-data-repo/` dedans :
   - `projects.json`
   - `profile.json`
   - `archive.json`
3. Push sur `main`

### 2. Configurer l'app

Dans `src/lib/github.js`, change :
```js
export const GITHUB_USER = 'TON_USERNAME'
export const GITHUB_REPO = 'portfolio-data'
```

### 3. Installer et lancer en dev

```bash
# Prérequis : Node 20+, Rust, Tauri CLI
npm install
npm run tauri dev
```

### 4. Builder et publier

```bash
# Crée un tag pour déclencher le build automatique
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions va builder automatiquement pour **Windows**, **macOS** (Intel + Apple Silicon) et **Linux**.
Les fichiers apparaissent dans `Releases` de ton repo.

---

## Mettre à jour son portfolio

C'est **juste éditer des JSON** dans le repo `portfolio-data` :

```bash
# Ajouter un projet
# Édite projects.json, pousse sur main
# L'app recharge les données au prochain lancement
git add projects.json
git commit -m "Add new project"
git push
```

---

## Structure des fichiers

```
src/
├── components/desktop/
│   ├── TitleBar.jsx      ← barre système Tauri (drag + window controls)
│   ├── Window.jsx        ← fenêtres draggables
│   ├── WorkExplorer.jsx  ← fetch projects.json
│   ├── AboutWindow.jsx   ← fetch profile.json
│   ├── ArchiveWindow.jsx ← fetch archive.json
│   ├── ContactWindow.jsx
│   ├── TerminalWindow.jsx
│   ├── CaseStudy.jsx
│   └── DesktopIcon.jsx
├── hooks/
│   └── useGitHubData.js  ← hook de fetch avec cache + fallback
├── lib/
│   ├── github.js         ← config URL GitHub raw
│   └── ThemeContext.jsx  ← switcher Win11/Debian
└── pages/
    └── Desktop.jsx       ← layout principal

src-tauri/
├── src/
│   ├── main.rs
│   └── lib.rs
├── tauri.conf.json       ← config fenêtre, bundle, identifiant
└── Cargo.toml

.github/workflows/
└── release.yml           ← build automatique sur les 3 OS
```

---

## Prérequis dev

- Node.js 20+
- Rust (via [rustup](https://rustup.rs))
- Tauri CLI : `npm install -g @tauri-apps/cli`
- Linux uniquement : `sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev`
