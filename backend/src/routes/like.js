const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like');

// Auth middleware nécessaire ici
router.post('/like/:user_id/:post_id', likeController.likePost);
router.delete('/like/:user_id/:post_id', likeController.unlikePost);
router.get('/like/:user_id/:post_id/status', likeController.isLiked);
router.get('/like/:post_id/count', likeController.countLikes);

module.exports = router;
