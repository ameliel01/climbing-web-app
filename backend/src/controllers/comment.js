const { Comment, Post } = require('../models');// Assurez-vous que le modèle Post est correctement défini

exports.getCommentsByPost = async (req, res) => {
  // #swagger.tags = ['Comment']
  // #swagger.summary = 'Get all comments for a specific post'
  // #swagger.parameters['postId'] = { description: 'Post ID', type: 'integer', required: true }
    try {
        const postId = req.params.postId;

        const post = await Post.findByPk(postId); 
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = await Comment.findAll({ where: { post_id: postId } }); 
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};
exports.addComment = async (req, res) => {
  // #swagger.tags = ['Comment']
  // #swagger.summary = 'Add a new comment to a post'
  // #swagger.parameters['postId'] = { description: 'Post ID', type: 'integer', required: true }
    try {
      const postId = req.params.postId;
      const { content, author } = req.body;
  
      // Vérifier si le post existe
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      // Créer et sauvegarder le commentaire (Sequelize)
      const newComment = await Comment.create({
        post_id: postId,
        content,
        user_id:author
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
    }
  };
  