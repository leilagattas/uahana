const router = require('express').Router();
const { db, Sequelize } = require('../conexionBD');
var nodemailer = require('nodemailer');
const autorizarUsuario = require('../autorizacion');
var smtpTransport = require('nodemailer-smtp-transport');
var img = require("fs").readFileSync("./covid-img.jpeg");


//CONFIRMAR RESERVA
router.get('/confirmReservation/:idReserva/:tipo', autorizarUsuario, (req, res) => {
    console.log("entro")
    let ID_Reserva = req.params.idReserva;
    let tipo = req.params.tipo;
    console.log(tipo)

    db.query(`SELECT ID_Reserva, ID_Cancha, concat(Dia, "/", Mes, "/", Anio) as Fecha, Hora, TipoPartido, Nombre,
            t2.Email as Email_1, t3.Email as Email_2, t4.Email as Email_3, t5.Email as Email_4, NombreJugador2, NombreJugador3, NombreJugador4 FROM
        (SELECT * FROM reservas_realizadas WHERE ID_Reserva = ${ID_Reserva}) t1
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as Nombre  FROM usuarios) t2
        ON t1.ID_Usuario = t2.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador2 FROM usuarios) t3
        ON t1.Jugador2 = t3.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador3 FROM usuarios) t4
        ON t1.Jugador3 = t4.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador4 FROM usuarios) t5
        ON t1.Jugador4 = t5.ID_Usuario`)
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results[0])
            var transporter = nodemailer.createTransport({
                host: "vps-1979822-x.dattaweb.com",
                port: 465,
                secure: true,
                auth: {
                    user: "lawntenis@reservatuspot.com",
                    pass: "SpotCLT21@"
                }
            })
            let hora = results[0].Hora.toString().replace(".16", ":10").replace(".32", ":20").replace(".48", ":30").replace(".64", ":40").replace(".8", ":50")
            if (hora.length <= 2) {
                hora = hora + ":00"
            }
            //console.log(results[0].Email_2)
            if (tipo != "cancel") {

                if (results[0].Email_2 == 'invitado' || results[0].Email_3 == 'invitado' || results[0].Email_4 == 'invitado' ||
                    results[0].Email_2 == 'invitada' || results[0].Email_3 == 'invitada' || results[0].Email_4 == 'invitada') {
                    console.log("entro ok")
                    let cantidad = 0;
                    results[0].Email_2 == 'invitado' || results[0].Email_2 == 'invitado' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_3 == 'invitado' || results[0].Email_3 == 'invitado' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_4 == 'invitado' || results[0].Email_4 == 'invitado' ? cantidad += 1 : cantidad = cantidad;
                    var mailOptionsInvitado = {
                        from: "lawntenis@reservatuspot.com",
                        //to: "leilagattas@hotmail.com",
                        to: "lawnteniscordoba@gmail.com",
                        subject: "Reserva con Invitado",
                        text: `El jugador ${results[0].Nombre} ha realizado una reserva con ${cantidad} invitado/s.
                        A continuación, te informamos los datos de su reserva:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Número de cancha: ` + results[0].ID_Cancha + ` Tipo Partido: ` + results[0].TipoPartido,
                        html: `<h4> El jugador ${results[0].Nombre} ha realizado una reserva con <b>${cantidad} </b> invitado/s.</h4>
                            <h4>A continuación, te informamos los datos de tu reserva: </h4>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                            <p><b>    Hora: </b>` + hora + `<br>
                            <p><b>    Número de cancha: </b>` + results[0].ID_Cancha + `<br>
                            <p><b>    Tipo de Partido: </b>` + results[0].TipoPartido
                    }
                    transporter.sendMail(mailOptionsInvitado, (error, info) => {
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva de invitado enviada a administración correctamente" });
                            console.log("mail a administración enviado correctamente")
                        }
                    })
                }


                let maillist = []
                results[0].Email_1 != '' ? maillist.push(results[0].Email_1) : ''
                results[0].Email_2 != '' ? maillist.push(results[0].Email_2) : ''
                results[0].Email_3 != '' ? maillist.push(results[0].Email_3) : ''
                results[0].Email_4 != '' ? maillist.push(results[0].Email_4) : ''

                //PARA WEB
                if (results[0].Email_1 != '') {
                    console.log(maillist)
                    let jugadores;
                    if (results[0].NombreJugador3 != null) {
                        jugadores = results[0].Nombre + ", " + results[0].NombreJugador2 + ", " + results[0].NombreJugador3 + ", " + results[0].NombreJugador4;
                    }
                    else {
                        jugadores = results[0].Nombre + ", " + results[0].NombreJugador2;
                    }
                    var mailOptions1 = {
                        from: "lawntenis@reservatuspot.com",
                        //to: results[0].Email_1,
                        //to: "leilagattas@gmail.com",
                        to: maillist,
                        subject: "Reserva Exitosa",
                        text: `Hola. ${results[0].Nombre} ha realizado una reserva. IMPORTANTE No olvides CANCELAR con antelación en caso de no poder ir.
                        Evitá sanciones administrativas.    
                        A continuación, informamos los datos de su reserva:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Número de cancha: ` + results[0].ID_Cancha + `
                            Tipo Partido: ` + results[0].TipoPartido + ` (recordá que Single es 1 hora y Doble es 1 hora y media)
                            Jugadores: `+ jugadores,
                        html: `<p> Hola.</p>
                        <p> ${results[0].Nombre} ha realizado una reserva. </p>
                        <p> <b> IMPORTANTE </b></p>
                        <p> No olvides CANCELAR con antelación en caso de no poder ir. <b>Evitá sanciones administrativas</b> </p>
                        <p>A continuación, informamos los datos de su reserva: </p>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                        <p><b>    Hora: </b>` + hora + `<br>
                        <p><b>    Número de cancha: </b>` + results[0].ID_Cancha + `<br>
                        <p><b>    Tipo de Partido: </b>` + results[0].TipoPartido + ` (recordá que Single es 1 hora y Doble es 1 hora y media) <br>
                        <p><b>    Jugadores: </b>` + jugadores,
                        attachments: [{   // stream as an attachment
                            filename: 'protocolo_covid.jpg',
                            contentType: 'image/jpeg',
                            content: img
                        }]
                    }

                    transporter.sendMail(mailOptions1, (error, info) => {
                        //console.log("intenta enviar mail")
                        //console.log(mailOptions1)
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva enviada correctamente" });
                            console.log("mail enviado correctamente")
                        }
                    })
                }
                //}
            }
            else {

                if (results[0].Email_2 == 'invitado' || results[0].Email_3 == 'invitado' || results[0].Email_4 == 'invitado' ||
                    results[0].Email_2 == 'invitada' || results[0].Email_3 == 'invitada' || results[0].Email_4 == 'invitada') {
                    console.log("entro ok")
                    let cantidad = 0;
                    results[0].Email_2 == 'invitado' || results[0].Email_2 == 'invitado' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_3 == 'invitado' || results[0].Email_3 == 'invitado' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_4 == 'invitado' || results[0].Email_4 == 'invitado' ? cantidad += 1 : cantidad = cantidad;
                    var mailOptionsInvitado = {
                        from: "lawntenis@reservatuspot.com",
                        //to: "leilagattas@hotmail.com",
                        to: "lawnteniscordoba@gmail.com",
                        subject: "Cancelación reserva con Invitado",
                        text: `El jugador ${results[0].Nombre} ha cancelado una reserva con ${cantidad} invitado/s.
                        A continuación, te informamos los datos de su reserva:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Número de cancha: ` + results[0].ID_Cancha + ` Tipo Partido: ` + results[0].TipoPartido,
                        html: `<h4> El jugador ${results[0].Nombre} ha cancelado una reserva con <b>${cantidad} </b> invitado/s.</h4>
                            <h4>A continuación, te informamos los datos de tu reserva: </h4>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                            <p><b>    Hora: </b>` + hora + `<br>
                            <p><b>    Número de cancha: </b>` + results[0].ID_Cancha + `<br>
                            <p><b>    Tipo de Partido: </b>` + results[0].TipoPartido
                    }
                    transporter.sendMail(mailOptionsInvitado, (error, info) => {
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva de invitado enviada a administración correctamente" });
                            console.log("mail a administración enviado correctamente")
                        }
                    })
                }
                //PARA WEB
                let maillist = []
                results[0].Email_1 != '' ? maillist.push(results[0].Email_1) : ''
                results[0].Email_2 != '' ? maillist.push(results[0].Email_2) : ''
                results[0].Email_3 != '' ? maillist.push(results[0].Email_3) : ''
                results[0].Email_4 != '' ? maillist.push(results[0].Email_4) : ''

                if (results[0].Email_1 != '') {

                    var mailOptions = {
                        from: "lawntenis@reservatuspot.com",
                        //to: "leilagattas@gmail.com",
                        to: maillist,
                        subject: "Reserva Cancelada",
                        text: `Hola. Tu reserva ha sido cancelada con éxito!
                    A continuación, te informamos los datos de tu reserva cancelada:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Número de cancha: ` + results[0].ID_Cancha + ` Tipo Partido: ` + results[0].TipoPartido,
                        html: `<h3> Hola.</h3>
                <h4> Tu reserva ha sido cancelada con éxito!</h4>
                <h4>A continuación, te informamos los datos de tu reserva cancelada: </h4>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                <p><b>    Hora: </b>` + hora + `<br>
                <p><b>    Número de cancha: </b>` + results[0].ID_Cancha + `<br>
                <p><b>    Tipo de Partido: </b>` + results[0].TipoPartido
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva enviada correctamente" });
                            console.log("mail enviado correctamente")
                            i += 1
                        }
                    })
                }
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar enviar el mail" })
        })
})

