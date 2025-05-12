'use strict';

//retrieve todo from locall storage and initialize empyty array

let todo = JSON.parse(localStorage.getItem('todo')) || [];

const todoInput = document.querySelector('#todoInput');

const todoList = document.querySelector('#todoList');

const todoCount = document.querySelector('#todoCount');

const addButton = document.querySelector('.btn');

const deleteButton = document.querySelector('#deleteButton');


//initialize

document.addEventListener('DOMContentLoaded', function () {
	addButton.addEventListener('click', addTask)
	todoInput.addEventListener('keydown', function (event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTask();
		}
	})
	deleteButton.addEventListener('click', deleteAllTasks);

	displayTasks();

});

function addTask() {
	const newTask = todoInput.value.trim();
	if (newTask !== '') {
		todo.push({
			text: newTask,
			disabled: false,
		})
		saveToLocalStorage();
		todoInput.value = '';
		displayTasks();
	}
}

function deleteAllTasks() {
	todo = [];
	saveToLocalStorage();
	displayTasks();
}

function displayTasks() {
	todoList.innerHTML = '';
	todo.forEach((item, index) => {
		const container = document.createElement('div');
		container.className = 'todo-container';

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'todo-checkbox';
		checkbox.id = `input-${index}`;
		checkbox.checked = item.disabled;
		checkbox.addEventListener('change', () => {
			toggleTask(index);
		});

		const taskText = document.createElement('p');
		taskText.id = `todo-${index}`;
		taskText.className = item.disabled ? 'disabled' : '';
		taskText.textContent = item.text;
		taskText.onclick = () => editTask(index);

		container.appendChild(checkbox);
		container.appendChild(taskText);
		todoList.appendChild(container);
	});
	
	todoCount.textContent = todo.length;
}

function editTask(index) {
	const todoItem = document.getElementById(`todo-${index}`);
	const existingText = todo[index].text;
	const inputElement = document.createElement('input');

	inputElement.value = existingText;
	todoItem.replaceWith(inputElement);
	inputElement.focus();

	inputElement.addEventListener('blur', function () {
		const updatedText = inputElement.value.trim();
		if (updatedText) {
			todo[index].text = updatedText;
			saveToLocalStorage();
		}
		displayTasks();
	});
}

function toggleTask(index) {
	todo[index].disabled = !todo[index].disabled;
	saveToLocalStorage();
	displayTasks();
}

function saveToLocalStorage() {
	localStorage.setItem('todo', JSON.stringify(todo))
}