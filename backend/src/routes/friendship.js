const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendship.js');


// Route pour récupérer toutes les routes ou filtrer par userId
router.get('/friendship/:user_id', friendshipController.getFriendship);
router.post('/friendship', friendshipController.createFriendship);
router.delete('/friendship/:friendship_id', friendshipController.deleteFriendship);
router.put('/friendship', friendshipController.updateFriendship);

module.exports = router;

