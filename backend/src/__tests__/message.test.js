const request = require('supertest');
const app = require('../app');
const { sequelize, Message, User, Room } = require('../models');
const { v4: uuidv4 } = require('uuid');

describe('Message controller', () => {
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
      name: 'Test Room',
      type: 'private' // ou la valeur attendue par ton modèle (ex: 'Indoor', 'Outdoor', etc.)
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/message', () => {
    it('crée un message si tous les champs sont présents', async () => {
      const res = await request(app)
        .post('/api/message')
        .send({
          content: 'Hello world',
          roomId: room.id,
          userId: user.id
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({
        content: 'Hello world',
        roomId: room.id,
        userId: user.id
      }));
    });

    it('renvoie 400 si un champ est manquant', async () => {
      const res = await request(app)
        .post('/api/message')
        .send({
          content: '',
          roomId: room.id,
          userId: user.id
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Champs requis manquants');
    });
  });

  describe('GET /api/message/:roomId', () => {
    it('renvoie les messages d\'une room', async () => {
      // Crée un message pour être sûr qu'il y en a au moins un
      await Message.create({
        content: 'Message dans la room',
        roomId: room.id,
        userId: user.id
      });

      const res = await request(app).get(`/api/message/room/${room.id}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('content');
      expect(res.body[0]).toHaveProperty('userId');
      expect(res.body[0]).toHaveProperty('roomId');
    });
  });
});