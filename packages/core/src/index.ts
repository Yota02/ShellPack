import { SetupConfig } from './types.js';
import { bashHeader, bashFooter } from './templates/common.js';
import {
  systemTemplate,
  gitTemplate,
  zshTemplate,
  dockerTemplate,
  nodeTemplate,
  pythonTemplate,
  goTemplate,
  rustTemplate,
  vscodeTemplate,
  neovimTemplate,
  ghcliTemplate,
  kubectlTemplate,
  terraformTemplate,
  postgresTemplate,
  mongodbTemplate,
  nginxTemplate
} from './templates/tools.js';

export * from './types.js';

export function generateSetupScript(config: SetupConfig, order?: string[]): string {
  let script = '';

  // 1. Script Header & Loggers
  script += bashHeader;

  // 2. Templates Mapping
  const templates: Record<string, () => string> = {
    system: () => config.system ? systemTemplate(config.system) : '',
    git: () => config.git ? gitTemplate(config.git) : '',
    zsh: () => config.zsh ? zshTemplate(config.zsh) : '',
    docker: () => config.docker ? dockerTemplate(config.docker) : '',
    node: () => config.node ? nodeTemplate(config.node) : '',
    python: () => config.python ? pythonTemplate(config.python) : '',
    go: () => config.go ? goTemplate(config.go) : '',
    rust: () => config.rust ? rustTemplate(config.rust) : '',
    vscode: () => config.vscode ? vscodeTemplate(config.vscode) : '',
    neovim: () => config.neovim ? neovimTemplate(config.neovim) : '',
    ghcli: () => config.ghcli ? ghcliTemplate(config.ghcli) : '',
    kubectl: () => config.kubectl ? kubectlTemplate(config.kubectl) : '',
    terraform: () => config.terraform ? terraformTemplate(config.terraform) : '',
    postgres: () => config.postgres ? postgresTemplate(config.postgres) : '',
    mongodb: () => config.mongodb ? mongodbTemplate(config.mongodb) : '',
    nginx: () => config.nginx ? nginxTemplate(config.nginx) : ''
  };

  // Execution order: custom or default
  const executionOrder = order || [
    'system',
    'git',
    'ghcli',
    'zsh',
    'docker',
    'node',
    'python',
    'go',
    'rust',
    'vscode',
    'neovim',
    'kubectl',
    'terraform',
    'postgres',
    'mongodb',
    'nginx'
  ];

  for (const key of executionOrder) {
    if (templates[key]) {
      script += templates[key]();
    }
  }

  // 3. Script Footer
  script += bashFooter;

  return script;
}
