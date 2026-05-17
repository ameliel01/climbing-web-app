const request = require('supertest');
const app = require('../app');
const { sequelize, Room, User, RoomUser } = require('../models');
const { v4: uuidv4 } = require('uuid');

describe('Room controller', () => {
  let user, room;

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

  describe('POST /api/room', () => {
    it('crée une room', async () => {
      const res = await request(app)
        .post('/api/room')
        .send({
          name: 'Test Room',
          type: 'private', // ou 'group'
          userIds: [user.id],
          admin: user.id
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Test Room');
      expect(res.body).toHaveProperty('type', 'private');
      room = res.body;
    });

    it('renvoie 400 si type invalide', async () => {
      const res = await request(app)
        .post('/api/room')
        .send({
          name: 'Room Invalide',
          type: 'autre',
          userIds: [user.id],
          admin: user.id
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Type de room invalide');
    });
  });

  describe('GET /api/room/:user_id', () => {
    it('récupère les rooms de l\'utilisateur', async () => {
      const res = await request(app).get(`/api/room/${user.id}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // On peut vérifier qu'au moins une room correspond à celle créée
      expect(res.body.some(r => r.id === room.id)).toBe(true);
    });
  });

  describe('PUT /api/room/:room_id', () => {
    it('modifie le nom de la room', async () => {
      const res = await request(app)
        .put(`/api/room/${room.id}`)
        .send({ name: 'Room Modifiée' });
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Nom de la room mis à jour/);
      expect(res.body.room.name).toBe('Room Modifiée');
    });
  });

  describe('DELETE /api/room/:room_id', () => {
    it('supprime la room', async () => {
      const res = await request(app).delete(`/api/room/${room.id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Room supprimée/);
    });

    it('renvoie 404 si la room n\'existe pas', async () => {
      const res = await request(app).delete(`/api/room/99999`);
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/Room non trouvée/);
    });
  });
});