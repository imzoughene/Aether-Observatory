# Développer et déployer Aether

Ce guide complète le [README](../README.md) avec les étapes opératoires pour un poste de développement, une CI et un hébergement statique.

## Démarrage local

Prérequis: Node.js 20 ou 22 LTS et npm 10 ou plus récent.

```sh
git clone <repository-url>
cd Angular-Enterprise-Dashboard-Angular-Nx-Signals-RxJS-
npm ci
npm start
```

Ouvrir `http://localhost:4200`. Pour inspecter les projets et leurs dépendances:

```sh
npx nx graph
npx nx show project aether-app
```

`npm install` reste adapté au développement lorsque le lockfile doit être régénéré; `npm ci` est recommandé en CI et pour reproduire exactement les dépendances verrouillées.

## Boucle de contribution

1. Identifier la feature ou la lib propriétaire du comportement.
2. Garder les composants standalone et les sélecteurs préfixés `aether`.
3. Utiliser Signals pour l’état local et dérivé; réserver RxJS aux flux asynchrones, HTTP et combinaisons multi-sources.
4. Ajouter les tests `*.spec.ts` à côté du code modifié.
5. Vérifier le workspace avant une PR:

   ```sh
   npm run format:check
   npm run lint
   npm test
   npm run build
   npm run e2e
   ```

Pour une itération ciblée, préférer `npx nx test <project>`, `npx nx lint <project>` ou `npx nx build aether-app`.

## Données et API

Le point d’injection est `API_CLIENT`, fourni par `provideDataServices()`. Le mock expose des probes, KPI et télémétrie selon le contrat OpenAPI. Les services de domaine ne doivent pas importer `MockApiAdapter`.

Pour simuler une API instable dans un test ou une démo:

```ts
const adapter = new MockApiAdapter();
adapter.configure({ latencyMs: 600, errorRate: 0.15 });
```

Le remplacement par une API réelle est documenté dans la section dédiée du [README](../README.md#remplacer-lapi-mock).

## Déploiement statique

```sh
npm run build
```

Publier `dist/apps/aether-app/browser` sur l’hébergeur choisi. Configurer un fallback de navigation vers `index.html`; sans ce réglage, un rechargement direct sur une route non racine peut renvoyer 404. Vérifier également que les réponses de l’API réelle autorisent l’origine du frontend et que les chemins `/api/v1/*` sont routés correctement.

Exemple Nginx minimal:

```nginx
server {
  root /var/www/aether;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Diagnostic rapide

| Symptôme                     | Vérification                                                                |
| ---------------------------- | --------------------------------------------------------------------------- |
| Page blanche                 | Console navigateur, `npm run build`, et présence de `browser/index.html`    |
| Route 404 après rechargement | Fallback SPA vers `index.html`                                              |
| Données absentes             | Provider `API_CLIENT`, base `/api/v1`, et forme JSON du contrat             |
| Tests Playwright impossibles | `npm run e2e:install` puis `npm run e2e`                                    |
| Styles incohérents           | Import global de `libs/ui/shared/src/styles/index.scss` et usage des tokens |
