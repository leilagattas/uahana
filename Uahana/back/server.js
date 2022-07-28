const fs = require('fs');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const { db, Sequelize } = require('./conexionBD');

const app = express();
var port = process.env.PORT || 4000;
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// const rutasReservas = require('./rutas/reservas')
// const rutasUser = require('./rutas/user')
// const rutasMailer = require('./rutas/mailer')
// const rutasCalendario = require('./rutas/calendario')

// const rutasInvitados = require('./rutas/invitados')
// app.use('/invitados', rutasInvitados)

// app.use('/reservas', rutasReservas)
// app.use('/user', rutasUser)
// app.use('/mailer', rutasMailer)
// app.use('/calendario', rutasCalendario)

//TESTING

const rutasReservasTesting = require('./rutas/reservas')
const rutasUserTesting = require('./rutas/user')
const rutasMailerTesting = require('./rutas/mailer')
const rutasCalendarioTesting = require('./rutas/calendario')

app.use('/reservas', rutasReservasTesting)
app.use('/user', rutasUserTesting)
app.use('/mailer', rutasMailerTesting)
app.use('/calendario', rutasCalendarioTesting)


const today = new Date()

//ESTO SIRVE PARA LOCAL 
app.listen(4000, () => console.log("Servidor en puerto " + port + ", iniciado " + today))


//ESTO SIRVE PARA WEB
// https.createServer(
//     {
//         key: fs.readFileSync('./privkey.pem'),
//         cert: fs.readFileSync('./cert.pem'),
//         ca: fs.readFileSync('./chain.pem'),
//     },
//     app)
//     .listen(4000, () => {
//         console.log('Listening...')
//     })
