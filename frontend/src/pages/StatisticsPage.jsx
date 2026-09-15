import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";

// Icônes pro
import { FaChartLine, FaUsers, FaMedal } from "react-icons/fa";
import { LuArrowDownRight } from "react-icons/lu";

const API_URL = "http://localhost:5000";

export default function StatisticsPage() {
  const { isAdmin } = useContext(AuthContext);

  const [stat, setStat] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // On ne charge les vraies données QUE si admin
    if (!isAdmin) return;
    axios.get(`${API_URL}/students/statistics`).then(r => setStat(r.data)).catch(() => {}); // on stocke les stats globales (moyenne générale)
    axios.get(`${API_URL}/students?all=yes`).then(r => setStudents(r.data)).catch(() => {});// on stocke la liste complète des étudiants (pour faire les calculs dynamiques et la répartition par filière) 
  }, [isAdmin]);

  // Calcul dynamique sur les données récupérées
  const nbEtudiants = isAdmin ? students.length : 0;
  const byFiliere = {};
  const notes = [];

  // Alimenter la répartition/filiere et notes UNIQUEMENT admin
  if (isAdmin) {
    students.forEach(stu => {
      if(!stu.isDeleted) {
        byFiliere[stu.filiere] = (byFiliere[stu.filiere] || 0) + 1;
        notes.push(...stu.notes); // on ajoute toutes les notes de tous les étudiants dans un même tableau pour calculer max/min ensuite
      }
    });
  }

  const meilleureNote = isAdmin && notes.length ? Math.max(...notes) : null;
  const moinsBonneNote = isAdmin && notes.length ? Math.min(...notes) : null;

  return (
    <div className="page-stats">
      <h2>Statistiques de la promotion</h2>
      <span className="stats-subtitle">Aperçu en temps réel des performances et de la répartition.</span>

      {/* 4 cartes KPI */}
      <div className="stats-kpi-grid">
        <div className="stat-card">
          <div className="stat-card-icon blue">
            <FaChartLine />
          </div>
          <span className="stat-card-label">Moyenne générale</span>
          <span className="stat-card-value">
            {isAdmin && stat?.moyenneGenerale != null
              ? stat.moyenneGenerale.toFixed(2)
              : "—"}
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange">
            <FaUsers />
          </div>
          <span className="stat-card-label">Total étudiants</span>
          <span className="stat-card-value">{isAdmin ? nbEtudiants : 0}</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">
            <FaMedal />
          </div>
          <span className="stat-card-label">Meilleure note</span>
          <span className="stat-card-value">{isAdmin && meilleureNote != null ? meilleureNote : "—"}</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red">
            <LuArrowDownRight />
          </div>
          <span className="stat-card-label">Plus basse</span>
          <span className="stat-card-value">{isAdmin && moinsBonneNote != null ? moinsBonneNote : "—"}</span>
        </div>
      </div>

      {/* Répartition par filière */}
      <div className="stats-chart-card">
        <h3>Répartition par filière</h3>
        <span className="stats-chart-subtitle">Nombre d'étudiants par filière</span>
        {(isAdmin && Object.keys(byFiliere).length > 0) ? ( //object.key son role est de transformer un objet en tableau pour pouvoir faire du map dessus
          <div className="filiere-bar-list">
            {Object.entries(byFiliere).map(([filiere, count]) => { //object.entries transforme un objet en tableau de paires [clé, valeur] pour pouvoir faire du map dessus et récupérer à la fois la clé (filiere) et la valeur (count)
              const max = Math.max(...Object.values(byFiliere));
              return (
                <div className="filiere-bar-row" key={filiere}>
                  <span className="filiere-bar-label">{filiere}</span>
                  <div className="filiere-bar-track">
                    <div
                      className="filiere-bar-fill"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                  <span className="filiere-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="stats-no-data">Aucune donnée</div>
        )}
      </div>
    </div>
  );
}