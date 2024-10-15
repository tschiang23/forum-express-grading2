const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

// 一般使用者驗證
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  // 如果有登入的話 next() 沒有回登入頁
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

// admin 驗證
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
