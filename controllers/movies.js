const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const movieSchema = require('../model/movie');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

module.exports.getMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => next(err));
};

module.exports.setMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  movieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequest('Переданны неккоректные данные при добавления фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  movieSchema.findById(movieId)
    .then((data) => {
      if (data === null) {
        return next(new NotFound(`Фильм с указанным id: ${movieId}, не найден`));
      }
      if (!(data.owner.toString() === req.user._id)) {
        return next(new Forbidden('Вы не можете удалять фильмы добавленные другими пользователями'));
      }
      movieSchema.findByIdAndRemove(movieId)
        .then((movie) => {
          if (movie) {
            return res.send({ message: 'Фильм удален' });
          }
        })
        .catch((err) => {
          if (err instanceof castError) {
            next(new BadRequest('Некорректный id фильма'));
          } else { next(err); }
        });
    })
    .catch((err) => {
      next(err);
    });
};
