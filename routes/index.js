const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

// 載入 controlle
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
// 管理者路由
router.use('/admin', admin)

// 帳號註冊登入路由
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

// 錯誤處理
router.use('/', generalErrorHandler)

module.exports = router
