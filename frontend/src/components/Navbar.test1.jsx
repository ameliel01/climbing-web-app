import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  NavLink: ({ children }) => <div>{children}</div>,
}));

test('Navbar affiche tous les liens', () => {
  render(<Navbar />);
  
  // Vérifie que les textes des liens sont présents
  expect(screen.getByText('Accueil')).toBeInTheDocument();
  expect(screen.getByText('Message')).toBeInTheDocument();
  expect(screen.getByText('Mon Profil')).toBeInTheDocument();
  expect(screen.getByText('Rechercher')).toBeInTheDocument();
});
