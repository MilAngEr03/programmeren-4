const logger = require('../util/logger');
const database = require('../dao/mysql-db');
const { get } = require('../..');

let mealService = {
    create: (meal, userId, callback) => {
        logger.info(`Creating meal ${meal.name} for user ${userId}.`);
    
        const requiredFields = ['isActive', 'isVega', 'isVegan', 'isToTakeHome', 'dateTime', 'maxAmountOfParticipants', 'price', 'imageUrl', 'cookId', 'name', 'description']; // Corrected 'maxAmountOfParticipants'
        const missingFields = requiredFields.filter(field => meal[field] === undefined && field !== 'cookId'); // Explicitly check for undefined

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
            logger.error(errorMessage);
            callback(new Error(errorMessage), null);
            return;
        }
    
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Removed the rolesString line as it's not used and 'user' is undefined
    
            const query = 'INSERT INTO `meal` (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageURL, cookId, name, description, allergenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
            const values = [
                meal.isActive,
                meal.isVega,
                meal.isVegan,
                meal.isToTakeHome,
                meal.dateTime,
                meal.maxAmountOfParticipants,
                meal.price,
                meal.imageUrl,
                userId, // Assuming this is the 'cookId'
                meal.name,
                meal.description,
                meal.allergenes
            ];
    
            connection.query(query, values, (error, results) => {
                connection.release();
                if (error) {
                    logger.error(error)
                    callback(error, null)
                } else {
                    logger.debug(results)
                    callback(null, {
                        message: `Created meal with id ${results.insertId}.`,
                        data: { values }
                    })
                }
            })
        })
    },

    update: (meal, mealId, userId, callback) => {
        logger.info(`Updating meal ${mealId}.`);
    
        const requiredFields = ['isActive', 'isVega', 'isVegan', 'isToTakeHome', 'dateTime', 'maxAmountOfParticipants', 'price', 'imageUrl', 'name', 'description']; // Corrected 'maxAmountOfParticipants'
        const missingFields = requiredFields.filter(field => meal[field] === undefined && field !== 'cookId'); // Explicitly check for undefined

        if (meal.cookId === userId) {
            if (missingFields.length > 0) {
                const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
                logger.error(errorMessage);
                callback(new Error(errorMessage), null);
                return;
            }
        
            database.getConnection((err, connection) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                    return;
                }
        
                const query = 'UPDATE `meal` SET isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ?, maxAmountOfParticipants = ?, price = ?, imageURL = ?, name = ?, description = ?, allergenes = ? WHERE id = ?;'
                const values = [
                    meal.isActive,
                    meal.isVega,
                    meal.isVegan,
                    meal.isToTakeHome,
                    meal.dateTime,
                    meal.maxAmountOfParticipants,
                    meal.price,
                    meal.imageUrl,
                    meal.name,
                    meal.description,
                    meal.allergenes,
                    mealId
                ];
        
                connection.query(query, values, (error, results) => {
                    connection.release();
                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Updated meal with id ${mealId}.`,
                            data: { meal }
                        })
                    }
                })
            })
        } else {
            const errorMessage = `You are not the owner of this meal.`;
            logger.error(errorMessage);
            callback(new Error(errorMessage), null);
        }
    },

    getAll: (callback) => {
        logger.info('Getting all meals.');
    
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            const query = 'SELECT * FROM `meal`;';
    
            connection.query(query, (error, results) => {
                connection.release();
                if (error) {
                    logger.error(error)
                    callback(error, null)
                } else {
                    logger.debug(results)
                    callback(null, {
                        message: `Found ${results.length} meals.`,
                        data: results
                    })
                }
            })
        })
    },

    getById: (mealId, callback) => {
        logger.info(`Getting meal with id ${mealId}.`);
    
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            const query = 'SELECT * FROM `meal` WHERE id = ?;';
            const values = [mealId];
    
            connection.query(query, values, (error, results) => {
                connection.release();
                if (error) {
                    logger.error(error)
                    callback(error, null)
                } else {
                    logger.debug(results)
                    callback(null, {
                        message: `Found meal with id ${mealId}.`,
                        data: results[0]
                    })
                }
            })
        })
    },

}

module.exports = mealService;