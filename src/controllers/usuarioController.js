const { Usuario } = require('../models');

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] }
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar usuários', erro: error.message });
  }
};

exports.obterUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });
    
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
    const novoUsuario = await Usuario.create(req.body);
    
    const usuarioSemSenha = novoUsuario.toJSON();
    delete usuarioSemSenha.senha;
    
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao criar usuário', erro: error.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const [linhasAtualizadas] = await Usuario.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (linhasAtualizadas === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    
    const usuarioAtualizado = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });
    
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar usuário', erro: error.message });
  }
};

exports.excluirUsuario = async (req, res) => {
  try {
    const linhasExcluidas = await Usuario.destroy({
      where: { id: req.params.id }
    });
    
    if (linhasExcluidas === 0) {
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
    const usuario = await Usuario.findByPk(userId);
    
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    
    if (aulaId) {
      const aulasCompletas = usuario.aulasCompletas;
      if (!aulasCompletas.includes(aulaId)) {
        aulasCompletas.push(aulaId);
        usuario.aulasCompletas = aulasCompletas;
      }
    }
    
    if (provaId) {
      const provasRealizadas = usuario.provasRealizadas;
      if (!provasRealizadas.includes(provaId)) {
        provasRealizadas.push(provaId);
        usuario.provasRealizadas = provasRealizadas;
      }
    }
    
    await usuario.save();
    
    const usuarioAtualizado = await Usuario.findByPk(userId, {
      attributes: { exclude: ['senha'] }
    });
    
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: 'Erro ao atualizar progresso', erro: error.message });
  }
}; 