const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('add', {
    title: "Добавить курс",
    isAdd: true
  })
})

router.post('/', (req, res) => {
  res.redirect('/courses')
})

module.exports = router;