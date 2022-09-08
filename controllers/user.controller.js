const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const fileService = require('../services/fileService')
const File = require('../models/File')

class UserController {
    async registration(req, res) {
        try {
            // Валидация
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Не удалось зарегестрироваться.', errors })
            }

            const { email, password } = req.body

            const candidate = await User.findOne({ email })
            if (candidate) {
                return res
                    .status(400)
                    .json({ message: 'Такой пользователь уже существует' })
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ email, password: hashPassword })

            // Создать папку "files" если нету
            if (!fs.existsSync(req.filePath)) {
                fs.mkdirSync(req.filePath)
            }

            await fileService.createDir(req, new File({ user: user._id, name: '' }))

            return res.status(201).json({ message: 'Пользователь создан' })
        } catch (e) {
            res.status(500).send({ message: 'Ошибка регистрации', e })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Неверный логин или пароль' })
            }

            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res
                    .status(404)
                    .json({ message: 'Неверный логин или пароль' })
            }

            const token = jwt.sign(
                { id: user.id },
                config.get('secretKey'),
                { expiresIn: "1d" }
            )

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })

        } catch (e) {
            res.status(500).send({ message: 'Ошибка входа', e })
        }
    }

    async auth(req, res) {
        try {
            const user = await User.findById(req.user.id)
            const token = jwt.sign(
                { id: user.id },
                config.get('secretKey'),
                { expiresIn: "1d" }
            )

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })

        } catch (e) {
            res.status(500).send({ message: 'Ошибка авторизации', e })
        }
    }
}

module.exports = new UserController()
