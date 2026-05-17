const { Room, User ,RoomUser } = require('../models');
const { Op } = require('sequelize');
const { isUUID } = require('validator');
const createRoom = async (req, res) => {
  // #swagger.tags = ['Room']
  // #swagger.summary = 'Create a new chat room'
  try {
    const { type, name, userIds,admin } = req.body;
    const parsedUserIds = typeof userIds === 'string' ? JSON.parse(userIds).flat() : userIds.flat();

    if (!Array.isArray(parsedUserIds)) {
      return res.status(400).json({ error: 'userIds must be an array' });
    }
    if (!parsedUserIds.every(userId => isUUID(userId))) {
      return res.status(400).json({ error: 'All userIds must be valid UUIDs' });
    }
    if (!['private', 'group'].includes(type)) {
      return res.status(400).json({ error: 'Type de room invalide' });
    }
    const existingRoom = await Room.findOne({ where: { name } });
    if (existingRoom) {
      return res.status(400).json({ error: 'Cette room existe déjà' });
    }
 
    const room = await Room.create({ name, type });
    await RoomUser.bulkCreate(
      parsedUserIds.map(userId => ({
      roomId: room.id,
      userId,
      role: type === 'private' ? null : (userId == admin ? 'administrator' : 'member')
      }))
    );

    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la room' });
  }
};

const getRooms = async (req, res) => {
  // #swagger.tags = ['Room']
  // #swagger.summary = 'Get all rooms for a user'
  const userId = req.params.user_id;

  try {
    const rooms = await Room.findAll({
      include: {
        model: User,
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }
    });

    const formattedRooms = [];

    for (const room of rooms) {
      if (room.name) {
        // Vérifie si l'utilisateur est administrateur de la room
        const admin = await RoomUser.findOne({
          where: { roomId: room.id, role: 'administrator' }
        });

        const isAdministrator = admin && admin.userId == userId;

        formattedRooms.push({
          ...room.toJSON(),
          isAdministrator: !!isAdministrator
        });
        continue;
      }

      const otherUsers = await User.findAll({
        include: {
          model: Room,
          where: { id: room.id },
          through: { attributes: [] }
        },
        where: {
          id: { [Op.ne]: userId }
        },
        attributes: ['username', 'email']
      });

    }

    res.json(formattedRooms);
  } catch (error) {
    console.error('Erreur lors de la récupération des rooms :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des rooms.' });
  }
};

const deleteRoom = async (req, res) => {
  // #swagger.tags = ['Room']
  // #swagger.summary = 'Delete a room by ID'
  const roomId = req.params.room_id;

  try {
    // Vérifier que la room existe
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room non trouvée.' });
    }

    // Supprimer la room (les RoomUser et Messages associés seront supprimés grâce à CASCADE)
    await room.destroy();

    res.status(200).json({ message: 'Room supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la room :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la room.' });
  }
};

const updateRoomName = async (req, res) => {
  // #swagger.tags = ['Room']
  // #swagger.summary = 'Update the name of a room'
  const roomId = req.params.room_id;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Le nouveau nom de la room est requis.' });
  }

  try {
    // Vérifie que la room existe
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room non trouvée.' });
    }

    // Met à jour le nom
    room.name = name.trim();
    await room.save();

    res.status(200).json({ message: 'Nom de la room mis à jour avec succès.', room });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nom de la room :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du nom de la room.' });
  }
};


module.exports = { createRoom, getRooms, deleteRoom, updateRoomName };
