const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

module.exports = router;
