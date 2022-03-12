const { Schema, model } = require('mongoose');

PCodesSchema = new Schema({
    userid: String,
    slug: String
}, {
    versionKey: false
})

module.exports = model('PCodes', PCodesSchema);