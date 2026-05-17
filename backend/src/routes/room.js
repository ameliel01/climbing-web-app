const express = require('express');
const router = express.Router();
const { createRoom, getRooms ,deleteRoom, updateRoomName} = require('../controllers/room');

router.post('/room', createRoom);      // POST /rooms
router.get('/room/:user_id', getRooms);         // GET /rooms
router.delete('/room/:room_id', deleteRoom); 
router.put('/room/:room_id', updateRoomName);

module.exports = router;
