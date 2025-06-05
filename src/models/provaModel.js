const mongoose = require('mongoose');

const questaoSchema = new mongoose.Schema({
  pergunta: {
    type: String,
    required: true
  },
  opcoes: {
    type: [String],
    required: true
  },
  resposta: {
    type: Number,
    required: true
  }
});

const provaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  nivel: {
    type: String,
    enum: ['iniciante', 'intermediário', 'avançado'],
    required: true
  },
  questoes: [questaoSchema],
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prova', provaSchema); 