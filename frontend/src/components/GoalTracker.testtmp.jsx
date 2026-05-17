import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import GoalTracker from "./GoalTracker";
import axios from "axios";

jest.mock("axios");

describe("GoalTracker", () => {
  const fakeGoals = [
    {
      id: 1,
      name: "Finir le projet",
      deadline: "2025-06-30",
      status: "En cours",
    },
    {
      id: 2,
      name: "Lire un livre",
      deadline: "2025-07-15",
      status: "Non commencé",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("récupère et affiche les objectifs de l'utilisateur", async () => {
    axios.get.mockResolvedValueOnce({ data: fakeGoals });

    render(<GoalTracker user_id={42} />);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/goals/42")
    );

    await waitFor(() => {
      expect(screen.getByText("Finir le projet")).toBeInTheDocument();
      expect(screen.getByText("Lire un livre")).toBeInTheDocument();
    });
  });

  it("supprime un objectif lorsqu'on clique sur le bouton Supprimer", async () => {
    axios.get.mockResolvedValueOnce({ data: fakeGoals });
    axios.delete.mockResolvedValueOnce({});

    render(<GoalTracker user_id={42} />);

    await waitFor(() => {
      expect(screen.getByText("Finir le projet")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Supprimer")[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/api/goals/1/")
      );
    });
  });

  it("ajoute un nouvel objectif via onGoalSubmitted", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<GoalTracker user_id={42} />);

    const newGoal = {
      id: 3,
      name: "Apprendre React",
      deadline: "2025-12-31",
      status: "En cours",
    };

    // Appel direct à la fonction exposée par le composant enfant simulé
    await waitFor(() => {
      const goalSubmission = screen.getByText("Soumettre").closest("form");
      expect(goalSubmission).toBeInTheDocument();
    });

    // Simulation manuelle de la soumission d'un nouvel objectif via le callback
    // (à adapter si `GoalSubmission` est mocké)
    // Pour un test e2e, il faut déclencher les champs comme dans GoalSubmission.test.jsx

    // Ici on simule simplement l’appel au callback
    fireEvent.click(screen.getByText("Soumettre"));
  });
});
