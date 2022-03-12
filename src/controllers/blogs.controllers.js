const slug = require('slug');
const Blog = require('../models/Blog');
const User = require('../models/User');

const renderCreateBlog = (req, res) => {
    // const user = getConnection().get('users').find({ id: req.user.id }).value();
    const user = User.findById(req.user.id)
    res.render('createBlog')
}

const createBlog = async (req, res) => {
    // const user = getConnection().get('users').find({ id: req.user.id }).value();
    const user = await User.findById(req.user.id)
    const userBlogs = await Blog.find({ autorid: user.id })
    if (userBlogs.length > 5) {
        res.redirect('/blogs')
    }
    const slugBlog = slug(req.body.name)
    // getConnection().get('blogs').push(newBlog).write();
    const newBlog = new Blog({
        autorid: user.id,
        autorslug: user.slug,
        autor: user.user,
        slug: slugBlog,
        name: req.body.name,
        content: req.body.blog,
        descripcion: req.body.descripcion,
        imagen: req.body.imagen
    })
    await newBlog.save();
    res.redirect('/blogs')
}

const renderBlogs = async (req, res) => {
    const auth = req.isAuthenticated()
    // const blogs = getConnection().get('blogs').value();
    const blogs = await Blog.find()
    res.render('blogs', { blogs, auth })
}

const renderBlog = async (req, res) => {
    const auth = req.isAuthenticated()
    // const blogs = getConnection().get('blogs').value();
    // const blog = getConnection().get('blogs').find({ slug: req.params.slug }).value();
    const blogs = await Blog.find()
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (blog) {
        res.render('blog', { blog, auth, blogs })
    } else {
        res.render('404', { auth })
    }
}

module.exports = {
    renderCreateBlog,
    createBlog,
    renderBlogs,
    renderBlog
}