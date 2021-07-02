const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/add');

const app = express();


const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public')) // по умолчанию папка public для подгрузки разных файлов
app.use(express.urlencoded({extended: true})) // для корректной обработки загружаемых данных (форма)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})







// app.get('/', (req, res) => {
//   // res.status(200)
//   // res.sendFile(path.join(__dirname, 'views', 'index.html'));
//   res.render('index', {
//     title: "Главная страница",
//     isHome: true
//   })
// })

// app.get('/add', (req, res) => {
//   // res.sendFile(path.join(__dirname, 'views', 'about.html'))
//   res.render('add', {
//     title: "Добавить курс",
//     isAdd: true
//   })
// })

// app.get('/courses', (req, res) => {
//   // res.sendFile(path.join(__dirname, 'views', 'about.html'))
//   res.render('courses', {
//     title: "Курсы",
//     isCourses: true
//   })
// })