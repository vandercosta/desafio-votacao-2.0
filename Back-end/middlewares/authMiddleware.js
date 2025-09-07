const jwt = require('jsonwebtoken');
const JWT_SECRET = 'seuSegredoSuperSeguro';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { cpf: decoded.cpf, isAdmin: decoded.isAdmin, id: decoded.id };
    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
