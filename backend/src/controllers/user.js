const fetch = require("node-fetch");
const User = require('../models/user.js');

exports.getUsersFromKeycloak = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Get all users or a user by ID'
  try {
    const userId = req.params.user_id; // or req.query.user_id if passed via query
    console.log(userId);

    let usersRes;
    if (userId) {
      // If a user_id is provided → fetch a single user
      usersRes = await User.findOne({ where: { id: userId } });
      if (!usersRes) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } else {
      // Otherwise → fetch all users
      usersRes = await User.findAll();
    }

    // Convert Sequelize instances to plain objects
    const users = Array.isArray(usersRes)
      ? usersRes.map(user => user.toJSON())
      : usersRes.toJSON();

    res.json(users);
  } catch (err) {
    console.error("Erreur récupération user", err);
    res.status(500).json({ message: "Erreur récupération user" });
  }
};
