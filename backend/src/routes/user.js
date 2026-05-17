const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/users", userController.getUsersFromKeycloak);
router.get('/users/:user_id', userController.getUsersFromKeycloak);
module.exports = router;