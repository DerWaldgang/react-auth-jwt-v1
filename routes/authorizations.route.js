const Router = require('express')
const { authControllers } = require('../controllers/authorizations.controllers')
const route = new Router()
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

route.get('/users', roleMiddleware(['USER', 'ADMIN']), authControllers.getUsers)
route.post('/registration', [
    check('username','Имя пользователя не может быть пустым.').notEmpty(),
    check('password', 'Пароль не может быть меньше 4 и больше 10 символов.').isLength({min:4, max:10})
],authControllers.registration )
route.post('/login', authControllers.login)
route.post('/create', authControllers.create)


module.exports = route 