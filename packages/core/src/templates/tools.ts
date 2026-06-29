import { SetupConfig } from '../types.js';

export const systemTemplate = (config: SetupConfig['system']): string => {
  let script = `\n# --- Mise à jour Système et Utilitaires de base ---\n`;
  if (config.updatePackages) {
    script += `log_info "Mise à jour des listes de paquets (apt update)..."\nsudo apt-get update\n`;
  }
  if (config.upgradePackages) {
    script += `log_info "Mise à jour des paquets existants (apt upgrade)..."\nsudo apt-get upgrade -y\n`;
  }
  if (config.installEssentials) {
    script += `log_info "Installation des dépendances de base (build-essential, curl, wget, git, unzip, ca-certificates)..."\n`;
    script += `sudo apt-get install -y build-essential curl wget git unzip ca-certificates software-properties-common gnupg\n`;
  }
  return script;
};

export const gitTemplate = (config: SetupConfig['git']): string => {
  if (!config.configure) return '';
  let script = `\n# --- Configuration Git ---\nlog_info "Configuration de Git global..."\n`;
  if (config.userName) {
    script += `git config --global user.name "${config.userName}"\n`;
  }
  if (config.userEmail) {
    script += `git config --global user.email "${config.userEmail}"\n`;
  }
  if (config.defaultBranch) {
    script += `git config --global init.defaultBranch "${config.defaultBranch}"\n`;
  }
  script += `log_success "Git configuré avec succès !"\n`;
  return script;
};

export const zshTemplate = (config: SetupConfig['zsh']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Zsh & Oh My Zsh ---\n`;
  script += `if ! has_command zsh; then\n`;
  script += `    log_info "Installation de Zsh..."\n`;
  script += `    sudo apt-get install -y zsh\n`;
  script += `else\n`;
  script += `    log_info "Zsh est déjà installé."\n`;
  script += `fi\n`;

  if (config.installOhMyZsh) {
    script += `if [ ! -d "$HOME/.oh-my-zsh" ]; then\n`;
    script += `    log_info "Installation de Oh My Zsh (non-interactif)..."\n`;
    script += `    sh -c "\$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended\n`;
    script += `else\n`;
    script += `    log_info "Oh My Zsh est déjà installé."\n`;
    script += `fi\n`;

    // Install plugins
    if (config.plugins && config.plugins.length > 0) {
      script += `log_info "Installation des plugins Oh My Zsh..."\n`;
      if (config.plugins.includes('zsh-autosuggestions')) {
        script += `if [ ! -d "\${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ]; then\n`;
        script += `    git clone https://github.com/zsh-users/zsh-autosuggestions \${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions\n`;
        script += `fi\n`;
      }
      if (config.plugins.includes('zsh-syntax-highlighting')) {
        script += `if [ ! -d "\${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting" ]; then\n`;
        script += `    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git \${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting\n`;
        script += `fi\n`;
      }

      // Configure .zshrc plugins and theme
      script += `log_info "Mise à jour du fichier .zshrc..."\n`;
      // Replace plugins list in .zshrc
      const pluginsList = config.plugins.join(' ');
      script += `sed -i 's/plugins=(git)/plugins=(${pluginsList})/g' "$HOME/.zshrc" 2>/dev/null || true\n`;
    }

    if (config.theme) {
      script += `sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="${config.theme}"/g' "$HOME/.zshrc" 2>/dev/null || true\n`;
    }
  }

  // Change default shell to zsh
  script += `if [ "\$SHELL" != "\$(which zsh)" ]; then\n`;
  script += `    log_info "Changement du shell par défaut vers Zsh..."\n`;
  script += `    sudo chsh -s "\$(which zsh)" "\$USER"\n`;
  script += `fi\n`;

  script += `log_success "Zsh installé et configuré !"\n`;
  return script;
};

export const dockerTemplate = (config: SetupConfig['docker']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Docker ---\n`;
  script += `if ! has_command docker; then\n`;
  script += `    log_info "Installation de Docker Engine..."\n`;
  script += `    curl -fsSL https://get.docker.com -o get-docker.sh\n`;
  script += `    sudo sh get-docker.sh\n`;
  script += `    rm get-docker.sh\n`;
  script += `    sudo systemctl enable --now docker\n`;
  script += `else\n`;
  script += `    log_info "Docker est déjà installé."\n`;
  script += `fi\n`;

  if (config.addToGroup) {
    script += `log_info "Ajout de l'utilisateur au groupe Docker..."\n`;
    script += `sudo usermod -aG docker \$USER\n`;
    script += `log_warning "Note: Vous devez redémarrer votre session pour utiliser Docker sans sudo."\n`;
  }

  if (config.installCompose) {
    script += `if ! docker compose version >/dev/null 2>&1; then\n`;
    script += `    log_info "Installation du plugin Docker Compose..."\n`;
    script += `    sudo apt-get install -y docker-compose-plugin\n`;
    script += `else\n`;
    script += `    log_info "Docker Compose est déjà installé."\n`;
    script += `fi\n`;
  }

  script += `log_success "Docker configuré avec succès !"\n`;
  return script;
};

