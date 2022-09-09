const fileService = require('../services/fileService')
const User = require('../models/User')
const File = require('../models/File')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

class FileController {
    async createDir(req, res) {
        try {
            const { name, type, parent } = req.body
            const file = new File({ name, type, parent, user: req.user.id })
            const parentFile = await File.findById(parent)

            if (!parentFile) {
                file.path = file.name
                await fileService.createDir(req, file)
            } else {
                file.path = path.join(parentFile.path, file.name)
                await fileService.createDir(req, file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }

            await file.save()

            return res.status(201).json(file)

        } catch (e) {
            return res.status(500).json({ message: "Ошибка при создании папки", e })
        }
    }

    async getFile(req, res) {
        try {
            const { sort } = req.query
            let files

            switch (sort) {
                case 'name':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 })
                    break
                case 'type':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: 1 })
                    break
                case 'date':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: 1 })
                    break
                default:
                    files = await File.find({ user: req.user.id, parent: req.query.parent })
            }

            return res.json(files)

        } catch (e) {
            return res.status(500).json({ message: "Ошибка при получении файлов", e })
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file
            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })
            const user = await User.findById(req.user.id)

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(409).json({ message: 'Недостаточно места на диске' })
            }

            user.usedSpace += file.size

            let filePath;

            if (parent) {
                filePath = path.join(req.filePath, String(user._id), parent.path, file.name)
            } else {
                filePath = path.join(req.filePath, String(user._id), file.name)
            }

            if (fs.existsSync(filePath)) {
                return res.status(409).json({ message: 'Такой файл уже существует' })
            }

            file.mv(filePath)

            const type = file.name.split('.').pop()

            let filePathDb = file.name
            if (parent) {
                filePathDb = path.join(parent.path, file.name)
            }

            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePathDb,
                parent: parent ? parent._id : null,
                user: user._id,
            })

            await dbFile.save()
            await user.save()

            res.status(201).json(dbFile)

        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при загрузке файла', e })
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })
            const filePath = fileService.getPath(req, file)

            if (fs.existsSync(filePath)) {
                return res.download(filePath, file.name)
            }

        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при скачивании файла', e })
        }
    }

    async deleteFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })
            if (!file) {
                return res.status(410).json({ message: 'Файл не существует' })
            }

            const user = await User.findById(req.user.id)
            user.usedSpace -= file.size
            await user.save()

            fileService.deleteFile(req, file)
            await file.remove()

            return res.json({ message: 'Файл был удален' })
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при удалении файла. В папке есть файлы', e })
        }
    }

    async searchFile(req, res) {
        try {
            const searchQuery = req.query.search
            let files = await File.find({ user: req.user.id })

            files = files.filter(file => file.name.includes(searchQuery))

            return res.json(files)
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при поиске файлов', e })
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file
            const user = await User.findById(req.user.id)
            const avatarName = uuid.v4() + '.jpg'

            const pathStatic = path.resolve(__dirname, '..', 'static')

            if (!fs.existsSync(pathStatic)) {
                fs.mkdirSync(pathStatic)
            }

            file.mv(path.join(pathStatic, avatarName))

            user.avatar = avatarName
            await user.save()

            return res.status(201).json(user)
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при загрузке аватара', e })
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findById(req.user.id)

            fs.unlinkSync(path.resolve(__dirname, '..', 'static', user.avatar))
            user.avatar = null

            await user.save()

            return res.json(user)
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при удалении аватара', e })
        }
    }
}

module.exports = new FileController()
