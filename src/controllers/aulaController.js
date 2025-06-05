const Aula = require('../models/aulaModel');

exports.listarAulas = async (req, res) => {
  try {
    const { categoria, nivel } = req.query;
    let filtro = {};
    
    if (categoria) filtro.categoria = categoria;
    if (nivel) filtro.nivel = nivel;
    
    const aulas = await Aula.find(filtro);
    res.status(200).json(aulas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar aulas', erro: error.message });
  }
};

exports.obterAula = async (req, res) => {
  try {
    const aula = await Aula.findById(req.params.id);
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
    const novaAula = new Aula(req.body);
    const aulaSalva = await novaAula.save();
    res.status(201).json(aulaSalva);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao criar aula', erro: error.message });
  }
};

exports.atualizarAula = async (req, res) => {
  try {
    const aulaAtualizada = await Aula.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!aulaAtualizada) {
      return res.status(404).json({ mensagem: 'Aula não encontrada' });
    }
    
    res.status(200).json(aulaAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar aula', erro: error.message });
  }
};

exports.excluirAula = async (req, res) => {
  try {
    const aulaExcluida = await Aula.findByIdAndDelete(req.params.id);
    
    if (!aulaExcluida) {
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
    
    const aulas = await Aula.find({
      $or: [
        { titulo: { $regex: termo, $options: 'i' } },
        { descricao: { $regex: termo, $options: 'i' } },
        { conteudo: { $regex: termo, $options: 'i' } }
      ]
    });
    
    res.status(200).json(aulas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar aulas', erro: error.message });
  }
}; 