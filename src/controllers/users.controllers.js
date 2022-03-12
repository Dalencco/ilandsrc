const { getConnection } = require("../database");
const passport = require("passport");
const dayjs = require('dayjs');
const customFormat = require('dayjs/plugin/customParseFormat');
const isToday = require('dayjs/plugin/isToday')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const User = require('../models/User');
const New = require('../models/New');

dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);
dayjs.extend(customFormat);

const home = (req, res) => {
  const auth = req.isAuthenticated();
  res.render("home", { auth });
};

const register = (req, res) => {
  res.render("register");
};

const createUser = passport.authenticate("local-register", {
  successRedirect: "/profile",
  failureRedirect: "/register",
  failureFlash: true,
});

const login = passport.authenticate("local-login", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
});

const l = (req, res) => {
  res.render("login");
};

const logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

const perfil = async (req, res) => {
  // const user = getConnection().get("users").find({ id: req.user.id }).value();
  const user = await User.findById(req.user.id)
  if (user.isVerify == "true") {
    res.render("perfil", { user });
  } else {
    res.redirect("/")
  }
};

const perfiles = async (req, res) => {
  const auth = req.isAuthenticated();
  // const users = getConnection().get("users").value();
  const users = await User.find()
  res.render("perfiles", { users, auth });
};

const admin = async (req, res) => {
  const auth = req.isAuthenticated();
  // const user = getConnection().get("users").find({ id: req.user.id }).value();
  const user = await User.findById(req.user.id)
  if (user.roles == "Admin" || user.roles == "Mod") {
    res.render("admin", { user });
  } else {
    res.render("404", { auth });
  }
};

const renderEditPerfil = async (req, res) => {
  // const user = getConnection().get("users").find({ id: req.user.id }).value();
  const user = await User.findById(req.user.id)
  res.render("editperfil", { user });
};

const editPerfil = async (req, res) => {
  // const user = getConnection().get("users").find({ id: req.user.id }).value();
  const user = await User.findById(req.user.id)
  let imagen;
  let username;
  let banner;
  let biografia;
  if (req.body.imagen) {
    imagen = req.body.imagen;
    if (user.premium.end == "false") {
      if (imagen.includes("gif")) {
        imagen = user.image;
      } else {
        imagen = req.body.imagen;
      }
    } else {
      imagen = req.body.imagen;
    }
  } else {
    imagen = user.image;
  }

  if (req.body.banner) {
    banner = req.body.banner;
    if (user.premium.end == "false") {
      if (banner.includes("gif")) {
        banner = user.banner;
      } else {
        banner = req.body.banner;
      }
    } else {
      banner = req.body.banner;
    }
  } else {
    banner = user.banner;
  }

  if (req.body.bio) {
    biografia = req.body.bio;
  } else {
    biografia = user.bio;
  }

  if (req.body.user) {
    username = req.body.user;
  } else {
    username = user.user;
  }
  await User.findByIdAndUpdate(user.id, {
    user: username,
    email: user.email,
    password: user.password,
    IP: user.IP,
    slug: user.slug,
    roles: user.roles,
    rango: user.rango,
    image: imagen,
    banner: banner,
    bio: biografia,
    isBanned: user.isBanned,
    isVerify: user.isVerify,
    premium: {
        end: user.premium.end,
        codes: user.premium.codes
    },
    joined: user.joined
  })
  res.redirect('/profile')
};

const renderPerfil = async (req, res) => {
  const auth = req.isAuthenticated();
  // const user = getConnection().get("users").find({ slug: req.params.slug }).value();
  const user = await User.findOne({ slug: req.params.slug })
  if (user) {
    res.render("verPerfil", { user, auth });
  } else {
    res.render('404', { auth })
  }
};

const renderNews = async (req, res) => {
  // const user = getConnection().get("users").find({ id: req.user.id }).value();
  // const news = getConnection().get("news").value();
  // const gnews = [];
  // const pnews = [];
  const user = await User.findById(req.user.id)
  const gnews = await New.find({ para: "global" })
  const pnews = await New.find({ para: user.id })
  res.render("news", { user, gnews, pnews })
}

const renderPremium = (req, res) => {
  const auth = req.isAuthenticated()
  res.render("premium", { auth })
}

const verifyUser = async (req, res) => {
  const user = await User.findById(req.user.id)
  if (user.isVerify !== "true") {
    if (req.params.token == user.isVerify) {
      await User.findByIdAndUpdate(user.id, {
        user: user.user,
        email: user.email,
        password: user.password,
        IP: user.IP,
        slug: user.slug,
        roles: user.roles,
        rango: user.rango,
        image: user.image,
        banner: user.banner,
        bio: user.bio,
        isBanned: user.isBanned,
        isVerify: "true",
        premium: {
            end: user.premium.end,
            codes: user.premium.codes
        },
        joined: user.joined
      })
      res.redirect("/profile")
    } else {
      const auth = req.isAuthenticated()
      res.render('404', { auth })
    }
  } else {
    res.redirect("/profile")
  }
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function isNoAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/profile");
  }
  return next();
}

async function isPremium(user) {
  if (user.premium.end == "false") {
    user.premium = { "end": "false", "codes": user.premium.codes }
  } else {
    let e = user.premium.end;
    let end = dayjs(e, "DD/MM/YYYY hh:mm:ss");
    if (dayjs(end).isSameOrBefore(dayjs())) {
      user.premium = { "end": "false", "codes": user.premium.codes };
    } else {
      user.premium = user.premium;
    }
  }
  var image
  var banner
  image = user.image;
  banner = user.banner;
  if (user.premium.end == "false") {
    if (image.includes("gif")) {
      image = "https://images.squarespace-cdn.com/content/v1/562146dae4b018ac1df34d5f/1450121660392-KS2FGMOXB7VL1JNQ487I/person-placeholder.jpg?format=1000w";
    } else {
      image = user.image;
    }
    if (banner.includes("gif")) {
      banner = "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/welcome-banner-design-template-61084152870e4a055056a7efc73a2359_screen.jpg?ts=1569136045";
    } else {
      banner = user.banner;
    }
  } else {

  }
  await User.findByIdAndUpdate(user.id, {
    user: user.user,
    email: user.email,
    password: user.password,
    IP: user.IP,
    slug: user.slug,
    roles: user.roles,
    rango: user.rango,
    image: image,
    banner: banner,
    bio: user.bio,
    isBanned: user.isBanned,
    isVerify: user.isVerify,
    premium: {
        end: user.premium.end,
        codes: user.premium.codes
    },
    joined: user.joined
  })
  // await getConnection().get("users").find({ id: user.id }).assign(verifyPerfil).write();
}


module.exports = {
  register,
  createUser,
  perfil,
  l,
  login,
  logout,
  isAuthenticated,
  isNoAuthenticated,
  home,
  perfiles,
  admin,
  renderEditPerfil,
  editPerfil,
  renderPerfil,
  renderNews,
  isPremium,
  renderPremium,
  verifyUser
};
