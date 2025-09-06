const express = require('express');

const passport = require('passport');
require('./config/passport')(passport);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const usuarioRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(express.json());

// inicializar passport
app.use(passport.initialize());

// Conexão MongoDB
require('./config/db');

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger docs em http://localhost:${PORT}/api-docs`);
});
