require('dotenv').config();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/turnos-reservas';

module.exports = {
  PORT,
  MONGO_URI
};
