const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../models/usuario.model');
const { verificarToken, verificarRol } = require('../middleware/auth');

const app = express();


app.get('/status', (req, res) => {
    res.json({
        ok: true,
        message: 'Servicios en funcionamiento'
    })
});

app.get('/usuarios', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Usuario.find({ estado: true }, 'nombre email role estado google img') // El segundo argumento sirve para poder colocar los atritubos que creamos convenientes
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            });
        });

});


app.post('/usuario', [verificarToken, verificarRol], (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, usuario: usuarioDB });
    });
});


app.put('/usuario/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});


app.delete('/usuario/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({ ok: false, err: { message: 'Usuario no encontrado' } });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

app.delete('/usuario-flag/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let change = { estado: false };

    Usuario.findByIdAndUpdate(id, change, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;