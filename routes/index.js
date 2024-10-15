const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport')

// 載入 controlle
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// middleware
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

// 管理者路由
router.use('/admin', admin)

// 帳號註冊登入路由
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

// 錯誤處理
router.use('/', generalErrorHandler)

module.exports = router
