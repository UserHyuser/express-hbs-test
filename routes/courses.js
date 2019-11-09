const {Router} = require('express');
const router = Router();
const Course = require('../models/course');

router.get('/', async (req,res) =>{ // await - подождать промиса EventLoop в это время обрабатывает другие вещи, а эта функция останавливается
	const courses = await Course.getAll();
	res.status(200);
	res.render('courses', {
		title: 'Курсы',
		isCourses: true,
		courses
	})
});

router.post('/edit', async (req,res) =>{
	await Course.update(req.body);
	res.redirect('/courses')
})

router.get('/:id/edit', async (req,res)=>{
	if(!req.query.allow){
		return res.redirect('/')
	}

	const course = await Course.getById(req.params.id);

	res.render('course-edit',{
		title: `Редактировать ${course.title}`,
		course
	})
})

router.get('/:id', async (req,res) =>{ // :id - динамечиский параметр
	const course = await Course.getById(req.params.id)

	res.render('course',{
		layout:'empty',
		title:`Курс ${course.title}`,
		course
	})
})

module.exports = router;