const request = require("supertest");
const app = require("../app"); // ton Express app
const { Like, Post } = require("../models"); // importe le fichier index.js

describe("Like Controller", () => {
  beforeAll(async () => {
    await Post.sync({ force: true }); // recrée la table Post
    await Like.sync({ force: true }); // recrée la table Like
  });
  

  beforeEach(async () => {
    await Like.destroy({ where: {} }); // vide la table Like avant chaque test
    await Post.destroy({ where: {} }); // vide la table Post avant chaque test
  });

  test("POST /api/like/:user_id/:post_id crée un like", async () => {
    try {
      await Post.create({ id: 1, user_id: "user1", content: "Test" });

      const res = await request(app).post("/api/like/user1/1");
      console.log("Status:", res.statusCode);
      console.log("Body:", res.body); // <<<<< ICI tu verras la vraie erreur

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Post liked");

      const like = await Like.findOne({
        where: { user_id: "user1", post_id: 1 },
      });
      expect(like).not.toBeNull();
    } catch (error) {
      console.error("Erreur dans le test:", error);
      throw error;
    }
  });
});
