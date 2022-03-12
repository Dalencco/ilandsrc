const { Schema, model } = require('mongoose');

const BlogSchema = new Schema({
    autorid: String,
    autorslug: String,
    autor: String,
    slug: String,
    name: String,
    content: String,
    descripcion: String,
    imagen: String
}, {
    versionKey: false,
    timestamps: false
})

module.exports = model('Blog', BlogSchema);