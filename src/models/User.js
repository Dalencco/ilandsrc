const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    user: String,
    email: String,
    password: String,
    IP: String,
    slug: String,
    roles: String,
    rango: String,
    image: String,
    banner: String,
    bio: String,
    isBanned: Boolean,
    isVerify: String,
    premium: {
        end: String,
        codes: Number
    },
    joined: String
}, {
    versionKey: false,
    timestamps: false
})

module.exports = model('User', UserSchema);