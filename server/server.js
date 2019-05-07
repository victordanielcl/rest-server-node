require('./config/config');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.json('get Usuario')
})

app.post('/usuarios', function(req, res) {
    let body = req.body;
    res.json({ body });
})

app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json('put Usuario: ' + id);
})

app.delete('/usuarios', function(req, res) {
    res.json('delete Usuario')
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto: ", process.env.PORT);
});