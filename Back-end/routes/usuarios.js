const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Usuario = require('../models/Usuario');
const authMiddleware = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const validateCpf = require('../utils/validateCpf');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - username
 *               - email
 *               - cpf
 *               - password
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               username:
 *                 type: string
 *                 example: joaosilva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               cpf:
 *                 type: string
 *                 example: "12345678901"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "minhasenha123"
 *               isAdmin:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou duplicados
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { nome, username, email, cpf, password, isAdmin } = req.body;

    if (!nome || !username || !email || !cpf || !password) {
      return res.status(400).json({
        error: 'Nome, username, email, CPF e password são obrigatórios',
      });
    }

    // valida CPF
    if (!validateCpf(cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // verifica duplicidade de username
    const existingUsername = await Usuario.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username já cadastrado' });
    }

    // verifica duplicidade de email
    const existingEmail = await Usuario.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // verifica duplicidade de cpf
    const existingCpf = await Usuario.findOne({ cpf });
    if (existingCpf) {
      return res.status(400).json({ error: 'CPF já cadastrado' });
    }

    // cria hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const novoUsuario = new Usuario({
      nome,
      username,
      email,
      cpf,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await novoUsuario.save();

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: novoUsuario.username,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

module.exports = router;
