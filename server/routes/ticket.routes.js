const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/ticket.controller');

const { authenticate } = require('../middleware/user.validator');

urlRoutes.post('/', authenticate, controller.create);
urlRoutes.get('/', authenticate, controller.getAll);
urlRoutes.get('/:id', authenticate, controller.getById);
urlRoutes.put('/:id', authenticate, controller.updateById);
urlRoutes.delete('/:id', authenticate, controller.softDelete);

module.exports = urlRoutes;