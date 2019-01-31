const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario.model');

const app = express();

app.post('/login', (req, res) => {


    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!userDB) {
            return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrectos.' } });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrectos.' } });
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



async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => { return res.status(403).json({ ok: false, err: e }); });

    console.log(googleUser);

    Usuario.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({ ok: false, err: { message: 'Debe de usar su autenticación normal.' } });
            } else {
                let token = jwt.sign({
                    payload: userDB,
                }, process.env.TOKEN_SECRET_KEY, { expiresIn: process.env.TOKEN_CADUCIDAD });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            // Si el usuario no existe en nuestra base de datos
            let user = new Usuario();

            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({ ok: false, error: err });
                }
                let token = jwt.sign({
                    payload: userDB,
                }, process.env.TOKEN_SECRET_KEY, { expiresIn: process.env.TOKEN_CADUCIDAD });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});


module.exports = app;