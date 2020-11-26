const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//crear servidor express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//directorio publico
app.use( express.static('public') );

//Lectura y parseo del body
app.use( express.json() );

//rutas
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/events', require('./routes/eventsRouter'));


//escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
});
