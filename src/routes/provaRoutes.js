const express = require('express');
const provaController = require('../controllers/provaController');

const router = express.Router();

router.get('/', provaController.listarProvas);
router.get('/:id', provaController.obterProva);
router.post('/gerar', provaController.gerarProva);
router.post('/', provaController.criarProva);
router.put('/:id', provaController.atualizarProva);
router.delete('/:id', provaController.excluirProva);
router.post('/verificar', provaController.verificarRespostas);

module.exports = router; 