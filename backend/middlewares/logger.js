/**
 * Middleware de logging pour Express.
 *
 * À chaque requête reçue :
 *  - Enregistre dans la console la méthode (GET, POST…), l’URL demandée et le temps de traitement (en ms).
 *  - Utile pour suivre l’activité du serveur et détecter les routes lentes.
 *
 * Doit être placé en début de chaîne de middlewares.
 */

module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => { // 'finish' est émis lorsque la réponse est complètement envoyée
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${duration}ms`);
  });
  next();
};