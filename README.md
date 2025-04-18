<p align="center">
  <img src="https://github.com/MathildePestie/lafabrique-frontend/blob/main/public/images/logo.png?raw=true" alt="La Fabrique Logo" width="250"/>
</p>

# lafabrique-backend

Bienvenue dans le backend de **La Fabrique**, une application e-commerce dédiée à la création et la personnalisation de fournitures artistiques (crayons, peintures, aérosols, marqueurs).  
Ce backend en **Node.js / Express** gère l’authentification, les palettes personnalisées, les commandes, et la gestion utilisateur via une base de données **MongoDB**.

---

## Technologies utilisées

- Node.js + Express
- MongoDB + Mongoose
- `uid2` + `bcrypt` pour l’authentification sécurisée
- `dotenv` pour les variables d’environnement
- (optionnel) Cloudinary ou Firebase pour le stockage des visuels

---

## Structure des dossiers

lafabrique-backend ┣ models ┃ ┣ users.js ┃ ┗ connection.js ┣ routes ┃ ┣ users.js ┃ ┣ orders.js ┣

## Démarrage du projet

1. Clone ce repo :

bash
git clone https://github.com/MathildePestie/lafabrique-backend.git
cd lafabrique-backend

2. Installe les dépendances  : 

yarn install

3. Crée un fichier .env avec les infos suivantes :

MONGODB_URI=mongodb+srv://...
TOKEN_SECRET=...

4. Lance le serveur :

node server.js

Le backend est dispo par défaut sur : http://localhost:3000

### Authentification

POST /users/signup

Créer un compte utilisateur
Body JSON :

{
  "nom": "Dupont",
  "prénom": "Marie",
  "rue": "12 rue des Artistes",
  "codePostal": "75001",
  "ville": "Paris",
  "téléphone": "0612345678",
  "mail": "marie@exemple.com",
  "password": "motdepasse123"
}

POST /users/signin

Connexion d’un utilisateur
Body JSON :

{
  "mail": "marie@exemple.com",
  "password": "motdepasse123"
}

### Palettes personnalisées

POST /users/save-palette

Enregistre une palette de couleurs (requiert token)
Body JSON :

{
  "token": "<user_token>",
  "palette": ["#ff0000", "#00ff00", "#0000ff"]
}

POST /users/get-palettes

Récupère toutes les palettes enregistrées par l'utilisateur connecté
Body JSON :

{
  "token": "<user_token>"
}

### Commandes

POST /orders

Récupère toutes les commandes passées par un utilisateur
Body JSON :

{
  "token": "<user_token>"
}

#### Notes de la créatrice

Ce projet a été développé dans le cadre de mon portfolio personnel.
Il met en avant une plateforme fictive d’e-retail artistique, alliant personnalisation, esthétique, et expérience utilisateur fluide.
Ce projet a été codé à l'issu de ma formation en développement Full Stack à la Capsule. Il a été conçu d'après une idée originale, de mes connaissances, de celles que j'ai acquises grâce au forums de développement tels que Stack Overflow et de celles que mon allié Chat GPT m'a enseignées.

### Licence

MIT — Libre d’utilisation et de contribution.