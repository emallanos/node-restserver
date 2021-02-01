const express = require('express'); //Express
const bcrypt = require('bcrypt'); //Encriptar la contraseña
const _ = require('underscore');

const Usuario = require('../models/usuario'); //Modelo de datos
const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');

const { getMaxListeners } = require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();

//GET
app.get('/usuario', verificaToken, (req, res) => {

    //Pagination --> desde - hasta
    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Filtros por valor -> email:'test1@gmail.com'
    //Filtros por campos -> "nombre email img role estado google"
    Usuario.find({estado:true},"nombre email img role estado google")
        .skip(desde) //saltea los primeros 5 registros
        .limit(limite) // total de registros a retornar
        .exec((err,usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            //Filtros por valor -> email:'test1@gmail.com'
            Usuario.count({estado:true}, (err, conteo) => {
                res.json({
                    ok:true,
                    usuarios,
                    total:conteo
                });
            });    
        });
});

//POST
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});

//PUT
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
    
    Usuario.findByIdAndUpdate(id, body, {new:true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});

//DELETE
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    
    let id = req.params.id;

    //Delete Físico
    //Usuario.findByIdAndRemove(id, (err, deleteUser) => {
    
    //Delete Lógico
    let changeState = {
        estado:false
    };

    Usuario.findByIdAndUpdate(id, changeState, {new:true}, (err, deleteUser) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if (!deleteUser) {
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            usuario: deleteUser
        });
    });
});

module.exports = app;