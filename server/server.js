require('./config/config');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Configuracion de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (err) throw err;
    console.log("Base de datos online");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto: ", process.env.PORT);
});