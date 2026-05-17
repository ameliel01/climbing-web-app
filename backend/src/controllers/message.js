const Message = require('../models/message.js');
// #swagger.tags = ['Message']
// #swagger.summary = 'Send a new message to a room'
const sendMessage = async (req, res) => {

  const { content, roomId, userId } = req.body;

  if (!content || !roomId || !userId) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const message = await Message.create({ content, roomId, userId });
    res.status(201).json(message);
  } catch (err) {
    console.error('Erreur lors de la création du message :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


const getMessages = async (req, res) => {
  // #swagger.tags = ['Message']
  // #swagger.summary = 'Get all messages from a room'
  const roomId = req.params.roomId;

  try {
    const messages = await Message.findAll({
      where: { roomId },
      include: {
        model: require('../models/user'),
        attributes: ['id', 'username', 'email', 'first_name', 'last_name']
      },
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    console.error('Erreur lors de la récupération des messages :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { sendMessage, getMessages };
