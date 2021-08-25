require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/connection');

//crear servidor
const app = express();

//configurar cors
app.use(cors());

//lectura y parseo del body
app.use( express.json() );

//conectamos a bbdd
dbConnection();

//rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

//levantamos servidor
app.listen( process.env.PORT, () => {
    console.log("servidor corriendo en puerto " + process.env.PORT);
});