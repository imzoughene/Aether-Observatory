# Structure des dossiers

Ce document décrit l’organisation du monorepo **Aether** et le rôle de chaque zone. Il complète le [README](../README.md).

## Racine du workspace

| Chemin | Rôle |
|--------|------|
| `apps/` | Applications déployables (shell Angular, éventuellement autres apps plus tard) |
| `libs/` | Bibliothèques TypeScript/Angular partagées, buildables via Nx |
| `docs/` | Documentation projet (ce fichier, guides futurs) |
| `nx.json` | Cibles par défaut, cache Nx, générateurs Angular (`prefix: aether`, Jest, SCSS) |
| `package.json` | Dépendances npm et scripts `start`, `build`, `test`, `lint`, `format` |
| `tsconfig.base.json` | Options TS communes ; `paths` pour les alias `@aether/...` lors de l’ajout de libs |
| `eslint.config.mjs` | Configuration ESLint flat (workspace) |
| `jest.preset.js` | Configuration Jest partagée entre projets |
| `.vscode/` | Tâches, launch et extensions recommandées pour VS Code / Cursor |
| `.editorconfig` | Indentation et encodage cohérents |
| `.prettierrc` / `.prettierignore` | Formatage automatique |

Fichiers générés ou locaux (non versionnés) : `node_modules/`, `dist/`, `.nx/cache`.

## Application `apps/aether-app`

Application Angular principale — **type:app**, tags `scope:aether-app`, `type:app`.

```text
apps/aether-app/
├── project.json           # Cibles Nx : build, serve, test, lint, serve-static
├── jest.config.ts         # Jest spécifique au projet
├── tsconfig.json          # Références app + spec
├── tsconfig.app.json      # Sources application
├── tsconfig.spec.json     # Sources tests
├── eslint.config.mjs      # ESLint projet
├── public/                # Assets statiques copiés tels quels (favicon, etc.)
└── src/
    ├── index.html         # Page HTML hôte
    ├── main.ts            # Bootstrap standalone
    ├── styles.scss        # Styles globaux
    ├── test-setup.ts      # Setup Jest
    └── app/
        ├── app.ts         # Composant racine (`aether-root`)
        ├── app.html       # Template racine
        ├── app.config.ts  # Providers (router, etc.)
        ├── app.routes.ts  # Définition des routes
        ├── app.spec.ts    # Test du composant racine
        └── nx-welcome.ts  # Composant de bienvenue Nx (temporaire / démo)
```

**Sortie de build** : `dist/apps/aether-app/` (browser bundle sous `browser/` selon le builder Angular).

## Bibliothèques `libs/`

Le dossier est prévu pour accueillir les libs Nx. À la création, une lib typique ressemble à :

```text
libs/<nom-lib>/
├── project.json
├── src/
│   ├── index.ts           # API publique (barrel)
│   └── lib/               # Implémentation
├── README.md              # (optionnel) doc de la lib
└── tsconfig*.json
```

Conventions recommandées de nommage :

| Préfixe / dossier | Usage |
|-------------------|--------|
| `libs/ui-*` | Composants présentationnels réutilisables |
| `libs/feature-*` | Smart components, pages, routing feature |
| `libs/data-access-*` | Services HTTP, stores, adapters API |
| `libs/util-*` | Fonctions pures, helpers, types partagés |

Importer depuis l’app via les alias définis dans `tsconfig.base.json` (à configurer lors de l’ajout de chaque lib), par exemple :

```ts
import { Something } from '@aether/data-access-orders';
```

## Graphe de dépendances

Règle générale Nx :

```text
apps  →  libs/feature  →  libs/data-access, libs/ui, libs/util
```

Les apps ne doivent pas importer directement des libs `data-access` si une couche `feature` existe déjà — cela garde le shell mince et testable.

Visualiser :

```sh
npx nx graph
```

## Évolution prévue

Au fur et à mesure du dashboard enterprise, on s’attend à :

- Découper `aether-app/src/app` en routes lazy-loaded pointant vers des libs `feature-*`.
- Centraliser thème, layout et navigation dans `libs/ui-shell` ou équivalent.
- Documenter ici chaque nouvelle lib (une ligne dans le tableau ci-dessus ou un README dans la lib).
