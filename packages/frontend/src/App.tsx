import React, { useState, useEffect, useRef } from 'react';
import {
  generateSetupScript,
  DEFAULT_CONFIG,
  type SetupConfig
} from '@setup-generator/core';
import {
  Terminal,
  GitBranch,
  Cpu,
  Container,
  Code,
  Binary,
  FileCode,
  Package,
  Layers,
  Edit3,
  Copy,
  Check,
  Download,
  Upload,
  RefreshCw,
  Info,
  Trash2,
  Settings,
  Flame,
  Plus,
  Search,
  GitPullRequest,
  Database,
  Globe,
  Chrome,
  Slack,
  Anchor,
  Grid,
  ListTodo,
  AlertTriangle,
  CheckCircle,
  ArrowUpDown
} from 'lucide-react';

// Map of Lego-themed styling classes and meta information for each tool
interface ToolMeta {
  id: string;
  name: string;
  desc: string;
  icon: any;
  colorClass: string; // Used for LEGO brick theme colors
}

const TOOLS_META: ToolMeta[] = [
  { id: 'system', name: 'Système', desc: 'Mises à jour et dépendances de base', icon: Terminal, colorClass: 'lego-red' },
  { id: 'git', name: 'Git', desc: 'Configuration identité et init de dépôts', icon: GitBranch, colorClass: 'lego-orange' },
  { id: 'ghcli', name: 'GitHub CLI', desc: 'Outil de ligne de commande GitHub (gh)', icon: GitPullRequest, colorClass: 'lego-orange' },
  { id: 'lazygit', name: 'LazyGit', desc: 'Interface de terminal simple pour Git', icon: GitBranch, colorClass: 'lego-orange' },
  { id: 'zsh', name: 'Zsh & Shell', desc: 'Installe Zsh, Oh My Zsh et thèmes', icon: Cpu, colorClass: 'lego-yellow' },
  { id: 'tmux', name: 'Tmux', desc: 'Multiplexeur de terminaux en ligne de commande', icon: Terminal, colorClass: 'lego-red' },
  { id: 'checklist', name: 'Liste de tâches', desc: 'Rappels post-install (ex: agy, antigravity, opencode)', icon: ListTodo, colorClass: 'lego-yellow' },
  { id: 'antigravity', name: 'Antigravity', desc: 'Framework d\'agents IA Google Antigravity', icon: Flame, colorClass: 'lego-red' },
  { id: 'agy', name: 'agy CLI', desc: 'Interface CLI pour piloter Antigravity', icon: Terminal, colorClass: 'lego-orange' },
  { id: 'opencode', name: 'OpenCode', desc: 'Assistant autonome de dev OpenCode', icon: Code, colorClass: 'lego-green' },
  { id: 'docker', name: 'Docker', desc: 'Moteur Docker et Docker Compose', icon: Container, colorClass: 'lego-blue' },
  { id: 'node', name: 'Node.js', desc: 'Versions Node via NVM/FNM et pkgs', icon: Code, colorClass: 'lego-green' },
  { id: 'bun', name: 'Bun', desc: 'Runtime JavaScript/TypeScript ultra-rapide', icon: Code, colorClass: 'lego-green' },
  { id: 'deno', name: 'Deno', desc: 'Runtime JavaScript/TypeScript moderne et sécurisé', icon: Code, colorClass: 'lego-green' },
  { id: 'python', name: 'Python', desc: 'Python 3, Poetry et gestionnaire Pyenv', icon: Binary, colorClass: 'lego-indigo' },
  { id: 'go', name: 'Go', desc: 'Langage Go et configuration de GOPATH', icon: FileCode, colorClass: 'lego-teal' },
  { id: 'rust', name: 'Rust', desc: 'Chaîne d\'outils Rust via rustup', icon: Package, colorClass: 'lego-rust' },
  { id: 'php', name: 'PHP & Composer', desc: 'PHP et le gestionnaire Composer', icon: FileCode, colorClass: 'lego-green' },
  { id: 'ruby', name: 'Ruby', desc: 'Langage Ruby globalement ou avec rbenv', icon: Package, colorClass: 'lego-green' },
  { id: 'java', name: 'Java (OpenJDK)', desc: 'Kit de développement Java OpenJDK', icon: Package, colorClass: 'lego-green' },
  { id: 'vscode', name: 'VS Code', desc: 'Éditeur VS Code et extensions', icon: Layers, colorClass: 'lego-vscode' },
  { id: 'neovim', name: 'Neovim', desc: 'Installe Neovim et kickstart.nvim', icon: Edit3, colorClass: 'lego-emerald' },
  { id: 'kubectl', name: 'Kubectl', desc: 'Gestion de clusters Kubernetes', icon: Anchor, colorClass: 'lego-blue' },
  { id: 'terraform', name: 'Terraform', desc: 'Infrastructure as Code par HashiCorp', icon: Grid, colorClass: 'lego-rust' },
  { id: 'helm', name: 'Helm', desc: 'Gestionnaire de paquets Kubernetes', icon: Anchor, colorClass: 'lego-blue' },
  { id: 'minikube', name: 'Minikube', desc: 'Déploie un cluster Kubernetes local', icon: Container, colorClass: 'lego-blue' },
  { id: 'awscli', name: 'AWS CLI', desc: 'Interface de ligne de commande AWS officielle', icon: Layers, colorClass: 'lego-vscode' },
  { id: 'gcloud', name: 'Google Cloud SDK', desc: 'Outil de ligne de commande Google Cloud (gcloud)', icon: Layers, colorClass: 'lego-vscode' },
  { id: 'ansible', name: 'Ansible', desc: 'Outil d\'automatisation de configuration', icon: Cpu, colorClass: 'lego-yellow' },
  { id: 'postgres', name: 'PostgreSQL', desc: 'Serveur de base relationnelle SQL', icon: Database, colorClass: 'lego-indigo' },
  { id: 'mongodb', name: 'MongoDB', desc: 'Base de données NoSQL orientée doc', icon: Database, colorClass: 'lego-green' },
  { id: 'redis', name: 'Redis', desc: 'Magasin de données en cache Redis', icon: Database, colorClass: 'lego-indigo' },
  { id: 'sqlite', name: 'SQLite', desc: 'Moteur de base de données SQL léger embarqué', icon: Database, colorClass: 'lego-indigo' },
  { id: 'nginx', name: 'Nginx', desc: 'Serveur HTTP et reverse proxy', icon: Globe, colorClass: 'lego-emerald' },
  { id: 'chrome', name: 'Google Chrome', desc: 'Navigateur web Google Chrome officiel', icon: Chrome, colorClass: 'lego-blue' },
  { id: 'firefox', name: 'Firefox', desc: 'Navigateur web Firefox via apt', icon: Globe, colorClass: 'lego-orange' },
  { id: 'slack', name: 'Slack', desc: 'Client de messagerie Slack officiel', icon: Slack, colorClass: 'lego-red' }
];

