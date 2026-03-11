# Réalisation d'une application Angular testée avec Playwright

## Objectifs

Pratiquer la réalisation de tests E2E avec Playwright dans le cadre d'un projet Angular

## Sujet

Créer un projet d'Application Angular de type TodoList et en réaliser des tests avec Platwright. 

```bash
ng new exercice-04 --routing=false --style=css
cd exercice-04
```

Implémente les fonctionnalités suivantes dans `app.component.ts` / `app.component.html` :

- **Afficher** une liste de tâches
- **Ajouter** une tâche via un champ texte et un bouton
- **Supprimer** une tâche via un bouton associé à chaque tâche
- **Marquer** une tâche comme terminée (via une case à cocher)

Installer et configurer Playwright:

```bash
npm init playwright@latest
```

Choisis les options suivantes lors de l'initialisation :
- Langage : **TypeScript**
- Dossier de tests : `e2e`
- Navigateurs : **Chromium** uniquement (pour commencer)

Dans le fichier `e2e/todo.spec.ts`, écris les tests suivants :

| # | Test | Ce qui est vérifié |
|---|------|--------------------|
| 1 | Affichage initial | La page se charge et la liste est vide |
| 2 | Ajout d'une tâche | Saisir un texte + cliquer sur "Ajouter" → la tâche apparaît dans la liste |
| 3 | Ajout de plusieurs tâches | Deux tâches distinctes sont bien présentes |
| 4 | Suppression d'une tâche | Cliquer sur "Supprimer" → la tâche disparaît |
| 5 | Marquer comme terminée | Cocher une tâche → elle est visuellement différenciée (ex : texte barré) |
| 6 | Tâche vide | Essayer d'ajouter une tâche sans texte → rien ne s'ajoute |
