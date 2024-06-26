const { get } = require('../..')
const userService = require('../services/user.service')
const logger = require('../util/logger')

let userController = {
    create: (req, res, next) => {
        const user = req.body
        logger.info('create user', user.firstName, user.lastName)
        userService.create(user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAll: (req, res, next) => {
        const isActive = req.body.isActive;
        const criteria = req.body.criteria || {};
    
        if (isActive !== undefined) {
            logger.trace(`getAll users where isActive = ${isActive}`);
            userService.getAllActive(isActive, (error, success) => {
                if (error) {
                    return next({
                        status: error.status,
                        message: error.message,
                        data: {}
                    });
                }
                if (success) {
                    res.status(200).json({
                        status: 200,
                        message: success.message,
                        data: success.data
                    });
                }
            });
        } else if (Object.keys(criteria).length > 0) {
            logger.trace('getAll users with criteria', criteria);
            userService.getByCriteria(criteria, (error, success) => {
                if (error) {
                    return next({
                        status: error.status,
                        message: error.message,
                        data: {}
                    });
                }
                if (success) {
                    res.status(200).json({
                        status: 200,
                        message: success.message,
                        data: success.data
                    });
                }
            });
        } else {
            logger.trace('getAll');
            userService.getAll((error, success) => {
                if (error) {
                    return next({
                        status: error.status,
                        message: error.message,
                        data: {}
                    });
                }
                if (success) {
                    res.status(200).json({
                        status: 200,
                        message: success.message,
                        data: success.data
                    });
                }
            });
        }
    },

    getById: (req, res, next) => {
        const userId = req.params.userId
        logger.trace('userController: getById', userId)
        userService.getById(userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getProfile: (req, res, next) => {
        const userId = req.userId
        logger.trace('getProfile for userId', userId)
        userService.getProfile(userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    update: (req, res, next) => {
        const userId = req.params.userId;
        const creatorId = req.userId;
        const user = req.body; // Assuming the user data is coming from the request body

        logger.trace('update user', userId);
        logger.trace('creatorId', creatorId);
        logger.trace('user', user)

        userService.update(userId, creatorId, user, (error, success) => {
            if (error) {
                return next({
                    status: 500, // You may want to set a proper error status based on the type of error
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    delete: (req, res, next) => {
        const userId = req.params.userId;
        const creatorId = req.userId;
        logger.trace(`delete user ${userId} if it matches ${creatorId}`);
        userService.delete(userId, creatorId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                });
            }
        });
    }
    // Todo: Implement the delete method
}

module.exports = userController