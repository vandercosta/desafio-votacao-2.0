db = db.getSiblingDB('meuapp');

db.usuarios.insertMany([
  {
    nome: 'Administrador',
    cpf: 11111111111,
    email: 'admin@admin.com.br',
    password: 'Admin@123',
    isAdmin: true,
  },
]);
