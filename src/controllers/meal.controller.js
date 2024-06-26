// 
// Authentication controller
//

const mealService = require('../services/meal.service');
const logger = require('../util/logger');
const userService = require('../services/user.service');
const { update, getAll } = require('./user.controller');
const { get } = require('../..');

let mealController = {
    create: (req, res, next) => {
        const meal = req.body;
        const userId = req.userId;

        logger.info('create meal', meal.name);
        mealService.create(meal, userId, (error, success) => {
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
    },

    update: (req, res, next) => {
        const meal = req.body;
        const mealId = req.params.mealId;
        const userId = req.userId;

        logger.info('update meal', mealId, userId);
        mealService.update(meal, mealId, userId, (error, success) => {
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
    },

    getAll: (req, res, next) => {
        logger.info('get all meals');
        mealService.getAll((error, success) => {
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
    },
};

module.exports = mealController;