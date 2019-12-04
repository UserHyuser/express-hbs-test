const express = require('express');
const path = require ('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');

const PORT = process.env.PORT || 3000;
const dbAddress = 'mongodb+srv://userdb:9R89pNDCLx8z1CcQ@cluster0-bx7mg.mongodb.net/shop';

/*Routes*/
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); // Говорим что вижок hbs
app.set('views', 'views'); // Папка со страницами

app.use(async (req,res,next)=>{
	try {
		const user = await User.findById('5dca7dc9561b9c2a2cd310d7');
		req.user = user;
		next();
	}catch (e) {
		console.log(e);
	}
})

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: 'some string',
	resave: false,
	saveUninitialized: false
}))
app.use(varMiddleware)
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)


async function start (){
	try {
		await mongoose.connect(dbAddress,{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})
		const candidate = await User.findOne();
		if(!candidate){
			const user = new User({
				email: 'test@mail.ru',
				name: 'Name',
				cart: {items: []}
			})
			await user.save();
		}
		app.listen(PORT, ()=>{
			console.log('Server is running on port:' + PORT)
		})
	} catch (e) {
		console.log(e)
	}
}
start();
