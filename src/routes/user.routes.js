const express = require('express')
const assert = require('assert')
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')
const { validateToken } = require('../routes/authentication.routes')

// Functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

// Userroutes
router.post('/', userController.create)
router.get('/', validateToken, userController.getAll)
router.get('/profile', validateToken, userController.getProfile)
router.get('/:userId', validateToken, userController.getById)
router.put('/:userId', validateToken, userController.update)
router.delete('/:userId', validateToken, userController.delete)

// Alle niet bestaande routes worden afgevangen
router.all('*', notFound);

module.exports = router