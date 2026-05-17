import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RouteForm from './RouteForm';
import axios from 'axios';

jest.mock('axios');

describe('RouteForm', () => {
  const user_id = 123;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche correctement le formulaire avec valeurs par défaut', () => {
    const { container } = render(<RouteForm user_id={user_id} />);

    // Vérifie que les inputs existent avec les valeurs par défaut
    const dateInput = container.querySelector("#route-date");
    const routeInput = container.querySelector("#route-route");
    const cotationInput = container.querySelector("#route-cotation");
    const typeOfRouteInput = container.querySelector("#route-typeOfRoute");
    const feelingTextarea = container.querySelector("#route-feeling");

    const today = new Date().toISOString().split('T')[0];
    expect(dateInput.value).toBe(today);
    expect(routeInput.value).toBe('Indoor');
    expect(cotationInput.value).toBe("1");
    expect(typeOfRouteInput.value).toBe("Verticale");
    expect(feelingTextarea.value).toBe('');
  });

  test('change les valeurs des champs formulaire', () => {
    const { container } = render(<RouteForm user_id={user_id} />);

    const feelingTextarea = container.querySelector("#route-feeling");
    fireEvent.change(feelingTextarea, { target: { value: 'Je me suis senti super bien !' } });
    expect(feelingTextarea.value).toBe('Je me suis senti super bien !');

    const selectRoute = container.querySelector("#route-route");
    fireEvent.change(selectRoute, { target: { value: 'Outdoor' } });
    expect(selectRoute.value).toBe('Outdoor');
  });

  test('envoie les données correctement lors de la soumission et affiche message succès', async () => {
    axios.post.mockImplementation((url, data) => {
      if (url.includes('/api/routes')) {
        return Promise.resolve({ data: { data: { userId: user_id, id: 456 } } });
      }
      if (url.includes(`/api/user/${user_id}/post`)) {
        return Promise.resolve({ data: { success: true } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const onEditComplete = jest.fn();

    const { container } = render(<RouteForm user_id={user_id} onEditComplete={onEditComplete} />);

    const feelingTextarea = container.querySelector("#route-feeling");
    fireEvent.change(feelingTextarea, { target: { value: 'Super séance' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(onEditComplete).toHaveBeenCalled();
    });
  });

  test('pré-remplit le formulaire en mode édition', () => {
    const routeToEdit = {
      id: 789,
      userId: user_id,
      date: '2023-05-01',
      route: 'Outdoor',
      typeOfRoute: 'Toit',
      cotation: 2,
      feeling: 'Un peu dur',
    };

    const { container } = render(<RouteForm user_id={user_id} routeToEdit={routeToEdit} />);

    const dateInput = container.querySelector("#route-date");
    const routeInput = container.querySelector("#route-route");
    const cotationInput = container.querySelector("#route-cotation");
    const typeOfRouteInput = container.querySelector("#route-typeOfRoute");
    const feelingTextarea = container.querySelector("#route-feeling");

    expect(dateInput.value).toBe(routeToEdit.date);
    expect(routeInput.value).toBe(routeToEdit.route);
    expect(cotationInput.value).toBe(String(routeToEdit.cotation));
    expect(typeOfRouteInput.value).toBe(routeToEdit.typeOfRoute);
    expect(feelingTextarea.value).toBe(routeToEdit.feeling);

  });

  test("l'input date a la bonne valeur", () => {
    const routeToEdit = {
      userId: 1,
      date: "2024-05-31",
      route: "Indoor",
      typeOfRoute: "Cheminée",
      cotation: "5a",
      feeling: "Bien",
      id: 123,
    };

    const { container } = render(<RouteForm user_id={1} routeToEdit={routeToEdit} />);
    const dateInput = container.querySelector("#route-date");
    expect(dateInput.value).toBe(routeToEdit.date);
  });
});
