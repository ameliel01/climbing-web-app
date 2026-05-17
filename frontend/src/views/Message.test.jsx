import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import Message from './Message';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock global.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

// Mock axios
jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();

  // Mock pour axios.get sur /api/room
  axios.get.mockImplementation((url) => {
    if (url.includes('/api/room/')) {
      return Promise.resolve({
        data: [{ id: 1, name: 'Groupe test', isAdministrator: true }],
      });
    } else if (url.includes('/api/message/room/')) {
      return Promise.resolve({
        data: [
          {
            userId: 1,
            content: 'Bonjour !',
            user: { username: 'Alice' },
          },
        ],
      });
    }
    return Promise.resolve({ data: [] });
  });
});

describe('Message component (UI rendering only)', () => {
  const dummyUserId = 1;

  test('affiche le titre "Discussions"', async () => {
    await act(async () => {
      render(<Message user_id={dummyUserId} />);
    });

    expect(await screen.findByText(/Discussions/i)).toBeInTheDocument();
  });

  test('affiche le bouton "+" pour ajouter une nouvelle discussion', async () => {
    await act(async () => {
      render(<Message user_id={dummyUserId} />);
    });

    expect(await screen.findByRole('button', { name: '+' })).toBeInTheDocument();
  });

  test('affiche le champ de saisie avec le placeholder', async () => {
    await act(async () => {
      render(<Message user_id={dummyUserId} />);
    });

    expect(await screen.findByPlaceholderText(/Écrire votre message/i)).toBeInTheDocument();
  });

  test('affiche le bouton "Envoyer"', async () => {
    await act(async () => {
      render(<Message user_id={dummyUserId} />);
    });

    expect(await screen.findByRole('button', { name: /Envoyer/i })).toBeInTheDocument();
  });

  test('affiche un message dans la conversation', async () => {
    await act(async () => {
      render(<Message user_id={dummyUserId} />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Bonjour !/i)).toBeInTheDocument();
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
    });
  });

  test('modale et sidebar ne sont pas visibles par défaut', async () => {
    await act(async () => {
      render(<Message user_id={dummyUserId} />);
    });

    expect(screen.queryByText(/Nouvelle discussion/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Réglages du groupe/i)).not.toBeInTheDocument();
  });
});
