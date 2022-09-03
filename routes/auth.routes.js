const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

router.post('/sign-up',
    [
        check('email', "Некоректный E-mail").isEmail(),
        check('password', 'Пароль должен быль от 3 до 12 символов').isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {

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

            const hashPassword = await bcrypt.hash(password, 15)
            const user = await User.create({ email, password: hashPassword })

            return res.json({ message: 'Пользователь создан' })

        } catch (e) {
            console.log(e);
            res.send({ message: 'Server error' })
        }

    })

module.exports = router