//ENVIAR MAIL RESERVA GYM
router.get('/confirmReservationGym/:idReserva/:idUsuario/:tipo', autorizarUsuario, (req, res) => {
    let ID_Reserva = req.params.idReserva;
    let ID_Usuario = req.params.idUsuario
    let tipo = req.params.tipo;
    console.log(tipo)

    db.query(`SELECT Fecha, Hora, Nombre, Email FROM
    (SELECT ID_Reserva, concat(Dia, "/", Mes, "/", Anio) as Fecha, Hora, ${ID_Usuario} as ID_Usuario FROM reservas_gym WHERE ID_Reserva = ${ID_Reserva}) t1
    INNER JOIN
    (SELECT ID_Usuario, concat(Nombre, " ", Apellido) AS Nombre, Email FROM usuarios) t2
    ON t1.ID_Usuario = t2.ID_Usuario`)
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results[0])
            var transporter = nodemailer.createTransport({
                host: "vps-1979822-x.dattaweb.com",
                port: 465,
                secure: true,
                auth: {
                    user: "lawntenis@reservatuspot.com",
                    pass: "SpotCLT21@"
                }
            })
            let hora = results[0].Hora.toString() + ":00"

            if (tipo != "cancel") {
                var mailOptionsGym = {
                    from: "lawntenis@reservatuspot.com",
                    to: results[0].Email,
                    subject: "Reserva de Gimnasio",
                    text: `Hola ${results[0].Nombre}. Tu reserva del gimnasio se ha realizado correctamente. IMPORTANTE No olvides CANCELAR con antelación en caso de no poder ir.
                    Evitá sanciones administrativas.
                            A continuación, informamos los datos de su reserva:` +
                        `Fecha: ` + results[0].Fecha + ` Hora: ` + hora,
                    html: `<p> Hola ${results[0].Nombre}.</p>
                        <p>Tu reserva del gimnasio se ha realizado correctamente. </p>
                        <p> <b> IMPORTANTE </b></p>
                        <p> No olvides CANCELAR con antelación en caso de no poder ir. <b>Evitá sanciones administrativas</b> </p>
                        <p>A continuación, informamos los datos de su reserva: </p>` +
                        `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                        <p><b>    Hora: </b>` + hora,
                    attachments: [{   // stream as an attachment
                        filename: 'protocolo_covid.jpg',
                        contentType: 'image/jpeg',
                        content: img
                    }]
                }
                transporter.sendMail(mailOptionsGym, (error, info) => {
                    if (error) {
                        console.log(error.message)
                        res.status(500).send(error.message)
                    }
                    else {
                        res.status(200).send({ mensaje: "Reserva de gym enviada correctamente" });
                        console.log("mail de gym enviado correctamente")
                    }
                })
            }
            else {
                var mailOptionsGym = {
                    from: "lawntenis@reservatuspot.com",
                    to: results[0].Email,
                    subject: "Cancelación de Gimnasio",
                    text: `Hola ${results[0].Nombre}. Tu reserva del gimnasio se ha cancelado correctamente!.
                            A continuación, informamos los datos de su reserva:` +
                        `Fecha: ` + results[0].Fecha + ` Hora: ` + hora,
                    html: `<h3> Hola ${results[0].Nombre}.</h3>
                        <h4>Tu reserva del gimnasio se ha cancelado correctamente! </h4>
                        <h4>A continuación, informamos los datos de su reserva: </h4>` +
                        `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                        <p><b>    Hora: </b>` + hora,
                }
                transporter.sendMail(mailOptionsGym, (error, info) => {
                    if (error) {
                        console.log(error.message)
                        res.status(500).send(error.message)
                    }
                    else {
                        res.status(200).send({ mensaje: "Reserva de gym enviada correctamente" });
                        console.log("mail de gym enviado correctamente")
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar enviar el mail" })
        })
})


//CANCELAR RESERVA GIMNASIO
router.get('/cancelReservation/:idReserva', autorizarUsuario, (req, res) => {

    let ID_Reserva = req.params.idReserva;

    db.query(`SELECT ID_Reserva, concat(Dia, "/", Mes, "/", Anio) as Fecha, Hora, Nombre, t2.Email as Email FROM
        (SELECT * FROM reservas_gym WHERE ID_Reserva = ${ID_Reserva}) t1
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as Nombre  FROM usuarios) t2
        ON t1.ID_Usuario = t2.ID_Usuario`)
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results[0])
            var transporter = nodemailer.createTransport({
                host: "vps-1979822-x.dattaweb.com",
                port: 465,
                secure: true,
                auth: {
                    user: "lawntenis@reservatuspot.com",
                    pass: "SpotCLT21@"
                }
            })
            let hora = results[0].Hora.toString().replace(".16", ":10").replace(".32", ":20").replace(".48", ":30").replace(".64", ":40").replace(".8", ":50")
            if (hora.length <= 2) {
                hora = hora + ":00"
            }
            var mailOptions = {
                from: "lawntenis@reservatuspot.com",
                //to: "leilagattas@gmail.com",
                to: results[0].Email_1,
                subject: "Reserva Cancelada",
                text: `Hola. Tu reserva de gimnasio ha sido cancelada con éxito!
                            A continuación, te informamos los datos de tu reserva cancelada:` +
                    `Fecha: ` + results[0].Fecha + ` Hora: ` + hora,
                html: `<h3> Hola.</h3>
                        <h4> Tu reserva de gimnasio ha sido cancelada con éxito!</h4>
                        <h4>A continuación, te informamos los datos de tu reserva cancelada: </h4>` +
                    `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                        <p><b>    Hora: </b>` + hora + `<br>`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error.message)
                    res.status(500).send(error.message)
                }
                else {
                    res.status(200).send({ mensaje: "Reserva enviada correctamente" });
                    console.log("mail enviado correctamente")
                    i += 1
                }
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar enviar el mail" })
        })
})


