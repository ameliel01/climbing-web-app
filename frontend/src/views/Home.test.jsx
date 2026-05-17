// frontend/src/pages/Home.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock de PostPerformance
jest.mock('../components/PostPerformance', () => ({ post_id, user_id }) => (
  <div data-testid="post-performance">{`Post ${post_id} pour user ${user_id}`}</div>
));

// Mock d'axios
jest.mock('axios');

describe('Home component', () => {
  const mockUserId = 42;

  it('affiche les posts après récupération', async () => {
    // Données simulées
    const mockPosts = [
      {
        id: 1,
        createdAt: '2024-01-01',
        content: 'Premier post',
        route: { name: 'Voie 6a' },
      },
      {
        id: 2,
        createdAt: '2024-01-02',
        content: 'Deuxième post',
        route: { name: 'Voie 6b+' },
      },
    ];

    // axios.get retourne ces posts
    axios.get.mockResolvedValueOnce({ data: mockPosts });

    render(<Home user_id={mockUserId} />);

    // On attend que les composants mockés apparaissent
    await waitFor(() => {
      expect(screen.getAllByTestId('post-performance')).toHaveLength(2);
    });

    // Vérifie que le titre est bien affiché
    expect(screen.getByText('Voici les dernières news coté grimpe !')).toBeInTheDocument();
    expect(screen.getByText('Post 1 pour user 42')).toBeInTheDocument();
    expect(screen.getByText('Post 2 pour user 42')).toBeInTheDocument();
  });

  it('gère les erreurs de requête', async () => {
    // axios.get provoque une erreur
    axios.get.mockRejectedValueOnce(new Error('Erreur réseau'));

    // Espionner console.error pour s'assurer qu'il est bien appelé
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Home user_id={mockUserId} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erreur getting post:',
        expect.any(Error)
      );
    });

    // Aucun post ne doit être affiché
    expect(screen.queryByTestId('post-performance')).toBeNull();

    // Nettoyage
    consoleSpy.mockRestore();
  });
});
