import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

test('Layout rend les éléments principaux', () => {
  render(<Layout />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
