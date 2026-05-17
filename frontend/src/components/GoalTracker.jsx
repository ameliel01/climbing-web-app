// GoalTracker.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GoalTracker.css";
import GoalSubmission from "./GoalSubmission";

const GoalTracker = ({ user_id }) => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Récupérer les objectifs de l'utilisateur
    axios
      .get(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/goals/${user_id}`)
      .then((response) => {
        setGoals(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des objectifs:", error);
      });
  }, [user_id]);

  const handleDelete = (goalId) => {
    axios
      .delete(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/goals/${goalId}/`)
      .then(() => {
        setGoals(goals.filter((goal) => goal.id !== goalId));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'objectif:", error);
      });
  };

  const handleEdit = (goalId) => {
    // Logique pour la modification (à intégrer dans un formulaire modifiable ou une modale)
    console.log("Modifier l'objectif avec l'ID:", goalId);
  };

  const handleGoalSubmitted = (newGoal) => {
    setGoals([...goals, newGoal]);
  };

  return (
    <div className="goal-tracker">
      <GoalSubmission user_id={user_id} onGoalSubmitted={handleGoalSubmitted} />
      <h2>Suivi des Objectifs</h2>
      <table>
        <thead>
          <tr>
            <th>Objectif</th>
            <th>Date Limite</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal.id}>
              <td>{goal.name}</td>
              <td>{goal.deadline}</td>
              <td>{goal.status}</td>
              <td>
                <button
                  onClick={() => handleEdit(goal.id)}
                  className="edit-button"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="delete-button"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoalTracker;
