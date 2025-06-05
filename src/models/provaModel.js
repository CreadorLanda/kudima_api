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
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel: {
    type: DataTypes.ENUM('iniciante', 'intermediário', 'avançado'),
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