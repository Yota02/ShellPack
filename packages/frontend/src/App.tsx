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
  Anchor,
  Grid,
  ListTodo
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
  { id: 'zsh', name: 'Zsh & Shell', desc: 'Installe Zsh, Oh My Zsh et thèmes', icon: Cpu, colorClass: 'lego-yellow' },
  { id: 'checklist', name: 'Liste de tâches', desc: 'Rappels post-install', icon: ListTodo, colorClass: 'lego-yellow' },
  { id: 'antigravity', name: 'Antigravity', desc: 'Framework d\'agents IA Google Antigravity', icon: Flame, colorClass: 'lego-red' },
  { id: 'agy', name: 'agy CLI', desc: 'Interface CLI pour piloter Antigravity', icon: Terminal, colorClass: 'lego-orange' },
  { id: 'opencode', name: 'OpenCode', desc: 'Assistant autonome de dev OpenCode', icon: Code, colorClass: 'lego-green' },
  { id: 'docker', name: 'Docker', desc: 'Moteur Docker et Docker Compose', icon: Container, colorClass: 'lego-blue' },
  { id: 'node', name: 'Node.js', desc: 'Versions Node via NVM/FNM et pkgs', icon: Code, colorClass: 'lego-green' },
  { id: 'python', name: 'Python', desc: 'Python 3, Poetry et gestionnaire Pyenv', icon: Binary, colorClass: 'lego-indigo' },
  { id: 'go', name: 'Go', desc: 'Langage Go et configuration de GOPATH', icon: FileCode, colorClass: 'lego-teal' },
  { id: 'rust', name: 'Rust', desc: 'Chaîne d\'outils Rust via rustup', icon: Package, colorClass: 'lego-rust' },
  { id: 'vscode', name: 'VS Code', desc: 'Éditeur VS Code et extensions', icon: Layers, colorClass: 'lego-vscode' },
  { id: 'neovim', name: 'Neovim', desc: 'Installe Neovim et kickstart.nvim', icon: Edit3, colorClass: 'lego-emerald' },
  { id: 'kubectl', name: 'Kubectl', desc: 'Gestion de clusters Kubernetes', icon: Anchor, colorClass: 'lego-blue' },
  { id: 'terraform', name: 'Terraform', desc: 'Infrastructure as Code par HashiCorp', icon: Grid, colorClass: 'lego-rust' },
  { id: 'postgres', name: 'PostgreSQL', desc: 'Serveur de base relationnelle SQL', icon: Database, colorClass: 'lego-indigo' },
  { id: 'mongodb', name: 'MongoDB', desc: 'Base de données NoSQL orientée doc', icon: Database, colorClass: 'lego-green' },
  { id: 'nginx', name: 'Nginx', desc: 'Serveur HTTP et reverse proxy', icon: Globe, colorClass: 'lego-emerald' }
];

function App() {
  // Pre-load active blocks for system, git, antigravity, agy, opencode to match user's default request
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

  // Helper to extract active tools list based on config values (useful when importing JSON)
  const getActiveToolsFromConfig = (cfg: SetupConfig): string[] => {
    const active: string[] = [];
    if (cfg.system) active.push('system');
    if (cfg.git?.configure) active.push('git');
    if (cfg.ghcli?.install) active.push('ghcli');
    if (cfg.zsh?.install) active.push('zsh');
    if (cfg.checklist?.install) active.push('checklist');
    if (cfg.agy?.install) active.push('agy');
    if (cfg.antigravity?.install) active.push('antigravity');
    if (cfg.opencode?.install) active.push('opencode');
    if (cfg.docker?.install) active.push('docker');
    if (cfg.node?.install) active.push('node');
    if (cfg.python?.install) active.push('python');
    if (cfg.go?.install) active.push('go');
    if (cfg.rust?.install) active.push('rust');
    if (cfg.vscode?.install) active.push('vscode');
    if (cfg.neovim?.install) active.push('neovim');
    if (cfg.kubectl?.install) active.push('kubectl');
    if (cfg.terraform?.install) active.push('terraform');
    if (cfg.postgres?.install) active.push('postgres');
    if (cfg.mongodb?.install) active.push('mongodb');
    if (cfg.nginx?.install) active.push('nginx');
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
          <Flame className="logo-icon" />
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
            <div className="baseplate-header">
              <div className="stud-pattern-bg"></div>
              <h3>Plaque de Construction</h3>
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
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Le framework Google Antigravity sera installé via son script d'installation officiel.</span>
                  </div>
                )}

                {activeModalTool === 'agy' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>Le CLI <code>agy</code> sera téléchargé et installé à partir du site officiel d'Antigravity.</span>
                  </div>
                )}

                {activeModalTool === 'opencode' && (
                  <div className="brick-info-note">
                    <Info size={14} />
                    <span>L'assistant autonome OpenCode sera installé depuis les dépôts officiels.</span>
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
