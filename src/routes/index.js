const express = require("express");
const router = express.Router();

const { register, createUser, perfil, l, login, logout, isAuthenticated, isNoAuthenticated, home, perfiles, admin, renderEditPerfil, editPerfil, renderPerfil, renderNews, renderPremium, verifyUser } = require("../controllers/users.controllers");
const { renderCreateBlog, createBlog, renderBlogs, renderBlog } = require("../controllers/blogs.controllers");

const { renderCreateNew, createNew, renderUsers, adminDeleteUser, changePremium, changeRolePerfil, renderAdminBlogs, AdminDeleteBlogs } = require('../controllers/admin.controllers');

const { genCode, getCode, renderAdminCodes } = require('../controllers/premium.controllers');

// Control de Usuarios
router.get("/", home);
router.get("/register", isNoAuthenticated, register);
router.post("/register", createUser);
router.get("/profile", isAuthenticated, perfil);
router.get("/user/:slug", renderPerfil);
router.get("/login", isNoAuthenticated, l);
router.post("/login", login);
router.get("/logout", logout);
router.get("/users", perfiles);
router.get("/admin", isAuthenticated, admin);
router.get("/edit/profile", isAuthenticated, renderEditPerfil);
router.post("/edit/profile", isAuthenticated, editPerfil);
router.get("/news", isAuthenticated, renderNews)
router.get("/token/:token", isAuthenticated, verifyUser)

// Premium
router.get("/premium", renderPremium)
router.get("/premium/gencode", isAuthenticated, genCode)
router.get("/premium/getcode/:slug", isAuthenticated, getCode)
router.get("/premium/codes", isAuthenticated, renderAdminCodes)

// Control de Blogs
router.get("/blogs", renderBlogs);
router.get("/blog/:slug", renderBlog);
router.get("/create/blog", isAuthenticated, renderCreateBlog);
router.post("/create/blog", isAuthenticated, createBlog);

// Admin
router.get('/admin/create/news', isAuthenticated, renderCreateNew);
router.post('/admin/create/news', isAuthenticated, createNew);
router.get('/admin/users', isAuthenticated, renderUsers);
router.get('/admin/user/delete/:id', isAuthenticated, adminDeleteUser);
router.get('/admin/users/premium/change/:id', isAuthenticated, changePremium)
router.get('/admin/users/roles/change/:id', isAuthenticated, changeRolePerfil)
router.get('/admin/blogs', isAuthenticated, renderAdminBlogs)
router.get('/admin/blog/delete/:id', isAuthenticated, AdminDeleteBlogs)

// otros
router.get('/discord', (req, res) => {
  res.redirect("https://discord.gg/sN2kNKvmuj")
})

module.exports = router;