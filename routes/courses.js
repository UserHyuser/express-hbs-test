const {Router} = require('express');
const router = Router();
const Course = require('../models/course');

router.get('/', async (req,res) =>{ // await - подождать промиса EventLoop в это время обрабатывает другие вещи, а эта функция останавливается
	const courses = await Course.find() // Без параметров - найти все;
		.populate('userId', 'email name') // populate - возвращает как объект (ИЗ ДРУГОЙ БД) данные
		.select('price title img'); // Обращаемся к Course
	res.status(200);
	res.render('courses', {
		title: 'Курсы',
		isCourses: true,
		courses
	})
});

router.post('/edit', async (req,res) =>{
	const {id} = req.body; // Забираем id
	delete req.body.id
	await Course.findByIdAndUpdate(id, req.body);
	res.redirect('/courses')
})

router.post('/remove', async (req,res) =>{
	try {
		await Course.deleteOne({_id: req.body.id})
		res.redirect('/courses')
	}catch (e) {
		console.log(e)
	}
})

router.get('/:id/edit', async (req,res)=>{
	if(!req.query.allow){
		return res.redirect('/')
	}

	const course = await Course.findById(req.params.id);

	res.render('course-edit',{
		title: `Редактировать ${course.title}`,
		course
	})
})

router.get('/:id', async (req,res) =>{ // :id - динамечиский параметр
	try {
		const course = await Course.findById(req.params.id)

		res.render('course',{
			layout:'empty',
			title:`Курс ${course.title}`,
			course
		})
	} catch (e) {
		if(e.name === 'CastError'){
			console.log('Got error: Course without an image')
		} else{
			console.log(e)
		}

	}

})

module.exports = router;