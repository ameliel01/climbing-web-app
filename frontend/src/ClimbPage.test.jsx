// src/ClimbPage.test.jsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ClimbPage from "./ClimbPage";

jest.mock("./components/RouteForm", () => () => <div>RouteForm Component</div>);
jest.mock("./components/RouteChart", () => () => <div>RouteChart Component</div>);
jest.mock("./components/RouteHistory", () => () => <div>RouteHistory Component</div>);
jest.mock("./components/GoalTracker", () => () => <div>GoalTracker Component</div>);

// Mock global du hook useKeycloak
import * as keycloakModule from "@react-keycloak/web";
jest.mock("@react-keycloak/web");

describe("ClimbPage", () => {
  const useKeycloakMock = keycloakModule.useKeycloak;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche Loading... quand Keycloak n'est pas initialisé", () => {
    useKeycloakMock.mockReturnValue({
      keycloak: null,
      initialized: false,
    });

    render(<ClimbPage />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("rend les onglets et affiche le contenu correct par défaut", () => {
    useKeycloakMock.mockReturnValue({
      keycloak: {
        authenticated: true,
        idTokenParsed: { sub: "user123" },
        logout: jest.fn(),
      },
      initialized: true,
    });

    render(<ClimbPage />);
    expect(screen.getByText("Suivi de Progression d'Escalade")).toBeInTheDocument();

    expect(screen.getByText("Ajouter Progression")).toHaveClass("active");
    expect(screen.getByText("Visualisation")).toBeInTheDocument();
    expect(screen.getByText("Historique")).toBeInTheDocument();
    expect(screen.getByText("Objectif")).toBeInTheDocument();

    expect(screen.getByText("RouteForm Component")).toBeInTheDocument();
  });

  it("change de contenu quand on clique sur les onglets", () => {
    useKeycloakMock.mockReturnValue({
      keycloak: {
        authenticated: true,
        idTokenParsed: { sub: "user123" },
        logout: jest.fn(),
      },
      initialized: true,
    });

    render(<ClimbPage />);

    fireEvent.click(screen.getByText("Visualisation"));
    expect(screen.getByText("RouteChart Component")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Historique"));
    expect(screen.getByText("RouteHistory Component")).toBeInTheDocument();
  });

  it("appelle la fonction logout quand on clique sur Déconnexion", () => {
    const logoutMock = jest.fn();

    useKeycloakMock.mockReturnValue({
      keycloak: {
        authenticated: true,
        idTokenParsed: { sub: "user123" },
        logout: logoutMock,
      },
      initialized: true,
    });

    render(<ClimbPage />);

    fireEvent.click(screen.getByText("Déconnexion"));
    expect(logoutMock).toHaveBeenCalled();
  });
});
