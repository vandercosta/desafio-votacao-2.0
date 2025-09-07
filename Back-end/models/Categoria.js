const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nome: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('Categoria', categoriaSchema);