const TOOL_DEPENDENCIES: Record<string, string[]> = {
  git: ['system'],
  ghcli: ['system'],
  lazygit: ['system'],
  zsh: ['system'],
  tmux: ['system'],
  docker: ['system'],
  node: ['system'],
  bun: ['system'],
  deno: ['system'],
  python: ['system'],
  go: ['system'],
  rust: ['system'],
  php: ['system'],
  ruby: ['system'],
  java: ['system'],
  vscode: ['system'],
  neovim: ['system'],
  kubectl: ['system'],
  terraform: ['system'],
  helm: ['system'],
  minikube: ['system', 'docker'],
  awscli: ['system'],
  gcloud: ['system'],
  ansible: ['system'],
  postgres: ['system'],
  mongodb: ['system'],
  redis: ['system'],
  sqlite: ['system'],
  nginx: ['system'],
  chrome: ['system'],
  firefox: ['system'],
  slack: ['system'],
  antigravity: ['system'],
  agy: ['system', 'antigravity'],
  opencode: ['system'],
};

interface DependencyIssue {
  toolId: string;
  dependentOnId: string;
  message: string;
  type: 'missing' | 'wrong_order';
}

function getDependenciesForTool(toolId: string, config: SetupConfig): string[] {
  const deps = [...(TOOL_DEPENDENCIES[toolId] || [])];
  
  // If the tool is installed via npm, it also requires node.js
  if (
    (toolId === 'opencode' && config.opencode?.installMethod === 'npm') ||
    (toolId === 'agy' && config.agy?.installMethod === 'npm') ||
    (toolId === 'antigravity' && config.antigravity?.installMethod === 'npm')
  ) {
    if (!deps.includes('node')) {
      deps.push('node');
    }
  }
  
  return deps;
}

function validateInstallationOrder(activeTools: string[], config: SetupConfig): DependencyIssue[] {
  const issues: DependencyIssue[] = [];

  // Check if system is not first
  const systemIndex = activeTools.indexOf('system');
  if (systemIndex > 0) {
    issues.push({
      toolId: 'system',
      dependentOnId: '',
      message: "Le 'Système de base' doit être configuré/installé en premier.",
      type: 'wrong_order'
    });
  }

  // Check if checklist is not last
  const checklistIndex = activeTools.indexOf('checklist');
  if (checklistIndex !== -1 && checklistIndex !== activeTools.length - 1) {
    issues.push({
      toolId: 'checklist',
      dependentOnId: '',
      message: "La 'Liste de tâches' post-installation doit être placée à la fin.",
      type: 'wrong_order'
    });
  }

  // Check regular dependencies order
  for (let i = 0; i < activeTools.length; i++) {
    const toolId = activeTools[i];
    const deps = getDependenciesForTool(toolId, config);
    for (const depId of deps) {
      const depIndex = activeTools.indexOf(depId);
      if (depIndex === -1) {
        // Missing dependency (only warn for specific critical dependencies to avoid forcing system for everything)
        if (depId === 'node' || depId === 'docker' || depId === 'antigravity') {
          const toolName = TOOLS_META.find(t => t.id === toolId)?.name || toolId;
          const depName = TOOLS_META.find(t => t.id === depId)?.name || depId;
          issues.push({
            toolId,
            dependentOnId: depId,
            message: `L'outil '${toolName}' requiert l'activation de '${depName}' pour son installation.`,
            type: 'missing'
          });
        }
      } else if (depIndex > i) {
        const toolName = TOOLS_META.find(t => t.id === toolId)?.name || toolId;
        const depName = TOOLS_META.find(t => t.id === depId)?.name || depId;
        issues.push({
          toolId,
          dependentOnId: depId,
          message: `L'outil '${toolName}' est configuré avant '${depName}', alors qu'il en dépend.`,
          type: 'wrong_order'
        });
      }
    }
  }

  return issues;
}

