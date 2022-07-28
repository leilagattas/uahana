const Sequelize = require('sequelize');

// let database = "spot_lawn";
// let username = "spot_lawn";
// let passwordDB = "Spot1812@";

// const db = new Sequelize(database, username, passwordDB, {
//     host: '168.197.49.240',
//     dialect: 'mysql'
// });

let database = "uahana"
let username = "root";
let passwordDB = "root";

const db = new Sequelize(database, username, passwordDB, {
    host: '127.0.0.1',
    dialect: 'mysql'
});

db.authenticate()
    .then(() => console.log('La conexión fue exitosa'))
    .catch((err) => console.log('Ocurrió un error'))

module.exports = { db, Sequelize };