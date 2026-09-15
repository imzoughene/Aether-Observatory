# Aether — Enterprise Dashboard (Angular / Nx)

Monorepo Nx pour un **tableau de bord d’entreprise** moderne : Angular avec **Signals**, **RxJS** pour les flux asynchrones, et une architecture modulaire prête à accueillir des bibliothèques partagées (`libs/`).

## Objectif du projet

Fournir une base applicative scalable pour un dashboard entreprise : routing, state réactif (signals + RxJS), composants réutilisables et conventions Nx (lint, tests, build cache). L’application hôte actuelle est **`aether-app`**.

## Stack technique

| Domaine | Technologies |
|--------|----------------|
| Framework | [Angular](https://angular.dev) 22 (standalone, `OnPush` par défaut via générateurs Nx) |
| Monorepo | [Nx](https://nx.dev) 23 |
| Réactivité | Angular Signals, [RxJS](https://rxjs.dev) 7.8 |
| Langage | TypeScript 6 (mode strict) |
| Styles | SCSS |
| Tests unitaires | Jest (`jest-preset-angular`) |
| Qualité | ESLint, Prettier |
| Build / dev server | `@angular/build` (application builder) |

## Prérequis

- **Node.js** 20.x ou 22.x (LTS recommandé)
- **npm** 10+ (fourni avec Node)

Vérifier la version :

```sh
node -v
npm -v
```

## Installation

À la racine du dépôt :

```sh
npm install
```

## Commandes principales

Scripts npm (racine) — préférés pour l’onboarding :

| Commande | Description |
|----------|-------------|
| `npm start` | Serveur de dev (`aether-app`), rechargement à chaud |
| `npm run build` | Build production dans `dist/apps/aether-app` |
| `npm test` | Tests unitaires Jest de `aether-app` |
| `npm run lint` | ESLint sur les projets du workspace |
| `npm run lint:fix` | ESLint avec corrections automatiques |
| `npm run format` | Prettier (écriture) |
| `npm run format:check` | Prettier (vérification CI) |

Équivalents Nx directs :

```sh
npx nx serve aether-app
npx nx build aether-app
npx nx test aether-app
npx nx run-many -t lint
npx nx graph
```

Après `npm run build`, servir le bundle localement :

```sh
npx nx serve-static aether-app
```

L’app de dev est en général disponible sur [http://localhost:4200](http://localhost:4200) (port par défaut Angular).

## Structure du dépôt

Vue d’ensemble :

```text
.
├── apps/
│   └── aether-app/          # Application Angular (shell du dashboard)
├── libs/                    # Bibliothèques Nx partagées (feature, UI, data, etc.)
├── docs/
│   └── STRUCTURE.md         # Détail des dossiers et conventions
├── nx.json                  # Configuration Nx (cache, générateurs, plugins)
├── package.json             # Scripts et dépendances workspace
├── tsconfig.base.json       # TypeScript partagé, alias `paths`
├── eslint.config.mjs        # ESLint racine
└── jest.preset.js           # Preset Jest partagé
```

Documentation détaillée : [docs/STRUCTURE.md](./docs/STRUCTURE.md).

## Développement

- **Préfixe composants** : `aether` (configuré dans `nx.json` / `project.json`)
- **Nouvelle lib** : `npx nx g @nx/angular:lib <nom> --directory=libs/<nom>`
- **Nouveau composant** : `npx nx g @nx/angular:component <nom> --project=aether-app`

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour le flux de contribution, les conventions et la checklist avant PR.

## Licence

MIT — voir le champ `license` dans `package.json`.
