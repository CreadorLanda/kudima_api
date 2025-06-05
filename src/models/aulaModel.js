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
    type: DataTypes.STRING,
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
  }
}, {
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao'
});

module.exports = Aula; 