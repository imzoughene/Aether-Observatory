# Guide de contribution

Merci de contribuer au dashboard enterprise **Aether**. Ce document décrit comment travailler dans le monorepo Nx et ce que nous attendons avant une pull request.

## Environnement local

1. Cloner le dépôt et installer les dépendances :

   ```sh
   npm install
   ```

2. Lancer l’application :

   ```sh
   npm start
   ```

3. Avant de pousser, exécuter au minimum :

   ```sh
   npm run lint
   npm test
   npm run format:check
   npm run build
   ```

## Organisation du code

- **`apps/aether-app`** : point d’entrée UI, routing, composition des features.
- **`libs/`** : logique métier, composants UI réutilisables, services data/API — une lib par domaine ou couche lorsque c’est pertinent.

Référence : [docs/STRUCTURE.md](./docs/STRUCTURE.md).

### Conventions Nx / Angular

| Sujet | Convention |
|-------|------------|
| Préfixe sélecteur | `aether` |
| Change detection | `OnPush` (défaut des générateurs) |
| Composants | Standalone, SCSS |
| Tests | Fichiers `*.spec.ts` à côté du code source |
| Tags projet | Définir dans `project.json` (`scope:`, `type:`) pour les règles de dépendances futures |

### State et async

- Préférer **signals** et `computed()` pour l’état local et dérivé au niveau composant / facades.
- Utiliser **RxJS** pour les flux HTTP, événements multi-sources et opérateurs (`switchMap`, `debounceTime`, etc.).
- Éviter de mélanger impérativement subscriptions non nettoyées dans les composants ; centraliser dans des services ou facades quand la logique grossit.

## Génération de code

Utiliser les générateurs Nx plutôt que copier-coller manuel :

```sh
# Bibliothèque
npx nx g @nx/angular:lib feature-dashboard --directory=libs/feature-dashboard

# Composant dans l’app
npx nx g @nx/angular:component dashboard-shell --project=aether-app --standalone
```

Lister les capacités d’un plugin :

```sh
npx nx list @nx/angular
```

## Style et lint

- **Prettier** : `npm run format` avant commit si vous modifiez beaucoup de fichiers.
- **ESLint** : règles workspace dans `eslint.config.mjs` ; ne pas désactiver une règle sans justification en review.

## Commits et pull requests

- Messages de commit : courts, à l’impératif (ex. `feat: add orders summary widget`, `fix: guard empty chart series`).
- Une PR = un sujet cohérent (feature, fix ou refactor ciblé).
- Décrire le **pourquoi**, les impacts UX/API, et comment tester.
- Joindre des captures pour les changements visuels si applicable.

## Tests

- Ajouter ou mettre à jour des tests pour le comportement métier non trivial.
- Lancer `npm test` ; en CI, la configuration `ci` de Jest peut activer la couverture (`nx.json`).

## Questions

Pour l’architecture des dossiers ou l’emplacement d’une nouvelle lib, commencer par [docs/STRUCTURE.md](./docs/STRUCTURE.md) et le graphe de projets :

```sh
npx nx graph
```
