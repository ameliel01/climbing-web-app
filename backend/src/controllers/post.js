const { Post, Route } = require('../models');
const Friendship = require('../models/friendship.js');
exports.createPost = async (req, res) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Create a new post'
    try {
      const { content, route_id } = req.body;
      const user_id = req.params.user_id; 
  
      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }
  
      if (!(route_id || content)) {
        return res.status(400).json({ error: 'content or route_id is required' });
      }
      const newPost = await Post.create({
        content,
        user_id,
        route_id
      });
  
  
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllPosts = async (req, res) => {
  
// #swagger.tags = ['Post']
// #swagger.summary = 'Get all posts from user\'s friends'
    try {
      const user_id = req.params.user_id; 
  
      // Étape 1 : récupérer les IDs des amis
      const friendships = await Friendship.findAll({
        where: { follower_id: user_id },
        attributes: ['followed_id']
      });
  
      const friendIds = friendships.map(f => f.followed_id);
  
      // Étape 2 : récupérer les posts des amis
      const posts = await Post.findAll({
        where: {
          user_id: friendIds // Sequelize convertit automatiquement en IN (...)
        },
        include: [
          {
            model: Route,
            attributes: ['userId','route', 'typeOfRoute', 'cotation','feeling'] 
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(posts
      );
    } catch (error) {
      console.error('Erreur dans getAllPosts:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

  exports.getPostById = async (req, res) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Get a post by ID'
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.updatePost = async (req, res) => {
  
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Update a post by ID'
  try {
    const { id } = req.params;
    const { content, imageUrl, route_id } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.content = content || post.content;
    post.imageUrl = imageUrl || post.imageUrl;
    post.route_id = route_id !== undefined ? route_id : post.route_id;

    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deletePost = async (req, res) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Delete a post by ID'
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.destroy();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
