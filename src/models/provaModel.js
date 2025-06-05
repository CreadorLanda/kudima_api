const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Prova = sequelize.define('Prova', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoria: {
    type: DataTypes.ENUM(
      'Gramática',
      'Vocabulário',
      'Conversação',
      'Cultura',
      'Expressões',
      'Compreensão'
    ),
    allowNull: false
  },
  nivel: {
    type: DataTypes.ENUM('iniciante', 'intermediário', 'avançado'),
    allowNull: false
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
  },
  questoes: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('questoes');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('questoes', JSON.stringify(value));
    },
    defaultValue: '[]'
  }
}, {
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao'
});

module.exports = Prova; 