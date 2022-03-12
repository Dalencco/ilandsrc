const dayjs = require('dayjs');
const customFormat = require('dayjs/plugin/customParseFormat');
const isToday = require('dayjs/plugin/isToday')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const shortid = require('shortid');
const PCodes = require('../models/PCodes');
const User = require('../models/User');

dayjs.extend(isSameOrBefore);
dayjs.extend(isToday)
dayjs.extend(customFormat);

const genCode = async (req, res) => {
    // const user = getConnection().get("users").find({ id: req.user.id }).value();
    const user = await User.findById(req.user.id)
    if (user.premium.codes <= 0) {
        const auth = req.isAuthenticated()
        res.render('404', { auth })
    } else {
        const slugCode = shortid.generate();
        const newCode = new PCodes({
          userid: user.id,
          slug: slugCode
        })
        await newCode.save()
        re = user.premium.codes - 1
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
          premium: {
            end: user.premium.end,
            codes: re
          },
          joined: user.joined
        })
        res.redirect("/premium/codes")
    }
}


const getCode = async (req, res) => {
    // const user = getConnection().get("users").find({ id: req.user.id }).value();
    // const code = getConnection().get("premiums").find({ slug: req.params.slug }).value();
    const user = await User.findById(req.user.id)
    const code = await PCodes.findOne({ slug: req.params.slug })
    if (code) {
        if (user.premium.end == "false") {
          var now = dayjs()
          var n = now.format("DD/MM/YYYY hh:mm:ss")
          const parsedDate = dayjs(n, "DD/MM/YYYY");
          const nextM = parsedDate.add(1, "month");
          const next = nextM.format("DD/MM/YYYY hh:mm:ss");
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
            premium: {
              end: next,
              codes: user.premium.codes
            },
            joined: user.joined
          })
          // await getConnection().get("users").find({ id: user.id }).assign(codeGetPerfil).write();
          res.redirect("/profile")
        } else {
          const parsedDate = dayjs(user.premium.end, "DD/MM/YYYY");
            const nextM = parsedDate.add(1, "month");
            const next = nextM.format("DD/MM/YYYY hh:mm:ss");
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
              premium: {
                end: next,
                codes: user.premium.codes
              },
              joined: user.joined
            })
            // await getConnection().get("users").find({ id: user.id }).assign(codeGetPerfil).write();        
            res.redirect("/profile")
        }
        await PCodes.remove({ slug: code.slug })
        // getConnection().get("premiums").remove({ slug: code.slug }).write();
    } else {
        const auth = req.isAuthenticated()
        res.render('404', { auth })
    }
}

const renderAdminCodes = async (req, res) => {
  // const user = getConnection().get("users").find({ id: req.user.id }).value();
  // const p = getConnection().get("premiums").value();
  // const ycodes = [];
  const user = await User.findById(req.user.id)
  const ycodes = await PCodes.find({ userid: user.id })
  res.render("codes", { user, ycodes })
}

module.exports = {
    genCode,
    getCode,
    renderAdminCodes
}