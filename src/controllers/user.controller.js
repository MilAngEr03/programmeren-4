const userService = require('../services/user.services');
const logger = require('../utils/logger');

const controller = {
  addUser: (req, res, next) => {
    const user = req.body;
    logger.info('Creating user', user.firstName, user.lastName);
    userService.create(user, (err, data) => {
      if (err) {
        return next({ status: err.status || 500, message: err.message || 'Unknown error' });
      }
      res.status(201).json({ status: 201, message: 'User created', data });
    });
  },

  getAllUsers: (req, res, next) => {
    logger.info('Showing all users');
    userService.getAll((err, data) => {
      if (err) {
        return next({ status: 500, message: err.message });
      }
      res.status(200).json({ status: 200, message: 'List of users', data });
    });
  },

  getUserById: (req, res, next) => {
    const userId = parseInt(req.params.userId);
    logger.info('Get user by id', userId);
    userService.getById(userId, (err, user) => {
      if (err) {
        return next({ status: err.status || 500, message: err.message });
      }
      res.status(200).json({ status: 200, message: 'User found', user });
    });
  },

  editUserById: (req, res, next) => {
    const userId = req.params.userId;
    const updatedData = req.body;
    logger.info('Updating user by ID:', userId);
    userService.updateUserById(userId, updatedData, (err, updatedUser) => {
      if (err) {
        logger.error('Error updating user by ID:', err);
        return next({ status: err.status || 404, message: err.message || `User with ID ${userId} not found` });
      }
      res.status(200).json({ status: 200, message: 'User updated', user: updatedUser });
    });
  },

  deleteUserById: (req, res, next) => {
    const userId = parseInt(req.params.userId);
    userService.deleteUserById(userId, (err, deletedUser) => {
      if (err) {
        logger.error('Error deleting user:', err);
        return next({ status: err.status || 404, message: err.message || `User with ID ${userId} not found` });
      }
      res.status(200).json({ status: 200, message: 'User deleted', deletedUser });
    });
  }
};

module.exports = controller;

