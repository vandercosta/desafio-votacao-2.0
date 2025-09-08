const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags:
 *       - Categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

module.exports = router;
