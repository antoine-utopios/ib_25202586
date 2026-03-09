# Création d'un projet Angular de jeu de Bowling

## Objectifs

Pratiquer la création d'un projet Angular utilisant un ensemble de modules ainsi que le lazy loading

## Sujet

Réaliser une application avec Angular utilisant le principe du Lazy loading pour différer le téléchargement du code pour le client. 

L'application Angular disposera donc:
* D'une page d'accueil ainsi que d'une page de contact et d'à propos
* D'un ensemble de page servant à la réalisation d'un CRUD de base concernant des albums de musiques, en accordance avec l'API présentée ci-après. 
  * Une page servant à la visualisation des albums de musique (uniquement le nom de l'album, la date de sortie ainsi que la vignette)
  * Une page servant à la visualisation des détails d'un album de musique
  * Une page servant à l'ajout d'un nouvel album de musique
  * Une page servant à l'édition d'un album de musique
  * Une page servant à confirmer la suppression d'un album de musique

L'application devra respecter les conventions de création d'application Angular moderne.

## API Express.js

```json
// package.json

{
  "express": "^5.2.1",
  "uuid": "^13.0.0"
}
```

```javascript
// server.js

const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const DATA_FILE = "./albums.json";

app.use(express.json());

/*
Créer le fichier JSON si il n'existe pas
*/
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    console.log("albums.json créé automatiquement");
}

/*
Fonctions utilitaires
*/
function readAlbums() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

function writeAlbums(albums) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(albums, null, 2));
}

/*
GET tous les albums
*/
app.get("/albums", (req, res) => {
    const albums = readAlbums();
    res.json(albums);
});

/*
GET album par ID
*/
app.get("/albums/:id", (req, res) => {
    const albums = readAlbums();
    const album = albums.find(a => a.id === req.params.id);

    if (!album) {
        return res.status(404).json({ message: "Album non trouvé" });
    }

    res.json(album);
});

/*
POST créer un album
*/
app.post("/albums", (req, res) => {
    const albums = readAlbums();

    const newAlbum = {
        id: uuidv4(),
        nom: req.body.nom,
        interprete: req.body.interprete,
        dateSortie: req.body.dateSortie,
        nombrePistes: req.body.nombrePistes,
        note: req.body.note,
        imageURL: req.body.imageURL,
        genre: req.body.genre
    };

    albums.push(newAlbum);
    writeAlbums(albums);

    res.status(201).json(newAlbum);
});

/*
PUT modifier un album
*/
app.put("/albums/:id", (req, res) => {
    const albums = readAlbums();
    const index = albums.findIndex(a => a.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Album non trouvé" });
    }

    albums[index] = {
        ...albums[index],
        ...req.body
    };

    writeAlbums(albums);

    res.json(albums[index]);
});

/*
DELETE supprimer un album
*/
app.delete("/albums/:id", (req, res) => {
    const albums = readAlbums();
    const filteredAlbums = albums.filter(a => a.id !== req.params.id);

    if (albums.length === filteredAlbums.length) {
        return res.status(404).json({ message: "Album non trouvé" });
    }

    writeAlbums(filteredAlbums);

    res.json({ message: "Album supprimé" });
});

app.listen(PORT, () => {
    console.log(`API lancée sur http://localhost:${PORT}`);
});
```