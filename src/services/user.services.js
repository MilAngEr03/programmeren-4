const database = require('../dao/inmem-db')
const logger = require('../utils/logger')

const userService = {
  create: (user, callback) => {
    userService.isEmailUnique(user.emailAdress, (err, isUnique) => {
      const error = handleError(err, logger, 'Error checking email uniqueness')
      if (error) {
        return callback(err, null)
      }

      if (!isUnique) {
        const error = give404Error(userId)
        logger.warn('Email already exists:', user.emailAddress)
        return callback(error, null)
      }

      // Email is unique, proceed to add the user
      database.add(user, (err, data) => {
        const error = handleError(err, logger, 'Error creating user')
        if (error) {
          callback(err, null)
        } else {
          logger.trace(`User created with id ${user.id}`)
          callback(null, {
            message: `User created with id ${user.id}`,
            data: data,
          })
        }
      })
    })
  },

  isEmailUnique: (email, callback) => {
    database.getByEmail(email, (err, user) => {
      const error = handleError(err, logger, 'Error checking email uniqueness')
      if (err) {
        return callback(err, null)
      }

      logger.info('User found by email:', user) // Add this line for debugging

      const isUnique = !user
      callback(null, isUnique)
    })
  },

  getAll: (callback) => {
    logger.info('Get all users')

    database.getAll((err, data) => {
      const error = handleError(err, logger, 'Error getting all users')
      if (error) {
        callback(err, null)
      } else {
        logger.trace('All users returned')
        callback(null, data)
      }
    })
  },

  getById: (userId, callback) => {
    logger.info('Get user by id', userId)

    database.getById(userId, (err, user) => {
      if (err) {
        logger.info('Error getting user by id', err.message || 'Unknown error')
        callback(err, null)
      } else {
        logger.trace(`User with id ${userId} returned`)
        callback(null, user)
      }
    })
  },

  updateUserById: (userId, updatedData, callback) => {
    logger.info('Updating user with ID:', userId)

    // Call the database method to update a user by ID
    database.updateById(userId, updatedData, (err, updatedUser) => {
      const error = handleError(err, logger, userId, 'Error updating user with given ID')
      if (error) {
        return callback(err, null)
      }

      if (!updatedUser) {
        const error = give404Error(userId)
        logger.warn(`No ID ${userId} found for update`)
        return callback(error, null)
      }

      logger.info('User updated:', updatedUser)
      callback(null, updatedUser)
    })
  },

  deleteUserById: (userId, callback) => {
    logger.info(`Deleting user with ID: ${userId}`)
  
    // Call the database method to delete a user by ID
    database.deleteUserById(userId, (err, deletedUser) => {
      const error = handleError(err, logger, userId, 'Error deleting user with given ID')
      if (error) {
        return callback(err, null)
      }
  
      if (!deletedUser) {
        const error = give404Error(userId)
        logger.warn(`No ID ${userId} found for delete`)
        return callback(error, null)
      }
  
      // Deleted user successfully, pass the deleted user data to the callback
      callback(null, deletedUser)
    })
  }
}

function handleError(err, logger, errorMessage) {
  if (err) {
    logger.error(
      errorMessage,
      err.message || 'Unknown error'
    );
    return true;
  }
  return false;
}

function give404Error(userId) {
  return {
    status: 404,
    message: `User with ${userId}not found`,
  }
}

module.exports = userService
