const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['estudante', 'professor', 'admin'],
    default: 'estudante'
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  progresso: {
    aulasCompletas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aula' }],
    provasRealizadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prova' }]
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema); 