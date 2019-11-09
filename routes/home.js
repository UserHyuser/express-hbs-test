const {Router} = require('express');
const router = Router()

router.get('/', (req,res) =>{
	res.status(200);
	// res.sendFile(path.join(__dirname, './views', 'about.hbs')) если без движка
	res.render('index', {
		title: 'Главная страница', // Сами мутим нужные нам переменные, которыми потом сможем пользоваться на фронте
		isHome: true
	})
});

module.exports = router;