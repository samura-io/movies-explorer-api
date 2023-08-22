const userRouter = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validationUserInfo } = require('../middlewares/validation');

userRouter.use('/users/', auth);
userRouter.get('/users/me', getUserInfo);
userRouter.patch('/users/me', validationUserInfo, updateUserInfo);

module.exports = userRouter;
