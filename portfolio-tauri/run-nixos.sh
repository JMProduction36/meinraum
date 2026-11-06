#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

if ! command -v nix >/dev/null 2>&1; then
  echo "Erreur : Nix est introuvable. Installez Nix/NixOS puis relancez ce script." >&2
  exit 127
fi

if ! nix --extra-experimental-features 'nix-command flakes' --version >/dev/null 2>&1; then
  echo "Erreur : cette version de Nix ne prend pas en charge les commandes nécessaires aux flakes." >&2
  exit 1
fi

if [[ ! -f flake.nix ]]; then
  echo "Erreur : flake.nix est introuvable à la racine du projet." >&2
  exit 1
fi

if [[ ! -f package-lock.json ]]; then
  echo "Erreur : package-lock.json est introuvable ; npm ci ne peut pas être exécuté." >&2
  exit 1
fi

echo "Entrée dans l’environnement Nix (nixpkgs unstable), installation npm ci, puis lancement de Tauri…"
exec nix --extra-experimental-features 'nix-command flakes' develop . --command bash -c 'npm ci && npm run tauri dev'
