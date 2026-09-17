# Présenter Aether

Ce guide propose une démonstration courte, reproductible et orientée produit. Préparer la démo avec `npm ci`, puis lancer `npm start`.

## Avant la présentation

- Ouvrir `http://localhost:4200` et vérifier que le dashboard est chargé.
- Garder la capture de référence: [`aether-dashboard.png`](./screenshots/aether-dashboard.png).
- Tester le parcours avec `npm run e2e` si les navigateurs Playwright sont installés.
- Prévoir une fenêtre assez large pour le desktop et une seconde fenêtre étroite pour montrer le responsive.
- Vérifier que le thème initial attendu est enregistré dans `localStorage` sous `aether-theme`.

## Parcours en cinq minutes

1. **Orientation** — montrer le shell, la navigation latérale et la hiérarchie des pages.
2. **Décision** — commencer par les KPI: volume, disponibilité, latence et erreurs donnent le contexte avant le détail.
3. **Investigation** — ouvrir la liste des probes, comparer les badges `OK`, `WARN` et `CRIT`, puis sélectionner `Public API`.
4. **Détail** — montrer la télémétrie et la relation entre statut, cible et historique; insister sur les états de chargement et d’erreur.
5. **Adaptation** — basculer clair/sombre puis réduire la fenêtre pour montrer le comportement responsive.

## Messages techniques à faire passer

- **Architecture**: l’app shell compose des features et des bibliothèques partagées Nx.
- **Réactivité**: Signals rendent l’état dérivé lisible; RxJS porte les flux asynchrones.
- **Résilience UI**: les composants disposent d’états de chargement, vide et erreur.
- **Évolutivité**: le contrat de données est documenté et l’adaptateur mock est remplaçable via `API_CLIENT`.
- **Qualité**: lint, tests Jest, build de production et smoke test Playwright font partie du parcours de livraison.

## Captures à maintenir

La capture principale doit représenter une version réellement exécutable du dashboard. Pour toute évolution visuelle importante, remplacer `docs/screenshots/aether-dashboard.png` et vérifier:

- desktop: navigation, KPI, tableau et états visibles sans recouvrement;
- responsive: navigation utilisable et contenu lisible sur une largeur mobile;
- clair et sombre: contraste et badges d’état toujours compréhensibles;
- image: format PNG, dimensions stables et texte suffisamment net pour une revue.

Une PR qui modifie l’UI doit inclure une capture mise à jour lorsque le changement est visible.

## Repli si une donnée manque

La démonstration doit rester possible sans backend externe: conserver `MockApiAdapter` et expliquer que le contrat est le même que celui attendu par l’API réelle. Ne pas présenter des données mock comme des mesures de production.
