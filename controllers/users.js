const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const validationError = require('mongoose').Error.ValidationError;
const userSchema = require('../model/user');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  userSchema.findById(req.user._id).select('-password')
    .then((data) => res.send(data))
    .catch((err) => next(err));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      userSchema.create({
        email,
        password: hash,
        name,
      })
        .then((data) => {
          const userWithoutPassword = data.toObject();
          delete userWithoutPassword.password;
          res.send({ data: userWithoutPassword });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict('Пользователь с данным Email`ом существует'));
          }
          if (err instanceof validationError) {
            next(new BadRequest('Переданы некорректные данные при регистрации'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  userSchema.findUserByCreditails(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ jwt: token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.signout = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: 'Выход' });
  } catch (err) {
    next(err);
  }
};
