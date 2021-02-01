require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'));

//Conexion a la Base de Datos CAFE
mongoose.connect(process.env.URLDB,
    {useNewUrlParser:true, useCreateIndex:true},
    (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

//Puerto para el WEBSERVER
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});