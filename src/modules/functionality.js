import { checkedBox } from "./check.js";

export default class TaskList {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('data')) || [];
    this.form = document.querySelector('form');
    this.taskList = document.getElementById('container');
    this.form.addEventListener('submit', this.addTask.bind(this));
    this.renderTaskList();
    this.checkbox();
  }

  /* eslint-disable */
  generateTaskHTML(task) {
    const taskId = `task-${task.index}`;
    const bodyInt = `<li class='listItems' id='${taskId}'>
      <div class='itemDescriptionContainer'>
        <input class="checkbox" type='checkbox' ${task.completed ? 'checked' : ''} data-task-id='${taskId}'>
        <input type='text' class='itemDescription' value='${task.description}' data-task-id='${taskId}'>
      </div>
      <button class="removeItem" type="button" data-task-id='${taskId}'><i class="fa-solid fa-trash-can"></i></button>
    </li>`;
    return bodyInt;
  }
  /* eslint-disable */

  renderTaskList() {
    this.taskList.innerHTML = '';
    this.tasks.forEach((task) => {
      const listItem = this.generateTaskHTML(task);
      this.taskList.innerHTML += listItem;
    });
    this.addDeleteListeners();
    this.checkbox();
  }

  checkbox() {
    checkedBox(this.tasks);
  }

  addTask(event) {
    event.preventDefault();
    const input = document.getElementById('inputTask');
    const inputValue = input.value.trim();
  
    if (!inputValue) {
      return;
    }
  
    const newTask = {
      description: inputValue,
      completed: false,
      index: this.tasks.length,
    };
  
    this.tasks.push(newTask);
    localStorage.setItem('data', JSON.stringify(this.tasks));
    this.renderTaskList();
    input.value = '';
    this.checkbox();
  }
  

  addDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.removeItem');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const taskId = button.getAttribute('data-task-id');
        this.removeTask(taskId);
        this.checkbox();
      });
    });

    const inputElements = document.querySelectorAll('.itemDescription');
    inputElements.forEach((input) => {
      input.addEventListener('change', () => {
        const taskId = input.getAttribute('data-task-id');
        const taskIndex = parseInt(taskId.split('-')[1], 10);
        this.tasks[taskIndex].description = input.value;
        localStorage.setItem('data', JSON.stringify(this.tasks));
        this.checkbox();
      });
    });
  }

  removeTask(taskId) {
    const taskElement = document.getElementById(taskId);
    const taskIndex = parseInt(taskId.split('-')[1], 10);
    this.tasks.splice(taskIndex, 1);
    taskElement.remove();
  
    // Update the data-task-id attribute of each checkbox element
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach((checkbox, index) => {
      const taskId = `task-${index}`;
      checkbox.setAttribute('data-task-id', taskId);
    });
  
    // Update index property of tasks
    this.tasks.forEach((task, index) => {
      task.index = index;
    });
  
    localStorage.setItem('data', JSON.stringify(this.tasks));
    this.refreshTaskIds();
    this.renderTaskList();
  }
  
  refreshTaskIds() {
    const taskElements = document.querySelectorAll('.listItems');
    taskElements.forEach((taskElement, index) => {
      const taskId = `task-${index}`;
      taskElement.setAttribute('id', taskId);
      const checkbox = taskElement.querySelector('.checkbox');
      checkbox.setAttribute('data-task-id', taskId);
    });
  }
}