// tests/pautas.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = require('../index');
const Usuario = require('../models/Usuario');
const Pauta = require('../models/Pauta');
const Categoria = require('../models/Categoria');

const JWT_SECRET = 'seuSegredoSuperSeguro';

let mongoServer;
let adminToken;
let userToken;
let categoriaId;
let userCpf = '12345678900'; // define o CPF aqui

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Cria uma categoria inicial
  const categoria = await Categoria.create({ nome: 'Política' });
  categoriaId = categoria._id;

  // Cria usuários
  const senhaHash = await bcrypt.hash('senha123', 10);

  const admin = await Usuario.create({
    username: 'admin',
    password: senhaHash,
    nome: 'Admin',
    cpf: '11111111111',
    isAdmin: true,
    email: 'admin@test.com',
  });

  const user = await Usuario.create({
    username: 'user',
    password: senhaHash,
    nome: 'User',
    cpf: '22222222222',
    isAdmin: false,
    email: 'user@test.com',
  });

  // Gera tokens
  adminToken = jwt.sign(
    {
      id: admin._id,
      username: admin.username,
      isAdmin: admin.isAdmin,
      cpf: admin.cpf,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  userToken = jwt.sign(
    {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      cpf: userCpf, // inclui o CPF
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Pauta.deleteMany({});
});

describe('Pautas API', () => {
  it('deve criar pauta apenas para admin', async () => {
    const resAdmin = await request(app)
      .post('/api/pautas')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        titulo: 'Nova Pauta',
        descricao: 'Teste',
        categoria: categoriaId,
        dataExpiracao: '2025-12-31T23:59:59Z',
      });

    expect(resAdmin.statusCode).toBe(201);
    expect(resAdmin.body.titulo).toBe('Nova Pauta');

    const resUser = await request(app)
      .post('/api/pautas')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        titulo: 'Outra Pauta',
        descricao: 'Teste',
        categoria: categoriaId,
        dataExpiracao: '2025-12-31T23:59:59Z',
      });

    expect(resUser.statusCode).toBe(403);
  });

  it('GET /api/pautas deve retornar erro se CPF não existir', async () => {
    const tokenSemCpf = jwt.sign(
      { id: '123', username: 'teste', isAdmin: false },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/api/pautas')
      .set('Authorization', 'Bearer ' + tokenSemCpf);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('CPF do usuário não encontrado');
  });

  it('deve listar pautas com jaVotou', async () => {
    await Pauta.create({
      titulo: 'Pauta Teste',
      descricao: 'Descrição',
      categoria: categoriaId,
      dataExpiracao: '2025-12-31T23:59:59Z',
    });

    const res = await request(app)
      .get('/api/pautas')
      .set('Authorization', 'Bearer ' + userToken);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('jaVotou', false);
  });

  it('GET /api/pautas/:id retorna pauta específica', async () => {
    const pauta = await Pauta.create({
      titulo: 'Pauta Específica',
      descricao: 'Descrição',
      categoria: categoriaId,
      dataExpiracao: '2025-12-31T23:59:59Z',
    });

    const res = await request(app)
      .get(`/api/pautas/${pauta._id}`)
      .set('Authorization', 'Bearer ' + userToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Pauta Específica');
    expect(res.body).toHaveProperty('jaVotou', false);
  });

  it('GET /api/pautas/:id retorna 404 se pauta não existir', async () => {
    const idInvalido = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/pautas/${idInvalido}`)
      .set('Authorization', 'Bearer ' + userToken);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Pauta não encontrada');
  });

  it('deve permitir votar e retornar mensagem correta', async () => {
    const pauta = await Pauta.create({
      titulo: 'Pauta Votacao',
      descricao: 'Teste',
      categoria: categoriaId,
      dataExpiracao: '2025-12-31T23:59:59Z',
    });

    const resSim = await request(app)
      .post(`/api/pautas/${pauta._id}/votar`)
      .set('Authorization', 'Bearer ' + userToken)
      .send({ voto: 'SIM' });

    expect(resSim.statusCode).toBe(200);
    expect(resSim.body.message).toBe('Você votou em SIM');

    const resRepetido = await request(app)
      .post(`/api/pautas/${pauta._id}/votar`)
      .set('Authorization', 'Bearer ' + userToken)
      .send({ voto: 'NAO' });

    expect(resRepetido.statusCode).toBe(400);
    expect(resRepetido.body.error).toBe('Você já votou nesta pauta');
  });

  it('POST /api/pautas/:id/votar retorna 404 se pauta não existir', async () => {
    const idInvalido = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/pautas/${idInvalido}/votar`)
      .set('Authorization', 'Bearer ' + userToken)
      .send({ voto: 'SIM' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Pauta não encontrada');
  });

  it('POST /api/pautas/:id/votar retorna erro se votação expirada', async () => {
    const pauta = await Pauta.create({
      titulo: 'Expirada',
      descricao: 'Teste',
      categoria: categoriaId,
      dataExpiracao: new Date('2000-01-01'),
    });

    const res = await request(app)
      .post(`/api/pautas/${pauta._id}/votar`)
      .set('Authorization', 'Bearer ' + userToken)
      .send({ voto: 'SIM' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('A votação já expirou');
  });

  it('POST /api/pautas/:id/votar retorna erro se voto inválido', async () => {
    const pauta = await Pauta.create({
      titulo: 'Voto Inválido',
      descricao: 'Teste',
      categoria: categoriaId,
      dataExpiracao: '2025-12-31T23:59:59Z',
    });

    const res = await request(app)
      .post(`/api/pautas/${pauta._id}/votar`)
      .set('Authorization', 'Bearer ' + userToken)
      .send({ voto: 'TALVEZ' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Voto inválido');
  });

  it('POST /api/pautas deve retornar 400 se salvar falhar', async () => {
    // mock do save para lançar erro
    const saveSpy = jest
      .spyOn(Pauta.prototype, 'save')
      .mockImplementationOnce(() => {
        throw new Error('Erro simulado');
      });

    const res = await request(app)
      .post('/api/pautas')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        titulo: 'Teste',
        descricao: 'Descrição',
        categoria: categoriaId,
        dataExpiracao: '2025-12-31T23:59:59Z',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Erro simulado');

    saveSpy.mockRestore(); // restaura o método original
  });

  it('GET /api/pautas deve retornar 500 se ocorrer erro no banco', async () => {
    // mock do Pauta.find() para lançar erro
    const findSpy = jest.spyOn(Pauta, 'find').mockImplementationOnce(() => {
      throw new Error('Erro simulado');
    });

    const res = await request(app)
      .get('/api/pautas')
      .set('Authorization', 'Bearer ' + userToken);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro simulado');

    findSpy.mockRestore(); // restaura o método original
  });

  it('GET /api/pautas/:id retorna 400 se CPF não estiver no token', async () => {
    const tokenSemCpf = jwt.sign(
      { id: '123', username: 'user', isAdmin: false },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get(`/api/pautas/qualquerId`)
      .set('Authorization', 'Bearer ' + tokenSemCpf);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('CPF do usuário não encontrado');
  });

  it('GET /api/pautas/:id retorna 500 se ocorrer erro no banco', async () => {
    // mock do findById para lançar erro
    const findByIdSpy = jest
      .spyOn(Pauta, 'findById')
      .mockImplementationOnce(() => {
        throw new Error('Erro simulado');
      });

    const res = await request(app)
      .get(`/api/pautas/qualquerId`)
      .set('Authorization', 'Bearer ' + userToken); // token válido com cpf

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Erro simulado');

    findByIdSpy.mockRestore();
  });

  it('POST /api/pautas/:id/votar retorna 400 se CPF não estiver no token', async () => {
    const pauta = await Pauta.create({
      titulo: 'Teste Pauta',
      descricao: 'Desc',
      categoria: categoriaId,
      dataExpiracao: new Date(Date.now() + 60 * 60 * 1000),
    });

    const tokenSemCpf = jwt.sign(
      { id: '123', username: 'user', isAdmin: false },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post(`/api/pautas/${pauta._id}/votar`)
      .set('Authorization', 'Bearer ' + tokenSemCpf)
      .send({ voto: 'SIM' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('CPF do usuário não encontrado');
  });

  it('POST /api/pautas/:id/votar deve registrar voto NÃO', async () => {
    const pauta = await Pauta.create({
      titulo: 'Teste Pauta',
      descricao: 'Desc',
      categoria: categoriaId,
      dataExpiracao: new Date(Date.now() + 60 * 60 * 1000),
    });

    const res = await request(app)
      .post(`/api/pautas/${pauta._id}/votar`)
      .set('Authorization', 'Bearer ' + userToken) // token com cpf válido
      .send({ voto: 'NAO' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Você votou em NÃO');

    const pautaAtualizada = await Pauta.findById(pauta._id);
    expect(pautaAtualizada.votosNao).toBe(1);
    expect(pautaAtualizada.votaramNao).toContain(userCpf);
  });

  it('POST /api/pautas/:id/votar retorna 400 em caso de erro inesperado', async () => {
    const pauta = await Pauta.create({
      titulo: 'Teste Pauta',
      descricao: 'Desc',
      categoria: categoriaId,
      dataExpiracao: new Date(Date.now() + 60 * 60 * 1000),
    });

    // mocka o save para lançar erro
    const saveSpy = jest
      .spyOn(Pauta.prototype, 'save')
      .mockImplementationOnce(() => {
        throw new Error('Erro simulado no save');
      });

    const res = await request(app)
      .post(`/api/pautas/${pauta._id}/votar`)
      .set('Authorization', 'Bearer ' + userToken)
      .send({ voto: 'SIM' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Erro simulado no save');

    saveSpy.mockRestore();
  });
});
