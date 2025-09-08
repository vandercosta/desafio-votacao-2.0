const express = require('express');
const router = express.Router();
const Pauta = require('../models/Pauta');
const Categoria = require('../models/Categoria');
const authMiddleware = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');

/**
 * @swagger
 * /api/pautas:
 *   post:
 *     summary: Cria uma nova pauta
 *     tags:
 *       - Pautas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Reforma do Estatuto"
 *               descricao:
 *                 type: string
 *                 example: "Votação para aprovação da reforma do estatuto social"
 *               categoria:
 *                 type: string
 *                 example: "68bdc2d45ff150d039fa3353"
 *               dataExpiracao:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Pauta criada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (não admin)
 */
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { titulo, descricao, categoria, dataExpiracao } = req.body;

    const pauta = new Pauta({
      titulo,
      descricao,
      categoria,
      dataExpiracao,
    });

    await pauta.save();
    res.status(201).json(pauta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pautas:
 *   get:
 *     summary: Lista todas as pautas
 *     tags:
 *       - Pautas
 *     responses:
 *       200:
 *         description: Lista de pautas
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cpf = req.user.cpf;
    if (!cpf)
      return res.status(400).json({ error: 'CPF do usuário não encontrado' });

    const { categoria } = req.query;

    // Se categoria foi passada, filtra. Senão, pega todas.
    const filtro = categoria ? { categoria } : {};

    const pautas = await Pauta.find(filtro).populate('categoria');

    const pautasFormatadas = pautas.map((p) => ({
      _id: p._id,
      titulo: p.titulo,
      descricao: p.descricao,
      categoria: p.categoria,
      dataCriacao: p.dataCriacao,
      dataExpiracao: p.dataExpiracao,
      votosSim: p.votosSim,
      votosNao: p.votosNao,
      jaVotou: p.votaramSim.includes(cpf) || p.votaramNao.includes(cpf),
    }));

    res.json(pautasFormatadas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pautas/{id}:
 *   get:
 *     summary: Retorna uma pauta específica
 *     tags:
 *       - Pautas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pauta encontrada
 *       404:
 *         description: Pauta não encontrada
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const cpf = req.user.cpf;
    if (!cpf)
      return res.status(400).json({ error: 'CPF do usuário não encontrado' });

    const pauta = await Pauta.findById(req.params.id).populate('categoria');
    if (!pauta) return res.status(404).json({ error: 'Pauta não encontrada' });

    const pautaFormatada = {
      _id: pauta._id,
      titulo: pauta.titulo,
      descricao: pauta.descricao,
      categoria: pauta.categoria,
      dataCriacao: pauta.dataCriacao,
      dataExpiracao: pauta.dataExpiracao,
      votosSim: pauta.votosSim,
      votosNao: pauta.votosNao,
      jaVotou: pauta.votaramSim.includes(cpf) || pauta.votaramNao.includes(cpf),
    };

    res.json(pautaFormatada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pautas/{id}/votar:
 *   post:
 *     summary: Votar em uma pauta
 *     tags:
 *       - Pautas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voto:
 *                 type: string
 *                 enum: [SIM, NAO]
 *     responses:
 *       200:
 *         description: Voto registrado
 */
router.post('/:id/votar', authMiddleware, async (req, res) => {
  try {
    const { voto } = req.body;
    const pauta = await Pauta.findById(req.params.id);

    if (!pauta) return res.status(404).json({ error: 'Pauta não encontrada' });
    if (new Date() > pauta.dataExpiracao)
      return res.status(400).json({ error: 'A votação já expirou' });

    // pega o CPF do usuário logado
    const cpf = req.user.cpf;
    if (!cpf)
      return res.status(400).json({ error: 'CPF do usuário não encontrado' });

    // verifica se já votou
    if (pauta.votaramSim.includes(cpf) || pauta.votaramNao.includes(cpf)) {
      return res.status(400).json({ error: 'Você já votou nesta pauta' });
    }

    let mensagem = '';

    if (voto === 'SIM') {
      pauta.votosSim++;
      pauta.votaramSim.push(cpf);
      mensagem = 'Você votou em SIM';
    } else if (voto === 'NAO') {
      pauta.votosNao++;
      pauta.votaramNao.push(cpf);
      mensagem = 'Você votou em NÃO';
    } else {
      return res.status(400).json({ error: 'Voto inválido' });
    }

    await pauta.save();
    res.json({ message: mensagem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
