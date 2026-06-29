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
  neovimTemplate
} from './templates/tools.js';

export * from './types.js';

export function generateSetupScript(config: SetupConfig): string {
  let script = '';

  // 1. Script Header & Loggers
  script += bashHeader;

  // 2. Base System Updates
  if (config.system) {
    script += systemTemplate(config.system);
  }

  // 3. Git configuration
  if (config.git) {
    script += gitTemplate(config.git);
  }

  // 4. Zsh & Oh My Zsh
  if (config.zsh) {
    script += zshTemplate(config.zsh);
  }

  // 5. Docker
  if (config.docker) {
    script += dockerTemplate(config.docker);
  }

  // 6. Node.js
  if (config.node) {
    script += nodeTemplate(config.node);
  }

  // 7. Python
  if (config.python) {
    script += pythonTemplate(config.python);
  }

  // 8. Go
  if (config.go) {
    script += goTemplate(config.go);
  }

  // 9. Rust
  if (config.rust) {
    script += rustTemplate(config.rust);
  }

  // 10. VS Code
  if (config.vscode) {
    script += vscodeTemplate(config.vscode);
  }

  // 11. Neovim
  if (config.neovim) {
    script += neovimTemplate(config.neovim);
  }

  // 12. Script Footer
  script += bashFooter;

  return script;
}
