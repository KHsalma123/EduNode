import { Link, useLocation } from "react-router-dom"; // link pour les liens de navigation, useLocation pour savoir quelle page est active

import { useContext } from "react"; 
//useContext sert à acceder au contexte de createContext dans App.jsx pour savoir si on est admin ou pas
//createContext est utilisé pour créer un contexte global qui peut être partagé entre les composants sans avoir à passer des props 
// manuellement à chaque niveau de l'arborescence des composants.
//provider est utilisé pour fournir une valeur au contexte, et useContext est utilisé pour consommer cette valeur dans les composants enfants.

import { AuthContext } from "../App";
// AuthContext est le contexte créé dans App.jsx qui contient l'information sur si l'utilisateur est admin ou pas, 
// et la fonction pour changer ce statut. En utilisant useContext(AuthContext), 
// on peut accéder à ces informations dans le composant Navbar pour afficher les éléments de navigation appropriés
// en fonction du rôle de l'utilisateur.

import { PiStudentBold } from "react-icons/pi";
import { PiGraduationCapBold } from "react-icons/pi";
import { LuHouse, LuShield } from "react-icons/lu";
import { FaChartBar } from "react-icons/fa";

//export default pour pouvoir importer ce composant dans App.jsx et l'utiliser dans le rendu de l'application.
export default function Navbar() {
  const { isAdmin } = useContext(AuthContext);
  const location = useLocation(); 

  return (
    <nav className="navbar-modern">
      {/* Logo et titre */}
      <div className="navbar-logo">
        <span className="navbar-logo-icone">
          <PiGraduationCapBold size={28} color="#fff" />
        </span>
        <span className="navbar-title">EduNode</span>
      </div>
      {/* Menu */}
      <div className="navbar-links">
        <MenuLink
          to="/"
          active={location.pathname === "/"} // pathname pour savoir si on est sur la page d'accueil
          icon={<LuHouse size={20} />}
          label="Accueil"
        />
        <MenuLink
          to="/students"
          active={location.pathname.startsWith("/students")}
          icon={<PiStudentBold size={20} />}
          label="Étudiants"
        />
        <MenuLink
          to="/statistics"
          active={location.pathname.startsWith("/statistics")}
          icon={<FaChartBar size={20} />}
          label="Statistiques"
        />
        <MenuLink
          to="/admin"
          active={location.pathname.startsWith("/admin")}
          icon={<LuShield size={20} />}
          label="Admin"
        />
      </div>
      {/* Admin / Lecture seule */}
      <div className="navbar-right">
        {!isAdmin ? (
          <span className="navbar-mode">Lecture seule</span>
        ) : (
          <span className="navbar-mode admin">Admin (ON)</span>
        )}
      </div>
    </nav>
  );
}

// Composant pour les liens de navigation, qui prend en props le chemin (to), l'icône, le label et si c'est actif ou pas pour appliquer une classe CSS différente.
function MenuLink({ to, icon, label, active }) {
  return (
    <Link to={to} className={`navbar-link ${active ? "active" : ""}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}