const {Router} = require('express');
const router = Router()
const Course = require('../models/course')

router.get('/', (req,res) =>{
	res.status(200);
	res.render('add', {
		title: 'Добавить курс',
		isAdd: true
	})
});

router.post('/', async (req,res) =>{
	// const course = new Course(req.body.title, req.body.price, req.body.img) // при работе с файлами
	const course = new Course({
		title: req.body.title,
		price: req.body.price,
		img: req.body.img,
		userId: req.user // req.user._id тож самое
	});

	try{
		await course.save();
		res.redirect('/courses')
	} catch (e) {
		console.log(e)
	}

})

module.exports = router;