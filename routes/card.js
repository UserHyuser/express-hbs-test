const {Router} = require('express');
const router = Router();
const Course = require('../models/course')

function mapCartItems(cart){
	return cart.items.map(c =>({
		...c.courseId._doc, count: c.count, id : c.courseId.id // ... - объединение набора значений в один массив (или разбитие массива на элементы)
	}))
}

function computePrice(courses){
	return courses.reduce((total, course)=>{
		return total += course.price * course.count
	}, 0)
}

router.post('/add', async (req,res)=>{
	const course = await Course.findById(req.body.id);
	await req.user.addToCart(course)
	res.redirect('/card')
})

router.delete('/remove/:id', async (req,res) =>{
	await req.user.removeFromCart(req.params.id); // id из адресной строки
	const user = await req.user.populate('cart.items.courseId').execPopulate()
	const courses = mapCartItems(user.cart)
	const cart = {
		courses, price: computePrice(courses)
	}
	res.status(200).json(cart);
});

router.get('/', async (req,res)=>{
	/*const card = await Card.fetch();
	res.render('card', {
		isCard: true,
		title: 'Корзина',
		courses: card.courses,
		price: card.price
	})*/ // Работа с файлами

	const user = await req.user
		.populate('cart.items.courseId')
		.execPopulate()

	const courses = mapCartItems(user.cart)
	
	res.render('card', {
			isCard: true,
			title: 'Корзина',
			courses: courses,
			price: computePrice(courses)
	})
})

module.exports = router