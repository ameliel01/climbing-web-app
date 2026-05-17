const status = require('http-status');
const routeModel = require('../models/routes.js');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');

module.exports = {
  async getRoutes(req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Get all routes or filter by userId'
    const { user_id } = req.params; // Récupère user_id depuis l'URL
    if (user_id) {
      const routes = await routeModel.findAll({ where: { userId: user_id } });
      res.json({ status: true, message: 'Routes filtered by userId', data: routes });
    } else {
      const routes = await routeModel.findAll();
      res.json({ status: true, message: 'All routes', data: routes });
    }
  },

  async getRouteById(req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Get a specific route by ID'
    if (!has(req.params, 'id')) throw new CodeError('You must specify the route ID', status.BAD_REQUEST);
    const { id } = req.params;
    const route = await routeModel.findOne({ where: { id } });
    if (!route) throw new CodeError('Route not found', status.NOT_FOUND);
    res.json({ status: true, message: 'Route found', data: route });
  },

  async createRoute(req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Create a new route'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $userId: '123', $date: '2025-04-08', $route: 'Indoor', $typeOfRoute: 'Verticale', $cotation: '6a', $feeling: 'Great!' }}
    if (!has(req.body, ['userId', 'date', 'route', 'typeOfRoute', 'cotation', 'feeling'])) {
      throw new CodeError('You must specify all required fields', status.BAD_REQUEST);
    }
    const { userId, date, route, typeOfRoute, cotation, feeling } = req.body;
    const newRoute = await routeModel.create({ userId, date, route, typeOfRoute, cotation, feeling });
    res.json({ status: true, message: 'Route created', data: newRoute });
  },

  async updateRoute(req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Update an existing route'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $route: 'Outdoor', $typeOfRoute: 'Dévers', $cotation: '7b', $feeling: 'Challenging!' }}
    if (!has(req.params, 'id')) throw new CodeError('You must specify the route ID', status.BAD_REQUEST);
    const { id } = req.params;
    const updates = {};
    for (const field of ['route', 'typeOfRoute', 'cotation', 'feeling']) {
      if (has(req.body, field)) {
        updates[field] = req.body[field];
      }
    }
    if (Object.keys(updates).length === 0) throw new CodeError('You must specify at least one field to update', status.BAD_REQUEST);
    await routeModel.update(updates, { where: { id } });
    res.json({ status: true, message: 'Route updated' });
  },

  async deleteRoute(req, res) {
    // #swagger.tags = ['Routes']
    // #swagger.summary = 'Delete a route'
    if (!has(req.params, 'id')) throw new CodeError('You must specify the route ID', status.BAD_REQUEST);
    const { id } = req.params;
    await routeModel.destroy({ where: { id } });
    res.json({ status: true, message: 'Route deleted' });
  }
};