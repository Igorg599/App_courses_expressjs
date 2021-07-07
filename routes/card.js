const {Router} = require('express')
// const Card = require('../models/card')
const Course = require('../models/course')
const router = Router()

function mapCartitems(cart) {
  return cart.items.map(c => ({
    ...c.courseId._doc, count: c.count
  }))
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return total += course.price*course.count
  }, 0)
}

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id)
  // await Card.add(course)
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
  // const card = await Card.remove(req.params.id)
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.courseId').execPopulate()

  const courses = mapCartitems(user.cart)
  const cart = {
    courses, price: computePrice(courses)
  }

  res.status(200).json(cart)
})

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.courseId').execPopulate()

  const courses = mapCartitems(user.cart)

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses: courses,
    price: computePrice(courses)
  })
})

module.exports = router

// router.get('/', async (req, res) => {
//   const card = await Card.fetch()
//   res.render('card', {
//     title: 'Корзина',
//     isCard: true,
//     courses: card.courses,
//     price: card.price
//   })
// })