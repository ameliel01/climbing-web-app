// En haut du fichier App.test.jsx, avant les imports React ou autres
jest.mock('react-router-dom', () => ({
  __esModule: true,
  NavLink: (props) => <a {...props} />,  // mock basique de NavLink
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
}));


jest.mock('./keycloak', () => ({
  __esModule: true,
  default: {}, // mock minimal du client Keycloak
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Exemple de test basique, à adapter selon ton code
test('affiche Loading... au début', () => {
  render(<App />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});
