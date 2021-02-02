

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());


//Directorio Publico
app.use( express.static('public'));


//Lectura y parseo del body
app.use( express.json() );

//Especificar ruta
app.use('/api/auth', require('./routes/auth') );


//Escuchar peticiones
app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`) 
});



//Rutas
/*
//Ejemplo
app.get('/', (req, res) =>{

    //console.log('se requiere el /');
    res.json({ ok : true})
 });
*/