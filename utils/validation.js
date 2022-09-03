
const { check } = require('express-validator')

const vlaidatorRegistration = [
    check('email', "Некоректный E-mail").isEmail(),
    check('password', 'Пароль должен быль от 3 до 12 символов').isLength({ min: 3, max: 12 })
]

module.exports = {
    vlaidatorRegistration
}