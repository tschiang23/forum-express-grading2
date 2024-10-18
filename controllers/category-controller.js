const { Category, Restaurant } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', {
          categories,
          category
        })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Promise.all([
      Category.findByPk(req.params.id, { include: [Restaurant] }),
      Category.findOne({
        raw: true,
        where: { name: '未分類' }
      })
    ]).then(([category, newCategory]) => {
      if (!category) throw new Error("Category didn't exist!")

      // 如果沒有相關類別的餐廳 直接刪除類別
      if (category.Restaurants.length === 0) {
        return category.destroy()
      } else {
        // 更新餐廳categoryId
        return Restaurant.update({ categoryId: newCategory.id }, {
          where: {
            categoryId: req.params.id
          }
        })
          .then(() => category.destroy())
      }
    })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
