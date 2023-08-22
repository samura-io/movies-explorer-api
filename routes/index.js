const router = require('express').Router();
const NotFound = require('../errors/NotFound');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login, signout } = require('../controllers/users');
const { validationEmailAndPassword } = require('../middlewares/validation');

router.post('/signup', validationEmailAndPassword, createUser);
router.post('/signin', validationEmailAndPassword, login);
router.get('/signout', signout);
router.use(userRouter);
router.use(moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена либо неверный тип запроса'));
});

module.exports = router;
