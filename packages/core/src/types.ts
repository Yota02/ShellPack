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

export interface ChecklistOptions {
  install: boolean;
  tasks: string[];
}

export interface AgyOptions {
  install: boolean;
}

export interface AntigravityOptions {
  install: boolean;
}

export interface OpencodeOptions {
  install: boolean;
}

export interface BunOptions {
  install: boolean;
}

export interface DenoOptions {
  install: boolean;
}

export interface PHPOptions {
  install: boolean;
  installComposer: boolean;
}

export interface RubyOptions {
  install: boolean;
  installRbenv: boolean;
}

export interface JavaOptions {
  install: boolean;
  version: '8' | '11' | '17' | '21' | string;
}

export interface AwsCLIOptions {
  install: boolean;
}

export interface GCloudOptions {
  install: boolean;
}

export interface AnsibleOptions {
  install: boolean;
}

export interface HelmOptions {
  install: boolean;
}

export interface MinikubeOptions {
  install: boolean;
}

export interface RedisOptions {
  install: boolean;
}

export interface SQLiteOptions {
  install: boolean;
}

export interface LazygitOptions {
  install: boolean;
}

export interface TmuxOptions {
  install: boolean;
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
  checklist: ChecklistOptions;
  agy: AgyOptions;
  antigravity: AntigravityOptions;
  opencode: OpencodeOptions;
  bun: BunOptions;
  deno: DenoOptions;
  php: PHPOptions;
  ruby: RubyOptions;
  java: JavaOptions;
  awscli: AwsCLIOptions;
  gcloud: GCloudOptions;
  ansible: AnsibleOptions;
  helm: HelmOptions;
  minikube: MinikubeOptions;
  redis: RedisOptions;
  sqlite: SQLiteOptions;
  lazygit: LazygitOptions;
  tmux: TmuxOptions;
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
    id: 'checklist',
    name: 'Liste de tâches',
    description: 'Affiche un rappel des tâches manuelles à la fin du script.',
    category: 'system',
    icon: 'ListTodo'
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    description: 'Installe le framework d\'agents d\'intelligence artificielle Google Antigravity.',
    category: 'system',
    icon: 'Flame'
  },
  {
    id: 'agy',
    name: 'agy CLI',
    description: 'Installe l\'interface en ligne de commande agy pour piloter Antigravity.',
    category: 'languages',
    icon: 'Terminal'
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'Installe l\'assistant de développement autonome OpenCode.',
    category: 'editors',
    icon: 'Code'
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
    id: 'bun',
    name: 'Bun',
    description: 'Installe le runtime JS/TS rapide Bun.',
    category: 'languages',
    icon: 'Code'
  },
  {
    id: 'deno',
    name: 'Deno',
    description: 'Installe le runtime JS/TS moderne et sécurisé Deno.',
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
    id: 'php',
    name: 'PHP & Composer',
    description: 'Installe PHP et le gestionnaire de dépendances Composer.',
    category: 'languages',
    icon: 'FileCode'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    description: 'Installe le langage Ruby de manière globale ou avec rbenv.',
    category: 'languages',
    icon: 'Package'
  },
  {
    id: 'java',
    name: 'Java (OpenJDK)',
    description: 'Installe le kit de développement OpenJDK Java.',
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
    id: 'awscli',
    name: 'AWS CLI',
    description: 'Installe l\'interface de ligne de commande officielle AWS.',
    category: 'devops',
    icon: 'Layers'
  },
  {
    id: 'gcloud',
    name: 'Google Cloud CLI',
    description: 'Installe l\'interface de ligne de commande officielle Google Cloud SDK.',
    category: 'devops',
    icon: 'Layers'
  },
  {
    id: 'ansible',
    name: 'Ansible',
    description: 'Installe l\'outil d\'automatisation de configuration Ansible.',
    category: 'devops',
    icon: 'Cpu'
  },
  {
    id: 'helm',
    name: 'Helm',
    description: 'Installe le gestionnaire de paquets Kubernetes Helm.',
    category: 'devops',
    icon: 'Anchor'
  },
  {
    id: 'minikube',
    name: 'Minikube',
    description: 'Installe un cluster local Kubernetes à nœud unique.',
    category: 'devops',
    icon: 'Container'
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
    id: 'redis',
    name: 'Redis',
    description: 'Installe le magasin de stockage de données en mémoire cache Redis.',
    category: 'devops',
    icon: 'Database'
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'Installe le moteur de base de données embarqué et léger SQLite3.',
    category: 'devops',
    icon: 'Database'
  },
  {
    id: 'nginx',
    name: 'Nginx',
    description: 'Installe le serveur web et proxy inverse Nginx.',
    category: 'devops',
    icon: 'Globe'
  },
  {
    id: 'lazygit',
    name: 'LazyGit',
    description: 'Installe l\'interface graphique de terminal simple pour Git.',
    category: 'system',
    icon: 'GitBranch'
  },
  {
    id: 'tmux',
    name: 'Tmux',
    description: 'Installe le multiplexeur de terminaux Tmux pour gérer plusieurs sessions.',
    category: 'system',
    icon: 'Terminal'
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
  bun: {
    install: false
  },
  deno: {
    install: false
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
  php: {
    install: false,
    installComposer: true
  },
  ruby: {
    install: false,
    installRbenv: true
  },
  java: {
    install: false,
    version: '17'
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
  awscli: {
    install: false
  },
  gcloud: {
    install: false
  },
  ansible: {
    install: false
  },
  helm: {
    install: false
  },
  minikube: {
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
  redis: {
    install: false
  },
  sqlite: {
    install: false
  },
  nginx: {
    install: false,
    configurePort: false,
    port: 80
  },
  checklist: {
    install: false,
    tasks: [
      'Se connecter à GitHub via gh auth login',
      'Configurer les clés SSH'
    ]
  },
  agy: {
    install: false
  },
  antigravity: {
    install: false
  },
  opencode: {
    install: false
  },
  lazygit: {
    install: false
  },
  tmux: {
    install: false
  }
};
