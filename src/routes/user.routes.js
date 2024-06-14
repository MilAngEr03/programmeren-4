const express = require('express')
const assert = require('assert')
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')

// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

// Userroutes
router.post('/api/user', userController.create)
router.get('/api/user', userController.getAll)
router.get('/api/user/profile', userController.getProfile)
router.get('/api/user/:userId', userController.getById)
router.put('/api/user/:userId', userController.update)

// Tijdelijke routes om niet bestaande routes op te vangen
router.delete('/api/user/:userId', notFound)

module.exports = router