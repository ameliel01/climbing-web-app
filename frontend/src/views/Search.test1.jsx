import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Search from "../views/Search";

// Mock axios
jest.mock("axios");

describe("Search component", () => {
  it("affiche la liste des utilisateurs sauf l'utilisateur courant", async () => {
    // Données simulées retournées par l'API
    const users = [
      { id: 1, username: "Jean" },
      { id: 2, username: "Paul" },
      { id: 3, username: "Jacques" },
    ];
    const currentUserId = 2;

    // Configure axios.get pour retourner ces données
    axios.get.mockResolvedValue({ data: users });

    // Render du composant
    render(<Search currentUserId={currentUserId} />);

    // Attendre que les utilisateurs soient rendus
    await waitFor(() => {
      // Vérifie que les bons utilisateurs sont affichés
      expect(screen.getByText("Jean")).toBeInTheDocument();
      expect(screen.getByText("Jacques")).toBeInTheDocument();

      // Vérifie que l'utilisateur courant n'est pas affiché
      expect(screen.queryByText("Paul")).not.toBeInTheDocument();
    });
  });
});
