const express = require('express');
const path = require ('path');
const exphbs = require('express-handlebars')

const PORT = process.env.PORT || 3000;

/*Routes*/
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); // Говорим что вижок hbs
app.set('views', 'views'); // Папка со страницами

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)





app.listen(PORT, ()=>{
	console.log('Server is running on port:' + PORT)
})

