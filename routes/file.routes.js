const router = require('express').Router()
const fileController = require('../controllers/file.controller')

router.post('', fileController.createDir)
router.post('/upload', fileController.uploadFile)
router.post('/avatar', fileController.uploadAvatar)
router.get('', fileController.getFile)
router.get('/download', fileController.downloadFile)
router.get('/search', fileController.searchFile)
router.delete('/', fileController.deleteFile)
router.delete('/avatar', fileController.deleteAvatar)

module.exports = router
