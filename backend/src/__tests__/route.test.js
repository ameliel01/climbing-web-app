const request = require('supertest');
const app = require('../app');
const { sequelize, User, Route } = require('../models');
const { v4: uuidv4 } = require('uuid');

describe('Route controller', () => {
  let user, route;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    user = await User.create({
      id: uuidv4(),
      username: 'testuser',
      email: 'test@user.com',
      first_name: 'Test',
      last_name: 'User'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/routes', () => {
    it('crée une route', async () => {
      const res = await request(app)
        .post('/api/routes')
        .send({
          userId: user.id,
          date: '2024-06-01',
          route: 'Indoor',
          typeOfRoute: 'Verticale',
          cotation: '6a',
          feeling: 'Great!'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('userId', user.id);
      route = res.body.data;
    });

    it('renvoie 400 si un champ est manquant', async () => {
      const res = await request(app)
        .post('/api/routes')
        .send({
          userId: user.id,
          date: '2024-06-01',
          route: 'Indoor'
          // champs manquants
        });

      expect(res.status).toBe(400);
      expect(res.body.message || res.body.error).toBeDefined();
    });
  });

  describe('GET /api/routes/:user_id', () => {
    it('récupère les routes de l\'utilisateur', async () => {
      const res = await request(app).get(`/api/routes/${user.id}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some(r => r.id === route.id)).toBe(true);
    });
  });

  describe('PUT /api/routes/:id', () => {
    it('modifie une route', async () => {
      const res = await request(app)
        .put(`/api/routes/${route.id}`)
        .send({ feeling: 'Encore mieux !' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toMatch(/updated/i);
    });
  });

  describe('DELETE /api/routes/:id', () => {
    it('supprime une route', async () => {
      const res = await request(app).delete(`/api/routes/${route.id}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('retourne 200 même si la route n\'existe pas', async () => {
      const res = await request(app).delete(`/api/routes/99999`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toMatch(/deleted/i);
    });
  });
});