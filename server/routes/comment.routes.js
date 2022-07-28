const express = require('express');
const urlRoutes = express.Router();

const controller = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/user.validator');

urlRoutes.post('/', authenticate, controller.create);
urlRoutes.put('/:id', authenticate, controller.updateById);
urlRoutes.delete('/:id', authenticate, controller.softDelete);

module.exports = urlRoutes;