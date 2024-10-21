const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  // 註冊
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  // 登入
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout(() => res.redirect('/signin'))
  },
  // user profile
  getUser: (req, res, next) => {
    const userId = +req.params.id
    return User.findByPk(userId, { raw: true })
      .then(foundUser => {
        if (!foundUser) throw new Error('使用者不存在')
        res.render('profile', { foundUser })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = +req.params.id
    // 如果登入的使用者與 userId 不相符
    if (req.user.id !== userId) return res.redirect(`/users/${req.user.id}`)

    return User.findByPk(userId, { raw: true })
      .then(foundUser => {
        if (!foundUser) throw new Error('使用者不存在')
        res.render('edit-profile', { foundUser })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    const userId = +req.params.id

    if (!name) throw new Error('User name is required!')
    if (req.user.id !== userId) throw new Error('無法修改他人資料')

    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => res.redirect(`/users/${userId}`))
      .catch(err => next(err))
  }
}

module.exports = userController
