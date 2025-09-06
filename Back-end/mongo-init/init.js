db = db.getSiblingDB('meuapp');

db.usuarios.insertMany([
  {
    username: 'admin',
    nome: 'Administrador',
    cpf: 11111111111,
    email: 'admin@admin.com.br',
    password: '$2b$10$VqyRAbEZtat7Z7wtLiPZI.fwZudgPczWtk4SsjHXxNlg1u.FXnLiq', // 'Admin@123'
    isAdmin: true,
  },
]);
