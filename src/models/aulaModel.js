const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Aula = sequelize.define('Aula', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  nivel: {
    type: DataTypes.ENUM('iniciante', 'intermediário', 'avançado'),
    allowNull: false
  },
  categoria: {
    type: DataTypes.ENUM(
      'Umbundu', 
      'Kimbundu', 
      'Kikongo', 
      'Chokwe', 
      'Nganguela', 
      'Kwanyama', 
      'Fiote', 
      'Mbunda', 
      'Nhaneca-Humbe', 
      'Luvale', 
      'Mucubal',
      'Gramática',
      'Vocabulário',
      'Conversação',
      'Cultura',
      'Expressões'
    ),
    allowNull: false
  },
  recursos: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('recursos');
      return value ? JSON.parse(value) : {
        videos: [],
        audios: [],
        documentos: []
      };
    },
    set(value) {
      this.setDataValue('recursos', JSON.stringify(value));
    },
    defaultValue: '{"videos":[],"audios":[],"documentos":[]}'
  },
  linguaAngolana: {
    type: DataTypes.ENUM(
      'Umbundu', 
      'Kimbundu', 
      'Kikongo', 
      'Chokwe', 
      'Nganguela', 
      'Kwanyama', 
      'Fiote', 
      'Mbunda', 
      'Nhaneca-Humbe', 
      'Luvale', 
      'Mucubal'
    ),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao'
});

module.exports = Aula; 