export const nodeTemplate = (config: SetupConfig['node']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Node.js ---\n`;

  if (config.manager === 'nvm') {
    script += `if [ ! -d "$HOME/.nvm" ]; then\n`;
    script += `    log_info "Installation de NVM (Node Version Manager)..."\n`;
    script += `    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash\n`;
    script += `fi\n`;
    script += `export NVM_DIR="$HOME/.nvm"\n`;
    script += `[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"\n`;

    const nodeVer = config.version === 'lts' ? '--lts' : (config.version === 'latest' ? 'node' : config.version);
    script += `log_info "Installation de Node.js (${config.version}) via NVM..."\n`;
    script += `nvm install ${nodeVer}\n`;
    script += `nvm use ${nodeVer}\n`;
    script += `nvm alias default ${nodeVer}\n`;
  } else if (config.manager === 'fnm') {
    script += `if ! has_command fnm; then\n`;
    script += `    log_info "Installation de FNM (Fast Node Manager)..."\n`;
    script += `    curl -fsSL https://fnm.vercel.app/install | bash\n`;
    script += `    export PATH="$HOME/.local/share/fnm:$PATH"\n`;
    script += `    eval "\$(fnm env --use-on-cd)"\n`;
    script += `fi\n`;

    const nodeVer = config.version === 'lts' ? '--lts' : (config.version === 'latest' ? 'latest' : config.version);
    script += `log_info "Installation de Node.js (${config.version}) via FNM..."\n`;
    script += `fnm install ${nodeVer}\n`;
    script += `fnm default ${nodeVer}\n`;
  }

  if (config.globalPackages && config.globalPackages.length > 0) {
    script += `log_info "Installation des packages globaux NPM (${config.globalPackages.join(', ')})..."\n`;
    script += `npm install -g ${config.globalPackages.join(' ')}\n`;
  }

  script += `log_success "Node.js configuré avec succès !"\n`;
  return script;
};

export const pythonTemplate = (config: SetupConfig['python']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Python ---\n`;
  script += `log_info "Installation de Python3 et Pip..."\n`;
  script += `sudo apt-get install -y python3 python3-pip python3-venv\n`;

  if (config.installPoetry) {
    script += `if ! has_command poetry; then\n`;
    script += `    log_info "Installation de Poetry..."\n`;
    script += `    curl -sSL https://install.python-poetry.org | python3 -\n`;
    script += `    export PATH="$HOME/.local/bin:\$PATH"\n`;
    script += `else\n`;
    script += `    log_info "Poetry est déjà installé."\n`;
    script += `fi\n`;
  }

  if (config.installPyenv) {
    script += `if [ ! -d "$HOME/.pyenv" ]; then\n`;
    script += `    log_info "Installation de Pyenv..."\n`;
    script += `    sudo apt-get install -y make build-essential libssl-dev zlib1g-dev \\\n`;
    script += `    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \\\n`;
    script += `    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev\n`;
    script += `    git clone https://github.com/pyenv/pyenv.git ~/.pyenv\n`;
    script += `    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc\n`;
    script += `    echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc\n`;
    script += `    echo 'eval "$(pyenv init -)"' >> ~/.bashrc\n`;
    script += `else\n`;
    script += `    log_info "Pyenv est déjà installé."\n`;
    script += `fi\n`;
  }

  script += `log_success "Python configuré avec succès !"\n`;
  return script;
};

export const goTemplate = (config: SetupConfig['go']): string => {
  if (!config.install) return '';
  const version = config.version || '1.22.0';
  let script = `\n# --- Installation de Go (Golang) ---\n`;
  script += `if ! has_command go; then\n`;
  script += `    log_info "Téléchargement et installation de Go v${version}..."\n`;
  script += `    wget https://go.dev/dl/go${version}.linux-amd64.tar.gz\n`;
  script += `    sudo rm -rf /usr/local/go\n`;
  script += `    sudo tar -C /usr/local -xzf go${version}.linux-amd64.tar.gz\n`;
  script += `    rm go${version}.linux-amd64.tar.gz\n`;
  script += `    echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> ~/.bashrc\n`;
  script += `    export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin\n`;
  script += `else\n`;
  script += `    log_info "Go est déjà installé (\$(go version))."\n`;
  script += `fi\n`;
  script += `log_success "Go configuré avec succès !"\n`;
  return script;
};

