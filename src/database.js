const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const config = require('./config/config');

mongoose.connect(config.MONGODB, {
    useNewUrlParser: true
})
    .then(db => console.log('DB Conectada'))
    .then(ex => console.log(mongoose.STATES[mongoose.connection.readyState]))

var encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

var comparePassword = function (password, password2) {
    return bcrypt.compareSync(password, password2)
}

module.exports = {
    encryptPassword,
    comparePassword
}