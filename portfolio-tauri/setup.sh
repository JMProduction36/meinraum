#!/bin/bash

# ============================================================
#  MEIN RAUM — Script d'installation complet (Debian/Ubuntu)
# ============================================================
# Usage : bash setup.sh
# Prérequis : avoir portfolio-tauri.zip dans le même dossier

set -e  # Arrête si une commande échoue

# ── Couleurs ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║     MEIN RAUM — Setup Debian         ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# ── 0. Vérifier qu'on est dans le bon dossier ─────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f "portfolio-tauri.zip" ]; then
  fail "portfolio-tauri.zip introuvable. Place ce script dans le même dossier que l'archive."
fi

# ── 1. Désarchiver ────────────────────────────────────────
info "Extraction de l'archive..."
if command -v unzip &>/dev/null; then
  unzip -o portfolio-tauri.zip -d . > /dev/null
  log "Archive extraite"
else
  info "Installation de unzip..."
  sudo apt-get install -y unzip > /dev/null
  unzip -o portfolio-tauri.zip -d . > /dev/null
  log "Archive extraite"
fi

cd portfolio-tauri

# ── 2. Node.js ────────────────────────────────────────────
info "Vérification de Node.js..."
if ! command -v node &>/dev/null || [ "$(node -e 'process.exit(parseInt(process.version.slice(1)) < 18)')" ]; then
  info "Installation de Node.js 20 via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 2>/dev/null
  sudo apt-get install -y nodejs > /dev/null
  log "Node.js $(node --version) installé"
else
  log "Node.js $(node --version) déjà présent"
fi

# ── 3. Rust ───────────────────────────────────────────────
info "Vérification de Rust..."
if ! command -v cargo &>/dev/null; then
  info "Installation de Rust via rustup..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --quiet
  source "$HOME/.cargo/env"
  log "Rust $(rustc --version) installé"
else
  source "$HOME/.cargo/env" 2>/dev/null || true
  log "Rust $(rustc --version) déjà présent"
fi

# S'assure que cargo est dans le PATH pour la suite
export PATH="$HOME/.cargo/bin:$PATH"

# ── 4. Dépendances système Tauri ──────────────────────────
info "Installation des dépendances système pour Tauri..."
sudo apt-get update -qq

PKGS=(
  libwebkit2gtk-4.1-dev
  libappindicator3-dev
  librsvg2-dev
  patchelf
  libgtk-3-dev
  libglib2.0-dev
  libdbus-1-dev
  libssl-dev
  pkg-config
  imagemagick   # pour générer les icônes
)

MISSING=()
for pkg in "${PKGS[@]}"; do
  if ! dpkg -s "$pkg" &>/dev/null; then
    MISSING+=("$pkg")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  info "Paquets à installer : ${MISSING[*]}"
  sudo apt-get install -y "${MISSING[@]}" 2>/dev/null || \
    warn "Certains paquets n'ont pas pu être installés (pare-feu ?). On continue..."
  log "Dépendances système installées"
else
  log "Toutes les dépendances système sont déjà présentes"
fi

# ── 5. Icônes ─────────────────────────────────────────────
info "Génération des icônes..."
mkdir -p src-tauri/icons

if command -v convert &>/dev/null; then
  # Génère une icône 512x512 avec ImageMagick
  convert -size 512x512 \
    xc:"#1a1a1a" \
    -fill white \
    -font DejaVu-Sans-Bold \
    -pointsize 180 \
    -gravity Center \
    -annotate 0 "MR" \
    /tmp/icon_source.png 2>/dev/null || \
  # Fallback sans font spécifique
  convert -size 512x512 xc:"#1a1a1a" /tmp/icon_source.png

  log "Image source créée"

  # Génère toutes les tailles nécessaires pour Tauri
  convert /tmp/icon_source.png -resize 32x32   src-tauri/icons/32x32.png
  convert /tmp/icon_source.png -resize 128x128  src-tauri/icons/128x128.png
  convert /tmp/icon_source.png -resize 256x256  src-tauri/icons/128x128@2x.png
  convert /tmp/icon_source.png -resize 256x256  src-tauri/icons/icon.png

  # .ico pour Windows (multi-taille)
  convert /tmp/icon_source.png -resize 256x256 \
    \( -clone 0 -resize 16x16  \) \
    \( -clone 0 -resize 32x32  \) \
    \( -clone 0 -resize 48x48  \) \
    \( -clone 0 -resize 256x256 \) \
    -delete 0 src-tauri/icons/icon.ico 2>/dev/null || \
    cp src-tauri/icons/32x32.png src-tauri/icons/icon.ico

  # .icns pour macOS (approximation PNG)
  cp src-tauri/icons/128x128.png src-tauri/icons/icon.icns

  log "Icônes générées"
else
  warn "ImageMagick non disponible — création d'icônes minimales..."
  # Crée des PNG 1x1 transparent comme fallback
  # (suffisant pour compiler, pas pour publier)
  MINIMAL_PNG="\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82"
  for f in 32x32.png 128x128.png "128x128@2x.png" icon.png icon.icns; do
    printf "$MINIMAL_PNG" > "src-tauri/icons/$f"
  done
  cp src-tauri/icons/32x32.png src-tauri/icons/icon.ico
  warn "Icônes minimales créées (à remplacer par de vraies icônes avant publication)"
fi

# ── 6. Dépendances npm ────────────────────────────────────
info "Installation des dépendances npm..."
npm install --silent
log "npm install terminé"

# ── 7. Test de compilation Rust ───────────────────────────
info "Vérification de la compilation Rust (peut prendre 5-10 min la première fois)..."
echo ""
warn "La première compilation Rust télécharge et compile ~300 crates."
warn "C'est normal — ça ne se répète qu'une seule fois."
echo ""

# ── 8. Lancement ─────────────────────────────────────────
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║          Installation terminée !     ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Avant de lancer, édite :${NC}"
echo -e "  ${BOLD}src/lib/github.js${NC}"
echo -e "  → Change ${YELLOW}GITHUB_USER${NC} et ${YELLOW}GITHUB_REPO${NC} par les tiens"
echo ""
echo -e "  ${BLUE}Ensuite :${NC}"
echo -e "  ${BOLD}npm run tauri dev${NC}    ← lancer en développement"
echo -e "  ${BOLD}npm run tauri build${NC}  ← builder le .AppImage final"
echo ""

# Demande si on lance directement
read -p "$(echo -e "${YELLOW}Lancer npm run tauri dev maintenant ? [o/N] ${NC}")" LAUNCH
if [[ "$LAUNCH" =~ ^[oOyY]$ ]]; then
  echo ""
  info "Lancement de l'app..."
  npm run tauri dev
fi
