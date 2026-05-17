const status = require('http-status');
const friendshipModel = require('../models/friendship.js');
const CodeError = require('../util/CodeError.js');
const { Op } = require('sequelize');

module.exports = {

  async getFriendship(req, res) {
      // GET /friendship/:user_id
   /**
   * #swagger.tags = ['Friendship']
   * #swagger.summary = 'Get all friendships filtered by userId'
   */
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(status.BAD_REQUEST).json({
        status: false,
        message: 'user_id is required in params',
      });
    }

    try {
      const friendships = await friendshipModel.findAll({
        where: {
          [Op.or]: [
            { follower_id: user_id },
            { followed_id: user_id }
          ]
        }
      });

      res.json({
        status: true,
        message: 'Friendships for user retrieved successfully',
        data: friendships,
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error retrieving friendships',
        error: error.message,
      });
    }
  },


  async createFriendship(req, res) {
      // POST /friendship
  /**
   * #swagger.tags = ['Friendship']
   * #swagger.summary = 'Create a new friendship'
   */
    const { follower_id, followed_id } = req.body;

    if (!follower_id || !followed_id) {
      return res.status(status.BAD_REQUEST).json({
        status: false,
        message: 'follower_id and followed_id are required',
      });
    }

    if (follower_id === followed_id) {
      return res.status(status.BAD_REQUEST).json({
        status: false,
        message: 'A user cannot befriend themselves',
      });
    }

    try {
      const [friendship, created] = await friendshipModel.findOrCreate({
        where: { follower_id, followed_id },
        defaults: { status: 'pending' },
      });

      if (!created) {
        return res.status(status.CONFLICT).json({
          status: false,
          message: 'Friendship already exists',
        });
      }

      res.status(status.CREATED).json({
        status: true,
        message: 'Friendship created successfully',
        data: friendship,
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error creating friendship',
        error: error.message,
      });
    }
  },
  async updateFriendship(req, res) {
    
      // PUT /friendship/:id
      /**
       * #swagger.tags = ['Friendship']
       * #swagger.summary = 'Update the status of a friendship'
       */
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!id || !newStatus) {
      return res.status(status.BAD_REQUEST).json({
        status: false,
        message: 'id and status are required',
      });
    }

    if (!['pending', 'accepted', 'rejected', 'blocked'].includes(newStatus)) {
      return res.status(status.BAD_REQUEST).json({
        status: false,
        message: 'Invalid status value',
      });
    }

    try {
      const friendship = await friendshipModel.findByPk(id);

      if (!friendship) {
        return res.status(status.NOT_FOUND).json({
          status: false,
          message: 'Friendship not found',
        });
      }

      await friendship.update({ status: newStatus });

      res.json({
        status: true,
        message: 'Friendship status updated successfully',
        data: friendship,
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error updating friendship',
        error: error.message,
      });
    }
  },

  async deleteFriendship(req, res) {
    // DELETE /friendship/:id
    /**
     * #swagger.tags = ['Friendship']
     * #swagger.summary = 'Delete a friendship by ID'
     */
    const { friendship_id } = req.params;

    if (!friendship_id) {
      return res.status(status.BAD_REQUEST).json({
        status: false,
        message: 'Friendship id is required',
      });
    }

    try {
      const friendship = await friendshipModel.findByPk(friendship_id);

      if (!friendship) {
        return res.status(status.NOT_FOUND).json({
          status: false,
          message: 'Friendship not found',
        });
      }

      await friendship.destroy();

      res.json({
        status: true,
        message: 'Friendship deleted successfully',
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error deleting friendship',
        error: error.message,
      });
    }
  }
};
