# Arts et Couleurs 2026

Site statique pour l'exposition Arts et Couleurs 2026.

## Structure

- `index.html` : page d'accueil avec les tuiles et les filtres par collection
- `oeuvre.html?id=1` : page de détail d'une œuvre
- `data/oeuvres.json` : catalogue source généré depuis le CSV
- `data/oeuvres.js` : copie embarquée du catalogue pour permettre l’ouverture directe de `index.html`
- `styles.css` : styles et palette de l'exposition
- `script.js` : chargement du catalogue et rendu des pages
- `audio/` : emplacement prévu pour les fichiers audio locaux
- `img/` : emplacement prévu pour les images des œuvres

Le site ne nécessite ni framework ni étape de compilation. Il peut être publié directement sur GitHub Pages.

## Aperçu local

Le site peut être ouvert directement en double-cliquant sur `index.html`. Le catalogue est embarqué dans `data/oeuvres.js`, ce qui évite l’erreur `Failed to fetch` liée à la sécurité des navigateurs avec les fichiers locaux.
