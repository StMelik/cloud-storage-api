const router = require('express').Router()
const authMiddleware = require('../middlewares/auth.middleware')
const fileController = require('../controllers/file.controller')


router.post('', authMiddleware, fileController.createDir)
router.get('', authMiddleware, fileController.getFile)


module.exports = router