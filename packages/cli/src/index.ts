#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { generateSetupScript, SetupConfig, DEFAULT_CONFIG } from '@setup-generator/core';

const program = new Command();

program
  .name('setup-generator-cli')
  .description('Générateur CLI de scripts d\'installation automatique pour ordinateurs')
  .version('1.0.0')
  .option('-c, --config <path>', 'Chemin vers le fichier de configuration JSON')
  .option('-o, --output <path>', 'Chemin du fichier de sortie généré', './setup.sh')
  .option('-d, --default', 'Générer un fichier de configuration JSON par défaut pour modification')
  .action((options) => {
    // Mode génération de configuration par défaut
    if (options.default) {
      const configPath = options.config || './config.json';
      try {
        fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
        console.log(`\x1b[32m[SUCCÈS]\x1b[0m Fichier de configuration par défaut écrit dans : ${configPath}`);
        console.log('Vous pouvez le modifier puis l\'exécuter avec : setup-generator-cli -c ' + configPath);
      } catch (error: any) {
        console.error(`\x1b[31m[ERREUR]\x1b[0m Impossible d'écrire le fichier par défaut : ${error.message}`);
      }
      return;
    }

    // Vérifier si la config est fournie
    if (!options.config) {
      console.error('\x1b[31m[ERREUR]\x1b[0m Vous devez spécifier un fichier de configuration avec -c ou --config.');
      console.log('Utilisez -d ou --default pour générer un fichier de configuration type.');
      program.help();
      return;
    }

    const resolvedConfigPath = path.resolve(options.config);
    if (!fs.existsSync(resolvedConfigPath)) {
      console.error(`\x1b[31m[ERREUR]\x1b[0m Le fichier de configuration n'existe pas : ${resolvedConfigPath}`);
      return;
    }

    let config: SetupConfig;
    try {
      const content = fs.readFileSync(resolvedConfigPath, 'utf-8');
      config = JSON.parse(content) as SetupConfig;
    } catch (error: any) {
      console.error(`\x1b[31m[ERREUR]\x1b[0m Erreur lors de la lecture ou de l'analyse du JSON : ${error.message}`);
      return;
    }

    console.log(`\x1b[34m[INFO]\x1b[0m Génération du script d'installation pour OS: ${config.os || 'ubuntu'}...`);
    
    try {
      const scriptContent = generateSetupScript(config);
      const resolvedOutputPath = path.resolve(options.output);
      
      fs.writeFileSync(resolvedOutputPath, scriptContent, 'utf-8');
      
      // Rendre le fichier exécutable (chmod +x / 755)
      fs.chmodSync(resolvedOutputPath, 0o755);
      
      console.log(`\x1b[32m[SUCCÈS]\x1b[0m Script d'installation généré avec succès dans : ${resolvedOutputPath}`);
      console.log(`Vous pouvez maintenant le lancer via : ${resolvedOutputPath}`);
    } catch (error: any) {
      console.error(`\x1b[31m[ERREUR]\x1b[0m Erreur lors de la génération du script : ${error.message}`);
    }
  });

program.parse(process.argv);
