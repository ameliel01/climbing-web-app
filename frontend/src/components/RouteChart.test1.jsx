import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RouteChart from "./RouteChart";
import axios from "axios";

// Mock d'Axios
jest.mock("axios");

// Mock de Recharts (ResponsiveContainer)
jest.mock("recharts", () => {
  const OriginalRecharts = jest.requireActual("recharts");

  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: 500, height: 400 }}>{children}</div>
    ),
  };
});

// Mock de ResizeObserver (nécessaire pour Recharts)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe("RouteChart", () => {
  it("affiche les cotations dans le graphique avec des données mockées", async () => {
    // Mock axios.get renvoyant un objet avec "data" tableau (comme attendu)
    const mockRoutes = {
      data: [
        {
          id: 1,
          cotation: "6",
          typeOfRoute: "Dalle",
          date: "2024-06-01",
        },
        {
          id: 2,
          cotation: "7",
          typeOfRoute: "Dalle",
          date: "2024-06-02",
        },
      ],
    };

    axios.get.mockResolvedValueOnce(mockRoutes);

    // On passe testMode=true pour fixer la taille ResponsiveContainer
    render(<RouteChart user_id={1} testMode={true} />);

    // Attente que le composant avec data-testid="line-chart" apparaisse
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });
});
