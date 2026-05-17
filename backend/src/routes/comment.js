const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');

// Auth middleware nécessaire ici
router.get('/comment/:postId', commentController.getCommentsByPost);
router.post('/comment/:postId', commentController.addComment);

module.exports = router;

