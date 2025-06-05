const Usuario = require('../models/usuarioModel');

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar usuários', erro: error.message });
  }
};

exports.obterUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter usuário', erro: error.message });
  }
};

exports.criarUsuario = async (req, res) => {
  try {
    const novoUsuario = new Usuario(req.body);
    const usuarioSalvo = await novoUsuario.save();
    
    const usuarioSemSenha = { ...usuarioSalvo.toObject() };
    delete usuarioSemSenha.senha;
    
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao criar usuário', erro: error.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-senha');
    
    if (!usuarioAtualizado) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar usuário', erro: error.message });
  }
};

exports.excluirUsuario = async (req, res) => {
  try {
    const usuarioExcluido = await Usuario.findByIdAndDelete(req.params.id);
    
    if (!usuarioExcluido) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    
    res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir usuário', erro: error.message });
  }
};

exports.atualizarProgresso = async (req, res) => {
  try {
    const { userId, aulaId, provaId } = req.body;
    const update = {};
    
    if (aulaId) {
      update.$push = { 'progresso.aulasCompletas': aulaId };
    } else if (provaId) {
      update.$push = { 'progresso.provasRealizadas': provaId };
    }
    
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      userId,
      update,
      { new: true }
    ).select('-senha');
    
    if (!usuarioAtualizado) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar progresso', erro: error.message });
  }
}; 