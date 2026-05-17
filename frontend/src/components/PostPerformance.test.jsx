import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import PostPerformance from "./PostPerformance";
import '@testing-library/jest-dom';


// Mock global fetch
const mockFetch = jest.fn();

global.fetch = mockFetch;

const baseProps = {
  post: {
    id: 1,
    user: 1,
    date: "2024-06-10T14:00:00",
    route: {
      id: 10,
      userId: 1, // Nécessaire pour fetch user
      route: "Voie Test",
      cotation: "6a",
      type: "Dalle",
      feeling: "Bien senti", // à ajouter car utilisé dans composant
    },
    ressenti: "Bien senti",
    likes: 5,
    liked: true,
    comments: [
      { id: 1, content: "Super performance !" },
      { id: 2, content: "Bravo !" },
    ],
    username: "TestUser",
  },
};

beforeEach(() => {
  jest.clearAllMocks();

  // Setup default fetch mock responses for initial loads
  mockFetch.mockImplementation((url) => {
    if (url.endsWith("/users/1")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: "TestUser" }),
      });
    }
    if (url.endsWith("/like/1/1/status")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ liked: true }),
      });
    }
    if (url.endsWith("/like/1/count")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ likes: 5 }),
      });
    }
    if (url.endsWith("/comment/1")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(baseProps.post.comments),
      });
    }
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    });
  });
});

// test("affiche les informations initiales correctement", async () => {
//   await act(async () => {
//     render(
//       <PostPerformance
//         user_id={baseProps.post.user}
//         post_id={baseProps.post.id}
//         createdAt={baseProps.post.date}
//         route={baseProps.post.route}
//         content={baseProps.post.ressenti}
//       />
//     );
//   });

//   expect(screen.getByText("2024-06-10 14:00")).toBeInTheDocument();

//   expect(screen.getByText(baseProps.post.route.route)).toBeInTheDocument();
//   expect(screen.getByText(baseProps.post.route.cotation)).toBeInTheDocument();
//   expect(screen.getByText(baseProps.post.route.type)).toBeInTheDocument();
//   expect(screen.getByText(`"${baseProps.post.route.feeling}"`)).toBeInTheDocument();

//   expect(screen.getByText(/5\s+likes/)).toBeInTheDocument();

//   baseProps.post.comments.forEach(({ content }) => {
//     expect(screen.getByText(content)).toBeInTheDocument();
//   });
// });

test("ajout de commentaire vide n'envoie rien", async () => {
  await act(async () => {
    render(
      <PostPerformance
        user_id={baseProps.post.user}
        post_id={baseProps.post.id}
        createdAt={baseProps.post.date}
        route={baseProps.post.route}
        content={baseProps.post.ressenti}
      />
    );
  });

  expect(mockFetch).toHaveBeenCalledTimes(4);

  const input = screen.getByPlaceholderText("Écrire votre commentaire...");
  const button = screen.getByText("Commenter");

  await act(async () => {
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(button);
  });

  expect(mockFetch).toHaveBeenCalledTimes(4);
});

test("ajout de commentaire valide appelle fetch et nettoie le champ", async () => {
  await act(async () => {
    render(
      <PostPerformance
        user_id={baseProps.post.user}
        post_id={baseProps.post.id}
        createdAt={baseProps.post.date}
        route={baseProps.post.route}
        content={baseProps.post.ressenti}
      />
    );
  });

  const input = screen.getByPlaceholderText("Écrire votre commentaire...");
  const button = screen.getByText("Commenter");

  const newComment = "Nouveau commentaire";

  // Mock réponse POST ajout commentaire
  mockFetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 3,
          content: newComment,
          author: baseProps.post.user,
        }),
    })
  );

  // Mock récupération commentaires après ajout
  mockFetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          ...baseProps.post.comments,
          { id: 3, content: newComment },
        ]),
    })
  );

  await act(async () => {
    fireEvent.change(input, { target: { value: newComment } });
    fireEvent.click(button);
  });

  expect(mockFetch).toHaveBeenCalledTimes(6);

  expect(input.value).toBe("");

  await waitFor(() => expect(screen.getByText(newComment)).toBeInTheDocument());
});
