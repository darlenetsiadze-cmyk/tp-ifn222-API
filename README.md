■ Bilove Beauty API - INF222
Bienvenue sur l'API Backend de Bilove Beauty, une plateforme dédiée aux soins capillaires naturels.
Ce projet a été réalisé dans le cadre du TAF 1 du module INF222.
Fonctionnalités :
- CRUD Complet : Gestion des articles (Création, Lecture, Recherche, Suppression).
- Persistance : Stockage des données dans un fichier articles.json.
- Documentation : Interface interactive avec Swagger UI.
Technologies Utilisées :
- Environnement : Linux Ubuntu
- Runtime : Node.js
- Framework : Express.js
- Documentation : Swagger UI / OpenAPI 3.0
Installation et Lancement :

1. Installer les dépendances :
npm install
2. Démarrer le serveur :
node app.js
Le serveur sera accessible sur : http://localhost:3000
Documentation de l'API :
http://localhost:3000/api-docs
Tests (Exemple CURL) :
curl -X DELETE http://localhost:3000/api/articles/1
Développé avec amour par Darlene Queen (L2 Informatique)
