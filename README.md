# MapFlow

> Application desktop de mapping visuel entre tables de données — construite avec Electron + React Flow.

![Version](https://img.shields.io/github/v/release/relouBird/mapping-node-app?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Windows-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Aperçu

MapFlow est un outil de mapping visuel permettant de créer des **tables de correspondances** entre différentes structures de données. Connecte visuellement les champs de tes tables via des nœuds et des arêtes interactives — sans draw.io, sans configuration lourde.

**Fonctionnalités principales :**

- Création de tables manuellement ou via import SQL / JSON / fichier `.node.mapper`
- Connexion de champs entre tables par glisser-déposer
- Export du graphe complet en fichier `.node.mapper` réutilisable
- Export du canvas en image PNG
- Suppression d'une connexion par double-clic
- Thème sombre, typographie DM Sans + DM Mono

---

## Installation — Utilisateurs

### Télécharger le setup (recommandé)

Rends-toi sur la page [**Releases**](https://github.com/relouBird/mapping-node-app/releases) du dépôt et télécharge la dernière version :

| Fichier | Description |
|---|---|
| `MapFlow-Setup.exe` | Installateur Windows (Squirrel) — recommandé |
| `MapFlow-win32-x64.zip` | Archive portable — aucune installation requise |

Lance `MapFlow-Setup.exe` et suis les instructions. L'application s'installe sans droits administrateur.

---

## Installation — Développeurs

### Prérequis

- [Node.js](https://nodejs.org) v18 ou supérieur
- npm v9 ou supérieur
- Git

### Cloner et démarrer

```bash
# 1. Cloner le dépôt
git clone https://github.com/relouBird/mapping-node-app.git
cd mapping-node-app

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run start
```

L'application s'ouvre dans une fenêtre Electron. Le hot-reload n'est pas activé par défaut — relance `npm start` après modification.

### Scripts disponibles

```bash
npm run start          # Lance l'app en développement
npm run make       # Compile et génère l'installateur dans /out
npm run package    # Empaquète sans générer l'installateur
npm run publish    # Compile + publie sur GitHub Releases
```

### Structure du projet

```
mapflow/
├── public/                  # Assets statiques (logo, icônes)
├── script/                  # Modules JS partagés
│   ├── const-data.js        # Constantes (COLORS, TYPES)
│   └── utils.js             # Fonctions utilitaires
├── styles/                  # CSS de l'application
│   ├── index.css            # Styles principaux
│   └── title.css            # Barre de titre
├── utilities/               # Librairies vendored (React, ReactFlow)
├── index.html               # Entrée principale du renderer
├── main.js                  # Processus principal Electron
├── forge.config.js          # Configuration Electron Forge
└── package.json
```

### Générer l'installateur localement

```bash
npm run make
```

Les fichiers générés se trouvent dans `out/make/` :

```
out/make/
└── squirrel.windows/
    └── x64/
        ├── MapFlow-Setup.exe       ← installateur
        ├── MapFlow-x.x.x-full.nupkg
        └── RELEASES
```

---

## Format de fichier `.node.mapper`

MapFlow utilise un format JSON propriétaire pour sauvegarder et charger les graphes complets.

**Structure :**

```json
{
  "tables": [
    {
      "id": "n1701234567890",
      "label": "customers",
      "color": "#4f7cff",
      "position": { "x": 80, "y": 100 },
      "fields": [
        { "id": "customers_id",    "name": "id",    "type": "uuid" },
        { "id": "customers_email", "name": "email", "type": "string" }
      ]
    }
  ],
  "edges": [
    {
      "source": "n1701234567890",
      "sourceHandle": "customers_id-s",
      "target": "n1701234567891",
      "targetHandle": "orders_customer_id-t"
    }
  ]
}
```

**Règles importantes :**
- Les IDs de champs suivent le format `tableName_fieldName`
- Les handles source se terminent par `-s`, les handles target par `-t`
- Les IDs de tables doivent être uniques dans le fichier
- Les IDs de champs doivent être uniques au sein d'une même table

---

## Publication sur GitHub Releases

### 1. Configurer `forge.config.js`

Installe le publisher GitHub :

```bash
npm install --save-dev @electron-forge/publisher-github
```

Ajoute la section `publishers` dans `forge.config.js` :

```js
module.exports = {
  packagerConfig: {
    asar: true,
    icon: './public/logo',
    name: 'MapFlow',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'MapFlow',
        authors: 'Ton Nom',
        description: 'Outil de mapping visuel entre tables de données',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'relouBird',   // ← remplace
          name: 'mapflow',         // ← remplace
        },
        prerelease: false,
        draft: true,               // crée un brouillon, tu publies manuellement
      },
    },
  ],
};
```

### 2. Créer un Personal Access Token GitHub

1. Va sur **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Clique sur **Generate new token**
3. Coche la permission `repo` (accès complet aux dépôts publics et privés)
4. Copie le token généré — il ne sera affiché qu'une seule fois

### 3. Publier manuellement depuis ta machine

```bash
# Windows PowerShell
$env:GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
npm run publish

# Windows CMD
set GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
npm run publish
```

Cela va :
1. Compiler l'application
2. Générer l'installateur `.exe`
3. Créer un brouillon de release sur GitHub avec les fichiers attachés

Rends-toi ensuite sur **GitHub → Releases**, clique sur **Edit**, rédige tes notes de version et clique **Publish release**.

---

## Automatiser via GitHub Actions

Pour construire et publier automatiquement à chaque tag pushé, ajoute ce fichier dans ton dépôt :

**`.github/workflows/release.yml`** — voir le fichier inclus dans ce dépôt.

**Workflow :**
1. Tu bumpes la version dans `package.json`
2. Tu crées un tag Git : `git tag v1.0.0 && git push --tags`
3. GitHub Actions build l'installateur Windows et le publie automatiquement

**Configurer le secret :**
1. Va sur **GitHub → Settings → Secrets and variables → Actions**
2. Clique **New repository secret**
3. Nom : `GH_TOKEN`, valeur : ton Personal Access Token

---

## Contribution

Les contributions sont les bienvenues. Pour proposer une modification :

1. Fork le dépôt
2. Crée une branche : `git checkout -b feature/ma-fonctionnalite`
3. Commit : `git commit -m "feat: description"`
4. Push : `git push origin feature/ma-fonctionnalite`
5. Ouvre une Pull Request

---

## Licence

MIT — voir [LICENSE](./LICENSE) pour les détails.