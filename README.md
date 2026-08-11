# Registre Familial

Application Vue 3 pour enregistrer des fiches familiales (nom, prénoms, date de naissance, nom du père et de la mère, photo). Les fiches sont automatiquement triées par **date de naissance croissante** et stockées dans le `localStorage` du navigateur (aucun serveur requis).

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrez l'URL affichée dans le terminal (généralement `http://localhost:5173`).

## Build de production

```bash
npm run build
npm run preview
```

Les fichiers statiques sont générés dans `dist/`, à déployer sur n'importe quel hébergeur (Netlify, Vercel, GitHub Pages, etc.).

## Structure

```
src/
  App.vue                     -> mise en page principale
  style.css                   -> identité visuelle globale
  components/
    FamilyForm.vue            -> formulaire d'ajout (avec upload photo)
    FamilyList.vue             -> liste triée par date de naissance
  composables/
    useFamilyStore.js         -> stockage localStorage + logique de tri
```

## Évolutions possibles

- Remplacer `localStorage` par une vraie base de données (Firebase, Supabase, API REST) pour partager les fiches entre plusieurs utilisateurs/appareils.
- Ajouter la recherche et le filtrage par nom.
- Ajouter la validation de format des noms, export CSV/PDF du registre.
