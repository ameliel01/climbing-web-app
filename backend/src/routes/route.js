const express = require('express');
const router = express.Router();
const routesController = require('../controllers/route.js');

// Route pour mettre à jour ou supprimer une route spécifique par son ID
router.put('/routes/:id', routesController.updateRoute);
router.delete('/routes/:id', routesController.deleteRoute);

// Route pour créer une nouvelle route
router.post('/routes', routesController.createRoute);

// Route pour récupérer toutes les routes ou filtrer par userId
router.get('/routes/:user_id', routesController.getRoutes);

module.exports = router;

