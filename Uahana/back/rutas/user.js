const express = require('express');
const server = express();
const router = require('express').Router();
const { db, Sequelize } = require('../conexionBD');
const autorizarUsuario = require('../autorizacion')
const jwt = require('jsonwebtoken');
const config = require('../config/config')
server.set("secret_token", config.secret_token);
const crypto = require('crypto')
const MD5 = require("crypto-js/md5");
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


//REGISTRO
const checkSamePass = (pass1, pass2) => {
    if (pass1 === pass2) {
        return true;
    }
    else {
        return false;
    }
}

router.post('/register', autorizarUsuario, (req, res) => {
    console.log(req.body, req.body.length)
    for (let i = 0; i < req.body.length; i++) {
        console.log("entro")
        const { nombre, apellido, sexo, nacimiento, email, phone, password, passwordCheck } = req.body[i]
        //const passOk = checkSamePass(password, passwordCheck);
        //console.log(passOk)
        //if (passOk) {
        db.query('SELECT * FROM usuarios where Email = ?',
            { replacements: [email] })
            .then((respuesta) => {
                const [results] = respuesta;
                console.log(results)
                if (results == "") {
                    crypto.randomBytes(16, (err, salt) => {
                        const newSalt = salt.toString('base64')
                        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, key) => {
                            const encryptedPass = key.toString('base64')
                            console.log(encryptedPass, newSalt)
                            db.query('INSERT INTO usuarios (Sexo, Nombre, Apellido, FechaNacimiento, Email, `Password`, Telefono, Salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                { replacements: [sexo, nombre, apellido, nacimiento, email, encryptedPass, phone, newSalt] })
                                .then((respuesta) => {
                                    const [results] = respuesta;
                                    console.log(results)
                                    res.status(201).send({ mensaje: 'Usuario creado con éxito' })
                                    db.query('INSERT INTO usuarios_habilitados (ID_Usuario, Habilitado) VALUES (?, 1)',
                                        { replacements: [results] })
                                })
                                .then(() => {
                                    //sendMailRegister(nombre, apellido, email, password);
                                })
                                .catch((err) => {
                                    res.status(400).send({ error: "Ocurrió un error al intentar crear usuario." })
                                })
                        })
                    })
                }
                else {
                    res.status(200).send({ mensaje: "El usuario con ese email, ya existe" })
                }
            })

            .catch((err) => {
                console.log(err)
                res.status(400).send({ error: "Ocurrió un error al intentar crear usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
            })
        // }
        // else {
        //     //res.status(401).send({ error: "Debe ingresar la misma contraseña" })
        // }
    }
})


function sendMailRegister(nombre, apellido, email, password) {
    var transporter = nodemailer.createTransport({
        // service: 'Gmail',
        // host: 'smtp.gmail.com',
        // auth: {
        //     user: 'lawnteniscordoba@gmail.com',
        //     pass: 'arenal299'
        // }
        host: "vps-1979822-x.dattaweb.com",
        port: 465,
        secure: true,
        auth: {
            user: "lawntenis@reservatuspot.com",
            pass: "SpotCLT21@"
        }
    })

    var mailOptions = {
        from: "lawntenis@reservatuspot.com",
        // to: '"' & email & '"',
        to: email,
        subject: "Registro Exitoso",
        text: `Estimados socio/a: Ya activamos su usuario y contraseña:
        Usuario: ${email}
        Contraseña: ${password}
        Recordá que sólo esta habilitada la opción de reserva de cancha de manera virtual, a través de la página web de nuestro club: www.cordobalawntenis.com.ar (imagen Reserva On Line).`,
        html: `<h4> Estimados socio/a:</h4>
                        <p> Ya activamos su usuario y contraseña:</p><br>
                        <p> <b> Usuario:</b> ${email} </p><br>
                        <p> <b> Contraseña:</b> ${password} </p> <br>               
                        <p> Recordá que <b> sólo esta habilitada la opción de reserva de cancha de manera virtual </b>, a través de la página web de nuestro club: <a href="http://www.cordobalawntenis.com.ar/"> www.cordobalawntenis.com.ar </a> (imagen <b> Reserva On Line</b>). </p>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message)
        }
        else {
            console.log("mail enviado correctamente")
        }
    })
}



//LOGIN

router.post('/login', (req, res) => {
    const { usuario, password } = req.body
    db.query(`SELECT Habilitado, email, salt FROM
    (SELECT ID_Usuario, email, salt FROM usuarios where Email = '${usuario}') t1
    LEFT JOIN
    (SELECT Habilitado, ID_Usuario FROM usuarios_habilitados) t2
    ON t1.ID_Usuario = t2.ID_Usuario`)
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results)
            if (results != "") {
                if (results[0].Habilitado != 0) {
                    crypto.pbkdf2(password, results[0].salt, 10000, 64, 'sha1', (err, key) => {
                        const encryptedPass = key.toString('base64')
                        console.log(encryptedPass)
                        db.query('SELECT ID_Usuario, Nombre, Apellido, ID_TipoUsuario FROM usuarios where Email = ? and password = ?',
                            { replacements: [usuario, encryptedPass] })
                            .then((respuesta) => {
                                const [results] = respuesta;
                                if (results != "") {
                                    //console.log(server.get('secret_token'))
                                    idUser = results[0].ID_Usuario;
                                    idType = results[0].ID_TipoUsuario;
                                    const token = jwt.sign({ usuario, idUser, idType }, server.get('secret_token'), { expiresIn: 525600 })
                                    const respuesta = [token]
                                    //console.log(results)
                                    res.header('Authorization', 'Bearer ' + token);
                                    res.status(200).send({
                                        mensaje: 'Autenticación correcta',
                                        Token: token,
                                        ID: idType
                                    })
                                }
                                else {
                                    res.status(403).send({ error: "La contraseña ingresada es incorrecta" })
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                res.status(400).send({ error: "Ocurrió un error al intentar verificar email y contraseña.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
                            })
                    })
                }
                else {
                    res.status(401).send({ error: "Su cuenta no está habilitada, por falta de pago. Por favor, contacte a administración." })
                }
            }
            else {
                res.status(401).send({ error: "El email ingresado no posee cuenta." })
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ error: "Ocurrió un error al intentar verificar email.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
        })
})

//GET DATOS USUARIO
router.get('/misdatos/:idUsuario', autorizarUsuario, (req, res) => {
    const ID_Usuario = req.params.idUsuario
    db.query('SELECT * FROM usuarios WHERE ID_Usuario = ?',
        { replacements: [ID_Usuario] })
        .then((respuesta) => {
            const [results] = respuesta;
            res.status(200).send({
                mensaje: "Usuario consultado correctamente",
                resultado: results
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar actualizar usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
        })
})

//UPDATE USUARIO
router.put('/updateDatos/:idUsuario', autorizarUsuario, (req, res) => {
    const { Nombre, Apellido, Usuario, Sexo, Fecha, Telefono } = req.body
    const ID_Usuario = req.params.idUsuario
    db.query('SELECT * FROM usuarios WHERE Email = ? AND ID_Usuario <> ?',
        { replacements: [Usuario, ID_Usuario] })
        .then((respuesta) => {
            const [results] = respuesta;
            if (results == "") {
                db.query('UPDATE usuarios SET Sexo = ?, Nombre = ?, Apellido = ?, FechaNacimiento = ?, Email = ?, Telefono = ? WHERE (ID_Usuario = ?)',
                    { replacements: [Sexo, Nombre, Apellido, Fecha, Usuario, Telefono, ID_Usuario] })
                    .then((respuesta) => {
                        const [results] = respuesta;
                        res.status(200).send({ mensaje: "Usuario actualizado con éxito", resultado: "Ok" })
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(400).send({ error: "Ocurrió un error al intentar actualizar usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
                    })
            }
            else {
                res.status(200).send({ mensaje: "Email ya existente", resultado: "noOk" })
            }
        })
})

//GET TODOS LOS USUARIOS
router.get('/lookAllPlayers/:idUsuario', autorizarUsuario, (req, res) => {
    const ID_User = req.params.idUsuario;

    db.query(`SELECT t1.ID_Usuario, Jugador FROM
    (SELECT ID_Usuario, concat(Nombre, " ", Apellido) as Jugador FROM usuarios WHERE ID_Usuario <> ${ID_User} AND ID_TipoUsuario = 1) t1
    INNER JOIN
    (SELECT * FROM usuarios_habilitados WHERE habilitado = 1) t2
    ON t1.ID_Usuario = t2.ID_Usuario`)
        .then((respuesta) => {
            const [results] = respuesta;
            res.status(200).send({
                mensaje: "Usuarios consultados correctamente",
                resultado: results
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar actualizar usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
        })
})

//GET TODOS LOS USUARIOS
router.get('/getSocios', autorizarUsuario, (req, res) => {

    db.query(`SELECT t1.ID_Usuario, concat(Nombre, " ", Apellido) as Nombre, Email, t1.ID_Usuario, Habilitado FROM usuarios_habilitados t1
                INNER JOIN 
                (SELECT Nombre, Apellido, Email, ID_Usuario FROM usuarios) t2
                ON t1.ID_Usuario = t2.ID_Usuario
                ORDER BY Habilitado`)
        .then((respuesta) => {
            const [results] = respuesta;
            res.status(200).send({
                mensaje: "Usuarios consultados correctamente",
                resultado: results
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar actualizar usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
        })
})

//CAMBIA EL ESTADO 
router.get('/changeStatus/:idUsuario/:valor', autorizarUsuario, (req, res) => {
    const ID_User = req.params.idUsuario;
    const Valor = req.params.valor;
    db.query('UPDATE usuarios_habilitados SET `Habilitado` = ? WHERE (`ID_Usuario` = ?)',
        { replacements: [Valor, ID_User] })
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results)
            res.status(200).send({
                mensaje: "Usuario actualizado correctamente",
                resultado: results
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar actualizar usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
        })
})

//SE FIJA SI EXISTE EL MAIL
router.get('/checkMail/:mail', (req, res) => {
    const Correo = req.params.mail;

    db.query(`SELECT ID_Usuario, Salt FROM usuarios WHERE Email = '${Correo}'`)
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results)
            res.status(200).send({
                mensaje: "Usuario obtenido correctamente",
                resultado: results
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar actualizar usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
        })
})

router.get('/checkSalt/:user/:salt', (req, res) => {
    const IDUsuario = req.params.user;
    const Salt = req.params.salt

    db.query(`SELECT Salt FROM usuarios WHERE ID_Usuario = '${IDUsuario}'`)
        .then((respuesta) => {
            const [results] = respuesta;
            if (results[0].Salt.replace("/", "") == Salt) {
                res.status(200).send({
                    mensaje: "OK",
                    resultado: results
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar actualizar usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
        })
})

router.get('/renewPass/:user/:pass', (req, res) => {
    const IDUsuario = req.params.user;
    const Pass = req.params.pass;

    crypto.randomBytes(16, (err, salt) => {
        const newSalt = salt.toString('base64')
        crypto.pbkdf2(Pass, newSalt, 10000, 64, 'sha1', (err, key) => {
            const encryptedPass = key.toString('base64')
            console.log(encryptedPass, newSalt)
            db.query(`UPDATE usuarios SET Password = '${encryptedPass}', Salt = '${newSalt}' WHERE ID_Usuario = '${IDUsuario}'`)
                .then((respuesta) => {
                    const [results] = respuesta;
                    console.log(results)
                    res.status(200).send({ mensaje: 'OK' })
                })
                .catch((err) => {
                    res.status(400).send({ error: "Ocurrió un error al intentar crear usuario.", tipoError: err.name, errorIdentificado: err.parent.sqlMessage })
                })
        })
    })
})

router.get('/decrypt/:token', (req, res) => {
    let token = req.params.token;
    try {
        if (token) {
            const verificarToken = jwt.verify(token, server.get("secret_token"))
            res.status(200).send({
                mensaje: "Ok",
                resultado: verificarToken
            })
        }
        else {
            res.status(406).send({
                mensaje: "Token no proveída. Usuario no ingresado"
            });
        }
    }
    catch (err) {
        res.status(406).send({ mensaje: "Error de autorización" })
    }
})






module.exports = router;