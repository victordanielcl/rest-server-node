const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let attb = (type, name) => {
    return {
        type,
        required: [true, `El campo: '${name}' es necesario`]
    }
}

//Objeto para validar los roles del usuario
let rolesValidos = {
    values: ['ADMIN', 'EMPLEADO'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: attb(String, 'nombre'),
    email: {
        type: String,
        unique: true,
        required: [true, `El campo: 'email' es necesario`]
    },
    password: attb(String, 'password'),
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, `El campo: 'role' es necesario`],
        default: 'EMPLEADO',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Elimina la contraseña del objeto de respuesta
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} deve de ser unico' });

module.exports = mongoose.model('Usuarios', usuarioSchema);