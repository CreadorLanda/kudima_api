const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('estudante', 'professor', 'admin'),
    defaultValue: 'estudante'
  },
  aulasCompletas: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('aulasCompletas');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('aulasCompletas', JSON.stringify(value));
    },
    defaultValue: '[]'
  },
  provasRealizadas: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('provasRealizadas');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('provasRealizadas', JSON.stringify(value));
    },
    defaultValue: '[]'
  }
}, {
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao'
});

module.exports = Usuario; 