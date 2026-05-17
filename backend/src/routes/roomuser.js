const express = require('express');
const router = express.Router();
const { addUserToRoom } = require('../controllers/roomuser');

router.post('/room-user/:roomId/users', addUserToRoom);  // POST /room-users/:roomId/users

module.exports = router;