export const rustTemplate = (config: SetupConfig['rust']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Rust ---\n`;
  script += `if ! has_command rustc; then\n`;
  script += `    log_info "Installation de Rust via rustup (sans invite de commande)..."\n`;
  script += `    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y\n`;
  script += `    source "\$HOME/.cargo/env"\n`;
  script += `else\n`;
  script += `    log_info "Rust est déjà installé (\$(rustc --version))."\n`;
  script += `fi\n`;
  script += `log_success "Rust configuré avec succès !"\n`;
  return script;
};

export const vscodeTemplate = (config: SetupConfig['vscode']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de VS Code ---\n`;
  script += `if ! has_command code; then\n`;
  script += `    log_info "Téléchargement du package .deb de VS Code..."\n`;
  script += `    curl -L "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64" -o vscode.deb\n`;
  script += `    log_info "Installation du package VS Code..."\n`;
  script += `    sudo apt install ./vscode.deb -y\n`;
  script += `    rm vscode.deb\n`;
  script += `else\n`;
  script += `    log_info "VS Code est déjà installé."\n`;
  script += `fi\n`;

  if (config.extensions && config.extensions.length > 0) {
    script += `log_info "Installation des extensions VS Code..."\n`;
    for (const ext of config.extensions) {
      script += `code --install-extension ${ext} --force || true\n`;
    }
  }

  script += `log_success "VS Code configuré avec succès !"\n`;
  return script;
};

export const neovimTemplate = (config: SetupConfig['neovim']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Neovim ---\n`;
  script += `if ! has_command nvim; then\n`;
  script += `    log_info "Ajout du PPA Neovim unstable..."\n`;
  script += `    sudo add-apt-repository ppa:neovim-ppa/unstable -y\n`;
  script += `    sudo apt-get update\n`;
  script += `    log_info "Installation de Neovim..."\n`;
  script += `    sudo apt-get install -y neovim\n`;
  script += `else\n`;
  script += `    log_info "Neovim est déjà installé."\n`;
  script += `fi\n`;

  if (config.installKickstart) {
    script += `if [ ! -d "\$HOME/.config/nvim" ]; then\n`;
    script += `    log_info "Clonage de kickstart.nvim..."\n`;
    script += `    git clone https://github.com/nvim-lua/kickstart.nvim.git "\${XDG_CONFIG_HOME:-$HOME/.config}/nvim"\n`;
    script += `else\n`;
    script += `    log_info "Un dossier de configuration ~/.config/nvim existe déjà. Passage du clonage de Kickstart."\n`;
    script += `fi\n`;
  }

  script += `log_success "Neovim configuré avec succès !"\n`;
  return script;
};

export const ghcliTemplate = (config: SetupConfig['ghcli']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de GitHub CLI ---\n`;
  script += `if ! has_command gh; then\n`;
  script += `    log_info "Configuration du dépôt officiel de GitHub CLI..."\n`;
  script += `    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg\n`;
  script += `    sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg\n`;
  script += `    echo "deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null\n`;
  script += `    sudo apt update\n`;
  script += `    log_info "Installation de gh..."\n`;
  script += `    sudo apt install gh -y\n`;
  script += `else\n`;
  script += `    log_info "GitHub CLI est déjà installé."\n`;
  script += `fi\n`;
  script += `log_success "GitHub CLI configuré avec succès !"\n`;
  return script;
};

export const kubectlTemplate = (config: SetupConfig['kubectl']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Kubectl ---\n`;
  script += `if ! has_command kubectl; then\n`;
  script += `    log_info "Téléchargement de Kubectl stable..."\n`;
  script += `    curl -LO "https://dl.k8s.io/release/\$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"\n`;
  script += `    log_info "Installation de kubectl..."\n`;
  script += `    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl\n`;
  script += `    rm kubectl\n`;
  script += `else\n`;
  script += `    log_info "Kubectl est déjà installé."\n`;
  script += `fi\n`;
  script += `log_success "Kubectl configuré avec succès !"\n`;
  return script;
};

export const terraformTemplate = (config: SetupConfig['terraform']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Terraform ---\n`;
  script += `if ! has_command terraform; then\n`;
  script += `    log_info "Configuration du dépôt HashiCorp..."\n`;
  script += `    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg\n`;
  script += `    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com \$(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list\n`;
  script += `    sudo apt update\n`;
  script += `    log_info "Installation de Terraform..."\n`;
  script += `    sudo apt-get install terraform -y\n`;
  script += `else\n`;
  script += `    log_info "Terraform est déjà installé."\n`;
  script += `fi\n`;
  script += `log_success "Terraform configuré avec succès !"\n`;
  return script;
};

