const { Schema, model } = require('mongoose');

const newSchema = new Schema({
    autorid: String,
    name: String,
    descripcion: String,
    para: String
})

module.exports = model('New', newSchema)