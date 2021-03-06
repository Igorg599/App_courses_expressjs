const { Router } = require("express")
const router = Router()
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const { validationResult } = require("express-validator")
// const nodemailer = require('nodemailer')
// const sendgrid = require('nodemailer-sendgrid-transport')
// const keys = require('../keys')
// const regEmail = require('../emails/registration')
const resetEmail = require("../emails/reset")
const User = require("../models/user")
const { registerValidators, loginValidators } = require("../utils/validators")

// const transporter = nodemailer.createTestAccount(sendgrid({
//   auth: { api_key: keys.SENDGRID_API_KEY }
// }))

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    registerError: req.flash("registerError"),
    loginError: req.flash("loginError"),
  })
})

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login")
  })
})

router.post("/login", loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body

    const candidate = await User.findOne({ email })
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("loginError", errors.array()[0].msg)
      return res.status(422).redirect("/auth/login#login")
    }

    // if (candidate) {
    //   const areSame = await bcrypt.compare(password, candidate.password)
    //   if (areSame) {
    //     const user = candidate
    //     req.session.user = user
    //     req.session.isAuthenticated = true
    //     req.session.save((err) => {
    //       if (err) {
    //         throw err
    //       }
    //       res.redirect("/")
    //     })
    //   } else {
    //     req.flash("loginError", "Неверный пароль")
    //     res.redirect("/auth/login#login")
    //   }
    // } else {
    //   req.flash("loginError", "Такого пользователя не существует")
    //   res.redirect("/auth/login#login")
    // }

    const areSame = await bcrypt.compare(password, candidate.password)
    if (areSame) {
      const user = candidate
      req.session.user = user
      req.session.isAuthenticated = true
      req.session.save((err) => {
        if (err) {
          throw err
        }
        res.redirect("/")
      })
    } else {
      req.flash("loginError", "Неверный пароль")
      res.redirect("/auth/login#login")
    }
  } catch (e) {
    console.log(e)
  }
})

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body
    // const candidate = await User.findOne({ email })

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg)
      return res.status(422).redirect("/auth/login#register")
    }

    // if (candidate) {
    //   req.flash("registerError", "Пользователь с таким email уже существует")
    //   res.redirect("/auth/login#register")
    // } else {
    //   const hashPassword = await bcrypt.hash(password, 11)
    //   const user = new User({
    //     email,
    //     name,
    //     password: hashPassword,
    //     cart: { items: [] },
    //   })
    //   await user.save()
    //   res.redirect("/auth/login#login")
    //   await transporter.sendMail(regEmail(email))
    // }

    const hashPassword = await bcrypt.hash(password, 11)
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: { items: [] },
    })
    await user.save()
    res.redirect("/auth/login#login")
    await transporter.sendMail(regEmail(email))
  } catch (e) {
    console.log(e)
  }
})

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Забыли пароль?",
    error: req.flash("error"),
  })
})

router.get("/paswword/:token", async (req, res) => {
  if (req.params.token) {
    return res.redirect("/auth/login")
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (!user) {
      return res.redirect("/auth/login")
    } else {
      res.render("auth/password", {
        title: "восстановить доступ",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      })
    }
  } catch (e) {
    console.log(e)
  }
})

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что-то пошло не так...")
        return res.redirect("/auth/reset")
      }

      const token = buffer.toString("hex")

      const candidate = await User.findOne({ email: req.body.email })

      if (candidate) {
        candidate.resetToken = token
        //1 час жизни токена
        candidate.resetTokenExp = Date.now() + 3600
        await candidate.save()
        // await transporter.sendMail(resetEmail(candidate.email, token))
        res.redirect("/auth/login")
      } else {
        req.flash("error", "Такого email не сущствует")
        res.redirect("/auth/reset")
      }
    })
  } catch (e) {
    console.log(e)
  }
})

router.post("/password", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 11)
      user.resetToken = underfined
      user.resetTokenExp = underfined
      await user.save()
      res.redirect("/auth/login")
    } else {
      req.flash("loginError", "Время жизни токена истекло")
      res.redirect("/auth/login")
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
