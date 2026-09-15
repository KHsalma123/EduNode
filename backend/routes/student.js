const express = require('express');
const router = express.Router(); //sert à créer un routeur Express pour gérer les routes liées aux étudiants
const rateLimiter = require("../middlewares/rateLimiter"); //middleware de limitation de taux pour protéger les routes contre les abus
const Student = require('../models/Student'); //modèle Mongoose pour les étudiants, utilisé pour interagir avec la base de données MongoDB
const adminAuth = require("../middlewares/adminAuth"); //middleware d'authentification pour les administrateurs, utilisé pour protéger certaines routes qui nécessitent des privilèges d'administrateur

// ------ ROUTES SPÉCIALES (toujours avant /:id !) ------

// Statistiques de la promo
router.get('/statistics', async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false }); 
    // await c'est une fonction asynchrone qui attend la résolution de la promesse retournée par Student.find() avant de continuer l'exécution du code. 
    // Cela permet d'obtenir les données des étudiants depuis la base de données avant de calculer les statistiques.

    // Sécuriser la récupération des notes
    const allNotes = students.flatMap(s => 
      Array.isArray(s.notes) ? s.notes.filter(n => typeof n === "number") : [] //condition ? valeurSiTrue : valeurSiFalse
    );
    //flatMap() parcourt chaque étudiant et extrait ses notes, en filtrant pour ne garder que les valeurs numériques. 
    // Cela garantit que les calculs statistiques ne seront pas perturbés par des données invalides ou manquantes.

    const moyenne = allNotes.length ? allNotes.reduce((a, b) => a + b, 0) / allNotes.length : 0; 
    const meilleure = allNotes.length ? Math.max(...allNotes) : null;
    const pire = allNotes.length ? Math.min(...allNotes) : null;
    const byFiliere = {};
    students.forEach(s => {
      byFiliere[s.filiere] = (byFiliere[s.filiere] || 0) + 1;
    });

    res.json({
      moyenneGenerale: moyenne,
      nbEtudiants: students.length,
      meilleureNote: meilleure,
      moinsBonneNote: pire,
      etudiantsParFiliere: byFiliere
    });
  } catch (err) {
    console.error("-- ERREUR STATISTIQUES --");
    console.error(err);
    res.status(500).json({ error: "Erreur calcul statistiques" });
  }
});


// Export CSV (optionnel, pour bouton export)
router.get('/export', async (req, res) => {
  const students = await Student.find({ isDeleted: false });
  let csv = 'id,prenom,nom,filiere,email,notes\n';
  csv += students
    .map(s => `${s._id},"${s.prenom}","${s.nom}","${s.filiere}","${s.email}","${Array.isArray(s.notes) ? s.notes.join('|') : ''}"`)
    .join('\n');
    //map permet de transformer chaque étudiant en une ligne CSV, en gérant les champs texte avec des guillemets et en séparant les notes par des barres verticales.
    //join('\n') assemble toutes les lignes en une seule chaîne de caractères avec des sauts de ligne entre chaque étudiant.
  
  res.setHeader('Content-Type', 'text/csv'); 
  //setHeader définit les en-têtes HTTP pour indiquer que la réponse est un fichier CSV, ce qui permet au navigateur de le traiter correctement (par exemple, en proposant de le télécharger).
  res.setHeader('Content-Disposition', 'attachment; filename="students.csv"'); 
  //force le téléchargement du fichier avec un nom spécifique "students.csv".
  res.send(csv);
});

// Moyenne compatible avec autres développements
router.get('/promotion/avg', async (req, res) => {
  const students = await Student.find({ isDeleted: false });
  const allNotes = students.flatMap(st => Array.isArray(st.notes) ? st.notes : []);
  const avg = allNotes.reduce((a, b) => a + b, 0) / (allNotes.length || 1); //reduce pour calculer la somme de toutes les notes, puis divise par le nombre de notes pour obtenir la moyenne.
  res.json({ moyenne: avg.toFixed(2) }); //toFixed(2) arrondit la moyenne à 2 décimales pour une présentation plus propre dans la réponse JSON.
});

// ------ ROUTES CRUD ------

// GET all students (sans les supprimés)
router.get('/', async (req, res) => {
  const { filiere } = req.query; //req.query permet d'accéder aux paramètres de requête passés dans l'URL, ici on récupère le paramètre "filiere" pour filtrer les étudiants par filière si nécessaire.
  const filter = { isDeleted: false };
  if (filiere) {
  filter.filiere = {
      $regex: "^" + filiere.trim(), //trim enleve les espaces 
      $options: "i" //ignore miniscule majuscule
    };
  }
  const students = await Student.find(filter);
  res.json(students);
});

// check admin
router.get("/admin/check", adminAuth, (req, res) => {
  res.json({ message: "OK admin" });
});

// GET by ID 
router.get('/:id', async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id, isDeleted: false });
  if (!student) return res.status(404).json({ message: 'Introuvable' });
  res.json(student);
});


// POST create student (corrigé + gestion d'erreur)
router.post('/', rateLimiter, adminAuth, async (req, res) => {
  try {
    const { prenom, nom, filiere, notes } = req.body;

    if (!prenom || !nom || !filiere) {
      return res.status(400).json({ message: "Champs obligatoires" });
    }

    const email =
      `${prenom.trim().toLowerCase()}.${nom.trim().toLowerCase()}@uit.ac.ma`;

    // IMPORTANT: chercher TOUS les documents même supprimés
    let student = await Student.findOne({ email });

    //cette condition vérifie si un étudiant avec l'email généré existe déjà dans la base de données, même s'il est marqué comme supprimé (isDeleted: true).
    if (student) {
      // UPDATE + RESTORE même ID (PAS création)
      student.prenom = prenom;
      student.nom = nom;
      student.filiere = filiere;
      student.notes = notes;

      if (student.isDeleted) {
        student.isDeleted = false;
      }

      await student.save();

      return res.json(student);
    }

    // CREATE seulement si vraiment inexistant
    student = await Student.create({
      prenom,
      nom,
      filiere,
      notes,
      email,
      isDeleted: false
    });

    return res.status(201).json(student); //201 Created pour indiquer que la ressource a été créée avec succès

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT update student (corrigé + gestion d'erreur)
//sert à modifier les informations d'un étudiant existant dans la base de données.
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    //copie toutes les données envoyées par le client dans un nouvel objet updateData,
    // ce qui permet de manipuler ces données sans affecter directement req.body.

    if ((updateData.prenom || updateData.nom) && !updateData.email) {
      const prenom = (updateData.prenom || "").trim().toLowerCase();
      const nom = (updateData.nom || "").trim().toLowerCase();
      
      updateData.email = `${prenom}.${nom}@uit.ac.ma`;
    }

    // La ligne suivante utilise la méthode findByIdAndUpdate de Mongoose pour trouver un étudiant par son ID (req.params.id) et mettre à jour ses données avec updateData.
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Erreur modification" });
  }
});

// "Soft delete" un étudiant
router.delete('/:id', adminAuth, async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ message: "Supprimé (logique)" });
});


module.exports = router;
