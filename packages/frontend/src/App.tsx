import { useState, useEffect, useRef } from 'react';
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
  Settings,
  Flame
} from 'lucide-react';

function App() {
  const [config, setConfig] = useState<SetupConfig>(DEFAULT_CONFIG);
  const [script, setScript] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('system');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate script whenever config changes
  useEffect(() => {
    try {
      const generated = generateSetupScript(config);
      setScript(generated);
    } catch (err) {
      console.error("Error generating script:", err);
    }
  }, [config]);

  const updateConfig = <K extends keyof SetupConfig>(key: K, value: SetupConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
        }
      } catch (err) {
        alert("Erreur lors de la lecture du fichier de configuration : JSON invalide.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetConfig = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser la configuration ?")) {
      setConfig(DEFAULT_CONFIG);
    }
  };

  const toggleZshPlugin = (plugin: string) => {
    const current = config.zsh.plugins || [];
    const updated = current.includes(plugin)
      ? current.filter(p => p !== plugin)
      : [...current, plugin];
    updateSubConfig('zsh', { plugins: updated });
  };

  const handleGlobalPackagesChange = (value: string) => {
    const pkgs = value.split(',').map(p => p.trim()).filter(Boolean);
    updateSubConfig('node', { globalPackages: pkgs });
  };

  const handleExtensionsChange = (value: string) => {
    const exts = value.split(',').map(e => e.trim()).filter(Boolean);
    updateSubConfig('vscode', { extensions: exts });
  };

  const sections = [
    { id: 'system', name: 'Système', icon: Terminal },
    { id: 'git', name: 'Git', icon: GitBranch },
    { id: 'zsh', name: 'Zsh & Oh My Zsh', icon: Cpu },
    { id: 'docker', name: 'Docker', icon: Container },
    { id: 'node', name: 'Node.js', icon: Code },
    { id: 'python', name: 'Python', icon: Binary },
    { id: 'go', name: 'Go', icon: FileCode },
    { id: 'rust', name: 'Rust', icon: Package },
    { id: 'vscode', name: 'VS Code', icon: Layers },
    { id: 'neovim', name: 'Neovim', icon: Edit3 },
  ];

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <Flame className="logo-icon" />
          <h2>SetupGen</h2>
        </div>
        <nav className="nav-menu">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`nav-item ${activeSection === s.id ? 'active' : ''}`}
              >
                <Icon className="nav-icon" size={18} />
                <span>{s.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <p>© 2026 Alexis-mk</p>
        </div>
      </aside>

      {/* Main editor split area */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-title-section">
            <h1>Configurateur d'Environnement</h1>
            <p>Personnalisez vos outils et générez votre script d'installation Bash en un clic.</p>
          </div>
          <div className="header-actions">
            <button onClick={handleExportJSON} className="btn-secondary" title="Exporter en JSON">
              <Download size={16} />
              <span>Exporter JSON</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary" title="Importer un JSON">
              <Upload size={16} />
              <span>Importer JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button onClick={resetConfig} className="btn-danger" title="Réinitialiser">
              <RefreshCw size={16} />
              <span>Réinitialiser</span>
            </button>
          </div>
        </header>

        <div className="editor-grid">
          {/* Left panel: Config form */}
          <section className="form-panel">
            {/* Target OS Selector */}
            <div className="form-card os-card">
              <div className="card-header">
                <Settings size={20} className="card-icon" />
                <h3>Distribution Target</h3>
              </div>
              <div className="os-selector-group">
                <button
                  type="button"
                  className={`os-btn ${config.os === 'ubuntu' ? 'active' : ''}`}
                  onClick={() => updateConfig('os', 'ubuntu')}
                >
                  Ubuntu
                </button>
                <button
                  type="button"
                  className={`os-btn ${config.os === 'debian' ? 'active' : ''}`}
                  onClick={() => updateConfig('os', 'debian')}
                >
                  Debian
                </button>
              </div>
            </div>

            {/* Dynamic Card rendering based on active sidebar tab */}
            <div className="form-card">
              {activeSection === 'system' && (
                <div className="section-form">
                  <div className="card-header">
                    <Terminal size={20} className="card-icon" />
                    <h3>Options Système de Base</h3>
                  </div>
                  <p className="card-desc">Gérez les mises à jour logicielles de base et les paquets essentiels.</p>
                  
                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Mise à jour des listes de paquets</label>
                      <span>Exécute <code>apt-get update</code> pour synchroniser les dépôts.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.system.updatePackages}
                        onChange={e => updateSubConfig('system', { updatePackages: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Mise à niveau des paquets existants</label>
                      <span>Exécute <code>apt-get upgrade -y</code> (peut prendre plus de temps).</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.system.upgradePackages}
                        onChange={e => updateSubConfig('system', { upgradePackages: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer les essentiels de compilation</label>
                      <span>Installe <code>build-essential, curl, wget, git, unzip, ca-certificates</code>.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.system.installEssentials}
                        onChange={e => updateSubConfig('system', { installEssentials: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}

              {activeSection === 'git' && (
                <div className="section-form">
                  <div className="card-header">
                    <GitBranch size={20} className="card-icon" />
                    <h3>Configuration de Git</h3>
                  </div>
                  <p className="card-desc">Configurez votre identité Git globale.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Configurer Git globalement</label>
                      <span>Active l'écriture des options Git ci-dessous.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.git.configure}
                        onChange={e => updateSubConfig('git', { configure: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.git.configure && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-field">
                        <label>Nom d'utilisateur global (user.name)</label>
                        <input
                          type="text"
                          value={config.git.userName || ''}
                          onChange={e => updateSubConfig('git', { userName: e.target.value })}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div className="form-field">
                        <label>Email global (user.email)</label>
                        <input
                          type="email"
                          value={config.git.userEmail || ''}
                          onChange={e => updateSubConfig('git', { userEmail: e.target.value })}
                          placeholder="jean.dupont@example.com"
                        />
                      </div>
                      <div className="form-field">
                        <label>Branche par défaut à l'initialisation</label>
                        <input
                          type="text"
                          value={config.git.defaultBranch || 'main'}
                          onChange={e => updateSubConfig('git', { defaultBranch: e.target.value })}
                          placeholder="main"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'zsh' && (
                <div className="section-form">
                  <div className="card-header">
                    <Cpu size={20} className="card-icon" />
                    <h3>Zsh & Oh My Zsh</h3>
                  </div>
                  <p className="card-desc">Configurez un terminal moderne avec Zsh, Oh My Zsh et ses thèmes.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer Zsh</label>
                      <span>Installe le shell et le définit comme shell par défaut.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.zsh.install}
                        onChange={e => updateSubConfig('zsh', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.zsh.install && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-group-switch">
                        <div className="switch-info">
                          <label>Installer Oh My Zsh</label>
                          <span>Installe Oh My Zsh de manière non interactive.</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={config.zsh.installOhMyZsh}
                            onChange={e => updateSubConfig('zsh', { installOhMyZsh: e.target.checked })}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      {config.zsh.installOhMyZsh && (
                        <>
                          <div className="form-field">
                            <label>Thème Oh My Zsh</label>
                            <select
                              value={config.zsh.theme}
                              onChange={e => updateSubConfig('zsh', { theme: e.target.value as any })}
                            >
                              <option value="robbyrussell">robbyrussell (défaut)</option>
                              <option value="agnoster">agnoster</option>
                              <option value="powerlevel10k">powerlevel10k</option>
                            </select>
                          </div>

                          <div className="form-field">
                            <label>Plugins Oh My Zsh</label>
                            <div className="checkbox-list">
                              <label className="checkbox-item">
                                <input
                                  type="checkbox"
                                  checked={config.zsh.plugins.includes('git')}
                                  onChange={() => toggleZshPlugin('git')}
                                />
                                <span>git</span>
                              </label>
                              <label className="checkbox-item">
                                <input
                                  type="checkbox"
                                  checked={config.zsh.plugins.includes('zsh-autosuggestions')}
                                  onChange={() => toggleZshPlugin('zsh-autosuggestions')}
                                />
                                <span>zsh-autosuggestions (Autocomplétion)</span>
                              </label>
                              <label className="checkbox-item">
                                <input
                                  type="checkbox"
                                  checked={config.zsh.plugins.includes('zsh-syntax-highlighting')}
                                  onChange={() => toggleZshPlugin('zsh-syntax-highlighting')}
                                />
                                <span>zsh-syntax-highlighting (Coloration syntaxique)</span>
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'docker' && (
                <div className="section-form">
                  <div className="card-header">
                    <Container size={20} className="card-icon" />
                    <h3>Docker & Compose</h3>
                  </div>
                  <p className="card-desc">Conteneurisez vos applications avec le moteur Docker officiel.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer Docker</label>
                      <span>Télécharge et configure Docker Engine depuis les dépôts officiels.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.docker.install}
                        onChange={e => updateSubConfig('docker', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.docker.install && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-group-switch">
                        <div className="switch-info">
                          <label>Installer Docker Compose</label>
                          <span>Installe l'extension de composition de conteneurs.</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={config.docker.installCompose}
                            onChange={e => updateSubConfig('docker', { installCompose: e.target.checked })}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="form-group-switch">
                        <div className="switch-info">
                          <label>Ajouter l'utilisateur au groupe docker</label>
                          <span>Permet de lancer les commandes Docker sans utiliser <code>sudo</code>.</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={config.docker.addToGroup}
                            onChange={e => updateSubConfig('docker', { addToGroup: e.target.checked })}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'node' && (
                <div className="section-form">
                  <div className="card-header">
                    <Code size={20} className="card-icon" />
                    <h3>Node.js & JS Tooling</h3>
                  </div>
                  <p className="card-desc">Installez Node.js de manière isolée et sécurisée.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer Node.js</label>
                      <span>Active l'installation d'un gestionnaire de version Node.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.node.install}
                        onChange={e => updateSubConfig('node', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.node.install && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-field">
                        <label>Gestionnaire de version</label>
                        <select
                          value={config.node.manager}
                          onChange={e => updateSubConfig('node', { manager: e.target.value as any })}
                        >
                          <option value="nvm">NVM (Node Version Manager - Classique)</option>
                          <option value="fnm">FNM (Fast Node Manager - Écrit en Rust, rapide)</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Version de Node.js</label>
                        <input
                          type="text"
                          value={config.node.version}
                          onChange={e => updateSubConfig('node', { version: e.target.value })}
                          placeholder="lts, latest, 20, 22..."
                        />
                        <span className="field-tip">Utilisez <code>lts</code> ou <code>latest</code>, ou un numéro majeur comme <code>20</code>.</span>
                      </div>

                      <div className="form-field">
                        <label>Dépendances globales NPM (séparées par une virgule)</label>
                        <input
                          type="text"
                          value={config.node.globalPackages.join(', ')}
                          onChange={e => handleGlobalPackagesChange(e.target.value)}
                          placeholder="yarn, pnpm, pm2..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'python' && (
                <div className="section-form">
                  <div className="card-header">
                    <Binary size={20} className="card-icon" />
                    <h3>Python & Packaging</h3>
                  </div>
                  <p className="card-desc">Installez Python 3 et configurez les outils modernes pour vos projets.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer Python 3</label>
                      <span>Installe Python 3, Pip et l'utilitaire d'environnements virtuels.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.python.install}
                        onChange={e => updateSubConfig('python', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.python.install && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-group-switch">
                        <div className="switch-info">
                          <label>Installer Poetry</label>
                          <span>Installe le gestionnaire de dépendances et d'empaquetage de référence.</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={config.python.installPoetry}
                            onChange={e => updateSubConfig('python', { installPoetry: e.target.checked })}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="form-group-switch">
                        <div className="switch-info">
                          <label>Installer Pyenv</label>
                          <span>Outil de gestion de versions Python multiples.</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={config.python.installPyenv}
                            onChange={e => updateSubConfig('python', { installPyenv: e.target.checked })}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'go' && (
                <div className="section-form">
                  <div className="card-header">
                    <FileCode size={20} className="card-icon" />
                    <h3>Langage Go (Golang)</h3>
                  </div>
                  <p className="card-desc">Installez le compilateur Go officiel et configurez votre GOPATH.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer Go</label>
                      <span>Télécharge et installe Go en configurant les variables d'environnement dans <code>~/.bashrc</code>.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.go.install}
                        onChange={e => updateSubConfig('go', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.go.install && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-field">
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
                </div>
              )}

              {activeSection === 'rust' && (
                <div className="section-form">
                  <div className="card-header">
                    <Package size={20} className="card-icon" />
                    <h3>Langage Rust</h3>
                  </div>
                  <p className="card-desc">Installez le compilateur Rust et le gestionnaire de paquets Cargo.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer Rust via rustup</label>
                      <span>Installe <code>rustup</code>, configurant <code>rustc</code>, <code>cargo</code> et les outils standards.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.rust.install}
                        onChange={e => updateSubConfig('rust', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}

              {activeSection === 'vscode' && (
                <div className="section-form">
                  <div className="card-header">
                    <Layers size={20} className="card-icon" />
                    <h3>Visual Studio Code</h3>
                  </div>
                  <p className="card-desc">Installez VS Code stable avec vos extensions préférées.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer VS Code</label>
                      <span>Installe le package Debian officiel.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.vscode.install}
                        onChange={e => updateSubConfig('vscode', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.vscode.install && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-field">
                        <label>Extensions VS Code (ID séparés par une virgule)</label>
                        <input
                          type="text"
                          value={config.vscode.extensions.join(', ')}
                          onChange={e => handleExtensionsChange(e.target.value)}
                          placeholder="dbaeumer.vscode-eslint, esbenp.prettier-vscode..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'neovim' && (
                <div className="section-form">
                  <div className="card-header">
                    <Edit3 size={20} className="card-icon" />
                    <h3>Neovim</h3>
                  </div>
                  <p className="card-desc">Installez Neovim depuis le PPA unstable et chargez une configuration propre.</p>

                  <div className="form-group-switch">
                    <div className="switch-info">
                      <label>Installer Neovim</label>
                      <span>Installe la version unstable la plus récente de Neovim via PPA.</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={config.neovim.install}
                        onChange={e => updateSubConfig('neovim', { install: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {config.neovim.install && (
                    <div className="sub-fields-container animate-fade">
                      <div className="form-group-switch">
                        <div className="switch-info">
                          <label>Installer Kickstart.nvim</label>
                          <span>Clone la configuration populaire Kickstart pour débuter facilement.</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={config.neovim.installKickstart}
                            onChange={e => updateSubConfig('neovim', { installKickstart: e.target.checked })}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick manual script execution card */}
            <div className="form-card info-card">
              <div className="card-header">
                <Info size={18} className="card-icon" />
                <h3>Comment exécuter le script ?</h3>
              </div>
              <ol className="execution-steps">
                <li>Téléchargez le script en cliquant sur <strong>Télécharger</strong>.</li>
                <li>Ouvrez votre terminal et naviguez vers le dossier de téléchargement.</li>
                <li>Rendez le script exécutable : <br /><code>chmod +x setup.sh</code></li>
                <li>Lancez l'installation : <br /><code>./setup.sh</code></li>
              </ol>
            </div>
          </section>

          {/* Right panel: Realtime script preview */}
          <section className="preview-panel">
            <div className="preview-header">
              <div className="preview-title-container">
                <div className="indicator"></div>
                <h3>Script Généré Live</h3>
              </div>
              <div className="preview-actions">
                <button
                  onClick={handleCopy}
                  className={`btn-action ${copied ? 'success' : ''}`}
                  title="Copier le script"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  onClick={handleDownloadScript}
                  className="btn-action primary"
                  title="Télécharger setup.sh"
                >
                  <Download size={16} />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
            <div className="code-viewer-container">
              <textarea
                className="code-textarea"
                readOnly
                value={script}
                placeholder="# Le script d'installation généré apparaîtra ici..."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