router.post('/recuperarPass/:salt/:idUsuario', (req, res) => {
    console.log("entro")
    let ID_Usuario = req.params.idUsuario;
    let Salt = req.params.salt;
    let { Email } = req.body;
    console.log(Email)
    //let link = `http://localhost:4200/recuperarPass/${ID_Usuario}_${Salt}`
    let link = `https://www.reservatuspot.com/lawntenis/recuperarPass/${ID_Usuario}_${Salt}`


    var transporter = nodemailer.createTransport({
        // service: 'Gmail',
        // host: 'smtp.gmail.com',
        // auth: {
        //     user: 'hoysejuegacba@gmail.com',
        //     pass: 'Ringo2107!'
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
        to: Email,
        //to: "leilagattas@gmail.com",
        subject: "Recuperar Contraseña",
        text: `Hola. Hacé click en el siguiente link y generá una contraseña nueva: ${link} `,
        html: `<h3> Hola.</h3>
                    <h4> Hacé click en el siguiente link y generá una contraseña nueva: </h4>
                    <a href=${link}>Click Aquí</a>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
        else {
            res.status(200).send({ mensaje: "Recuperar contraseña enviada correctamente" });
            console.log("mail enviado correctamente")
        }
    })
})


//ESTO SE BORRA
//CONFIRMAR RESERVA
router.get('/confirmReservationSbart/:idReserva/:tipo', autorizarUsuario, (req, res) => {
    console.log("entro")
    let ID_Reserva = req.params.idReserva;
    let tipo = req.params.tipo;
    console.log(tipo)

    db.query(`SELECT ID_Reserva, ID_Cancha, concat(Dia, "/", Mes, "/", Anio) as Fecha, Hora, TipoPartido, Nombre,
            t2.Email as Email_1, t3.Email as Email_2, t4.Email as Email_3, t5.Email as Email_4, NombreJugador2, NombreJugador3, NombreJugador4 FROM
        (SELECT * FROM reservas_realizadas WHERE ID_Reserva = ${ID_Reserva}) t1
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as Nombre  FROM usuarios) t2
        ON t1.ID_Usuario = t2.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador2 FROM usuarios) t3
        ON t1.Jugador2 = t3.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador3 FROM usuarios) t4
        ON t1.Jugador3 = t4.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador4 FROM usuarios) t5
        ON t1.Jugador4 = t5.ID_Usuario`)
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results[0])
            var transporter = nodemailer.createTransport({
                host: "vps-1979822-x.dattaweb.com",
                port: 465,
                secure: true,
                auth: {
                    user: "lawntenis@reservatuspot.com",
                    pass: "SpotCLT21@"
                }
            })
            let hora = results[0].Hora.toString().replace(".16", ":10").replace(".32", ":20").replace(".48", ":30").replace(".64", ":40").replace(".8", ":50")
            if (hora.length <= 2) {
                hora = hora + ":00"
            }
            //console.log(results[0].Email_2)
            if (tipo != "cancel") {

                if (results[0].Email_2 == 'invitado' || results[0].Email_3 == 'invitado' || results[0].Email_4 == 'invitado' ||
                    results[0].Email_2 == 'invitada' || results[0].Email_3 == 'invitada' || results[0].Email_4 == 'invitada') {
                    console.log("entro ok")
                    let cantidad = 0;
                    results[0].Email_2 == 'invitado' || results[0].Email_2 == 'invitada' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_3 == 'invitado' || results[0].Email_3 == 'invitada' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_4 == 'invitado' || results[0].Email_4 == 'invitada' ? cantidad += 1 : cantidad = cantidad;
                    var mailOptionsInvitado = {
                        from: "lawntenis@reservatuspot.com",
                        //to: "leilagattas@hotmail.com",
                        to: "lawnteniscordoba@gmail.com",
                        subject: "Reserva con Invitado",
                        text: `El jugador ${results[0].Nombre} ha realizado una reserva con ${cantidad} invitado/s.
                        A continuación, te informamos los datos de su reserva:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Número de cancha: ` + results[0].ID_Cancha + ` Tipo Partido: ` + results[0].TipoPartido,
                        html: `<h4> El jugador ${results[0].Nombre} ha realizado una reserva con <b>${cantidad} </b> invitado/s.</h4>
                            <h4>A continuación, te informamos los datos de tu reserva: </h4>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                            <p><b>    Hora: </b>` + hora + `<br>
                            <p><b>    Número de cancha: </b>` + results[0].ID_Cancha + `<br>
                            <p><b>    Tipo de Partido: </b>` + results[0].TipoPartido
                    }
                    transporter.sendMail(mailOptionsInvitado, (error, info) => {
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva de invitado enviada a administración correctamente" });
                            console.log("mail a administración enviado correctamente")
                        }
                    })
                }


                let maillist = []
                results[0].Email_1 != '' ? maillist.push(results[0].Email_1) : ''
                results[0].Email_2 != '' ? maillist.push(results[0].Email_2) : ''
                results[0].Email_3 != '' ? maillist.push(results[0].Email_3) : ''
                results[0].Email_4 != '' ? maillist.push(results[0].Email_4) : ''

                //PARA WEB
                if (results[0].Email_1 != '') {
                    console.log(maillist)
                    let jugadores;
                    if (results[0].NombreJugador3 != null) {
                        jugadores = results[0].Nombre + ", " + results[0].NombreJugador2 + ", " + results[0].NombreJugador3 + ", " + results[0].NombreJugador4;
                    }
                    else {
                        jugadores = results[0].Nombre + ", " + results[0].NombreJugador2;
                    }
                    var mailOptions1 = {
                        from: "lawntenis@reservatuspot.com",
                        //to: results[0].Email_1,
                        //to: "leilagattas@gmail.com",
                        to: maillist,
                        subject: "Reserva Exitosa",
                        text: `Hola. ${results[0].Nombre} ha realizado una reserva. IMPORTANTE No olvides CANCELAR con antelación en caso de no poder ir.
                        Evitá sanciones administrativas.    
                        A continuación, informamos los datos de su reserva:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + `
                            Lugar: San Bartolomé, Jorge E. Ordóñez 326, Córdoba (recordá que el turno es de 1 hora)
                            Jugadores: `+ jugadores,
                        html: `<p> Hola.</p>
                        <p> ${results[0].Nombre} ha realizado una reserva. </p>
                        <p> <b> IMPORTANTE </b></p>
                        <p> No olvides CANCELAR con antelación en caso de no poder ir. <b>Evitá sanciones administrativas</b> </p>
                        <p>A continuación, informamos los datos de su reserva: </p>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                        <p><b>    Hora: </b>` + hora + `<br>
                        <p><b>    Lugar: </b> San Bartolomé, Jorge E. Ordóñez 326, Córdoba (recordá que el turno es de 1 hora)<br>
                        <p><b>    Jugadores: </b>` + jugadores,
                        attachments: [{   // stream as an attachment
                            filename: 'protocolo_covid.jpg',
                            contentType: 'image/jpeg',
                            content: img
                        }]
                    }

                    transporter.sendMail(mailOptions1, (error, info) => {
                        //console.log("intenta enviar mail")
                        //console.log(mailOptions1)
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva enviada correctamente" });
                            console.log("mail enviado correctamente")
                        }
                    })
                }
                //}
            }
            else {
                if (results[0].Email_2 == 'invitado' || results[0].Email_3 == 'invitado' || results[0].Email_4 == 'invitado' ||
                    results[0].Email_2 == 'invitada' || results[0].Email_3 == 'invitada' || results[0].Email_4 == 'invitada') {
                    console.log("entro ok")
                    let cantidad = 0;
                    results[0].Email_2 == 'invitado' || results[0].Email_2 == 'invitada' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_3 == 'invitado' || results[0].Email_3 == 'invitada' ? cantidad += 1 : cantidad = cantidad;
                    results[0].Email_4 == 'invitado' || results[0].Email_4 == 'invitada' ? cantidad += 1 : cantidad = cantidad;
                    var mailOptionsInvitado = {
                        from: "lawntenis@reservatuspot.com",
                        //to: "leilagattas@hotmail.com",
                        to: "lawnteniscordoba@gmail.com",
                        subject: "Reserva con Invitado",
                        text: `El jugador ${results[0].Nombre} ha cancelado una reserva con ${cantidad} invitado/s.
                        A continuación, te informamos los datos de su reserva:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Número de cancha: ` + results[0].ID_Cancha + ` Tipo Partido: ` + results[0].TipoPartido,
                        html: `<h4> El jugador ${results[0].Nombre} ha cancelado una reserva con <b>${cantidad} </b> invitado/s.</h4>
                            <h4>A continuación, te informamos los datos de tu reserva: </h4>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                            <p><b>    Hora: </b>` + hora + `<br>
                            <p><b>    Número de cancha: </b>` + results[0].ID_Cancha + `<br>
                            <p><b>    Tipo de Partido: </b>` + results[0].TipoPartido
                    }
                    transporter.sendMail(mailOptionsInvitado, (error, info) => {
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva de invitado enviada a administración correctamente" });
                            console.log("mail a administración enviado correctamente")
                        }
                    })
                }

                //PARA WEB
                let maillist = []
                results[0].Email_1 != '' ? maillist.push(results[0].Email_1) : ''
                results[0].Email_2 != '' ? maillist.push(results[0].Email_2) : ''
                results[0].Email_3 != '' ? maillist.push(results[0].Email_3) : ''
                results[0].Email_4 != '' ? maillist.push(results[0].Email_4) : ''

                if (results[0].Email_1 != '') {

                    var mailOptions = {
                        from: "lawntenis@reservatuspot.com",
                        //to: "leilagattas@gmail.com",
                        to: maillist,
                        subject: "Reserva Cancelada",
                        text: `Hola. Tu reserva ha sido cancelada con éxito!
                    A continuación, te informamos los datos de tu reserva cancelada:` +
                            `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Lugar: San Bartolomé, Jorge E. Ordóñez 326, Córdoba (recordá que el turno es de 1 hora)`,
                        html: `<h3> Hola.</h3>
                <h4> Tu reserva ha sido cancelada con éxito!</h4>
                <h4>A continuación, te informamos los datos de tu reserva cancelada: </h4>` +
                            `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                <p><b>    Hora: </b>` + hora + `<br>
                <p><b>    Lugar: </b> San Bartolomé, Jorge E. Ordóñez 326, Córdoba (recordá que el turno es de 1 hora)`
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error.message)
                            res.status(500).send(error.message)
                        }
                        else {
                            res.status(200).send({ mensaje: "Reserva enviada correctamente" });
                            console.log("mail enviado correctamente")
                            i += 1
                        }
                    })
                }
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar enviar el mail" })
        })
})



