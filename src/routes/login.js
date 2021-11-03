const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

const { isLoggedIn, isNotLoggedIn } = require('../helpers/auth')

router.get('/', isNotLoggedIn, authController.renderLogin)

router.post('/login', isNotLoggedIn, authController.signin)

router.get('/logout', isLoggedIn, authController.logout)


module.exports = router