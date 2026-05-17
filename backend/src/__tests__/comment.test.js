const request = require('supertest');
const app = require('../app');
const { sequelize, Post, Comment } = require('../models');

describe('Comment controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    await Post.create({
      id: 1,
      content: 'Post de test',
      user_id: 123
    });

    await Comment.create({
      content: 'Test comment',
      user_id: 456,
      post_id: 1
    });
  });
  afterAll(async () => {
  await sequelize.close();
});

  describe('GET /api/comment/:postId', () => {
    it('renvoie les commentaires si le post existe', async () => {
      const res = await request(app).get('/api/comment/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ content: 'Test comment' })
        ])
      );
    });

    it('renvoie 404 si le post n\'existe pas', async () => {
      const res = await request(app).get('/api/comment/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Post not found');
    });
  });

  describe('POST /api/comment/:postId', () => {
    it('crée un commentaire si le post existe', async () => {
      const res = await request(app)
        .post('/api/comment/1')
        .send({ content: 'Nouveau commentaire', author: 789 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({ content: 'Nouveau commentaire' }));
    });

    it('renvoie 404 si le post n\'existe pas', async () => {
      const res = await request(app)
        .post('/api/comment/999')
        .send({ content: 'Commentaire perdu', author: 999 });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Post not found');
    });
  });
});
