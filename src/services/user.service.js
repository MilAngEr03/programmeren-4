const logger = require('../util/logger');
const database = require('../dao/mysql-db');
const { create } = require('../controllers/user.controller');

const userService = {
    create: (user, callback) => {
        logger.info('create user', user.firstName, user.lastName);
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Assuming user.roles is an array of strings, e.g., ['admin', 'user']
            // Convert the array to a comma-separated string without spaces
            const rolesString = user.roles.join(',');

            const query = 'INSERT INTO `user` (firstName, lastName, emailAdress, password, isActive, street, city, phoneNumber, roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
            const values = [
                user.firstName, 
                user.lastName, 
                user.emailAdress, 
                user.password, 
                user.isActive, 
                user.street, 
                user.city, 
                user.phoneNumber,
                rolesString // Add rolesString to the values array
            ];
    
            connection.query(query, values, (error, results) => {
                connection.release();
                if (error) {
                    logger.error(error);
                    callback(error, null);
                } else {
                    logger.debug(results);
                    callback(null, {
                        message: `Created user with id ${results.insertId}.`,
                        data: {
                            id: results.insertId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            roles: user.roles // Optionally return the roles array as part of the response
                        }
                    });
                }
            });
        });
    },

    getAll: (callback) => {
        logger.info('getAll');
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            connection.query('SELECT id, firstName, lastName FROM `user`', (error, results) => {
                connection.release();
                if (error) {
                    logger.error(error);
                    callback(error, null);
                } else {
                    logger.debug(results);
                    callback(null, {
                        message: `Found ${results.length} users.`,
                        data: results
                    });
                }
            });
        });
    },

    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId);
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            connection.query('SELECT id, firstName, lastName FROM `user` WHERE id = ?', [userId], (error, results) => {
                connection.release();
                if (error) {
                    logger.error(error);
                    callback(error, null);
                } else {
                    logger.debug(results);
                    callback(null, {
                        message: `Found ${results.length} user.`,
                        data: results
                    });
                }
            });
        });
    },

    getById: (userId, callback) => {
        logger.info('getById userId:', userId);
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            connection.query('SELECT id, firstName, lastName FROM `user` WHERE id = ?', [userId], (error, results) => {
                connection.release();
                if (error) {
                    logger.error(error);
                    callback(error, null);
                } else {
                    logger.debug(results);
                    callback(null, {
                        message: `Found ${results.length} user.`,
                        data: results
                    });
                }
            });
        });
    },

    update: (userId, user, callback) => {
        logger.info('update user', userId, user);
    
        if (!userId) {
            const error = new Error('Invalid userId');
            logger.error(error.message);
            callback(error, null);
            return;
        }
    
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Assuming user.roles is an array of strings, e.g., ['admin', 'user']
            // Convert the array to a comma-separated string without spaces
            const rolesString = user.roles.join(',');
    
            const query = 'UPDATE `user` SET firstName = ?, lastName = ?, emailAdress = ?, password = ?, isActive = ?, street = ?, city = ?, phoneNumber = ?, roles = ? WHERE id = ?';
    
            const values = [
                user.firstName, user.lastName, user.emailAdress, user.password, 
                user.isActive, user.street, user.city, user.phoneNumber, rolesString, 
                userId
            ];
    
            connection.query(query, values, (error, results) => {
                connection.release();
    
                if (error) {
                    logger.error(error);
                    callback(error, null);
                } else {
                    logger.debug(results);
                    callback(null, {
                        message: `Updated ${results.affectedRows} user.`,
                        data: results
                    });
                }
            });
        });
    }
};

module.exports = userService;
