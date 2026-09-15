import { Link } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";
import { LuShield } from "react-icons/lu";
import { FaChartBar } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 24,
        background: "radial-gradient(circle at 60% 40%, #e1e8fb 0%, #fafafb 70%, #f9f4f0 100%)",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <div
          style={{
            display: "flex", justifyContent: "center",
            margin: "36px 0 32px"
          }}
        >
          <span style={{
            display: "inline-block",
            background: "#fff",
            border: "1px solid #ecebfd",
            color: "#ea7c1b",
            borderRadius: 30,
            fontWeight: 600,
            fontSize: 16,
            padding: "6px 26px",
            boxShadow: "0 2px 16px #ecebfd99",
            marginBottom: 18,
          }}>
            🟠 Nouvelle interface • Plus rapide, plus claire
          </span>
        </div>
        <h1 style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 62,
          letterSpacing: -2,
          marginBottom: 20,
          lineHeight: "110%",
          color: "#131525"
        }}>
          Gérez vos étudiants
          <br />
          <span style={{ color: "#405be3", fontWeight: 800 }}>avec élégance.</span>
        </h1>
        <p style={{
          textAlign: "center",
          fontSize: "1.3rem",
          color: "#6b6375",
          margin: "16px auto 40px",
          maxWidth: 600
        }}>
          EduNode rassemble la liste des étudiants, leurs notes et les statistiques
          de la promotion dans une interface moderne et fluide.
        </p>
        <div className="landing-actions">
          <Link to="/students" className="btn-main">
            Voir les étudiants &nbsp;→
          </Link>
          <Link to="/statistics" className="btn-secondary">
            Statistiques
          </Link>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 34,
          marginTop: 64,
          marginBottom: 32,
          flexWrap: "wrap"
        }}>
        <FeatureCard
          icon={<PiStudentBold size={30} color="#405be3" />}
          title="Gestion complète"
          desc="Ajoutez, modifiez et organisez vos étudiants par filière en quelques clics."
        />
        <FeatureCard
          icon={<FaChartBar size={30} color="#405be3" />}
          title="Statistiques claires"
          desc="Visualisez les moyennes, meilleures notes et répartitions de la promotion."
        />
        <FeatureCard
          icon={<LuShield size={30} color="#405be3" />}
          title="Accès sécurisé"
          desc="Mode lecture pour tous, modifications réservées aux administrateurs."
        />
      </div>
    </div>
  );
}

// FeatureCard est un composant réutilisable qui évite de répéter le même HTML pour chaque carte
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="FeatureCard">
      <div
        style={{
          height: 44, width: 44,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 12,
          marginBottom: 18,
          fontSize: 28
        }}
      >
        {icon}
      </div>
      <div style={{
        fontWeight: 800, fontSize: 22, color: "#151827", marginBottom: 10,
        fontFamily: "inherit"
      }}>{title}</div>
      <div style={{
        fontSize: 16, color: "#8591ab", textAlign: "center", fontWeight: 500,
        maxWidth: 226
      }}>{desc}</div>
    </div>
  );
}