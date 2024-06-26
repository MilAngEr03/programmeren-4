const logger = require('../util/logger');
const database = require('../dao/mysql-db');

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
}

module.exports = mealService;