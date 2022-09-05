const router = require('express').Router()
const authMiddleware = require('../middlewares/auth.middleware')
const fileController = require('../controllers/file.controller')


router.post('', authMiddleware, fileController.createDir)
router.post('/upload', authMiddleware, fileController.uploadFile)
router.get('', authMiddleware, fileController.getFile)
router.get('/download', authMiddleware, fileController.downloadFile)
router.delete('/', authMiddleware, fileController.deleteFile)


module.exports = router