export const postgresTemplate = (config: SetupConfig['postgres']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de PostgreSQL ---\n`;
  script += `if ! has_command psql; then\n`;
  script += `    log_info "Installation de PostgreSQL et contribs..."\n`;
  script += `    sudo apt-get install -y postgresql postgresql-contrib\n`;
  script += `    sudo systemctl enable --now postgresql\n`;
  script += `else\n`;
  script += `    log_info "PostgreSQL est déjà installé."\n`;
  script += `fi\n`;
  if (config.createUserAndDb && config.dbUser) {
    const dbName = config.dbName || config.dbUser;
    script += `log_info "Création de l'utilisateur Postgres '${config.dbUser}' et DB '${dbName}'..."\n`;
    script += `sudo -u postgres psql -c "CREATE USER ${config.dbUser} WITH PASSWORD 'password';" 2>/dev/null || true\n`;
    script += `sudo -u postgres psql -c "CREATE DATABASE ${dbName} OWNER ${config.dbUser};" 2>/dev/null || true\n`;
  }
  script += `log_success "PostgreSQL configuré avec succès !"\n`;
  return script;
};

export const mongodbTemplate = (config: SetupConfig['mongodb']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de MongoDB ---\n`;
  script += `if ! has_command mongod; then\n`;
  script += `    log_info "Configuration du dépôt MongoDB officiel..."\n`;
  script += `    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg\n`;
  script += `    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu \$(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list\n`;
  script += `    sudo apt update\n`;
  script += `    log_info "Installation de MongoDB Community Server..."\n`;
  script += `    sudo apt-get install -y mongodb-org\n`;
  script += `    sudo systemctl enable --now mongod\n`;
  script += `else\n`;
  script += `    log_info "MongoDB est déjà installé."\n`;
  script += `fi\n`;
  script += `log_success "MongoDB configuré avec succès !"\n`;
  return script;
};

export const nginxTemplate = (config: SetupConfig['nginx']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Nginx ---\n`;
  script += `if ! has_command nginx; then\n`;
  script += `    log_info "Installation de Nginx..."\n`;
  script += `    sudo apt-get install -y nginx\n`;
  script += `    sudo systemctl enable --now nginx\n`;
  script += `else\n`;
  script += `    log_info "Nginx est déjà installé."\n`;
  script += `fi\n`;
  if (config.configurePort && config.port) {
    script += `log_info "Configuration du port Nginx vers ${config.port}..."\n`;
    script += `sudo sed -i 's/listen 80 default_server;/listen ${config.port} default_server;/g' /etc/nginx/sites-available/default 2>/dev/null || true\n`;
    script += `sudo systemctl restart nginx\n`;
  }
  script += `log_success "Nginx configuré avec succès !"\n`;
  return script;
};

export const checklistTemplate = (config: SetupConfig['checklist']): string => {
  if (!config.install || !config.tasks || config.tasks.length === 0) return '';
  let script = `\n# --- Liste des tâches post-installation ---\n`;
  script += `log_warning "=== CHOSES A FAIRE (POST-INSTALLATION) ==="\n`;
  for (const task of config.tasks) {
    script += `echo "  [ ] ${task}"\n`;
  }
  script += `log_warning "==========================================="\n`;
  return script;
};

export const agyTemplate = (config: SetupConfig['agy']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de agy CLI ---\n`;
  script += `if ! has_command agy; then\n`;
  script += `    log_info "Téléchargement et installation de agy CLI..."\n`;
  script += `    curl -fsSL https://antigravity.google/install-agy.sh | bash\n`;
  script += `else\n`;
  script += `    log_info "agy CLI est déjà installé."\n`;
  script += `fi\n`;
  script += `log_success "agy CLI installé avec succès !"\n`;
  return script;
};

export const antigravityTemplate = (config: SetupConfig['antigravity']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de Google Antigravity ---\n`;
  script += `if ! has_command antigravity; then\n`;
  script += `    log_info "Téléchargement et installation de Google Antigravity..."\n`;
  script += `    curl -fsSL https://antigravity.google/install.sh | bash\n`;
  script += `else\n`;
  script += `    log_info "Google Antigravity est déjà installé."\n`;
  script += `fi\n`;
  script += `log_success "Google Antigravity installé avec succès !"\n`;
  return script;
};

export const opencodeTemplate = (config: SetupConfig['opencode']): string => {
  if (!config.install) return '';
  let script = `\n# --- Installation de OpenCode ---\n`;
  script += `if ! has_command opencode; then\n`;
  script += `    log_info "Téléchargement et installation de OpenCode..."\n`;
  script += `    curl -fsSL https://opencode.dev/install.sh | bash\n`;
  script += `else\n`;
  script += `    log_info "OpenCode est déjà installé."\n`;
  script += `fi\n`;
  script += `log_success "OpenCode installé avec succès !"\n`;
  return script;
};
