const dayjs = require('dayjs');
const User = require('../models/User');
const New = require('../models/New');

const renderCreateNew = async (req, res) => {
    // const user = getConnection().get("users").find({ id: req.user.id }).value();
    const user = await User.findById(req.user.id)
    if (user.roles == "Admin") {
        res.render("admin/createNews", { user })
    } else {
        const auth = req.isAuthenticated()
        res.render("404", { auth })
    }
}

const createNew = async (req, res) => {
    // const user = getConnection().get("users").find({ id: req.user.id }).value();
    const user = await User.findById(req.user.id)
    if (user.roles == "Admin") {
        let para;
        if (req.body.userid) {
            para = req.body.userid
        } else {
            para = "global"
        }
        const newNews = new New({
            autorid: user.id,
            name: req.body.name,
            descripcion: req.body.descripcion,
            para: para
        })
        // getConnection().get("news").push(newNews).write();
        await newNews.save()
        res.redirect("/news")
    } else {
        const auth = req.isAuthenticated()
        res.render("404", { auth })
    }
}

const renderUsers = async (req, res) => {
    // const user = getConnection().get("users").find({ id: req.user.id }).value();
    // const sers = getConnection().get("users").value();
    // const users = [];
    const user = await User.findById(req.user.id)
    const sers = await User.find()
    const users = [];
    sers.forEach(function(user) {
        if (user.id !== "61dddc2dccd99bff4569e28e") {
            users.push(user)
        }
    });
    if (user.roles == "Admin") {
        res.render("admin/users", { user, users })
    } else {
        const auth = req.isAuthenticated()
        res.render("404", { auth })
    }
}

const adminDeleteUser = async (req, res) => {
    // const user = getConnection().get("users").find({ id: req.user.id }).value();
    const user = await User.findById(req.user.id)
    if (user.roles == "Admin") {
        // getConnection().get("users").remove({ id: req.params.id }).write();
        await User.findByIdAndDelete(req.params.id)
        res.redirect("/admin/users")
    } else {
        const auth = req.isAuthenticated()
        res.render("404", { auth })
    }
}

const changePremium = async (req, res) => {
    // const user = getConnection().get("users").find({ id: req.user.id }).value();
    const user = await User.findById(req.user.id)
    if (user.roles == "Admin") {
        const userP = await User.findById(req.params.id)
        // const sp = getConnection().get("users").find({ id: req.params.id }).value();
        var premium1;
        var now = dayjs()
        var n = now.format("DD/MM/YYYY hh:mm:ss")
        const parsedDate = dayjs(n, "DD/MM/YYYY");
        const nextM = parsedDate.add(1, "month");
        const next = nextM.format("DD/MM/YYYY hh:mm:ss");
        if (userP.premium.end == "false") {
            var premium1 =  { "end": next, "codes": sp.premium.codes }
        } else {
            var premium1 =  { "end": false, "codes": sp.premium.codes }
        }
        const updatePremiumPerfil = {
            id: sp.id,
            user: sp.user,
            email: sp.email,
            password: sp.password,
            slug: sp.slug,
            otros: {
              roles: sp.otros.roles,
              rango: sp.otros.rango,
              image: sp.otros.image,
              banner: sp.otros.banner,
              bio: sp.otros.bio,
              premium: premium1,
              joined: sp.otros.joined
            },
          };

        res.redirect("/admin/users")
    } else {
        const auth = req.isAuthenticated()
        res.render("404", { auth })
    }
}


const changeRolePerfil = async (req, res) => {
    const user = getConnection().get("users").find({ id: req.user.id }).value();
    if (user.otros.roles == "Admin") {
        const sp = getConnection().get("users").find({ id: req.params.id }).value();
        var role;
        if (sp.otros.roles == "Mod") {
            var role = "user"
        } else {
            var role = "Mod"
        }
        const updateRolePerfil = {
            id: sp.id,
            user: sp.user,
            email: sp.email,
            password: sp.password,
            slug: sp.slug,
            otros: {
              roles: role,
              rango: sp.otros.rango,
              image: sp.otros.image,
              banner: sp.otros.banner,
              bio: sp.otros.bio,
              premium: sp.otros.premium,
              joined: sp.otros.joined
            },
          };
          await getConnection()
            .get("users")
            .find({ id: sp.id })
            .assign(updateRolePerfil)
            .write();
        res.redirect("/admin/users")
    } else {
        const auth = req.isAuthenticated()
        res.render("404", { auth })
    }
}

const renderAdminBlogs = (req, res) => {
    const user = getConnection().get("users").find({ id: req.user.id }).value();
    const blogs = getConnection().get("blogs").value();
    if (user.otros.roles == "Admin") {
        res.render('admin/blogs', { user, blogs })
    } else {
        const auth = req.isAuthenticated()
        res.render('404', { auth })
    }
}

const AdminDeleteBlogs = (req, res) => {
    const user = getConnection().get("users").find({ id: req.user.id }).value();
    if (user.otros.roles == "Admin") {
        getConnection().get("blogs").remove({ id: req.params.id }).write();
        res.redirect('/admin/blogs')
    } else {
        const auth = req.isAuthenticated()
        res.render('404', { auth })
    }
}

module.exports = {
    renderCreateNew,
    createNew,
    renderUsers,
    adminDeleteUser,
    changePremium,
    changeRolePerfil,
    renderAdminBlogs,
    AdminDeleteBlogs
}