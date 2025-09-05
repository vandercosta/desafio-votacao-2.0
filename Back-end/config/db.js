const mongoose = require('mongoose');

mongoose
  .connect('mongodb://admin:admin123@localhost:27017/meuapp', {
    authSource: 'admin',
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar no MongoDB', err));
