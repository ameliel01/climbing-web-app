import React, { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import RouteForm from "./components/RouteForm";
import RouteChart from "./components/RouteChart";
import RouteHistory from "./components/RouteHistory";
import "./ClimbPage.css";
import GoalTracker from "./components/GoalTracker";

function ClimbPage() {
  const { keycloak, initialized } = useKeycloak();
  const [activeTab, setActiveTab] = useState("addProgress");

  if (!initialized) {
    return <div>Loading...</div>;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    keycloak.authenticated && (
      <div className="climb-page">
        <h1>Suivi de Progression d'Escalade</h1>

        <div className="tabs">
          <button
            className={activeTab === "addProgress" ? "active" : ""}
            onClick={() => handleTabChange("addProgress")}
          >
            Ajouter Progression
          </button>
          <button
            className={activeTab === "viewProgress" ? "active" : ""}
            onClick={() => handleTabChange("viewProgress")}
          >
            Visualisation
          </button>
          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => handleTabChange("history")}
          >
            Historique
          </button>
          <button
            className={activeTab === "goal" ? "active" : ""}
            onClick={() => handleTabChange("goal")}
          >
            Objectif
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "addProgress" && (
            <RouteForm user_id={keycloak.idTokenParsed.sub} />
          )}
          {activeTab === "viewProgress" && (
            <RouteChart user_id={keycloak.idTokenParsed.sub} />
          )}
          {activeTab === "history" && (
            <RouteHistory user_id={keycloak.idTokenParsed.sub} />
          )}
          {/* {activeTab === "goal" && (
            <GoalTracker user_id={keycloak.idTokenParsed.sub} />
          )} */}
        </div>

        <button className="logout-button" onClick={keycloak.logout}>
          Déconnexion
        </button>
      </div>
    )
  );
}

export default ClimbPage;
