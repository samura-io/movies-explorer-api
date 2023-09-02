const jwt = require('jsonwebtoken');
require('dotenv').config();
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new Unauthorized('Необходима авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
