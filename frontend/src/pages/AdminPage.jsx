import { useContext, useState } from "react";
import axios from "axios"; //permet de faire des requêtes HTTP vers le backend.
import { AuthContext } from "../App"; //contient apikey setapi et isadmin
import { LuShield } from "react-icons/lu";
import { LuKeyRound, LuBadgeCheck, LuLogOut } from "react-icons/lu";

export default function AdminPage() {
  const { apiKey, setApiKey, isAdmin } = useContext(AuthContext);
  const [input, setInput] = useState(apiKey);
  const [toast, setToast] = useState(null);

  const handleLogin = async (e) => {
  e.preventDefault();

  const showToast = (type, message) => {
  setToast({ type, message });

  setTimeout(() => {
    setToast(null);
  }, 3000);
  }; // Affiche un message temporaire (succès ou erreur) pendant 3 secondes

  try {
    const res = await axios.get(
      "http://localhost:5000/students/admin/check",
      {
        headers: { "x-api-key": input }
      }
    );

    if (res.data.message === "OK admin") {
      setApiKey(input); // Met à jour le contexte global avec la clé API valide
      showToast("success", "Connexion admin réussie");
      localStorage.setItem("apiKey", input); // Stocke la clé API dans le localStorage pour persistance entre les sessions
    }

  } catch (err) {
    showToast("error", "Clé admin incorrecte");
  }
};

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh", padding: 0 }}>
      <div className="admin-box">

        <div className="admin-box-header">
          <span className="admin-icon">
            <LuShield style={{ fontSize: "2.1rem" }} />
          </span>
          <h2>Espace administrateur</h2>
          <div className="subtitle">
            Saisissez votre clé API pour activer les actions de modification.
          </div>
        </div>

        <div className="admin-box-content">

          <form autoComplete="off" onSubmit={handleLogin}>

            <label className="admin-label" htmlFor="adminkey">Clé API</label>

            <div className="admin-input-wrapper">
              <LuKeyRound className="admin-input-icon" />
              <input
                type="password"
                id="adminkey"
                className="admin-input"
                placeholder="••••••••••••••"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="admin-actions" style={{ margin: "10px 0 0 0" }}>
              <button type="submit" className="admin-validate-btn">
                Valider
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className="admin-logout-btn"
                  onClick={() => {
                    setApiKey("");
                    setInput("");
                    localStorage.removeItem("apiKey"); 
                  }}
                >
                  <LuLogOut style={{ fontSize: "1.15em" }} /> Déconnecter
                </button>
              )}
            </div>

          </form>

          <div>
            {isAdmin ? (
              <div className="admin-status">
                <LuBadgeCheck className="status-icon" />
                <span>
                  Vous êtes connecté en tant qu'<strong>administrateur</strong>.
                </span>
              </div>
            ) : (
              <div className="admin-status not-admin">
                <LuKeyRound className="status-icon" />
                Mode lecture seule actif.
              </div>
            )}
          </div>

        </div>
      </div>
      
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
          </div>
        )}
    </div>
  );
}

//:Entrer clé → vérifier backend → activer admin → sauvegarder → afficher statut