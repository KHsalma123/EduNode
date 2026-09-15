/**
 * Middleware d'authentification par clé API pour les routes protégées (admin).
 * 
 * - Vérifie la présence et la validité du header 'x-api-key' dans la requête.
 * - Si la clé est incorrecte ou absente, renvoie une erreur 403 "Accès interdit".
 * - Sinon, autorise l'accès à la suite (next).
 * 
 * À utiliser pour sécuriser toutes les routes nécessitant un accès administrateur.
 */

module.exports = (req, res, next) => { 
  const apiKey = req.header('x-api-key');

  if (!apiKey || apiKey !== "salma1234") {
    return res.status(403).json({ message: 'Accès interdit!' });
  }

  next();
};

