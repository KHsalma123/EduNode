import { useContext } from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";
//navigate pour rediriger vers une autre page si l'utilisateur n'est pas admin

// Encapsule une page pour n'afficher que si admin (clé entrée)
export default function PrivateRoute({ children }) {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? children : <Navigate to="/admin" replace />;
  //children c'est la page à protéger
}