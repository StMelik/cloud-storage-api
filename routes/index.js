const router = require('express').Router()
const authRoutes = require('./auth.routes')
const fileRoutes = require('./file.routes')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authRoutes)
router.use('/files', authMiddleware, fileRoutes)

module.exports = router
