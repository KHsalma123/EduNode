/**
 * Modèle Mongoose pour un étudiant.
 *
 * Définit la structure et les règles de validation pour les documents "Student" dans MongoDB :
 * - prénom, nom, filière, notes (tableau), email (unique), isDeleted (suppression logique)
 *
 * Sert à créer, lire, modifier, supprimer ou restaurer un étudiant depuis la base.
 */

const mongoose = require('mongoose'); //Mongoose sert à connecter Node.js avec MongoDB

const studentSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  filiere: { type: String, required: true },
  notes: [Number],
  email: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false }
});


module.exports = mongoose.model('Student', studentSchema); // Création et exportation du modèle Student basé sur studentSchema