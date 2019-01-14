const jwt = require('jsonwebtoken');

// Token verification

let verificarToken = ( req, res, next ) => {

    let auth = req.get('Authorization');

    jwt.verify( auth, process.env.TOKEN_SECRET_KEY, (err, decode) => {
        if( err ) {
            return res.status(401).json({ok: false, err: { name: err.name, message: 'Invalid access token.'}});
        }

        req.payload = decode.payload;
        next();
    });
};


let verificarRol = ( req, res, next ) =>{

    let user = req.payload;

    if ( user.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({ok: false, err: { message: 'Just admin can create user.'}});
    } else {
        next();
    }
};


module.exports = {
    verificarToken,
    verificarRol
};
