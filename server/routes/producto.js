const express = require('express');
const { verificarToken } = require('../middleware/auth');

let app = express();
let Producto = require('../models/producto.model');


// Obtener productos: Filtrar todos, utilizar el populate y paginado
app.get('/productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(hasta)
        .exec((err, productosDB) => {
            if (err) {
                res.status(400).json({ ok: false, err });
            }
            res.json({ ok: true, productos: productosDB });
        });
});

// Obtener producto por ID: Utilizar el populate
app.get('/productos/:id', verificarToken, (req, res) => {
    let identifier = req.params.id;

    Producto.findOne({ _id: identifier }, (err, productoDB) => {
            if (err) {
                res.status(500).json({ ok: false, err });
            }
            if (!productoDB) {
                res.status(400).json({ ok: false, err: { message: 'El producto no existe.' } });
            }
            res.json({ ok: true, producto: productoDB });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                res.status(500).json({ ok: false, err });
            }
            res.json({ ok: true, producto: productoDB });
        });
});

// Crear producto: grabar el usuario(payload), grabar una categoria del listado
app.post('/producto', verificarToken, (req, res) => {
    let identifier = req.payload._id;
    let productoSent = req.body;

    let producto = new Producto();

    producto.nombre = productoSent.nombre;
    producto.precioUni = productoSent.precioUni;
    producto.descripcion = productoSent.descripcion;
    producto.disponible = productoSent.disponible;
    producto.categoria = productoSent.categoria;
    producto.usuario = identifier;

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        res.status(201).json({ ok: true, producto: productoDB });
    });
});

// Actualizar producto: grabar el usuario(payload), grabar una categoria del listado
app.put('/producto/:id', verificarToken, (req, res) => {

    let identifier = req.params.id;
    let productoSent = req.body;

    Producto.findById(identifier, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (!productoDB) {
            return res.status(400).json({ ok: false, err: { message: 'El producto no existe.' } });
        }

        productoDB.nombre = productoSent.nombre
        productoDB.precioUni = productoSent.precioUni
        productoDB.descripcion = productoSent.descripcion
        productoDB.disponible = productoSent.disponible
        productoDB.categoria = productoSent.categoria

        productoDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }
            res.json({ ok: true, producto: productSaved });
        });
    });
});

// Desactivar producto: actualizar el estado del atributo 'disponible'
app.delete('/producto/:id', verificarToken, (req, res) => {
    let identifier = req.params.id;

    Producto.findOneAndUpdate({ _id: identifier }, { disponible: false }, (err, productoDB) => {
        if (err) {
            res.status(400).json({ ok: false, err });
        }
        if (!productoDB.disponible) {
            res.status(400).json({ ok: false, message: 'El producto ya se encuentra "No disponible".' });
        }
        res.json({ ok: true, message: 'El producto fue actualizado a "No disponible".', producto: productoDB })
    });
});

module.exports = app;