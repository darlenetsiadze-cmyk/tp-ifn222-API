const express = require('express');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express'); // Import de Swagger
const app = express();
const port = 3000;

app.use(express.json());

const DATA_FILE = './articles.json';

// --- CONFIGURATION SWAGGER ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Bilove Beauty API',
    description: 'Documentation interactive de l’API de Darlene (INF222)',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/api/articles': {
      get: { summary: 'Récupérer tous les articles', responses: { '200': { description: 'Liste des articles' } } },
      post: { 
        summary: 'Créer un article',
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Article créé' } } 
      }
    },
    '/api/articles/{id}': {
      get: { summary: 'Voir un article par ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Succès' }, '404': { description: 'Non trouvé' } } },
      delete: { summary: 'Supprimer un article', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Supprimé' } } }
    },
    '/api/articles/search': {
      get: { summary: 'Rechercher un article', parameters: [{ name: 'query', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'Résultats de recherche' } } }
    }
  }
};

// Route pour afficher la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- FONCTIONS DE GESTION DE LA BDD ---
const lireBDD = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const contenu = fs.readFileSync(DATA_FILE, 'utf-8');
    return contenu ? JSON.parse(contenu) : [];
};

const sauvegarderBDD = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- ROUTES DE L'API ---

// 1. LIRE TOUS LES ARTICLES
app.get('/api/articles', (req, res) => {
    const articles = lireBDD();
    res.json(articles);
});

// 2. RECHERCHER UN ARTICLE
app.get('/api/articles/search', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : "";
    const articles = lireBDD();
    const resultats = articles.filter(a => 
        a.titre.toLowerCase().includes(query) || 
        a.contenu.toLowerCase().includes(query)
    );
    res.json(resultats);
});

// 3. LIRE UN ARTICLE UNIQUE
app.get('/api/articles/:id', (req, res) => {
    const articles = lireBDD();
    const article = articles.find(a => a.id === parseInt(req.params.id));
    if (!article) return res.status(404).json({ error: "Article non trouvé" }); 
    res.json(article);
});

// 4. CRÉER UN ARTICLE
app.post('/api/articles', (req, res) => {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    if (!titre || !auteur) return res.status(400).json({ error: "Titre et auteur obligatoires" });

    const articles = lireBDD();
    const nouvelArticle = {
        id: articles.length > 0 ? articles[articles.length - 1].id + 1 : 1,
        titre,
        contenu,
        auteur,
        date: new Date().toISOString().split('T')[0],
        categorie,
        tags: tags || []
    };
    articles.push(nouvelArticle);
    sauvegarderBDD(articles);
    res.status(201).json(nouvelArticle);
});

// 5. SUPPRIMER UN ARTICLE
app.delete('/api/articles/:id', (req, res) => {
    let articles = lireBDD();
    const initialLength = articles.length;
    articles = articles.filter(a => a.id !== parseInt(req.params.id));
    if (articles.length === initialLength) return res.status(404).json({ error: "Article non trouvé" });
    sauvegarderBDD(articles);
    res.json({ message: "Article supprimé de Bilove Beauty" });
});

app.listen(port, () => {
    console.log(`🚀 Serveur Bilove Beauty prêt sur http://localhost:${port}`);
    console.log(`📖 Documentation Swagger : http://localhost:${port}/api-docs`);
});