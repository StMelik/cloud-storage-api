const router = require('express').Router()
const { registration, login, auth } = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { vlaidatorRegistration } = require('../utils/validation')

router.post('/sign-up', vlaidatorRegistration, registration)
router.post('/sign-in', login)
router.get('/auth', authMiddleware, auth)

module.exports = router