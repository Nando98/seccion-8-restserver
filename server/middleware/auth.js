const jwt = require('jsonwebtoken');

// Token verification

let verificarToken = (req, res, next) => {

    let auth = req.get('Authorization');

    jwt.verify(auth, process.env.TOKEN_SECRET_KEY, (err, decode) => {
        if (err) {
            return res.status(401).json({ ok: false, err: { name: err.name, message: 'Invalid access token.' } });
        }

        req.payload = decode.payload;
        next();
    });
};


let verificarRol = (req, res, next) => {

    let user = req.payload;

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({ ok: false, err: { message: 'Solo el administrador puede realizar la operación solicitada.' } });
    } else {
        next();
    }
};


let verificarImageToken = (req, res, next) => {

    let access_token = req.query.q;

    jwt.verify(access_token, process.env.TOKEN_SECRET_KEY, (err, decode) => {
        if (err) {
            return res.status(401).json({ ok: false, err: { name: err.name, message: 'Invalid access token.' } });
        }

        req.payload = decode.payload;
        next();
    });
}

module.exports = {
    verificarToken,
    verificarRol,
    verificarImageToken
};