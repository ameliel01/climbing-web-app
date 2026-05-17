const { RoomUser } = require('../models');

const addUserToRoom = async (req, res) => {
  // #swagger.tags = ['RoomUser']
  // #swagger.summary = 'Add a user to a room'
  try {
    const { roomId, userId, role } = req.body;

    const newLink = await RoomUser.create({ roomId, userId, role });
    res.status(201).json(newLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible d’ajouter l’utilisateur à la room' });
  }
};

module.exports = { addUserToRoom };
