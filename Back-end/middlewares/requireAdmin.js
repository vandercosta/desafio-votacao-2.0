function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado: admin apenas' });
  }
  next();
}

module.exports = requireAdmin;
