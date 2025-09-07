const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const authMiddleware = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

module.exports = router;
