const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'invalid Email'],
    unique: true,
  },
  password: {
    type: String,
    select: true,
    required: true,
    minlenght: 6,
  },
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlenght: 30,
  },
});

userSchema.statics.findUserByCreditails = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильный email или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
