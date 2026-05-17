import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalSubmission from "./GoalSubmission";
import axios from "axios";

// Mock d'Axios
jest.mock("axios");

describe("GoalSubmission", () => {
  const mockOnGoalSubmitted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche correctement les champs du formulaire", () => {
    render(<GoalSubmission user_id={1} onGoalSubmitted={mockOnGoalSubmitted} />);
    
    expect(screen.getByLabelText(/Nom de l'objectif/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date Limite/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Statut/i)).toBeInTheDocument();
    // Utilise getByRole pour éviter l'ambiguïté avec le titre
    expect(screen.getByRole('button', { name: /Soumettre/i })).toBeInTheDocument();
  });

  it("soumet le formulaire et appelle onGoalSubmitted", async () => {
    const fakeResponse = { data: { id: 123, name: "Apprendre React", deadline: "2025-12-31", status: "En cours" } };
    axios.post.mockResolvedValueOnce(fakeResponse);

    render(<GoalSubmission user_id={1} onGoalSubmitted={mockOnGoalSubmitted} />);

    fireEvent.change(screen.getByLabelText(/Nom de l'objectif/i), {
      target: { value: "Apprendre React" },
    });
    fireEvent.change(screen.getByLabelText(/Date Limite/i), {
      target: { value: "2025-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/Statut/i), {
      target: { value: "En cours" },
    });

    // Utilise getByRole pour le bouton
    fireEvent.click(screen.getByRole('button', { name: /Soumettre/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/goals/"),
        {
          name: "Apprendre React",
          deadline: "2025-12-31",
          status: "En cours",
          user: 1,
        }
      );
      expect(mockOnGoalSubmitted).toHaveBeenCalledWith(fakeResponse.data);
    });
  });
});
