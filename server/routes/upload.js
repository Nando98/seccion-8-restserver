const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario.model');
const Producto = require('../models/producto.model');

// Middleware -> Cuando lo llamamos, todo los archivos que cargue caen el req.files
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let identifier = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({ ok: false, err: { message: 'No files were uploaded.' } });
    }

    //  Validar tipos
    let tiposPermitidos = ['productos', 'usuarios'];

    if (tiposPermitidos.indexOf(tipo) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Las extensiones permitidas son:' + tiposPermitidos.join(', ') } })
    }

    //  El nombre del campo de entrada (es decir, "sampleFile") se usa para recuperar el archivo cargado
    let sampleFile = req.files.sampleFile;
    let nameFile = sampleFile.name.split('.');
    let extension = nameFile[nameFile.length - 1]; // Trae consigo el ultimo item del array

    //  Validando extensiones
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Las extensiones permitidas son:' + extensionesPermitidas.join(', ') } })
    }

    //  Cambiar el nombre del archivo
    let newNameFile = `${identifier}-${new Date().getTime()}.${extension}`;
    let genericPath = path.resolve(__dirname, `../../uploads/${tipo}`);
    let saveImagePath = path.resolve(__dirname, `../../uploads/${tipo}/${newNameFile}`);

    console.log(saveImagePath);

    if (!fs.existsSync(genericPath)) {
        fs.mkdirSync(genericPath)
    } else {
        console.info('MESSAGE >>>> El directorio ya existe.');
    }

    //  Use el método mv() para colocar el archivo en algún lugar de su servidor
    sampleFile.mv(saveImagePath, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, message: 'Error con el metodo mv()', dir: __dirname, err });
        }

        //  Guardar imagen
        if (tipo === 'usuarios') {
            imagenUsuario(identifier, res, newNameFile);
        } else {
            imagenProducto(identifier, res, newNameFile);
        }
    });
});

function imagenUsuario(identifier, res, nameFile) {
    Usuario.findById(identifier, (err, userDB) => {
        if (err) {
            deleteFile(nameFile, 'usuarios');
            return res.status(500).json({
                ok: false,
                message: 'Error en linea 66, no hay usuario',
                err
            });
        }
        if (!userDB) {
            deleteFile(nameFile, 'usuarios');
            return res.status(400).json({ ok: false, err: { message: 'Usuario no existe.' } });
        }

        deleteFile(userDB.img, 'usuarios');

        userDB.img = nameFile;
        userDB.save((err, userSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error en la linea 82, error al guardarlo.',
                    err
                });
            }
            res.json({ ok: true, img: nameFile, usuario: userSaved });
        });
    });
}

function imagenProducto(identifier, res, nameFile) {
    Producto.findById(identifier, (err, productDB) => {
        if (err) {
            deleteFile(nameFile, 'productos');
            return res.status(500).json({ ok: false, err });
        }
        if (!productDB) {
            deleteFile(nameFile, 'productos');
            return res.status(400).json({ ok: false, err: { message: 'Usuario no existe.' } });
        }

        deleteFile(productDB.img, 'productos');

        productDB.img = nameFile;
        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }
            res.json({ ok: true, img: nameFile, usuario: productSaved });
        });
    });
}



function deleteFile(imageName, type) {
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${ imageName }`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

module.exports = app;