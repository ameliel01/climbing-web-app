import React, { useState } from "react";
import axios from "axios";
import "./GoalSubmission.css";

const GoalSubmission = ({ user_id, onGoalSubmitted }) => {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/goals/", {
        name: goal,
        deadline: deadline,
        status: status,
        user: user_id,
      });
      onGoalSubmitted(response.data);
      setGoal("");
      setDeadline("");
      setStatus("");
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  return (
    <div className="goal-submission">
      <h2>Soumettre un Objectif</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="goal-name">Nom de l'objectif:</label>
          <input
            id="goal-name"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="goal-deadline">Date Limite:</label>
          <input
            id="goal-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="goal-status">Statut:</label>
          <input
            id="goal-status"
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default GoalSubmission;
