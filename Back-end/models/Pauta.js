const mongoose = require('mongoose');

const pautaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
  dataCriacao: { type: Date, default: Date.now },
  dataExpiracao: { type: Date, required: true },
  votosSim: { type: Number, default: 0 },
  votosNao: { type: Number, default: 0 },
  votaramSim: { type: [String], default: [] }, // lista de CPFs
  votaramNao: { type: [String], default: [] },
});

module.exports = mongoose.model('Pauta', pautaSchema);
