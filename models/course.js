const uuid = require('uuid/v4')
const fs = require('fs');
const path = require('path')

class Course {
	constructor(title, price, img) {
		this.title = title;
		this.price = price;
		this.img = img;
		this.id = uuid();
	}

	toJSON() {
		return {
			title: this.title,
			price: this.price,
			img: this.img,
			id: this.id
		}
	}

	async save() {
		const courses = await Course.getAll(); // Здесь мы получаем промис но чтобы получить данные подождем их с помощью async await
		courses.push(this.toJSON());
		return new Promise((resolve, reject) => {
			fs.writeFile( // ToDo: Почему не append???
				path.join(__dirname, '..', 'data', 'courses.json'),
				JSON.stringify(courses),
				(err) => {
					if (err) reject(err); else resolve()
				}
			)
		})
	}

	static getAll() { // static - для вызова класс не нужно инициализировать. Доступ к данным класа не выполняется
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '..', '/data', 'courses.json'), 'utf-8', function (err, content) {
					if (err) reject(err);
					else resolve(JSON.parse(content))
				}
			)
		})
	}
	static async getById(id){
		const courses = await Course.getAll();

		return courses.find(c=> c.id === id)
	}

	static async update(course){
		const courses = await Course.getAll();
		const idx = courses.findIndex(c => c.id === course.id)

		courses[idx] = course;

		return new Promise((resolve, reject) => {
			fs.writeFile( // ToDo: Почему не append???
				path.join(__dirname, '..', 'data', 'courses.json'),
				JSON.stringify(courses),
				(err) => {
					if (err) reject(err); else resolve()
				}
			)
		})
	}

}

module.exports = Course;