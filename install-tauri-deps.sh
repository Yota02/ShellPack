#!/usr/bin/env bash

# ==============================================================================
# Script d'installation des dépendances de compilation de Tauri (Linux)
# Conçu pour Ubuntu / Debian
# ==============================================================================

set -euo pipefail

# Couleurs pour l'affichage console
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Vérification que le script est exécuté sur Linux
if [ "$(uname)" != "Linux" ]; then
    log_error "Ce script est conçu uniquement pour Linux."
    exit 1
fi

# 2. Vérification de la distribution (doit être Debian/Ubuntu ou dérivé)
if [ ! -f /etc/debian_version ]; then
    log_warning "Ce script est principalement conçu pour les distributions basées sur Debian ou Ubuntu."
    read -p "Voulez-vous quand même tenter l'installation ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 3. Installation des dépendances système via APT
log_info "Mise à jour des listes de paquets (apt update)..."
sudo apt-get update

log_info "Installation des dépendances système requises pour Tauri v2..."
sudo apt-get install -y \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libwebkit2gtk-4.1-dev

log_success "Dépendances système installées avec succès !"

# 4. Installation / Configuration de Rust
if ! command -v cargo &> /dev/null; then
    log_info "Cargo/Rust non détecté. Installation de Rust via rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    
    # Charger l'environnement cargo dans le shell actuel
    # shellcheck source=/dev/null
    source "$HOME/.cargo/env"
    log_success "Rust a été installé avec succès !"
else
    log_info "Rust est déjà installé ($(cargo --version))."
fi

log_success "=== TOUTES LES DÉPENDANCES TAURI SONT PRÊTES ==="
log_info "Pour compiler l'application de bureau, vous pouvez maintenant exécuter :"
log_info "  npm run build:desktop"
