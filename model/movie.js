const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [isURL, 'invalid URL poster image'],
  },
  trailerLink: {
    type: String,
    required: true,
    validate: [isURL, 'invalid URL trailerLink'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [isURL, 'invalid URL thumbnail'],
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    res: 'user',
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
