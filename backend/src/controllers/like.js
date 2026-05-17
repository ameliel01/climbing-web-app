const { Like, Post } = require('../models');

exports.likePost = async (req, res) => {
  // #swagger.tags = ['Like']
  // #swagger.summary = 'Like a post (or restore like if already exists)'
  try {
    const {user_id , post_id } = req.params;
    if((!user_id)||(!post_id)){
      return res.status(400).json({ error: 'user_id and post_id is required' });
    }
    const [like, created] = await Like.findOrCreate({
      where: { user_id, post_id }
    });
  
    if (!created) {
      return res.status(200).json({ message: 'Already liked' });
    }

    res.status(201).json({ message: 'Post liked' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.unlikePost = async (req, res) => {
  
  // #swagger.tags = ['Like']
  // #swagger.summary = 'Unlike a post'
  try {
    const { user_id,post_id } = req.params;
    if((!user_id)||(!post_id)){
      return res.status(400).json({ error: 'user_id and post_id is required' });
    }
    const like = await Like.findOne({ where: { user_id, post_id } });

    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await like.destroy();

    res.json({ message: 'Post unliked' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.isLiked = async (req, res) => {
  
  // #swagger.tags = ['Like']
  // #swagger.summary = 'Check if a post is liked by a user'
  try {
    const {user_id, post_id } = req.params;
    if((!user_id)||(!post_id)){
      return res.status(400).json({ error: 'user_id and post_id is required' });
    }
    const like = await Like.findOne({ where: { user_id, post_id } });

    res.json({ liked: !!like });
  } catch (error) {
    console.error('Error checking like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.countLikes = async (req, res) => {
  
  // #swagger.tags = ['Like']
  // #swagger.summary = 'Get number of likes for a post'
  try {
    const { post_id } = req.params;

    const count = await Like.count({ where: { post_id } });

    res.json({ post_id, likes: count });
  } catch (error) {
    console.error('Error counting likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
