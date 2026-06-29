export type OSTarget = 'ubuntu' | 'debian';

export interface BaseSystemOptions {
  updatePackages: boolean;
  upgradePackages: boolean;
  installEssentials: boolean; // git, curl, wget, build-essential, unzip, etc.
}

export interface DockerOptions {
  install: boolean;
  installCompose: boolean;
  addToGroup: boolean; // Add current user to docker group to avoid sudo
}

export interface NodeOptions {
  install: boolean;
  version: 'lts' | 'latest' | string; // e.g. "20"
  manager: 'nvm' | 'fnm';
  globalPackages: string[]; // e.g. ['yarn', 'pnpm', 'pm2']
}

export interface PythonOptions {
  install: boolean;
  installPoetry: boolean;
  installPyenv: boolean;
}

export interface GoOptions {
  install: boolean;
  version: string; // e.g. "1.22.0"
}

export interface RustOptions {
  install: boolean; // via rustup
}

export interface ZshOptions {
  install: boolean;
  installOhMyZsh: boolean;
  theme: 'robbyrussell' | 'agnoster' | 'powerlevel10k';
  plugins: string[]; // e.g. ['git', 'zsh-autosuggestions', 'zsh-syntax-highlighting']
}

export interface GitOptions {
  configure: boolean;
  userName?: string;
  userEmail?: string;
  defaultBranch?: string; // e.g. "main"
}

export interface VSCodeOptions {
  install: boolean;
  extensions: string[]; // e.g. ['dbaeumer.vscode-eslint', 'esbenp.prettier-vscode']
}

export interface NeovimOptions {
  install: boolean;
  installKickstart: boolean; // Clones kickstart.nvim
}

export interface GHCLIOptions {
  install: boolean;
}

export interface KubectlOptions {
  install: boolean;
}

export interface TerraformOptions {
  install: boolean;
}

export interface PostgreSQLOptions {
  install: boolean;
  createUserAndDb: boolean;
  dbUser?: string;
  dbName?: string;
}

export interface MongoDBOptions {
  install: boolean;
}

export interface NginxOptions {
  install: boolean;
  configurePort: boolean;
  port: number;
}

export interface SetupConfig {
  os: OSTarget;
  system: BaseSystemOptions;
  git: GitOptions;
  zsh: ZshOptions;
  docker: DockerOptions;
  node: NodeOptions;
  python: PythonOptions;
  go: GoOptions;
  rust: RustOptions;
  vscode: VSCodeOptions;
  neovim: NeovimOptions;
  ghcli: GHCLIOptions;
  kubectl: KubectlOptions;
  terraform: TerraformOptions;
  postgres: PostgreSQLOptions;
  mongodb: MongoDBOptions;
  nginx: NginxOptions;
}

export interface ToolMetadata {
  id: keyof Omit<SetupConfig, 'os'>;
  name: string;
  description: string;
  category: 'system' | 'languages' | 'devops' | 'editors';
  icon: string; // Icon identifier for frontend
}

export const TOOLS_METADATA: ToolMetadata[] = [
  {
    id: 'system',
    name: 'Système de base',
    description: 'Mises à jour système et utilitaires de base (curl, wget, build-essential, unzip).',
    category: 'system',
    icon: 'Terminal'
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Configuration globale de Git (nom, email, branche par défaut).',
    category: 'system',
    icon: 'GitBranch'
  },
  {
    id: 'ghcli',
    name: 'GitHub CLI',
    description: 'Installe l\'outil en ligne de commande officiel GitHub (gh).',
    category: 'system',
    icon: 'GitPullRequest'
  },
  {
    id: 'zsh',
    name: 'Zsh & Oh My Zsh',
    description: 'Installe Zsh, Oh My Zsh et des thèmes/plugins populaires.',
    category: 'system',
    icon: 'Cpu'
  },
  {
    id: 'docker',
    name: 'Docker & Compose',
    description: 'Installe le moteur Docker, Docker Compose et configure les permissions utilisateur.',
    category: 'devops',
    icon: 'Container'
  },
  {
    id: 'node',
    name: 'Node.js',
    description: 'Installe Node.js via NVM ou FNM avec des gestionnaires globaux (Yarn, PNPM).',
    category: 'languages',
    icon: 'Code'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Installe Python 3, Pip, Poetry pour la gestion de dépendances et Pyenv.',
    category: 'languages',
    icon: 'Binary'
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    description: 'Installe le langage Go et configure le GOPATH dans le shell.',
    category: 'languages',
    icon: 'FileCode'
  },
  {
    id: 'rust',
    name: 'Rust',
    description: 'Installe Rust via rustup (rustc, cargo).',
    category: 'languages',
    icon: 'Package'
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Installe Visual Studio Code et configure les extensions recommandées.',
    category: 'editors',
    icon: 'Layers'
  },
  {
    id: 'neovim',
    name: 'Neovim',
    description: 'Installe Neovim et configure optionnellement kickstart.nvim pour un éditeur prêt à l\'emploi.',
    category: 'editors',
    icon: 'Edit3'
  },
  {
    id: 'kubectl',
    name: 'Kubectl',
    description: 'Outil de ligne de commande Kubernetes pour piloter les clusters.',
    category: 'devops',
    icon: 'Anchor'
  },
  {
    id: 'terraform',
    name: 'Terraform',
    description: 'Outil d\'Infrastructure as Code par HashiCorp.',
    category: 'devops',
    icon: 'Grid'
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Installe le serveur de base de données relationnelle PostgreSQL.',
    category: 'devops',
    icon: 'Database'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Installe le serveur de base de données NoSQL orientée documents MongoDB.',
    category: 'devops',
    icon: 'Database'
  },
  {
    id: 'nginx',
    name: 'Nginx',
    description: 'Installe le serveur web et proxy inverse Nginx.',
    category: 'devops',
    icon: 'Globe'
  }
];

export const DEFAULT_CONFIG: SetupConfig = {
  os: 'ubuntu',
  system: {
    updatePackages: true,
    upgradePackages: false,
    installEssentials: true
  },
  git: {
    configure: false,
    userName: '',
    userEmail: '',
    defaultBranch: 'main'
  },
  zsh: {
    install: false,
    installOhMyZsh: true,
    theme: 'robbyrussell',
    plugins: ['git', 'zsh-autosuggestions', 'zsh-syntax-highlighting']
  },
  docker: {
    install: false,
    installCompose: true,
    addToGroup: true
  },
  node: {
    install: false,
    version: 'lts',
    manager: 'nvm',
    globalPackages: ['yarn', 'pnpm']
  },
  python: {
    install: false,
    installPoetry: true,
    installPyenv: false
  },
  go: {
    install: false,
    version: '1.22.0'
  },
  rust: {
    install: false
  },
  vscode: {
    install: false,
    extensions: []
  },
  neovim: {
    install: false,
    installKickstart: true
  },
  ghcli: {
    install: false
  },
  kubectl: {
    install: false
  },
  terraform: {
    install: false
  },
  postgres: {
    install: false,
    createUserAndDb: false,
    dbUser: '',
    dbName: ''
  },
  mongodb: {
    install: false
  },
  nginx: {
    install: false,
    configurePort: false,
    port: 80
  }
};
