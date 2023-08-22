const moviesRouter = require('express').Router();
const { getMovies, setMovie, deleteMovie } = require('../controllers/movies');
const auth = require('../middlewares/auth');
const { validationMovieInfo, validationCardId } = require('../middlewares/validation');

moviesRouter.use('/movies/', auth);
moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validationMovieInfo, setMovie);
moviesRouter.delete('/movies/:movieId', validationCardId, deleteMovie);

module.exports = moviesRouter;
