const { sequelize } = require('../config/db');
const Usuario = require('./usuarioModel');
const Aula = require('./aulaModel');
const Prova = require('./provaModel');

// Definir associações aqui, se necessário

const sincronizarModelos = async () => {
  try {
    // Sincroniza os modelos com o banco de dados
    // Use { force: true } para recriar as tabelas (cuidado, isso apaga os dados existentes)
    await sequelize.sync();
    console.log('Modelos sincronizados com o banco de dados MySQL');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error.message);
  }
};

module.exports = {
  Usuario,
  Aula,
  Prova,
  sequelize,
  sincronizarModelos
}; 