import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import StudentForm from "../components/StudentForm";
import StudentsTable from "../components/StudentsTable";
import { AuthContext } from "../App";
import { LuDownload } from "react-icons/lu";
import { FaFilter, FaLock } from "react-icons/fa";

const API_URL = "http://localhost:5000";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [formState, setFormState] = useState(null); // etat pour stocker les données de l'étudiant en cours d'édition ou un état vide pour l'ajout
  const [filiereFilter, setFiliereFilter] = useState("");
  const { apiKey, isAdmin } = useContext(AuthContext);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({message, type});
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Fonction pour charger les étudiants depuis l'API, avec possibilité de filtrer par filière
  const fetchStudents = async () => {
  try {
    const res = await axios.get(`${API_URL}/students`, {
      params: filiereFilter ? { filiere: filiereFilter } : {},
    });
    setStudents(res.data); //stock les étudiants dans le state
  } catch (err) {
    showToast("Erreur chargement étudiants");
  }
};

  useEffect(() => {
    fetchStudents();
  }, [filiereFilter]); // a chaque changement du filtre, on refetch les étudiants pour avoir la liste à jour

  const handleSave = async (student, mode) => {
  const payload = {
    prenom: student.prenom,
    nom: student.nom,
    filiere: student.filiere,
    notes: Array.isArray(student.notes)
      ? student.notes.map((n) => +n) // si c'est déjà un array, on convertit les éléments en nombres
      : student.notes.split(",").map((s) => +s.trim()), // sinon on split la string et convertit en nombres
    _id: student._id,
  };

  // On ajoute l'header d'authentification pour les requêtes protégées
  const authHeader = {
    headers: { "x-api-key": apiKey }
  };

  try {
    if (mode === "edit") {
      await axios.put(`${API_URL}/students/${student._id}`, payload, authHeader);

      showToast("Étudiant modifié avec succès", "success");
    } else {
      await axios.post(`${API_URL}/students`, payload, authHeader);

      showToast("Étudiant ajouté avec succès", "success");
    }

    setFormState(null); // reset le formulaire après sauvegarde
    fetchStudents();

  } catch (e) {
    showToast(e.response?.data?.message || "Erreur serveur", "error");
  }
};

  const handleDelete = async (id) => {
  try {
    await axios.delete(`${API_URL}/students/${id}`, {
      headers: { "x-api-key": apiKey }
    });

    showToast("Étudiant supprimé avec succès", "success");

    fetchStudents();
  } catch (e) {
    showToast("Erreur suppression", "error");
  }
};

  const exportCSV = async () => {
  try {
    if (!isAdmin) {
      showToast("Accès refusé. Connectez-vous comme admin.");
      return;
    }

    const res = await axios.get(`${API_URL}/students/export`, {
      headers: { "x-api-key": apiKey },
      responseType: "blob" // important pour recevoir le fichier en binaire
    });

    //Ce bout de code permet de générer et déclencher le téléchargement automatique d’un fichier CSV côté utilisateur,
    //à partir d’une réponse du serveur, sans passer par un vrai lien visible ni de page de téléchargement.
    
    const url = window.URL.createObjectURL(new Blob([res.data])); // crée une URL pour le blob reçu
    const a = document.createElement("a");// crée un lien temporaire
    a.href = url;
    a.download = "students.csv";
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000); // libère la mémoire après téléchargement
  } catch (err) {
    showToast("Erreur export CSV");
  }
};

  const filteredStudents = students.filter((s) =>
    s.filiere?.toLowerCase().includes(filiereFilter.toLowerCase())
  ); // filtre les étudiants côté client pour une réactivité instantanée du filtre. 

  return (
    
    <div className="page-students">
      <div className="students-header">
        <div>
            <h2>Liste des étudiants</h2>
          <span className="students-sub">
            {isAdmin ? filteredStudents.length : 0} étudiant(s) au total
          </span>
        </div>
        <button className="btn-csv" onClick={exportCSV}>
          <LuDownload /> Exporter CSV
        </button>
      </div>

      <div className="students-filters">
        <FaFilter className="students-filters-icon" />
        <input
          className="filter-input"
          placeholder="Filtrer par filière..."
          value={filiereFilter}
          onChange={(e) => setFiliereFilter(e.target.value)}
        />
      </div>

      {/*Affiche le formulaire d'ajout/modification seulement si l'utilisateur est admin*/}
      <div style={{ position: "relative" }}>
        <StudentForm
        onSave={handleSave}
        initialData={formState}
        clearForm={() => setFormState(null)}
        isAdmin={isAdmin}
        showToast={showToast} 
      />
      </div>

      {isAdmin ? (
        <StudentsTable
        students={filteredStudents}
        onEdit={(stu) => setFormState(stu)}
        onDelete={handleDelete}
        isAdmin={isAdmin}
        />
        ) : (
        <div className="students-empty">
          <FaLock />
          <p>Aucun étudiant à afficher</p>
        </div>
        )}

        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>

      
      
      );
}
