import express from 'express';
import cors from 'cors';
import { generateSetupScript, TOOLS_METADATA, DEFAULT_CONFIG, SetupConfig } from '@setup-generator/core';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// GET /api/tools - Liste des outils configurables et configuration par défaut
app.get('/api/tools', (req, res) => {
  res.json({
    success: true,
    tools: TOOLS_METADATA,
    defaultConfig: DEFAULT_CONFIG
  });
});

// POST /api/generate - Générer le script d'installation Bash à partir du JSON
app.post('/api/generate', (req, res) => {
  try {
    const config = req.body as SetupConfig;
    
    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'Le corps de la requête doit être un objet JSON valide contenant la configuration.'
      });
    }

    // Générer le script bash
    const script = generateSetupScript(config);

    // Si le client demande du texte brut
    if (req.query.format === 'raw' || req.headers['accept'] === 'text/plain') {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="setup.sh"');
      return res.send(script);
    }

    // Sinon renvoyer un objet JSON
    return res.json({
      success: true,
      script: script,
      filename: 'setup.sh'
    });
  } catch (error: any) {
    console.error('Erreur de génération :', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Une erreur interne est survenue lors de la génération.'
    });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`==================================================`);
  console.log(`  Setup Generator API démarrée sur le port ${port}`);
  console.log(`  - GET  http://localhost:${port}/api/tools`);
  console.log(`  - POST http://localhost:${port}/api/generate`);
  console.log(`==================================================`);
});
