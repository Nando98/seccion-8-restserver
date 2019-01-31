const express = require('express');
const app = express();


app.use( require('./usuario') );
app.use( require('./login') );


module.exports = app;

// 002 193 001 748 648 009 12
