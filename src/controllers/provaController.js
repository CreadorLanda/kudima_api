const Prova = require('../models/provaModel');

exports.listarProvas = async (req, res) => {
  try {
    const { categoria, nivel } = req.query;
    let filtro = {};
    
    if (categoria) filtro.categoria = categoria;
    if (nivel) filtro.nivel = nivel;
    
    const provas = await Prova.find(filtro);
    res.status(200).json(provas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar provas', erro: error.message });
  }
};

exports.obterProva = async (req, res) => {
  try {
    const prova = await Prova.findById(req.params.id);
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
    const novaProva = new Prova(req.body);
    const provaSalva = await novaProva.save();
    res.status(201).json(provaSalva);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao criar prova', erro: error.message });
  }
};

exports.atualizarProva = async (req, res) => {
  try {
    const provaAtualizada = await Prova.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!provaAtualizada) {
      return res.status(404).json({ mensagem: 'Prova não encontrada' });
    }
    
    res.status(200).json(provaAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar prova', erro: error.message });
  }
};

exports.excluirProva = async (req, res) => {
  try {
    const provaExcluida = await Prova.findByIdAndDelete(req.params.id);
    
    if (!provaExcluida) {
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
    
    const prova = await Prova.findById(provaId);
    
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