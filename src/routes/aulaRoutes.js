const express = require('express');
const aulaController = require('../controllers/aulaController');

const router = express.Router();

router.get('/', aulaController.listarAulas);
router.get('/buscar', aulaController.buscarAulas);
router.get('/:id', aulaController.obterAula);
router.post('/', aulaController.criarAula);
router.put('/:id', aulaController.atualizarAula);
router.delete('/:id', aulaController.excluirAula);

module.exports = router; 