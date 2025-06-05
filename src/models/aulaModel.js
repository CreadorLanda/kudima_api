const mongoose = require('mongoose');

const aulaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  nivel: {
    type: String,
    enum: ['iniciante', 'intermediário', 'avançado'],
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  recursos: {
    videos: [String],
    audios: [String],
    documentos: [String]
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Aula', aulaSchema); 