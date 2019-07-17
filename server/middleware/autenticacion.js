const jwt = require('jsonwebtoken');

// Verificar Token

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decode.usuario;
        next();

    });
}

let verificaRol = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                mensaje: 'El usuario no es admin no puede registrar usuarios'
            }
        });

    }

}

module.exports = {
    verificaToken,
    verificaRol
}