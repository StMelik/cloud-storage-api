const User = require('../models/User')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const fileService = require('../services/fileService')
const File = require('../models/File')

const registration = async (req, res) => {
    try {
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

        await fileService.createDir(req, new File({ user: user.id, name: '' }))

        return res.json({ message: 'Пользователь создан' })
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Неверный логин или пароль' })
        }

        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid) {
            return res
                .status(400)
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
        console.log(e);
        res.send({ message: 'Server error' })
    }
}

const auth = async (req, res) => {
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
        console.log(e);
        res.send({ message: 'Server error' })
    }
}

module.exports = {
    registration,
    login,
    auth,
}