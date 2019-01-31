require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//======Middleware======

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//=============================

// Habilitando carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')));


//Global config for routes
app.use(require('./routes/index'));


// START DATABASE
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB, (err, resp) => {
    if (err) throw err;
    console.log('>>>> Base de datos creada');
});


// START SERVER
app.listen(process.env.PORT, () => {
    console.log('>>>> Listen port 3000');
});