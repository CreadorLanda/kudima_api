require('dotenv').config({ path: '../../.env' });
const geminiService = require('../services/geminiService');

async function testarGeracaoAula() {
  try {
    console.log('Gerando aula com IA...');
    const aula = await geminiService.gerarAula(
      'História de Angola', 
      'intermediário',
      'História'
    );
    
    console.log('Aula gerada com sucesso:');
    console.log('Título:', aula.titulo);
    console.log('Descrição:', aula.descricao.substring(0, 150) + '...');
    console.log('Conteúdo (primeiros 200 caracteres):', aula.conteudo.substring(0, 200) + '...');
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

testarGeracaoAula(); 