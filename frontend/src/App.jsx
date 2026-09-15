import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentsPage from "./pages/StudentsPage";
import StatisticsPage from "./pages/StatisticsPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute"; 
import "./App.css";


// CONTEXTE pour l'auth admin partagé dans toute l'app
export const AuthContext = React.createContext();

export default function App() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("apiKey") || ""
  );
  const isAdmin = !!apiKey;

  return (
    <AuthContext.Provider value={{ apiKey, setApiKey, isAdmin }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<LandingPage />} />

          {/* Pages publiques */}
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />

          {/* Page admin pour saisir la clé */}
          <Route path="/admin" element={<AdminPage />} />   

          {/* Exemple d'une vraie page privée : 
              Remplace <DummyEditPage /> par ta vraie page si besoin */}
          {/*
          <Route
            path="/students/edit/:id"
            element={
              <PrivateRoute>
                <DummyEditPage />
              </PrivateRoute>
            }
          /> */}

          {/* Redirection pour toute URL inconnue */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}