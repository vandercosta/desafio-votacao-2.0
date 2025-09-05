const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: String,
  cpf: Number,
  email: String,
  password: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model('Usuario', usuarioSchema);
