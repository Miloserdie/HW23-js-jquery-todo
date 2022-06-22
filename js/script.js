class TodoList{
	constructor(el){
		this.todos = [];
		this.el = el;
	}

	getTodos() {
		$.ajax({
			url: 'http://localhost:3000/todos',
			dataType: 'json',
		})
		.done((data) => {
			data.map((el) => {
				this.todos.unshift(el);
			})
			this.render(this.todos);
		})
		.fail((err) => {
			console.log(err);
		})
	}

	addTodo(task) {
		$.ajax({
			url: 'http://localhost:3000/todos',
			type: 'POST',
			сontentType: 'application/json',
			data: task,
		})
		.done(() => {
			this.todos.unshift(task);
			this.render(this.todos);
		})
		.fail((err) => {
			console.log(err);
		})
	}

	deleteTodo(id) {
		let index = this.todos.findIndex((el) => el.id === id);
		
		$.ajax({
			url: `http://localhost:3000/todos/${this.todos[index].id}`,
			type: 'DELETE',
		})
		.done(() => {
			this.todos = this.todos.filter((el) => {
				return el.id !== id;
			});
			this.render(this.todos);
		})
		.fail((err) => {
			alert( "error" + err);
		})
	}

	changeStatus(id) {
		let index = this.todos.findIndex((el) => el.id === id);

		$.ajax({
			url: `http://localhost:3000/todos/${this.todos[index].id}`,
			type: 'PUT',
			сontentType: 'application/json',
			header: {
				'Access-Control-Allow-Methods' : 'PUTCH',
			},
			data: {
				value: this.todos[index].value,
				status: this.todos[index].status === 'in-progress' ? 'done' : 'in-progress',
				id: this.todos[index].id,
			},
		})
		.done(() => {
			this.todos[index].status = this.todos[index].status === 'in-progress' ? 'done' : 'in-progress';
			this.render(this.todos);
		})
		.fail((err) => {
			alert( "error" + err);
		})
	}

	render(todos = []) {
		let todosList = '';

		for (let el of todos) {
			if (!el) {
			return;
		}
		
		todosList += `<li class="list-item ${el.status === 'done' ? 'list-item-done' : ''}" data-id="${el.id}"><span>${el.value}</span><button class="change-status">Change status</button><button class="delete-task">Delete</button></li>`;
	  	}

	  	this.el.innerHTML = todosList;
	}

	findTasks(value) {
      this.render(
         this.todos.filter(item => item.value.includes(value))
      );
  	}
}

class Task {
	constructor(value) {
		this.value = value;
		this.status = 'in-progress';
		this.id = Math.random().toString(36).substring(2, 9);
	}
}

const $list = $('#list');

const todos = new TodoList(list);

todos.getTodos()

$('.form').on('click', '.add-task', (event) => {
	event.preventDefault();
	todos.addTodo(new Task($('.task-text').val()));
	$('.task-text').val('');
})

$('.form').on('click', '.find-task', (event) => {
	event.preventDefault();
	todos.findTasks($('.task-text').val());
})

$list.on('click', '.delete-task', (event) => {
	todos.deleteTodo($(event.target).closest('.list-item').data('id'));
})

$list.on('click', '.change-status', (event) => {
	todos.changeStatus($(event.target).closest('.list-item').data('id'));
})





