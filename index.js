const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const Handlebars = require("handlebars")
const exphbs = require("express-handlebars")
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access")
const homeRoutes = require("./routes/home")
const addRoutes = require("./routes/add")
const coursesRoutes = require("./routes/courses")
const cardRoutes = require("./routes/card")

const app = express()

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
})

app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views", "views")

app.use(express.static(path.join(__dirname, "public"))) // по умолчанию папка public для подгрузки разных файлов
app.use(express.urlencoded({ extended: true })) // для корректной обработки загружаемых данных (форма)

app.use("/", homeRoutes)
app.use("/add", addRoutes)
app.use("/courses", coursesRoutes)
app.use("/card", cardRoutes)

const PORT = process.env.PORT || 4001

async function start() {
  try {
    const url =
      "mongodb+srv://igorg599:Dbhecyzr59@cluster0.vrd8v.mongodb.net/shop"

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()

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
