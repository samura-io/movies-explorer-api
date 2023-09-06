const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
// const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const INTERNAL_SERVER_ERROR = 500;
const { PORT = 3000 } = process.env;
const { NODE_ENV, DB_IP } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DB_IP : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const app = express();
// app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.disable('x-powered-by');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://samura.io.nomoredomainsicu.ru',
    'http://samura.io.nomoredomainsicu.ru'
  ],
  credentials: true,
};


app.use(cors(corsOptions));

app.use(requestLogger);
app.use('/', router);

app.use(errorLogger);
app.use('/', errors());
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Simon Says: 'Listen server on ${PORT} port'`);
});
