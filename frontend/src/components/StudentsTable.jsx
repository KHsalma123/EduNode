import { FaBriefcase } from "react-icons/fa";

//students liste des étudiants à afficher
export default function StudentsTable({ students, onEdit, onDelete, isAdmin }) {
  //filter pour vérifier s'il y a des étudiants non supprimés à afficher, si la liste est vide ou tous les étudiants sont marqués comme supprimés, on affiche un message indiquant qu'il n'y a aucun étudiant à afficher.
  const isEmpty = !students.filter((s) => !s.isDeleted).length;

  if (isEmpty) {
    return (
      <div className="students-empty">
        <FaBriefcase />
        <p>Aucun étudiant à afficher</p>
      </div>
    );
  }

  return (
    <table className="students-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Filière</th>
          <th>Email</th>
          <th>Notes</th>
          <th>Moyenne</th>
          {isAdmin && <th>Action</th>} {/* afficher seulement si admin */}
        </tr>
      </thead>
      <tbody>
        {/* on parcourt tous les étudiants */}
        {students.map( 
          (stu) =>
            !stu.isDeleted && (
              <tr key={stu._id}>
                <td>{stu.prenom} {stu.nom}</td>
                <td>{stu.filiere}</td>
                <td>{stu.email}</td>
                <td>{Array.isArray(stu.notes) ? stu.notes.join(", ") : ""}</td> 
                <td>
                  {Array.isArray(stu.notes) && stu.notes.length > 0
                    ? (stu.notes.reduce((a, b) => a + b, 0) / stu.notes.length).toFixed(2)
                    : ""} {/*reduce sert parcourir toutes les notes et les additionner*/}
                </td>
                {isAdmin && (
                  <td>
                    <button className="btn-act" onClick={() => onEdit(stu)}>Modifier</button>
                    <button className="btn-act1" onClick={() => onDelete(stu._id)}>Supprimer</button>
                  </td>
                )}
              </tr>
            )
        )}
      </tbody>
    </table>
  );
}
