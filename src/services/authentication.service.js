//
// Authentication controller
//
const jwt = require('jsonwebtoken')
const db = require('../dao/mysql-db')
// const validateEmail = require('../util/emailvalidator')
const logger = require('../util/logger')
const jwtSecretKey = require('../util/config').secretkey
const bcrypt = require('bcrypt')

const authController = {
    login: (userCredentials, callback) => {
        logger.debug('login');

        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err.message, null);
            }
            if (connection) {
                // Check if the user account exists
                connection.query(
                    'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?',
                    [userCredentials.emailAdress],
                    (err, rows, fields) => {
                        connection.release();
                        if (err) {
                            logger.error('Error: ', err.toString());
                            callback(err.message, null);
                        }
                        if (rows && rows.length === 1) {
                            const user = rows[0];
                            // Compare the provided password with the stored hashed password
                            bcrypt.compare(userCredentials.password, user.password, (err, result) => {
                                if (err) {
                                    logger.error('Error: ', err.toString());
                                    callback(err.message, null);
                                }
                                if (result) {
                                    logger.debug('passwords DID match, sending userinfo and valid token');
                                    const { password, ...userinfo } = user;
                                    const payload = { userId: userinfo.id };

                                    jwt.sign(
                                        payload,
                                        jwtSecretKey,
                                        { expiresIn: '12d' },
                                        (err, token) => {
                                            if (err) {
                                                logger.error('Error signing token: ', err.toString());
                                                callback(err.message, null);
                                            }
                                            logger.info('User logged in, sending: ', userinfo);
                                            callback(null, {
                                                status: 200,
                                                message: 'User logged in',
                                                data: { ...userinfo, token }
                                            });
                                        }
                                    );
                                } else {
                                    logger.debug('User not found or password invalid');
                                    callback({
                                        status: 409,
                                        message: 'User not found or password invalid',
                                        data: {}
                                    }, null);
                                }
                            });
                        } else {
                            callback({
                                status: 409,
                                message: 'User not found or password invalid',
                                data: {}
                            }, null);
                        }
                    }
                );
            }
        });
    },

    login2: (req, res, next) => {
        db.getConnection((err, connection) => {
            if (err) {
                logger.error('Error getting connection from dbconnection');
                return next({
                    status: 500,
                    message: err.message,
                    data: {}
                });
            }
            if (connection) {
                // Check if the user account exists
                connection.query(
                    'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?',
                    [req.body.emailAdress],
                    (err, rows, fields) => {
                        connection.release();
                        if (err) {
                            logger.error('Error: ', err.toString());
                            return next({
                                status: 500,
                                message: err.message,
                                data: {}
                            });
                        }
                        if (rows && rows.length === 1) {
                            const user = rows[0];
                            // Compare the provided password with the stored hashed password
                            bcrypt.compare(req.body.password, user.password, (err, result) => {
                                if (err) {
                                    logger.error('Error: ', err.toString());
                                    return next({
                                        status: 500,
                                        message: err.message,
                                        data: {}
                                    });
                                }
                                if (result) {
                                    logger.info('passwords DID match, sending userinfo and valid token');
                                    const { password, ...userinfo } = user;
                                    const payload = { userId: userinfo.id };

                                    jwt.sign(
                                        payload,
                                        jwtSecretKey,
                                        { expiresIn: '12d' },
                                        (err, token) => {
                                            if (err) {
                                                logger.error('Error signing token: ', err.toString());
                                                return next({
                                                    status: 500,
                                                    message: err.message,
                                                    data: {}
                                                });
                                            }
                                            logger.debug('User logged in, sending: ', userinfo);
                                            res.status(200).json({
                                                statusCode: 200,
                                                results: { ...userinfo, token }
                                            });
                                        }
                                    );
                                } else {
                                    logger.info('User not found or password invalid');
                                    return next({
                                        status: 409,
                                        message: 'User not found or password invalid',
                                        data: {}
                                    });
                                }
                            });
                        } else {
                            return next({
                                status: 409,
                                message: 'User not found or password invalid',
                                data: {}
                            });
                        }
                    }
                );
            }
        });
    }
};

module.exports = authController;