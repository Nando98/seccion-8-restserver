const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const app = express();

app.post('/login', (req, res) => {


    let body  = req.body;

    Usuario.findOne({ email: body.email }, ( err, userDB ) => {
        if( err ) {
            return res.status(500).json({ok: false, err});
        }

        if ( !userDB ) {
            return res.status(400).json({ ok: false, err: { message:'Usuario o contraseña incorrectos.' } });
        }

        if ( !bcrypt.compareSync( body.password, userDB.password ) ) {
            return res.status(400).json({ ok: false, err: { message:'Usuario o contraseña incorrectos.' } });
        }

        let token = jwt.sign({
            payload: userDB,
        }, process.env.TOKEN_SECRET_KEY, { expiresIn: process.env.TOKEN_CADUCIDAD })

        res.json({
            ok: true,
            usuario: userDB,
            token: token
        })
    });
});




module.exports = app;
