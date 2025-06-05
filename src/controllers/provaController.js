const { Prova } = require('../models');
const geminiService = require('../services/geminiService');

exports.gerarProva = async (req, res) => {
  try {
    const { tema, nivel, categoria, quantidadeQuestoes = 5, linguaAngolana } = req.body;
    
    if (!tema || !nivel || !categoria || !linguaAngolana) {
      return res.status(400).json({ 
        mensagem: 'Tema, nível, categoria e língua angolana são obrigatórios para gerar uma prova' 
      });
    }
    
    const questoes = await geminiService.gerarQuestoes(tema, quantidadeQuestoes, linguaAngolana);
    
    if (!questoes || questoes.length === 0) {
      return res.status(500).json({ 
        mensagem: 'Não foi possível gerar questões para a prova' 
      });
    }
    
    const novaProva = await Prova.create({
      titulo: `Avaliação sobre ${tema}`,
      descricao: `Prova com ${questoes.length} questões sobre ${tema}`,
      categoria,
      nivel,
      linguaAngolana,
      questoes
    });
      
    res.status(201).json(novaProva);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao gerar prova com IA', 
      erro: error.message 
    });
  }
};

exports.listarProvas = async (req, res) => {
  try {
    const { categoria, nivel, linguaAngolana } = req.query;
    let where = {};
    
    if (categoria) where.categoria = categoria;
    if (nivel) where.nivel = nivel;
    if (linguaAngolana) where.linguaAngolana = linguaAngolana;
    
    const provas = await Prova.findAll({ where });
    res.status(200).json(provas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar provas', erro: error.message });
  }
};

exports.obterProva = async (req, res) => {
  try {
    const prova = await Prova.findByPk(req.params.id);
    
    if (!prova) {
      return res.status(404).json({ mensagem: 'Prova não encontrada' });
    }
    
    res.status(200).json(prova);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter prova', erro: error.message });
  }
};

exports.criarProva = async (req, res) => {
  try {
    const novaProva = await Prova.create(req.body);
    res.status(201).json(novaProva);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao criar prova', erro: error.message });
  }
};

exports.atualizarProva = async (req, res) => {
  try {
    const [linhasAtualizadas] = await Prova.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (linhasAtualizadas === 0) {
      return res.status(404).json({ mensagem: 'Prova não encontrada' });
    }
    
    const provaAtualizada = await Prova.findByPk(req.params.id);
    res.status(200).json(provaAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar prova', erro: error.message });
  }
};

exports.excluirProva = async (req, res) => {
  try {
    const linhasExcluidas = await Prova.destroy({
      where: { id: req.params.id }
    });
    
    if (linhasExcluidas === 0) {
      return res.status(404).json({ mensagem: 'Prova não encontrada' });
    }
    
    res.status(200).json({ mensagem: 'Prova excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir prova', erro: error.message });
  }
};

exports.verificarRespostas = async (req, res) => {
  try {
    const { provaId, respostas } = req.body;
    
    if (!provaId || !respostas || !Array.isArray(respostas)) {
      return res.status(400).json({ mensagem: 'Dados inválidos para verificação' });
    }
    
    const prova = await Prova.findByPk(provaId);
    
    if (!prova) {
      return res.status(404).json({ mensagem: 'Prova não encontrada' });
    }
    
    let acertos = 0;
    const resultado = [];
    
    for (let i = 0; i < Math.min(respostas.length, prova.questoes.length); i++) {
      const resposta = respostas[i];
      const questao = prova.questoes[i];
      const correto = resposta === questao.resposta;
      
      if (correto) {
        acertos++;
      }
      
      resultado.push({
        questaoIndex: i,
        correto,
        respostaCorreta: questao.resposta
      });
    }
    
    const percentualAcerto = (acertos / prova.questoes.length) * 100;
    
    res.status(200).json({
      acertos,
      total: prova.questoes.length,
      percentualAcerto,
      resultado
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao verificar respostas', erro: error.message });
  }
}; 