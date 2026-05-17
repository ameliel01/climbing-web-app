
const express = require('express');
const router = express.Router({ mergeParams: true });
const postController = require('../controllers/post');

router.post('/post', postController.createPost);
router.get('/post', postController.getAllPosts);
router.get('/post/:id', postController.getPostById);
router.put('/post/:id', postController.updatePost);
router.delete('/post/:id', postController.deletePost);

module.exports = router;
