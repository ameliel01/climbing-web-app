import React from 'react';
import { render, waitFor } from '@testing-library/react';
import RouteHistory from './RouteHistory';
import axios from 'axios';
import "@testing-library/jest-dom";

jest.mock('axios');

describe('Affichage de RouteHistory', () => {
  const mockUserId = 1;

  const mockRoutes = [
    {
      id: 101,
      date: '2024-05-01',
      typeOfRoute: 'Dévers',
      cotation: 5,
      feeling: 'Très dur',
    },
    {
      id: 102,
      date: '2024-05-15',
      typeOfRoute: 'Toit',
      cotation: 6,
      feeling: 'Nickel',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche correctement les lignes du tableau avec les bons ID", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockRoutes } });

    const { container } = render(<RouteHistory user_id={mockUserId} />);

    // Attendre que les éléments s'affichent
    await waitFor(() => {
      // Vérifie la présence des lignes
      const row1 = container.querySelector('#route-row-101');
      const row2 = container.querySelector('#route-row-102');
      expect(row1).toBeInTheDocument();
      expect(row2).toBeInTheDocument();

      // Vérifie les cellules par ID
      expect(container.querySelector('#route-date-101').textContent).toBe('2024-05-01');
      expect(container.querySelector('#route-type-101').textContent).toBe('Dévers');
      expect(container.querySelector('#route-cotation-101').textContent).toBe('5b'); // selon inverseCotationScale

      expect(container.querySelector('#route-date-102').textContent).toBe('2024-05-15');
      expect(container.querySelector('#route-type-102').textContent).toBe('Toit');
      expect(container.querySelector('#route-cotation-102').textContent).toBe('5c');

      // Vérifie la présence des boutons
      expect(container.querySelector('#edit-button-101')).toBeInTheDocument();
      expect(container.querySelector('#delete-button-101')).toBeInTheDocument();
      expect(container.querySelector('#edit-button-102')).toBeInTheDocument();
      expect(container.querySelector('#delete-button-102')).toBeInTheDocument();
    });
  });
});
