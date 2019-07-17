const express = require('express');
const Usuarios = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

const {
    verificaToken,
    verificaRol
} = require('../middleware/autenticacion');

app.get('/usuarios', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let estado = true;

    Usuarios.find({
            estado
        }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuarios.countDocuments({
                estado
            }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    usuarios
                });
            });

        });

});

app.post('/usuarios', [verificaToken, verificaRol], (req, res) => {
    let body = req.body;

    let usuario = new Usuarios({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuarios/:id', [verificaToken, verificaRol], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuarios.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
});

app.delete('/usuarios/:id', [verificaToken, verificaRol], function(req, res) {

    let id = req.params.id;

    //let body = _.pick(req.body, ['estado']);
    let cambiaEstado = {
        estado: false
    }

    Usuarios.findByIdAndUpdate(id, cambiaEstado, {
        new: true
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    messege: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

    /*Usuarios.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    messege: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });*/

});


module.exports = app;