function sortInstallationTools(activeTools: string[], config: SetupConfig): string[] {
  const inDegree: Record<string, number> = {};
  const adjList: Record<string, string[]> = {};
  const toolsSet = new Set(activeTools);

  // Initialize
  for (const tool of activeTools) {
    inDegree[tool] = 0;
    adjList[tool] = [];
  }

  // Add edges using predecessors to avoid duplicates
  for (const tool of activeTools) {
    const predecessors = new Set<string>();
    
    if (tool !== 'system' && toolsSet.has('system')) {
      predecessors.add('system');
    }
    
    if (tool === 'checklist') {
      for (const other of activeTools) {
        if (other !== 'checklist') {
          predecessors.add(other);
        }
      }
    } else {
      const deps = getDependenciesForTool(tool, config);
      for (const dep of deps) {
        if (toolsSet.has(dep)) {
          predecessors.add(dep);
        }
      }
    }

    for (const pred of predecessors) {
      adjList[pred].push(tool);
      inDegree[tool]++;
    }
  }

  // Find all nodes with in-degree 0
  const originalIndices = new Map<string, number>();
  activeTools.forEach((tool, idx) => originalIndices.set(tool, idx));

  const queue: string[] = [];
  for (const tool of activeTools) {
    if (inDegree[tool] === 0) {
      queue.push(tool);
    }
  }

  // Sort queue by original index to keep it stable
  queue.sort((a, b) => (originalIndices.get(a) || 0) - (originalIndices.get(b) || 0));

  const result: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    const neighbors = adjList[node] || [];
    for (const neighbor of neighbors) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }

    queue.sort((a, b) => (originalIndices.get(a) || 0) - (originalIndices.get(b) || 0));
  }

  if (result.length !== activeTools.length) {
    return activeTools;
  }

  return result;
}

