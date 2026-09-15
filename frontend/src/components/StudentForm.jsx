import React, { useState, useEffect } from "react";
//useState pour gérer l'état du formulaire, useEffect pour mettre à jour le formulaire quand les données initiales changent (pour l'édition).
//useEffect stocker les donnés 

import { FaPlus, FaUndo } from "react-icons/fa";

//onsave fonction de sauvegarde 
//initialData données initiales pour pré-remplir le formulaire en cas d'édition
//clearForm fonction pour réinitialiser le formulaire après l'ajout ou l'édition
//isAdmin pour vérifier si l'utilisateur est admin avant de permettre l'ajout ou la modification
//showToast pour afficher des messages d'erreur ou de succès à l'utilisateur
export default function StudentForm({ onSave, initialData, clearForm, isAdmin, showToast }) {
  const [form, setForm] = useState({ prenom: "", nom: "", filiere: "", notes: "" });
  //loading permet d’afficher un état “en cours de traitement” dans l’interface
  const [loading, setLoading] = useState(false);
  const filieres = [
  "Informatique",
  "Électrique",
  "Réseaux et Télécommunications",
  "Industriel",
  "Mécatronique",
  "Efficacité Énergétique"
];


  //s'exécute à chaque fois que initialData change, pour mettre à jour le formulaire avec les nouvelles données (utile pour l'édition d'un étudiant existant).
  useEffect(() => {
    setForm(
      initialData
        ? {
            prenom: initialData.prenom || "",
            nom: initialData.nom || "",
            filiere: initialData.filiere || "",
            notes: Array.isArray(initialData.notes)
              ? initialData.notes.join(",") //si les notes sont déjà un tableau, on les convertit en chaîne séparée par des virgules pour les afficher dans le champ de saisie.
              : initialData.notes || "",
          }
        : { prenom: "", nom: "", filiere: "", notes: "" }
    );
  }, [initialData]);

  return (
    <form
      className="form-students"
      onSubmit={async (e) => {
        e.preventDefault();
        //empeche la page de se recharger à la soumission du formulaire, ce qui est le comportement par défaut des formulaires HTML.

        if (!isAdmin) {
          showToast("Vous devez être admin pour ajouter ou modifier un étudiant.");
          return;
        }

        if (!form.prenom || !form.nom || !form.filiere || !form.notes) {
          showToast("Tous les champs sont obligatoires.");
          return;
        }
        const notesArray = form.notes
          .split(",") //sépare la chaîne de notes en un tableau de chaînes en utilisant la virgule comme séparateur.
          .map((n) => parseFloat(n.trim())) //enlève les espaces et convertit en nombre
          .filter((n) => !isNaN(n));
        if (!notesArray.length) {
          showToast("Veuillez saisir au moins une note");
          return;
        }
        setLoading(true);
        try {
          //await pour attendre la fin de l'opération de sauvegarde avant de continuer, ce qui permet d'afficher un état de chargement pendant le processus.

          // Appelle la fonction de sauvegarde (ajout ou édition) fournie par le parent.
          // - Envoie toutes les infos du formulaire (avec notes converties en tableau de nombres)
          // - Précise le type d'action ("edit" si on modifie, "add" si on crée)
          // - Attend que la sauvegarde soit totalement terminée avant de continuer (grâce à `await`)
          await onSave(
            { ...form, notes: notesArray, _id: initialData?._id },
            initialData ? "edit" : "add"
          );
          clearForm && clearForm();
          setForm({ prenom: "", nom: "", filiere: "", notes: "" });
        } catch (err) {
          showToast("Erreur !");
        } finally {
          setLoading(false);
        }
      }}
    >
      <label>
        Prénom
        <input
          value={form.prenom}
          onChange={(e) => setForm({ ...form, prenom: e.target.value })}
          //e.target.value pour récupérer la valeur saisie dans le champ de formulaire et mettre à jour l'état du formulaire en conséquence.
        />
      </label>
      <label>
        Nom
        <input
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />
      </label>
      <label>
        Filière
        <select
          value={form.filiere}
          onChange={(e) => setForm({ ...form, filiere: e.target.value })}
        >
        <option value="">-- Choisir une filière --</option>
        {filieres.map((f, i) => (
          <option key={i} value={f}>{f}</option>
        ))}
      </select>
      </label>
      <label>
        Notes (séparées par ,)
        <input
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>
      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" className="btn-main" disabled={loading}>
          <FaPlus style={{ marginRight: 8 }} />
          {loading ? "..." : initialData ? "Modifier" : "Ajouter"}
        </button>
        {initialData && (
          <button type="button" className="btn-neutral" onClick={clearForm}>
            <FaUndo style={{ marginRight: 6 }} />
            Annuler
          </button>
          //button visible uniquement en mode édition pour permettre d'annuler les modifications et revenir au formulaire vide.
        )}
      </div>
    </form>
  );
}
