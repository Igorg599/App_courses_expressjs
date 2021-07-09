const {Router} = require('express')
const router = Router()
const Order = require('../models/order')

router.get('/', async (req, res) => {
  res.render('orders', {
    isOrder: true,
    title: 'Заказы'
  })
})

router.post('/', async (req, res) => {
  res.redirect('/orders')
})

module.exports = router