function App() {
  const [config, setConfig] = useState<SetupConfig>({
    ...DEFAULT_CONFIG,
    antigravity: { install: true },
    agy: { install: true },
    opencode: { install: true }
  });
  const [activeTools, setActiveTools] = useState<string[]>(['system', 'git', 'antigravity', 'agy', 'opencode']);
  const [activeModalTool, setActiveModalTool] = useState<string | null>(null);
  const [script, setScript] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dependencyIssues = validateInstallationOrder(activeTools, config);
  const hasOrderIssues = dependencyIssues.some(issue => issue.type === 'wrong_order');
  const hasAnyIssues = dependencyIssues.length > 0;

  // Helper to extract active tools list based on config values (useful when importing JSON)
  const getActiveToolsFromConfig = (cfg: SetupConfig): string[] => {
    const active: string[] = [];
    if (cfg.system) active.push('system');
    if (cfg.git?.configure) active.push('git');
    if (cfg.ghcli?.install) active.push('ghcli');
    if (cfg.lazygit?.install) active.push('lazygit');
    if (cfg.zsh?.install) active.push('zsh');
    if (cfg.tmux?.install) active.push('tmux');
    if (cfg.checklist?.install) active.push('checklist');
    if (cfg.agy?.install) active.push('agy');
    if (cfg.antigravity?.install) active.push('antigravity');
    if (cfg.opencode?.install) active.push('opencode');
    if (cfg.docker?.install) active.push('docker');
    if (cfg.node?.install) active.push('node');
    if (cfg.bun?.install) active.push('bun');
    if (cfg.deno?.install) active.push('deno');
    if (cfg.python?.install) active.push('python');
    if (cfg.go?.install) active.push('go');
    if (cfg.rust?.install) active.push('rust');
    if (cfg.php?.install) active.push('php');
    if (cfg.ruby?.install) active.push('ruby');
    if (cfg.java?.install) active.push('java');
    if (cfg.vscode?.install) active.push('vscode');
    if (cfg.neovim?.install) active.push('neovim');
    if (cfg.kubectl?.install) active.push('kubectl');
    if (cfg.terraform?.install) active.push('terraform');
    if (cfg.helm?.install) active.push('helm');
    if (cfg.minikube?.install) active.push('minikube');
    if (cfg.awscli?.install) active.push('awscli');
    if (cfg.gcloud?.install) active.push('gcloud');
    if (cfg.ansible?.install) active.push('ansible');
    if (cfg.postgres?.install) active.push('postgres');
    if (cfg.mongodb?.install) active.push('mongodb');
    if (cfg.redis?.install) active.push('redis');
    if (cfg.sqlite?.install) active.push('sqlite');
    if (cfg.nginx?.install) active.push('nginx');
    if (cfg.chrome?.install) active.push('chrome');
    if (cfg.firefox?.install) active.push('firefox');
    if (cfg.slack?.install) active.push('slack');
    return active;
  };

  // Generate script in real-time when config or blocks order changes
  useEffect(() => {
    try {
      const generated = generateSetupScript(config, activeTools);
      setScript(generated);
    } catch (err) {
      console.error("Error generating script:", err);
    }
  }, [config, activeTools]);

  const updateSubConfig = <K extends keyof Omit<SetupConfig, 'os'>>(
    section: K,
    updates: Partial<SetupConfig[K]>
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      } as SetupConfig[K]
    }));
  };

  // HTML5 Drag and Drop events
  const handleDragStart = (e: React.DragEvent, data: any) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    try {
      const rawData = e.dataTransfer.getData("text/plain");
      if (!rawData) return;
      const data = JSON.parse(rawData);

      if (data.action === 'add') {
        const toolId = data.toolId;
        if (activeTools.includes(toolId)) return;

        // Insert new tool at drop point
        const newActive = [...activeTools];
        newActive.splice(targetIndex, 0, toolId);
        setActiveTools(newActive);

        // Turn on in config
        if (toolId === 'git') {
          updateSubConfig('git', { configure: true });
        } else {
          updateSubConfig(toolId as any, { install: true });
        }
        
        // Open the configuration modal for the newly added brick
        setActiveModalTool(toolId);

      } else if (data.action === 'reorder') {
        const sourceIndex = data.index;
        if (sourceIndex === targetIndex || sourceIndex === targetIndex - 1) return;

        const newActive = [...activeTools];
        const [removed] = newActive.splice(sourceIndex, 1);
        
        // Adjust targetIndex if it shifts after removal
        const adjustedTarget = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newActive.splice(adjustedTarget, 0, removed);
        
        setActiveTools(newActive);
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleAddToolDirectly = (toolId: string) => {
    if (activeTools.includes(toolId)) return;
    setActiveTools(prev => [...prev, toolId]);
    if (toolId === 'git') {
      updateSubConfig('git', { configure: true });
    } else {
      updateSubConfig(toolId as any, { install: true });
    }
    setActiveModalTool(toolId);
  };

  const handleAddMissingDependency = (depId: string) => {
    if (activeTools.includes(depId)) return;
    const newActive = [...activeTools, depId];
    const sorted = sortInstallationTools(newActive, config);
    setActiveTools(sorted);
    if (depId === 'git') {
      updateSubConfig('git', { configure: true });
    } else if (depId === 'system') {
      // system config object is already initialized in DEFAULT_CONFIG
    } else {
      updateSubConfig(depId as any, { install: true });
    }
  };

  const handleRemoveTool = (toolId: string) => {
    setActiveTools(prev => prev.filter(t => t !== toolId));
    if (toolId === 'git') {
      updateSubConfig('git', { configure: false });
    } else {
      updateSubConfig(toolId as any, { install: false });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy script:", err);
    }
  };

  const handleDownloadScript = () => {
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'setup.sh';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'setup-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          const merged = { ...DEFAULT_CONFIG, ...parsed } as SetupConfig;
          setConfig(merged);
          // Set activeTools in order defined by config presence
          const active = getActiveToolsFromConfig(merged);
          setActiveTools(active);
        }
      } catch (err) {
        alert("Erreur lors de la lecture du fichier : JSON invalide.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetConfig = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser la plaque de Lego ?")) {
      setConfig(DEFAULT_CONFIG);
      setActiveTools(['system', 'git', 'antigravity', 'agy', 'opencode']);
      setActiveModalTool(null);
    }
  };

  const toggleZshPlugin = (plugin: string) => {
    const current = config.zsh.plugins || [];
    const updated = current.includes(plugin)
      ? current.filter(p => p !== plugin)
      : [...current, plugin];
    updateSubConfig('zsh', { plugins: updated });
  };

  const handleGlobalPackagesChange = (val: string) => {
    const packages = val.split(',').map(p => p.trim()).filter(Boolean);
    updateSubConfig('node', { globalPackages: packages });
  };

  const handleExtensionsChange = (val: string) => {
    const extensions = val.split(',').map(e => e.trim()).filter(Boolean);
    updateSubConfig('vscode', { extensions });
  };

  // Filter tools based on search term
  const filteredTools = TOOLS_META.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selected tool meta for the active configuration modal
  const selectedToolMeta = TOOLS_META.find(t => t.id === activeModalTool);

  return (
    <div className="app-container lego-light-theme">
      {/* Left Sidebar: Lego Box (Palette of tools) */}
      <aside className="sidebar">
        <div className="logo-section">
          <img src="/logo.png" alt="LegoSetup" className="logo-icon" />
          <h2>LegoSetup</h2>
        </div>
        
        {/* Search bar inside the Lego palette box */}
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={15} />
            <input
              type="text"
              placeholder="Rechercher un outil..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="lego-search-input"
            />
          </div>
        </div>

        <div className="lego-box-container">
          <div className="lego-box-title">Boîte à Legos</div>
          <div className="lego-bricks-palette">
            {filteredTools.map(tool => {
              const Icon = tool.icon;
              const isActive = activeTools.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  draggable={!isActive}
                  onDragStart={(e) => handleDragStart(e, { action: 'add', toolId: tool.id })}
                  className={`lego-palette-brick ${tool.colorClass} ${isActive ? 'used' : ''}`}
                  title={isActive ? "Déjà sur la plaque de construction" : "Glisser sur la plaque"}
                >
                  <div className="brick-studs-indicator">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="brick-inner">
                    <Icon size={16} className="brick-icon" />
                    <div className="brick-info">
                      <div className="brick-name">{tool.name}</div>
                      <div className="brick-desc">{tool.desc}</div>
                    </div>
                    {!isActive && (
                      <button 
                        onClick={() => handleAddToolDirectly(tool.id)} 
                        className="btn-add-brick"
                        title="Ajouter à la fin"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredTools.length === 0 && (
              <div className="no-search-results">
                Aucun bloc ne correspond.
              </div>
            )}
          </div>
        </div>
        <div className="sidebar-footer">
          <p>© 2026 Alexis-mk</p>
        </div>
      </aside>

      {/* Main interactive grid area */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-title-section">
            <h1>Constructeur de Script</h1>
            <p>Assemblez votre script d'installation comme des briques de Lego, ajustez l'ordre et exportez.</p>
          </div>
          <div className="header-actions">
            <div className="os-toggle-container">
              <span>OS Cible:</span>
              <div className="os-pills">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, os: 'ubuntu' }))}
                  className={`os-pill ${config.os === 'ubuntu' ? 'active' : ''}`}
                >
                  Ubuntu
                </button>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, os: 'debian' }))}
                  className={`os-pill ${config.os === 'debian' ? 'active' : ''}`}
                >
                  Debian
                </button>
              </div>
            </div>
            
            <button onClick={handleExportJSON} className="btn-secondary" title="Exporter la configuration">
              <Download size={15} />
              <span>Exporter</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary" title="Importer une configuration">
              <Upload size={15} />
              <span>Importer</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button onClick={resetConfig} className="btn-danger" title="Vider la plaque">
              <RefreshCw size={15} />
              <span>Vider</span>
            </button>
          </div>
        </header>

        <div className="editor-grid">
          {/* Middle: Drag-and-drop lego baseplate workspace */}
          <section className="workspace-panel">
            {hasAnyIssues && (
              <div className="lego-alert-banner" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
                  <div className="lego-alert-content" style={{ width: '100%' }}>
                    <AlertTriangle className="lego-alert-icon" size={20} style={{ marginTop: '3px' }} />
                    <div className="lego-alert-details" style={{ width: '100%' }}>
                      <div className="lego-alert-title">
                        {hasOrderIssues ? "Ajustements requis : Ordre d'installation" : "Ajustements requis : Dépendance manquante"}
                      </div>
                      <div className="lego-alert-message" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px', width: '100%' }}>
                        {dependencyIssues.map((issue, idx) => {
                          const depMeta = TOOLS_META.find(t => t.id === issue.dependentOnId);
                          const depName = depMeta?.name || issue.dependentOnId;
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
                              <span>• {issue.message}</span>
                              {issue.type === 'missing' && issue.dependentOnId && (
                                <button
                                  onClick={() => handleAddMissingDependency(issue.dependentOnId)}
                                  className="btn-sort-auto"
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    backgroundColor: '#ea580c',
                                    border: '2px solid #9a3412',
                                    boxShadow: '1px 1px 0px rgba(154, 52, 18, 0.5)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    textTransform: 'none'
                                  }}
                                  title={`Activer et placer automatiquement ${depName} sur la plaque`}
                                >
                                  <Plus size={12} />
                                  <span>Activer {depName}</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {hasOrderIssues && (
                    <button
                      onClick={() => {
                        const sorted = sortInstallationTools(activeTools, config);
                        setActiveTools(sorted);
                      }}
                      className="btn-sort-auto"
                      style={{ flexShrink: 0 }}
                      title="Réorganiser automatiquement les briques"
                    >
                      <ArrowUpDown size={15} />
                      <span>Trier dans le bon ordre</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="baseplate-header">
              <div className="stud-pattern-bg"></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3>Plaque de Construction</h3>
                {!hasAnyIssues && activeTools.length > 0 && (
                  <span className="lego-badge-optimal" title="Toutes les briques respectent l'ordre de dépendances !">
                    <CheckCircle size={12} />
                    Ordre optimal
                  </span>
                )}
              </div>
              <span>Ordre d'exécution de haut en bas</span>
            </div>
            
            <div className="lego-baseplate">
              {/* Top drop zone */}
              <div
                onDragOver={(e) => handleDragOver(e, 0)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 0)}
                className={`lego-drop-zone ${dragOverIndex === 0 ? 'active' : ''}`}
              >
                <div className="drop-indicator"></div>
              </div>

              {activeTools.length === 0 ? (
                <div className="empty-baseplate-msg">
                  <div className="lego-placeholder-brick"></div>
                  <h4>La plaque est vide !</h4>
                  <p>Glissez-déposez des blocs depuis la Boîte à Legos de gauche pour commencer à assembler votre script.</p>
                </div>
              ) : (
                activeTools.map((toolId, index) => {
                  const toolMeta = TOOLS_META.find(t => t.id === toolId);
                  if (!toolMeta) return null;
                  const Icon = toolMeta.icon;

                  return (
                    <React.Fragment key={toolId}>
                      {/* Active lego block */}
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, { action: 'reorder', index })}
                        className={`lego-brick-active ${toolMeta.colorClass} collapsed`}
                      >
                        {/* Lego studs on top of the brick */}
                        <div className="brick-studs">
                          <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        </div>

                        <div className="brick-header">
                          <div className="brick-drag-handle" title="Glisser pour réordonner">
                            <span className="drag-dots">⋮⋮</span>
                          </div>
                          
                          <div className="brick-title-area" onClick={() => setActiveModalTool(toolId)} title="Cliquez pour configurer">
                            <Icon size={18} className="brick-icon" />
                            <h4>{toolMeta.name}</h4>
                            <span className="brick-order-badge">#{index + 1}</span>
                          </div>

                          <div className="brick-actions">
                            <button
                              onClick={() => setActiveModalTool(toolId)}
                              className="btn-brick-action"
                              title="Configurer"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoveTool(toolId)}
                              className="btn-brick-delete"
                              title="Retirer de la plaque"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Drop zone below current block */}
                      <div
                        onDragOver={(e) => handleDragOver(e, index + 1)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index + 1)}
                        className={`lego-drop-zone ${dragOverIndex === index + 1 ? 'active' : ''}`}
                      >
                        <div className="drop-indicator"></div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Drag guide */}
            <div className="baseplate-guide">
              <Info size={16} />
              <span>Cliquez sur un bloc pour modifier ses paramètres. Attrapez-le par la poignée de déplacement pour modifier l'ordre d'installation.</span>
            </div>
          </section>

          {/* Right: Live code preview panel */}
          <section className="preview-panel">
            <div className="preview-header">
              <div className="preview-title-container">
                <div className="indicator"></div>
                <h3>Script d'Installation</h3>
              </div>
              <div className="preview-actions">
                <button
                  onClick={handleCopy}
                  className={`btn-action ${copied ? 'success' : ''}`}
                  title="Copier le script"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  onClick={handleDownloadScript}
                  className="btn-action primary"
                  title="Télécharger setup.sh"
                >
                  <Download size={14} />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
            <div className="code-viewer-container">
              <textarea
                className="code-textarea"
                readOnly
                value={script}
                placeholder="# Assemblez des blocs Lego pour générer le script..."
              />
            </div>
          </section>
        </div>
      </main>

      {/* Modal Dialog for Configuration Details */}
      {activeModalTool && selectedToolMeta && (() => {
        const Icon = selectedToolMeta.icon;
        return (
          <div className="lego-modal-overlay animate-fade" onClick={() => setActiveModalTool(null)}>
            <div className={`lego-modal ${selectedToolMeta.colorClass}`} onClick={e => e.stopPropagation()}>
              <div className="lego-modal-header">
                <div className="lego-modal-title">
                  <Icon size={20} className="modal-header-icon" />
                  <h3>Configuration de {selectedToolMeta.name}</h3>
                </div>
                <button className="btn-close-modal" onClick={() => setActiveModalTool(null)}>×</button>
              </div>
              
              <div className="lego-modal-body">
                {activeModalTool === 'system' && (
                  <div className="lego-form-grid">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.system.updatePackages}
                        onChange={e => updateSubConfig('system', { updatePackages: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Mettre à jour apt (<code>apt-get update</code>)</span>
                    </label>
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.system.upgradePackages}
                        onChange={e => updateSubConfig('system', { upgradePackages: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Mettre à niveau les paquets installés (<code>apt-get upgrade</code>)</span>
                    </label>
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.system.installEssentials}
                        onChange={e => updateSubConfig('system', { installEssentials: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Installer dépendances essentielles (curl, git, build-essential)</span>
                    </label>
                  </div>
                )}

                {activeModalTool === 'git' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Nom d'utilisateur global (user.name)</label>
                      <input
                        type="text"
                        value={config.git.userName || ''}
                        onChange={e => updateSubConfig('git', { userName: e.target.value })}
                        placeholder="Alexis"
                      />
                    </div>
                    <div className="lego-field">
                      <label>Email global (user.email)</label>
                      <input
                        type="email"
                        value={config.git.userEmail || ''}
                        onChange={e => updateSubConfig('git', { userEmail: e.target.value })}
                        placeholder="alexis@example.com"
                      />
                    </div>
                    <div className="lego-field">
                      <label>Branche par défaut</label>
                      <input
                        type="text"
                        value={config.git.defaultBranch || 'main'}
                        onChange={e => updateSubConfig('git', { defaultBranch: e.target.value })}
                        placeholder="main"
                      />
                    </div>
                  </div>
                )}

                {activeModalTool === 'ghcli' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>GitHub CLI sera installé depuis les dépôts officiels de GitHub.</span>
                  </div>
                )}

                {activeModalTool === 'lazygit' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>LazyGit sera installé en téléchargeant le binaire stable officiel depuis GitHub.</span>
                  </div>
                )}

                {activeModalTool === 'zsh' && (
                  <div className="lego-form-fields">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.zsh.installOhMyZsh}
                        onChange={e => updateSubConfig('zsh', { installOhMyZsh: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Installer Oh My Zsh (non-interactif)</span>
                    </label>
                    
                    {config.zsh.installOhMyZsh && (
                      <>
                        <div className="lego-field">
                          <label>Thème Oh My Zsh</label>
                          <select
                            value={config.zsh.theme}
                            onChange={e => updateSubConfig('zsh', { theme: e.target.value as any })}
                          >
                            <option value="robbyrussell">robbyrussell (par défaut)</option>
                            <option value="agnoster">agnoster</option>
                            <option value="powerlevel10k">powerlevel10k</option>
                          </select>
                        </div>
                        <div className="lego-field">
                          <label>Plugins Oh My Zsh</label>
                          <div className="lego-checkbox-group">
                            <label className="lego-checkbox">
                              <input
                                type="checkbox"
                                checked={config.zsh.plugins.includes('git')}
                                onChange={() => toggleZshPlugin('git')}
                              />
                              <span className="checkmark"></span>
                              <span>git</span>
                            </label>
                            <label className="lego-checkbox">
                              <input
                                type="checkbox"
                                checked={config.zsh.plugins.includes('zsh-autosuggestions')}
                                onChange={() => toggleZshPlugin('zsh-autosuggestions')}
                              />
                              <span className="checkmark"></span>
                              <span>zsh-autosuggestions</span>
                            </label>
                            <label className="lego-checkbox">
                              <input
                                type="checkbox"
                                checked={config.zsh.plugins.includes('zsh-syntax-highlighting')}
                                onChange={() => toggleZshPlugin('zsh-syntax-highlighting')}
                              />
                              <span className="checkmark"></span>
                              <span>zsh-syntax-highlighting</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeModalTool === 'tmux' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Tmux sera installé via le gestionnaire de paquets apt.</span>
                  </div>
                )}

                {activeModalTool === 'checklist' && (
                  <div className="lego-form-fields">
                    <div className="brick-info-note">
                      <Info size={14} />
                      <span>Ces tâches s'afficheront à la fin de l'exécution du script d'installation sous forme de liste manuelle à cocher.</span>
                    </div>
                    
                    <label className="lego-field-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                      Étapes manuelles post-installation :
                    </label>
                    
                    <div className="todo-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {config.checklist.tasks.map((task, idx) => (
                        <div key={idx} className="todo-item-input-row" style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={task}
                            onChange={e => {
                              const updated = [...config.checklist.tasks];
                              updated[idx] = e.target.value;
                              updateSubConfig('checklist', { tasks: updated });
                            }}
                            placeholder="Ex: Tâche"
                            className="todo-input"
                            style={{ flexGrow: 1, padding: '8px', border: '2px solid var(--border-color)', borderRadius: '6px' }}
                          />
                          <button
                            onClick={() => {
                              const updated = config.checklist.tasks.filter((_, i) => i !== idx);
                              updateSubConfig('checklist', { tasks: updated });
                            }}
                            className="btn-todo-delete"
                            title="Supprimer la tâche"
                            style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: '#fee2e2', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => {
                        const updated = [...config.checklist.tasks, ''];
                        updateSubConfig('checklist', { tasks: updated });
                      }}
                      className="btn-add-todo-item"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '2px solid var(--border-color)', borderRadius: '6px', background: '#f0fdf4', color: '#16a34a', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      <Plus size={14} />
                      <span>Ajouter une étape</span>
                    </button>
                  </div>
                )}

                {activeModalTool === 'antigravity' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Méthode d'installation</label>
                      <select
                        value={config.antigravity.installMethod || 'curl'}
                        onChange={e => updateSubConfig('antigravity', { installMethod: e.target.value as any })}
                      >
                        <option value="curl">Script d'installation (curl)</option>
                        <option value="npm">Gestionnaire de paquets NPM (npm install -g)</option>
                      </select>
                    </div>
                    <div className="brick-info-note">
                      <Info size={14} />
                      <span>
                        {config.antigravity.installMethod === 'npm'
                          ? "Le framework Google Antigravity sera installé de manière globale via npm."
                          : "Le framework Google Antigravity sera installé via son script d'installation officiel curl."}
                      </span>
                    </div>
                    <div style={{ marginTop: '15px' }}>
                      <label className="lego-checkbox">
                        <input
                          type="checkbox"
                          checked={config.antigravity.installIDE || false}
                          onChange={e => updateSubConfig('antigravity', { installIDE: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        <span>Installer également l'IDE Antigravity (VS Code Fork)</span>
                      </label>
                    </div>
                  </div>
                )}

                {activeModalTool === 'agy' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Méthode d'installation</label>
                      <select
                        value={config.agy.installMethod || 'curl'}
                        onChange={e => updateSubConfig('agy', { installMethod: e.target.value as any })}
                      >
                        <option value="curl">Script d'installation (curl)</option>
                        <option value="npm">Gestionnaire de paquets NPM (npm install -g)</option>
                      </select>
                    </div>
                    <div className="brick-info-note">
                      <Info size={14} />
                      <span>
                        {config.agy.installMethod === 'npm'
                          ? "Le CLI agy sera installé de manière globale via npm."
                          : "Le CLI agy sera téléchargé et installé à partir du site officiel d'Antigravity via curl."}
                      </span>
                    </div>
                  </div>
                )}

                {activeModalTool === 'opencode' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Méthode d'installation</label>
                      <select
                        value={config.opencode.installMethod || 'curl'}
                        onChange={e => updateSubConfig('opencode', { installMethod: e.target.value as any })}
                      >
                        <option value="curl">Script d'installation (curl)</option>
                        <option value="npm">Gestionnaire de paquets NPM (npm install -g)</option>
                      </select>
                    </div>
                    <div className="brick-info-note">
                      <Info size={14} />
                      <span>
                        {config.opencode.installMethod === 'npm'
                          ? "L'assistant autonome OpenCode sera installé de manière globale via npm."
                          : "L'assistant autonome OpenCode sera installé depuis les dépôts officiels via curl."}
                      </span>
                    </div>
                  </div>
                )}

                {activeModalTool === 'docker' && (
                  <div className="lego-form-grid">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.docker.installCompose}
                        onChange={e => updateSubConfig('docker', { installCompose: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Installer Docker Compose</span>
                    </label>
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.docker.addToGroup}
                        onChange={e => updateSubConfig('docker', { addToGroup: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Ajouter l'utilisateur au groupe Docker (sans sudo)</span>
                    </label>
                  </div>
                )}

                {activeModalTool === 'node' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Gestionnaire de version</label>
                      <select
                        value={config.node.manager}
                        onChange={e => updateSubConfig('node', { manager: e.target.value as any })}
                      >
                        <option value="nvm">NVM (Node Version Manager)</option>
                        <option value="fnm">FNM (Fast Node Manager)</option>
                      </select>
                    </div>
                    <div className="lego-field">
                      <label>Version de Node.js</label>
                      <input
                        type="text"
                        value={config.node.version}
                        onChange={e => updateSubConfig('node', { version: e.target.value })}
                        placeholder="lts, latest, 20, 22"
                      />
                    </div>
                    <div className="lego-field">
                      <label>Modules globaux NPM (séparés par virgules)</label>
                      <input
                        type="text"
                        value={config.node.globalPackages.join(', ')}
                        onChange={e => handleGlobalPackagesChange(e.target.value)}
                        placeholder="yarn, pnpm, pm2"
                      />
                    </div>
                  </div>
                )}

                {activeModalTool === 'bun' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Bun sera installé via son installateur bash officiel (<code>bun.sh</code>).</span>
                  </div>
                )}

                {activeModalTool === 'deno' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Deno sera installé via son script d'installation officiel (<code>deno.land</code>).</span>
                  </div>
                )}

                {activeModalTool === 'python' && (
                  <div className="lego-form-fields">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.python.installPoetry}
                        onChange={e => updateSubConfig('python', { installPoetry: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Installer Poetry (Gestionnaire de dépendances)</span>
                    </label>
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.python.installPyenv}
                        onChange={e => updateSubConfig('python', { installPyenv: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Installer Pyenv (Gestion de versions de Python)</span>
                    </label>
                  </div>
                )}

                {activeModalTool === 'go' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Version de Go</label>
                      <input
                        type="text"
                        value={config.go.version}
                        onChange={e => updateSubConfig('go', { version: e.target.value })}
                        placeholder="1.22.0"
                      />
                    </div>
                  </div>
                )}

                {activeModalTool === 'rust' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Rust sera installé via l'installateur officiel <code>rustup</code>.</span>
                  </div>
                )}

                {activeModalTool === 'php' && (
                  <div className="lego-form-fields">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.php.installComposer}
                        onChange={e => updateSubConfig('php', { installComposer: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Installer le gestionnaire de paquets Composer</span>
                    </label>
                  </div>
                )}

                {activeModalTool === 'ruby' && (
                  <div className="lego-form-fields">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.ruby.installRbenv}
                        onChange={e => updateSubConfig('ruby', { installRbenv: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Installer et configurer <code>rbenv</code> + <code>ruby-build</code> (au lieu de ruby-full apt)</span>
                    </label>
                  </div>
                )}

                {activeModalTool === 'java' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Version OpenJDK à installer</label>
                      <select
                        value={config.java.version}
                        onChange={e => updateSubConfig('java', { version: e.target.value })}
                      >
                        <option value="8">Java 8</option>
                        <option value="11">Java 11</option>
                        <option value="17">Java 17 (Recommandé)</option>
                        <option value="21">Java 21 (LTS récent)</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeModalTool === 'vscode' && (
                  <div className="lego-form-fields">
                    <div className="lego-field">
                      <label>Extensions recommandées (ID séparés par virgules)</label>
                      <input
                        type="text"
                        value={config.vscode.extensions.join(', ')}
                        onChange={e => handleExtensionsChange(e.target.value)}
                        placeholder="dbaeumer.vscode-eslint, esbenp.prettier-vscode"
                      />
                    </div>
                  </div>
                )}

                {activeModalTool === 'neovim' && (
                  <div className="lego-form-fields">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.neovim.installKickstart}
                        onChange={e => updateSubConfig('neovim', { installKickstart: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Cloner la configuration Kickstart.nvim</span>
                    </label>
                  </div>
                )}

                {activeModalTool === 'kubectl' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Kubectl sera installé en téléchargeant le binaire stable officiel de Kubernetes.</span>
                  </div>
                )}

                {activeModalTool === 'terraform' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Terraform sera installé à partir du dépôt de packages HashiCorp.</span>
                  </div>
                )}

                {activeModalTool === 'helm' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Helm sera installé à partir des dépôts de packages APT officiels.</span>
                  </div>
                )}

                {activeModalTool === 'minikube' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Minikube sera installé à partir du binaire stable officiel.</span>
                  </div>
                )}

                {activeModalTool === 'awscli' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>AWS CLI sera téléchargé et installé sous forme de binaire zip autonome officiel.</span>
                  </div>
                )}

                {activeModalTool === 'gcloud' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Google Cloud SDK (gcloud CLI) sera installé via le dépôt APT officiel.</span>
                  </div>
                )}

                {activeModalTool === 'ansible' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Ansible sera installé via son dépôt PPA officiel.</span>
                  </div>
                )}

                {activeModalTool === 'postgres' && (
                  <div className="lego-form-fields">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.postgres.createUserAndDb}
                        onChange={e => updateSubConfig('postgres', { createUserAndDb: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Créer un utilisateur et sa base de données associés</span>
                    </label>
                    {config.postgres.createUserAndDb && (
                      <>
                        <div className="lego-field">
                          <label>Nom d'utilisateur Postgres</label>
                          <input
                            type="text"
                            value={config.postgres.dbUser || ''}
                            onChange={e => updateSubConfig('postgres', { dbUser: e.target.value })}
                            placeholder="mon_utilisateur"
                          />
                        </div>
                        <div className="lego-field">
                          <label>Nom de la base de données</label>
                          <input
                            type="text"
                            value={config.postgres.dbName || ''}
                            onChange={e => updateSubConfig('postgres', { dbName: e.target.value })}
                            placeholder="ma_base"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeModalTool === 'mongodb' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>MongoDB Community Server sera installé à partir des dépôts officiels de MongoDB.</span>
                  </div>
                )}

                {activeModalTool === 'redis' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Redis Server sera installé via apt et configuré pour se lancer au démarrage.</span>
                  </div>
                )}

                {activeModalTool === 'sqlite' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>SQLite3 sera installé via le paquet standard apt.</span>
                  </div>
                )}

                {activeModalTool === 'nginx' && (
                  <div className="lego-form-fields">
                    <label className="lego-checkbox">
                      <input
                        type="checkbox"
                        checked={config.nginx.configurePort}
                        onChange={e => updateSubConfig('nginx', { configurePort: e.target.checked })}
                      />
                      <span className="checkmark"></span>
                      <span>Changer le port par défaut (actuellement 80)</span>
                    </label>
                    {config.nginx.configurePort && (
                      <div className="lego-field">
                        <label>Port d'écoute Nginx</label>
                        <input
                          type="number"
                          value={config.nginx.port || 80}
                          onChange={e => updateSubConfig('nginx', { port: parseInt(e.target.value) || 80 })}
                          placeholder="8080"
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeModalTool === 'chrome' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Google Chrome sera installé via le paquet officiel .deb téléchargé depuis les serveurs de Google.</span>
                  </div>
                )}

                {activeModalTool === 'firefox' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Firefox sera installé via le gestionnaire de paquets standard apt.</span>
                  </div>
                )}

                {activeModalTool === 'slack' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Slack sera installé via snap (si disponible) ou via le paquet officiel .deb.</span>
                  </div>
                )}
              </div>
              
              <div className="lego-modal-footer">
                <button className="btn-save-modal" onClick={() => setActiveModalTool(null)}>
                  Enregistrer et Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default App;
