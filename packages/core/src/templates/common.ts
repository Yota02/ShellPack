export const bashHeader = `#!/usr/bin/env bash

# ==============================================================================
# SCRIPT D'INSTALLATION AUTOMATIQUE ET DE CONFIGURATION
# Généré par Setup Generator - Alexis-mk
# Date de génération : ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}
# ==============================================================================

# Fermer le script en cas d'erreur sur les commandes critiques
set -o pipefail

# Couleurs pour l'affichage console
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[0;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Fonctions de journalisation (logging)
log_info() {
    echo -e "\${BLUE}[INFO]\${NC} \$1"
}

log_success() {
    echo -e "\${GREEN}[SUCCESS]\${NC} \$1"
}

log_warning() {
    echo -e "\${YELLOW}[WARNING]\${NC} \$1"
}

log_error() {
    echo -e "\${RED}[ERROR]\${NC} \$1"
}

# Vérifier si une commande existe
has_command() {
    command -v "\$1" >/dev/null 2>&1
}

# Vérifier que le script est exécuté sur Linux
if [ "\$(uname)" != "Linux" ]; then
    log_error "Ce script est conçu uniquement pour Linux."
    exit 1
fi

log_info "Démarrage du processus d'installation..."
`;

export const bashFooter = `
# ==============================================================================
# INSTALLATION TERMINÉE
# ==============================================================================

log_success "Toutes les étapes d'installation configurées sont terminées !"
log_warning "Certaines modifications (comme le changement de shell Zsh ou les groupes Docker) peuvent nécessiter de vous déconnecter/reconnecter pour prendre effet."
log_info "Profitez de votre nouvelle machine !"
`;
