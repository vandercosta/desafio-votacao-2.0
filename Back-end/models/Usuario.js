const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model('Usuario', usuarioSchema);
