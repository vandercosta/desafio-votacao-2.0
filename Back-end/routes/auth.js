const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router = express.Router();
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'seuSegredoSuperSeguro'; // ideal: process.env.JWT_SECRET

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login do usuário via username
 *     description: Retorna um token JWT ao usuário se o login estiver correto.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: Bearer eyJhbGciOiJIUzI1NiIsInR...
 *       400:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Usuário não encontrado
 *       401:
 *         description: Senha inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Senha inválida
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Erro no login
 */

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const usuario = await Usuario.findOne({ username });
    if (!usuario)
      return res.status(400).json({ erro: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha inválida' });

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, isAdmin: usuario.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: 'Bearer ' + token });
  } catch (err) {
    res.status(500).json({ erro: `Erro no login: ${err}` });
  }
});

module.exports = router;
