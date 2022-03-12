const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const slug = require('slug');
const { isPremium } = require('../controllers/users.controllers');
const transporter = require('../controllers/nodemailer');
const { v4 } = require('uuid');

const User = require('../models/User');
const { encryptPassword, comparePassword } = require('../database');

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    // const findUser = getConnection().get('users').find({ id: id }).value();
    if (user) {
        if (user.isBanned) {
            return done(null, false)
        } else {
            isPremium(user)
            done(null, user)
        }
    } else {
        return done(null, false)
    }
})

passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const um = await User.findOne({ email: email })
    // const u = getConnection().get('users').find({ email: email }).value();

    if (um) {
        return done(null, false, req.flash('registerMessage', 'El Email ya existe en mi base de datos.'))
    } else {
        const slugUser = slug(req.body.user)
        const sum = await User.findOne({ slug: slugUser })
        // const su = getConnection().get('users').find({ slug: slugUser }).value();
        if (sum) {
            return done(null, false, req.flash('registerMessage', 'No hemos podido registrarte con ese nombre.'))
        } else {
            let ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let IP = ips.replace('::ffff:', '')
            /* const asers = getConnection().get('users').value();
            const users = [];
            // var ip = req.headers['cf-connecting-ip']
            var ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            var ip = ips.replace('::ffff:', '')
            asers.forEach(function(uuser) {
                if (uuser.IP == ip) {
                    users.push(uuser)
                }
            }); */
            const users = await User.find({ IP: IP })
            if (users.length >= 2) {
                return done(null, false, req.flash('registerMessage', 'Ya tienes dos cuentas.'))
            } else {
                var today = new Date()
                today = today.getDate()+'-'+parseInt(today.getMonth()+1)+'-'+today.getFullYear()+' '+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
                // getConnection().get('users').push(newUser).write();
                const newUser = new User({
                    user: req.body.user,
                    email: email,
                    password: encryptPassword(password),
                    IP: IP,
                    slug: slugUser,
                    roles: "user",
                    rango: "J1",
                    image: "https://images.squarespace-cdn.com/content/v1/562146dae4b018ac1df34d5f/1450121660392-KS2FGMOXB7VL1JNQ487I/person-placeholder.jpg?format=1000w",
                    banner: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/welcome-banner-design-template-61084152870e4a055056a7efc73a2359_screen.jpg?ts=1569136045",
                    bio: "¡Soy nuevo!",
                    isBanned: false,
                    isVerify: v4(),
                    premium: {
                        end: false,
                        codes: 0
                    },
                        joined: today
                })
                await newUser.save();
                await transporter.sendMail({
                    from: '"Confirm Email" <confirm@iland.ga>', 
                    to: newUser.email,
                    subject: "Confirm Email ✔",
                    html: `
                        <b>Hey, ¡hola ${newUser.user}! Verifica tu cuenta aqui http://127.0.0.1:3000/token/${newUser.isVerify}</b>
                    `, // html body
                  });
                done(null, newUser)
            }
        }
    }
}))

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    // const user = getConnection().get('users').find({ email: email }).value();
    const user = await User.findOne({ email: email })

    if (!user) {
        return done(null, false, req.flash('loginMessage', 'No se encontro al Usuario.'))
    }

    const pm = comparePassword(password, user.password)

    if (!pm) {
        return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.'))
    }

    let ip = req.headers['cf-connecting-ip']
    // let ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    // let ip = ips.replace('::ffff:', '')

    if (user.isBanned) {
        return done(null, false, req.flash('loginMessage', 'Su cuenta ha sido baneada.'))
    }

    /*
    var r1 = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,query`)
    var r1json = await r1.json();
    var r2 = await fetch(`http://ip-api.com/json/${user.IP}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,query`)
    var r2json = await r2.json();
    if (r2json.isp != r1json.isp) {
        return done(null, false, req.flash('loginMessage', 'Parece que te estas conectando desde otra zona.'))
    }
    */

    done(null, user)
}))