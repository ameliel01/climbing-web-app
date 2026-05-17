const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/message');

router.post('/message', sendMessage);
router.get('/message/room/:roomId', getMessages);

module.exports = router;
