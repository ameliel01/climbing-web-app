const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

describe('User controller', () => {
  let user;

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

  describe('GET /api/users', () => {
    it('récupère tous les utilisateurs', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      // Peut être un tableau ou un objet selon ton contrôleur
      if (Array.isArray(res.body)) {
        expect(res.body.some(u => u.id === user.id)).toBe(true);
      } else {
        expect(res.body).toHaveProperty('id', user.id);
      }
    });
  });

  describe('GET /api/users/:user_id', () => {
    it('récupère un utilisateur par id', async () => {
      const res = await request(app).get(`/api/users/${user.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', user.id);
      expect(res.body).toHaveProperty('username', 'testuser');
    });

    it('renvoie 404 si l\'utilisateur n\'existe pas', async () => {
      const res = await request(app).get('/api/users/00000000-0000-0000-0000-000000000999');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/non trouvé/i);
    });
  });
});