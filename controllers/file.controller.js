const fileService = require('../services/fileService')
const User = require('../models/User')
const File = require('../models/File')
const path = require('path')
const fs = require('fs')


class FileController {

    async createDir(req, res) {
        try {

            const { name, type, parent } = req.body
            const file = new File({ name, type, parent, user: req.user.id })
            const parentFile = await File.findById(parent)

            if (!parentFile) {
                file.path = name
                await fileService.createDir(file)
            } else {
                file.path = path.join(parentFile.path, file.name)
                await fileService.createDir(file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }

            await file.save()
            return res.json(file)

        } catch (e) {
            console.log(e);
            return res.status(500).json(e)
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
            console.log(e);
            return res.status(500).json(e)
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file
            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })
            const user = await User.findById(req.user.id)

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({ message: 'Недостаточно места на диске' })
            }

            user.usedSpace += file.size

            let filePath;
            if (parent) {
                filePath = path.resolve('./files', String(user._id), parent.path, file.name)
            } else {
                filePath = path.resolve('./files', String(user._id), file.name)
            }

            if (fs.existsSync(filePath)) {
                return res.status(400).json({ message: 'Такой файл уже существует' })
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
                parent: parent?._id,
                user: user._id,
            })

            await dbFile.save()
            await user.save()

            res.json(dbFile)

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Ошибка при загрузке файла' })
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })
            const filePath = path.resolve('./files', String(req.user.id), file.path)

            if (fs.existsSync(filePath)) {
                return res.download(filePath, file.name)
            }

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Ошибка при скачивании файла' })
        }
    }

    async deleteFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })
            if (!file) {
                return res.status(400).json({ message: 'Файл не существует' })
            }

            fileService.deleteFile(file)
            await file.remove()

            return res.json({ message: 'Файл был удален' })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Ошибка при удалении файла. В папке есть файлы' })
        }
    }
}

module.exports = new FileController()