const express = require('express');
const server = express();
const router = require('express').Router();
const config = require('./config/config');
const jwt = require('jsonwebtoken');

server.set("secret_token", config.secret_token);

const autorizarUsuario = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        //console.log(token)
        if (token) {
            //console.log(token, server.get("secret_token"));
            const verificarToken = jwt.verify(token, server.get("secret_token"))
            if (verificarToken) {
                req.usuario = verificarToken
                return next();
            }
        }
        else {
            res.status(406).send({
                mensaje: "Token no proveída. Usuario no ingresado"
            });
        }
        console.log("Verificar token ", verificarToken)
        return next();
    }
    catch (err) {
        res.status(406).send({ mensaje: "Error de autorización" })
    }
}


module.exports = autorizarUsuario;