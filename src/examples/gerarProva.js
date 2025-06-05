require('dotenv').config({ path: '../../.env' });
const geminiService = require('../services/geminiService');

async function testarGeracaoProva() {
  try {
    console.log('Gerando questões com IA...');
    const questoes = await geminiService.gerarQuestoes('História de Angola', 3);
    
    console.log('Questões geradas com sucesso:');
    
    questoes.forEach((questao, index) => {
      console.log(`\nQuestão ${index + 1}: ${questao.pergunta}`);
      
      questao.opcoes.forEach((opcao, i) => {
        console.log(`${i}. ${opcao}`);
      });
      
      console.log(`Resposta correta: ${questao.resposta}`);
    });
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

testarGeracaoProva(); 