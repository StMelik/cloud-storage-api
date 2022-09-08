const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { vlaidatorRegistration } = require('../utils/validation')

router.post('/sign-up', vlaidatorRegistration, userController.registration)
router.post('/sign-in', userController.login)
router.get('/auth', authMiddleware, userController.auth)

module.exports = router
