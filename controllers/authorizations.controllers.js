const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config')

const generateAccessToken =  (id, roles) => {
    const payload = {id,roles}
    return jwt.sign(payload, secret, {expiresIn: '24h'} )
}

const { validationResult } = require('express-validator')
module.exports.authControllers = {
  getUsers: async (req, res) => {
    const user = await User.find()
    res.json(user);
  },
  login: async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})

        if(!user) {
            return res.status(400).json({message: `Пользователь ${username} не найден`})
        }

        const validPassword = bcrypt.compareSync(password, user.password)

        if(!validPassword) {
            return res.status(400).json({message: 'Неверный пароль'})
        }
        const token = generateAccessToken(user._id, user.roles)
        return res.json({token})
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "login failed" });
    }
  },

  registration: async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({ message:'Ошибка при регистрации', errors})
        }
        const { username, password } = req.body;
        const candidate = await User.findOne({ username });
        
        if (candidate) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({value: "USER"})
        const user = new User({ username, password: hashPassword, roles: [userRole.value] });
        await user.save()
  
        return res.json({message: "User has been created successfully"})
  
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: "login failed" });
      }
  },

  create: async (req, res) => {
    const data = await Role.create({
      value: req.body.value,
    });
    res.json(data);
  },
};
