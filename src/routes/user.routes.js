const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const assert = require('assert')

const validateUserCreate = (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      emailAdress,
      password,
      isActive,
      street,
      city,
      phoneNumber,
      roles,
    } = req.body

    assertStringCreate(firstName, 'firstName')
    assertStringCreate(lastName, 'lastName')
    assertStringCreate(emailAdress, 'emailAddress')
    assert.ok(
      checkEmailRestrictions(emailAdress),
      'emailAddress should match the pattern'
    )
    assertStringCreate(password, 'password')
    assert.ok(
      checkPasswordRestrictions(password),
      'password should match the pattern'
    )
    assertBooleanCreate(isActive, 'isActive')
    assertStringCreate(street, 'street')
    assertStringCreate(city, 'city')
    assertStringCreate(phoneNumber, 'phoneNumber')
    assert.ok(
      checkPhoneNumberRestrictions(phoneNumber),
      'phoneNumber should match the pattern'
    )

    assert.ok(Array.isArray(roles), 'roles should be an array')

    // Move to the next middleware if validation passes
    next()
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid user data',
      error: err.toString(),
    })
  }
}

const validateUserUpdate = (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      emailAdress,
      password,
      isActive,
      street,
      city,
      phoneNumber,
      roles,
    } = req.body

    assertStringUpdate(firstName, 'firstName')
    assertStringUpdate(lastName, 'lastName')
    assertStringUpdate(emailAdress, 'emailAddress')
    assert.ok(
      checkEmailRestrictions(emailAdress),
      'emailAddress should match the pattern'
    )
    assertStringUpdate(password, 'password')
    assert.ok(
      checkPasswordRestrictions(password),
      'password should match the pattern'
    )
    assertBooleanUpdate(isActive, 'isActive')
    assertStringUpdate(street, 'street')
    assertStringUpdate(city, 'city')
    assertStringUpdate(phoneNumber, 'phoneNumber')
    assert.ok(
      checkPhoneNumberRestrictions(phoneNumber),
      'phoneNumber should match the pattern'
    )

    assert.ok(Array.isArray(roles), 'roles should be an array')

    // Move to the next middleware if validation passes
    next()
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid user data',
      error: err.toString(),
    })
  }
}

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome!',
  })
})

router.get('/api/info', (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Naam: Milan Bollebakker, Studentnummer: 2203725, Beschrijving: Dit is de api voor de"
  })
})

router.post('/api/user', validateUserCreate, userController.addUser)

router.get('/api/user', userController.getAllUsers)

router.get('/api/user/:userId', userController.getUserById)

router.put(
  '/api/user/:userId',
  validateUserUpdate,
  userController.editUserById
)

function assertStringCreate(value, name) {
  assert.ok(value, `${name} should not be empty`)
  assert.strictEqual(typeof value, 'string', `${name} should be a string`)
}

function assertStringUpdate(value, name) {
  assert.strictEqual(typeof value, 'string', `${name} should be a string`)
}

function assertBooleanCreate(value, name) {
  assert.ok(value !== undefined, `${name} should not be empty`)
  assert.strictEqual(typeof value, 'boolean', `${name} should be a boolean`)
}

function assertBooleanUpdate(value, name) {
  assert.strictEqual(typeof value, 'boolean', `${name} should be a boolean`)
}

function checkEmailRestrictions(email) {
  return /^[a-zA-Z]{1}[.]{1}[a-zA-Z]{2,}\@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/.test(email)
}

function checkPasswordRestrictions(password) {
  return /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password)
}

function checkPhoneNumberRestrictions(phoneNumber) {
  return /^06[-\s]?\d{8}$/.test(phoneNumber)
}

router.delete('/api/user/:userId', userController.deleteUserById)

module.exports = router