const express = require('express');
const urlRoutes = express.Router();

const { userRegistrationValidation, userLoginValidation, validate, authenticate, authenticateAdmin } = require('../middleware/user.validator');

const controller = require('../controllers/user.controller');

urlRoutes.post('/', userRegistrationValidation(), validate, controller.create);
urlRoutes.post('/verified', userRegistrationValidation(), [authenticateAdmin, validate], controller.createVerified);
urlRoutes.get('/', authenticateAdmin, controller.getAll);
urlRoutes.post('/sendVerification', controller.sendVerification);
urlRoutes.post('/verify', controller.verify);
urlRoutes.post('/login', userLoginValidation(), validate, controller.login);
urlRoutes.get('/logout', authenticate, controller.logout);
urlRoutes.get('/authenticated', authenticate, controller.getAuth);
urlRoutes.put('/:id', authenticateAdmin, controller.updateById);
urlRoutes.delete('/:id', authenticateAdmin, controller.softDelete);

module.exports = urlRoutes;