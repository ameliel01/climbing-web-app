const request = require('supertest');
const app = require('../app');
const { sequelize, Room, User, RoomUser } = require('../models');
const { v4: uuidv4 } = require('uuid');

describe('RoomUser controller', () => {
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

    room = await Room.create({
      name: 'Test RoomUser',
      type: 'private'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/room-user/:roomId/users', () => {
    it('ajoute un utilisateur à une room', async () => {
      const res = await request(app)
        .post(`/api/room-user/${room.id}/users`)
        .send({
          roomId: room.id,
          userId: user.id,
          role: 'administrator'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('roomId', room.id);
      expect(res.body).toHaveProperty('userId', user.id);
      expect(res.body).toHaveProperty('role', 'administrator');
    });

    it('renvoie une erreur si userId est manquant', async () => {
      const res = await request(app)
        .post(`/api/room-user/${room.id}/users`)
        .send({
          roomId: room.id,
          // userId manquant
          role: 'member'
        });

      expect([400, 500]).toContain(res.status);
      expect(res.body.error).toBeDefined();
    });

    it('renvoie une erreur si roomId est manquant', async () => {
      const res = await request(app)
        .post(`/api/room-user/${room.id}/users`)
        .send({
          // roomId manquant
          userId: user.id,
          role: 'member'
        });

      expect([400, 500]).toContain(res.status);
      expect(res.body.error).toBeDefined();
    });
  });
});