//MAILS AUSENTES
router.get('/ausencia/:idReserva', autorizarUsuario, (req, res) => {
    console.log("entro")
    let ID_Reserva = req.params.idReserva;

    db.query(`SELECT ID_Reserva, ID_Cancha, concat(Dia, "/", Mes, "/", Anio) as Fecha, Hora, TipoPartido, Nombre,
            t2.Email as Email_1, t3.Email as Email_2, t4.Email as Email_3, t5.Email as Email_4, NombreJugador2, NombreJugador3, NombreJugador4 FROM
        (SELECT * FROM reservas_realizadas WHERE ID_Reserva = ${ID_Reserva}) t1
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as Nombre  FROM usuarios) t2
        ON t1.ID_Usuario = t2.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador2 FROM usuarios) t3
        ON t1.Jugador2 = t3.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador3 FROM usuarios) t4
        ON t1.Jugador3 = t4.ID_Usuario
        LEFT JOIN
        (SELECT Email, ID_Usuario, concat(Nombre, " ", Apellido) as NombreJugador4 FROM usuarios) t5
        ON t1.Jugador4 = t5.ID_Usuario`)
        .then((respuesta) => {
            const [results] = respuesta;
            console.log(results[0])
            var transporter = nodemailer.createTransport({
                host: "vps-1979822-x.dattaweb.com",
                port: 465,
                secure: true,
                auth: {
                    user: "lawntenis@reservatuspot.com",
                    pass: "SpotCLT21@"
                }
            })
            let hora = results[0].Hora.toString().replace(".16", ":10").replace(".32", ":20").replace(".48", ":30").replace(".64", ":40").replace(".8", ":50")
            if (hora.length <= 2) {
                hora = hora + ":00"
            }
            let maillist = []
            results[0].Email_1 != '' ? maillist.push(results[0].Email_1) : ''
            results[0].Email_2 != '' ? maillist.push(results[0].Email_2) : ''
            results[0].Email_3 != '' ? maillist.push(results[0].Email_3) : ''
            results[0].Email_4 != '' ? maillist.push(results[0].Email_4) : ''

            if (results[0].Email_1 != '') {

                var mailOptions = {
                    from: "lawntenis@reservatuspot.com",
                    //to: "leilagattas@gmail.com",
                    to: maillist,
                    subject: "Turno Ausente",
                    text: `Hola. Tenías una reserva para el día de hoy, y no asististe. Recuerda que para evitar sanciones, debes cancelar tus reservas, en caso de no poder asistir. 
                    A continuación, te informamos los datos de tu reserva ausente:` +
                        `Fecha: ` + results[0].Fecha + ` Hora: ` + hora + ` Número de cancha: ` + results[0].ID_Cancha + ` Tipo Partido: ` + results[0].TipoPartido + ` Saludos`,
                    html: `<h3> Hola.</h3>
                <h4> Hola. Tenías una reserva para el día de hoy, y no asististe. Recuerda que para evitar sanciones, debes cancelar tus reservas, en caso de no poder asistir. </h4>
                <h4>A continuación, te informamos los datos de tu reserva ausente: </h4>` +
                        `<p><b>    Fecha: </b>` + results[0].Fecha + `<br> 
                <p><b>    Hora: </b>` + hora + `<br>
                <p><b>    Número de cancha: </b>` + results[0].ID_Cancha + `<br>
                <p><b>    Tipo de Partido: </b>` + results[0].TipoPartido + `<br>
                <p> Saludos, </p>`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error.message)
                        res.status(500).send(error.message)
                    }
                    else {
                        res.status(200).send({ mensaje: "Ausente enviada correctamente" });
                        console.log("mail enviado correctamente")
                        i += 1
                    }
                })
            }

        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ error: "Ocurrió un error al intentar enviar el mail" })
        })
})

module.exports = router;