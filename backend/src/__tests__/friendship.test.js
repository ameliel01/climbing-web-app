const request = require('supertest');
const app = require('../app');
const { sequelize, User, Friendship } = require('../models');
const { v4: uuidv4 } = require('uuid');

describe('Friendship controller', () => {
  let user1, user2, friendship;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    user1 = await User.create({
      id: uuidv4(),
      username: 'alice',
      email: 'alice@test.com',
      first_name: 'Alice',
      last_name: 'Test'
    });

    user2 = await User.create({
      id: uuidv4(),
      username: 'bob',
      email: 'bob@test.com',
      first_name: 'Bob',
      last_name: 'Test'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/friendship', () => {
    it('crée une amitié', async () => {
      const res = await request(app)
        .post('/api/friendship')
        .send({
          follower_id: user1.id,
          followed_id: user2.id
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty('follower_id', user1.id);
      expect(res.body.data).toHaveProperty('followed_id', user2.id);
      expect(res.body.data).toHaveProperty('status', 'pending');
      friendship = res.body.data;
    });

    it('renvoie 400 si un champ est manquant', async () => {
      const res = await request(app)
        .post('/api/friendship')
        .send({
          follower_id: user1.id
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/required/);
    });

    it('renvoie 400 si on veut s\'ajouter soi-même', async () => {
      const res = await request(app)
        .post('/api/friendship')
        .send({
          follower_id: user1.id,
          followed_id: user1.id
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/cannot befriend themselves/);
    });
  });

  describe('GET /api/friendship/:user_id', () => {
    it('récupère les amitiés d\'un utilisateur', async () => {
      const res = await request(app).get(`/api/friendship/${user1.id}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some(f => f.follower_id === user1.id || f.followed_id === user1.id)).toBe(true);
    });

    it('renvoie 400 si user_id manquant', async () => {
      const res = await request(app).get('/api/friendship/');
      expect([400, 404]).toContain(res.status);
    });
  });

  describe('PUT /api/friendship', () => {


    it('renvoie 400 si id ou status manquant', async () => {
      const res = await request(app)
        .put('/api/friendship')
        .send({
          id: friendship.id
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/required/);
    });

  });

  describe('DELETE /api/friendship/:friendship_id', () => {
    it('supprime une amitié', async () => {
      const res = await request(app).delete(`/api/friendship/${friendship.id}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toMatch(/deleted/);
    });

    it('renvoie 404 si l\'amitié n\'existe pas', async () => {
      const res = await request(app).delete('/api/friendship/99999');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});