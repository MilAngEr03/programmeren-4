const express = require('express')
const assert = require('assert')
// const chai = require('chai')
// chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller')
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

router.post('/', validateToken, mealController.create)
router.put('/:mealId', validateToken, mealController.update)
router.get('/', mealController.getAll)
router.get('/:mealId', mealController.getById)
router.delete('/:mealId', validateToken, mealController.delete)

// Alle niet bestaande routes worden afgevangen
router.all('*', notFound);

module.exports = router