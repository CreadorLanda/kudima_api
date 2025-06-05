const { Aula } = require('../models');
const geminiService = require('../services/geminiService');
const { Op } = require('sequelize');

exports.gerarAula = async (req, res) => {
  try {
    const { tema, nivel, categoria } = req.body;
    
    if (!tema || !nivel || !categoria) {
      return res.status(400).json({ 
        mensagem: 'Tema, nível e categoria são obrigatórios para gerar uma aula' 
      });
    }
    
    const aulaGerada = await geminiService.gerarAula(tema, nivel, categoria);
    const novaAula = await Aula.create(aulaGerada);
    
    res.status(201).json(novaAula);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao gerar aula com IA', 
      erro: error.message 
    });
  }
};

exports.listarAulas = async (req, res) => {
  try {
    const { categoria, nivel } = req.query;
    let where = {};
    
    if (categoria) where.categoria = categoria;
    if (nivel) where.nivel = nivel;
    
    const aulas = await Aula.findAll({ where });
    res.status(200).json(aulas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar aulas', erro: error.message });
  }
};

exports.obterAula = async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id);
    
    if (!aula) {
      return res.status(404).json({ mensagem: 'Aula não encontrada' });
    }
    
    res.status(200).json(aula);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter aula', erro: error.message });
  }
};

exports.criarAula = async (req, res) => {
  try {
    const novaAula = await Aula.create(req.body);
    res.status(201).json(novaAula);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao criar aula', erro: error.message });
  }
};

exports.atualizarAula = async (req, res) => {
  try {
    const [linhasAtualizadas] = await Aula.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (linhasAtualizadas === 0) {
      return res.status(404).json({ mensagem: 'Aula não encontrada' });
    }
    
    const aulaAtualizada = await Aula.findByPk(req.params.id);
    res.status(200).json(aulaAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar aula', erro: error.message });
  }
};

exports.excluirAula = async (req, res) => {
  try {
    const linhasExcluidas = await Aula.destroy({
      where: { id: req.params.id }
    });
    
    if (linhasExcluidas === 0) {
      return res.status(404).json({ mensagem: 'Aula não encontrada' });
    }
    
    res.status(200).json({ mensagem: 'Aula excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir aula', erro: error.message });
  }
};

exports.buscarAulas = async (req, res) => {
  try {
    const { termo } = req.query;
    
    if (!termo) {
      return res.status(400).json({ mensagem: 'Termo de busca não fornecido' });
    }
    
    const aulas = await Aula.findAll({
      where: {
        [Op.or]: [
          { titulo: { [Op.like]: `%${termo}%` } },
          { descricao: { [Op.like]: `%${termo}%` } },
          { conteudo: { [Op.like]: `%${termo}%` } }
        ]
      }
    });
    
    res.status(200).json(aulas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar aulas', erro: error.message });
  }
}; 