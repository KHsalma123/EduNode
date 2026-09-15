const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); //Permet à ton API d’être appelée depuis d’autres machines/domaine (ex : frontend sur une autre adresse).
const logger = require('./middlewares/logger');
const jsonValidation = require('./middlewares/jsonValidation');
const adminAuth = require('./middlewares/adminAuth');
const rateLimiter = require('./middlewares/rateLimiter');
const studentRoutes = require('./routes/student');

const app = express(); //creation de l'application Express, qui servira de base pour définir les routes, les middlewares et démarrer le serveur.

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(logger);

// Middleware de validation JSON
app.use(jsonValidation);

// Student routes (rate limiter appliqué sur les POST)
app.use('/students', studentRoutes);


// *********** ROUTE D'ACCUEIL ************
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API EduNode !');
});
// *****************************************

// Middleware de gestion des erreurs global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

// Connexion MongoDB & démarrage du serveur
mongoose.connect('mongodb://127.0.0.1:27017/edunode').then(() => {
  app.listen(5000, () => console.log('API démarrée ! (http://localhost:5000)'));
});