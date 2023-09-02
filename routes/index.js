const router = require('express').Router();
const NotFound = require('../errors/NotFound');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login, signout } = require('../controllers/users');
const { validationSignup, validationSignin } = require('../middlewares/validation');

router.post('/signup', validationSignup, createUser);
router.post('/signin', validationSignin, login);
router.get('/signout', auth, signout);
router.use(userRouter);
router.use(moviesRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFound('Страница не найдена либо неверный тип запроса'));
});

module.exports = router;
