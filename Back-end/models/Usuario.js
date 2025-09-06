const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  nome: String,
  cpf: Number,
  email: { type: String, unique: true },
  password: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model('Usuario', usuarioSchema);
