/**
 * Middleware d'erreur Express pour détecter et signaler un JSON mal formé.
 *
 * - Si la requête contient un JSON invalide (erreur de syntaxe lors du parsing),
 *   cette fonction intercepte l'erreur et renvoie un code 400 ("Format JSON invalide!").
 * - Sinon, elle passe l'erreur au gestionnaire suivant.
 *
 * À placer après express.json() dans l'ordre des middlewares.
 */

module.exports = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Format JSON invalide!' });
  }
  next();
};