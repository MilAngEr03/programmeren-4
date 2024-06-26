const logger = require('../util/logger');
const database = require('../dao/mysql-db');
const { create, getActive } = require('../controllers/user.controller');
const bcrypt = require('bcrypt');

const validFields = ['firstName', 'lastName', 'emailAdress', 'password', 'isActive', 'street', 'city', 'phoneNumber', 'roles'];

const userService = {
    create: (user, callback) => {
        logger.info('create user', user.firstName, user.lastName);
    
        const requiredFields = ['firstName', 'lastName', 'emailAdress', 'password', 'isActive', 'street', 'city', 'phoneNumber', 'roles'];
        const missingFields = requiredFields.filter(field => !user[field]);
    
        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
            logger.error(errorMessage);
            callback(new Error(errorMessage), null);
            return;
        }
    
        bcrypt.hash(user.password, 10, (err, hashedPassword) => {
            if (err) {
                logger.error('Error hashing password:', err);
                callback(err, null);
                return;
            }

            user.password = hashedPassword;
    
            database.getConnection((err, connection) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                    return;
                }
    
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
                    rolesString
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
                            data: { user }
                        });
                    }
                });
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

    getAllActive: (isActive, callback) => {
        logger.info(`getAllActive where isActive = ${isActive}`);
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
            connection.query('SELECT id, firstName, lastName FROM `user` WHERE isActive = ?', [isActive], (error, results) => {
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
    
    getByCriteria: (criteria, callback) => {
        logger.info('getByCriteria', criteria);
        database.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            // Validate criteria fields
            const invalidFields = Object.keys(criteria).filter(field => !validFields.includes(field));
            if (invalidFields.length > 0) {
                logger.warn('Invalid search criteria fields:', invalidFields);
                return callback(null, {
                    message: 'No users found due to invalid search criteria.',
                    data: []
                });
            }

            let query = 'SELECT id, firstName, lastName FROM `user` WHERE 1=1';
            const values = [];
            Object.keys(criteria).forEach(key => {
                query += ` AND ${key} = ?`;
                values.push(criteria[key]);
            });

            connection.query(query, values, (error, results) => {
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

    update: (userId, creatorId, user, callback) => {
        userId = parseInt(userId);
        logger.info('update user', userId, user);
    
        if (!userId) {
            const error = new Error('Invalid userId');
            logger.error(error.message);
            callback(error, null);
            return;
        }

        logger.debug('Comparing userId and creatorId', { userId, creatorId });

        if (userId === creatorId) {
            logger.debug('UserId matches CreatorId, proceeding with update');
            const updateUser = () => {
                database.getConnection((err, connection) => {
                    if (err) {
                        logger.error('Database connection error', err);
                        callback(err, null);
                        return;
                    }
            
                    const rolesString = user.roles.join(',');

                    logger.debug('Roles string:', rolesString);

                    const query = 'UPDATE `user` SET firstName = ?, lastName = ?, emailAdress = ?, password = ?, isActive = ?, street = ?, city = ?, phoneNumber = ?, roles = ? WHERE id = ?';
            
                    const values = [
                        user.firstName, user.lastName, user.emailAdress, user.password, 
                        user.isActive, user.street, user.city, user.phoneNumber, rolesString, 
                        userId
                    ];

                    logger.debug('Query:', query);
                    logger.debug('Values:', values);

                    connection.query(query, values, (error, results) => {
                        connection.release();
            
                        if (error) {
                            logger.error('Query execution error', error);
                            callback(error, null);
                        } else {
                            logger.debug('Query results', results);
                            callback(null, {
                                message: `Updated ${results.affectedRows} user.`,
                                data: { user }
                            });
                        }
                    });
                });
            };
        
            if (user.password) {
                bcrypt.hash(user.password, 10, (err, hashedPassword) => {
                    if (err) {
                        logger.error('Error hashing password:', err);
                        callback(err, null);
                        return;
                    }
                    user.password = hashedPassword;
                    updateUser();
                });
            } else {
                updateUser();
            }
        } else {
            const error = new Error('Unauthorized');
            logger.error('Unauthorized: UserId does not match CreatorId', { userId, creatorId });
            callback(error, null);
        }
    },

    delete : (userId, creatorId, callback) => {
        userId = parseInt(userId);

        if (!userId) {
            const error = new Error('Invalid userId');
            logger.error(error.message);
            callback(error, null);
            return;
        }
        if (userId === creatorId) {
            logger.info('delete user', userId);
            database.getConnection((err, connection) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                    return;
                }

                connection.query('DELETE FROM `user` WHERE id = ?', [userId], (error, results) => {
                    connection.release();
                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    } else {
                        logger.debug(results);
                        callback(null, {
                            message: `Deleted ${results.affectedRows} user.`,
                            data: { message: `Deleted user with userId ${userId}` }
                        });
                    }
                });
            });
        } else {
            const error = new Error('Unauthorized');
            logger.error('Unauthorized: UserId does not match CreatorId', { userId, creatorId });
            callback(error, null);
        }
    },
};

module.exports = userService;
