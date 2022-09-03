const router = require('express').Router()
const { registration, login } = require('../controllers/user.controller')
const { vlaidatorRegistration } = require('../utils/validation')

router.post('/sign-up', vlaidatorRegistration, registration)
router.post('/sign-in', login)

module.exports = router