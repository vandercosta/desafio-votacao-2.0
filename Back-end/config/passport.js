const { Strategy, ExtractJwt } = require('passport-jwt');
const Usuario = require('../models/Usuario');

const JWT_SECRET = 'seuSegredoSuperSeguro'; // ideal: process.env.JWT_SECRET

module.exports = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  };

  passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
      try {
        const usuario = await Usuario.findById(jwt_payload.id).select(
          '-password'
        );
        if (usuario) return done(null, usuario);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
