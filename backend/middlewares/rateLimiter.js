/**
 * Middleware Express de limitation de débit (rate limiting) pour les requêtes POST.
 *
 * - Autorise 10 requêtes POST maximum par minute et par IP.
 * - Renvoie une erreur si la limite est dépassée ("Trop de requêtes POST, réessayez plus tard !").
 * - Ignore les autres méthodes HTTP (GET, PUT, etc).
 *
 * Utilisé pour éviter le spam et protéger les routes sensibles (ex : création d'étudiant).
 */

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Trop de requêtes POST, réessayez plus tard !",
  skip: (req) => req.method !== "POST"
});

module.exports = limiter; // Appliquer ce middleware uniquement aux routes POST pour limiter les tentatives de connexion ou d'inscription