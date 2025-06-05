const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.obterUsuario);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.excluirUsuario);
router.post('/progresso', usuarioController.atualizarProgresso);

module.exports = router; 