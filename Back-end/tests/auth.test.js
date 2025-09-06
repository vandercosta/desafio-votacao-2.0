const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../index'); // importa seu app Express
const Usuario = require('../models/Usuario');

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test'; // garante que conecta no meuapp_test

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    authSource: 'admin',
  });

  // Cria um usuário fake para login
  await Usuario.create({
    username: 'admin',
    nome: 'Administrador',
    cpf: 11111111111,
    email: 'admin@admin.com.br',
    password: '$2b$10$VqyRAbEZtat7Z7wtLiPZI.fwZudgPczWtk4SsjHXxNlg1u.FXnLiq', // hash de Admin@123
    isAdmin: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // limpa dados do teste
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /api/auth/login', () => {
  it('deve retornar token com credenciais corretas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin@123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('deve falhar se o usuário não existir', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'fake', password: '123456' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('erro', 'Usuário não encontrado');
  });

  it('deve falhar se a senha for inválida', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'senhaErrada' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('erro', 'Senha inválida');
  });

  describe('POST /api/auth/login - erro interno', () => {
    it('deve retornar 500 se ocorrer erro no servidor', async () => {
      // força findOne a lançar um erro
      jest.spyOn(Usuario, 'findOne').mockImplementation(() => {
        throw new Error('Erro forçado para teste');
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'Admin@123' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('erro');

      // restaura o método original
      Usuario.findOne.mockRestore();
    });
  });
});
