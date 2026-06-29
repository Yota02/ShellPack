# Setup Generator Monorepo

Un outil moderne et multi-plateforme d'automatisation de configuration et de configuration d'environnement de développement pour Linux (Ubuntu et Debian). 

Ce projet utilise une architecture **monorepo** avec des workspaces npm, permettant de partager un moteur de génération commun entre une API, un outil en ligne de commande (CLI), et une interface graphique interactive packagée pour le Web, le Bureau (Tauri) et le Mobile (Capacitor).

---

## 📁 Structure du Projet

Le projet est divisé en plusieurs packages autonomes situés dans `/packages` :

*   **`packages/core`** : Le moteur de génération de scripts Bash. C'est une bibliothèque purement TypeScript sans dépendances d'interface graphique, capable de tourner sous Node.js (CLI, API) ou dans un navigateur web (mode hors-ligne).
*   **`packages/cli`** : Utilitaire en ligne de commande pour générer des scripts `setup.sh` à partir d'un fichier de configuration JSON local.
*   **`packages/api`** : Serveur HTTP Express exposant des routes pour lister les outils disponibles et générer des scripts Bash à la volée via requêtes HTTP.
*   **`packages/frontend`** : Dashboard web interactif en React + Vite (style premium sombre, glassmorphism, génération en temps réel).
    *   **Tauri (`src-tauri`)** : Packaging de bureau ultra-léger pour compiler une application Desktop native.
    *   **Capacitor (`android`)** : Packaging mobile pour compiler l'application en fichier Android `.apk`.

---

## 🚀 Installation & Build

Pour installer les dépendances et compiler l'ensemble des modules :

```bash
# Installer toutes les dépendances du monorepo
npm install

# Compiler la librairie principale core (requis avant de compiler les autres modules)
npm run build:core

# Compiler l'ensemble des modules (API, CLI, Frontend)
npm run build:api
npm run build:cli
npm run build:frontend
```

---

## 🛠️ Utilisation des Modules

### 1. Interface Web (Frontend)
Pour lancer le serveur de développement de l'interface graphique :
```bash
npm run dev:frontend
```
Ouvrez [http://localhost:5173](http://localhost:5173). Vous pouvez modifier les options de manière interactive et télécharger votre script `setup.sh` final.

### 2. Outil CLI (`packages/cli`)
Pour générer un fichier de configuration JSON par défaut :
```bash
npx setup-generator-cli -d -c config.json
```
Pour compiler votre configuration JSON en script d'installation Bash :
```bash
npx setup-generator-cli -c config.json -o setup.sh
```

### 3. API Express HTTP (`packages/api`)
Pour lancer le serveur API local :
```bash
npm run dev:api
```
Le serveur expose :
*   `GET /api/tools` : Liste des outils disponibles et options associées.
*   `POST /api/generate` : Envoie une configuration JSON et renvoie le script Bash.

---

## 📱 Desktop (Tauri) & Mobile (Capacitor)

Les configurations de packaging sont intégrées dans le package `packages/frontend`.

### Bureau (Tauri)
Tauri vous permet de compiler l'application de bureau sous forme de binaire natif pour Linux (Ubuntu et Debian), générant un package `.deb` et un fichier `.AppImage`.

#### 1. Installer les dépendances système de build
Avant de lancer le build ou le développement de l'application de bureau sous Linux, vous devez installer les outils de compilation et les bibliothèques système nécessaires (comme WebKit2GTK et GTK+3). Un script automatisé est disponible à la racine du monorepo :
```bash
./install-tauri-deps.sh
```

#### 2. Lancer en mode développement de bureau
Pour lancer l'application en mode développement Desktop :
```bash
npm run dev:desktop
```
*(Équivalent à : `npm run tauri dev --workspace=@setup-generator/frontend`)*

#### 3. Compiler pour la production (générer les paquets .deb / .AppImage)
Pour générer les binaires et paquets d'installation finaux pour Linux :
```bash
npm run build:desktop
```
*(Équivalent à : `npm run tauri build --workspace=@setup-generator/frontend`)*

Les paquets `.deb` et `.AppImage` générés se trouveront dans le dossier :
`packages/frontend/src-tauri/target/release/bundle/`


### Mobile Android (Capacitor)
Pour synchroniser les modifications web avec le projet Android :
```bash
npm run cap:sync --workspace=@setup-generator/frontend
```
Pour ouvrir le projet dans Android Studio afin de compiler l'APK :
```bash
npm run cap:open:android --workspace=@setup-generator/frontend
```
