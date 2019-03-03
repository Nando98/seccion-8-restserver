const express = require('express');
const { verificarToken, verificarRol } = require('../middleware/auth');

const Categoria = require('../models/categoria.model');

const app = express();


app.get('/categorias', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') // Permite cargar la información un objectID
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }
            res.json({ ok: true, categorias: categoriaDB });
        });
});

app.get('/categoria/:id', (req, res) => {

    let identifier = req.params.id

    Categoria.findById(identifier, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        res.json({ ok: true, categoria: categoriaDB });
    });
});

app.post('/new-categoria', verificarToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria();

    categoria.descripcion = body.descripcion;
    categoria.usuario = req.payload._id;

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, categoria: categoriaDB });
    });
});

app.put('/categoria/:id', (req, res) => {

    let identifier = req.params.id;
    let body = req.body;

    Categoria.findOneAndUpdate({ _id: identifier }, body, { new: true }, (err, newCategoriaDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        res.json({ ok: true, categoria: newCategoriaDB });
    })

});

app.delete('/categoria/:id', [verificarToken, verificarRol], (req, res) => {

    let identifier = req.params.id;

    Categoria.findOneAndDelete({ _id: identifier }, (err, categoriaEliminada) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        if (!categoriaEliminada) {
            return res.status(400).json({ ok: false, err: { message: 'Categoria no encontrada' } });
        }
        res.json({ ok: true, message: 'Se eliminó correctamente.', categoria: categoriaEliminada });
    });

});

module.exports = app;