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
    this.deleteAllCompleted();
  }

  checkbox() {
    checkedBox(this.tasks);
  }

  deleteAllCompleted() {
    const deleteCompletedBtn = document.getElementById('clearAllButton');
    deleteCompletedBtn.addEventListener('click', () => {
      this.tasks = this.tasks.filter((task) => !task.completed);
      localStorage.setItem('data', JSON.stringify(this.tasks));
      this.renderTaskList();
      console.log(this.tasks);
    })
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
  addTask() {
    const addTask = document.querySelector('#toDo');
    const addInput = document.querySelector('.addToInput');
    const addTaskIcon = document.querySelector('#addIcon');

    addTask.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputValue = addInput.value;
        if (inputValue !== '') {
          const description = inputValue;
          const completed = false;
          const index = this.list.length > 0
            ? this.list[this.list.length - 1].index + 1
            : 1;
          this.saveTask(description, completed, index);
          e.preventDefault();
          this.renderTask();
          const addTaskIcon = document.querySelector('#addIcon');
          addTaskIcon.classList.add('addIconEnter');
          setTimeout(() => {
            addTaskIcon.classList.remove('addIconEnter');
          }, 500);

          addInput.value = '';
        } else {
          e.preventDefault();
          const addTaskIcon = document.querySelector('#addIcon');
          addTaskIcon.classList.add('addIconError');
          setTimeout(() => {
            addTaskIcon.classList.remove('addIconError');
          }, 500);
        }
      }
    });

    addTaskIcon.addEventListener('click', () => {
      const inputValue = addInput.value;
      if (inputValue !== '') {
        const description = inputValue;
        const completed = false;
        const index = this.list.length > 0 ? this.list[this.list.length - 1].index + 1 : 1;
        this.saveTask(description, completed, index);
        this.renderTask();
        addInput.value = '';
      }
    });
  }

  removeTask() {
    const listGroup = document.querySelector('.container');
    listGroup.addEventListener('click', (event) => {
      const removeIcon = event.target.closest('.removeIcon');
      if (removeIcon) {
        const listItem = removeIcon.closest('.listItem');
        const indexToRemove = parseInt(listItem.id, 10);
        const filteredList = this.list.filter(
          (task) => task.index !== indexToRemove,
        );
        this.list = filteredList;

        if (this.list.length === 0) {
          localStorage.removeItem('list');
        } else {
          this.list.forEach((task, i) => {
            task.index = i + 1;
          });
          localStorage.setItem('list', JSON.stringify(this.list));
        }
        this.renderTask();
      }
    });
  }

  editTask() {
    const listGroup = document.querySelector('.container');
    listGroup.addEventListener('keydown', (event) => {
      const editInput = event.target.closest('.toDoTask');
      if (editInput && event.key === 'Enter') {
        const listItem = editInput.closest('.listItem');
        const indexToEdit = this.list.findIndex((task) => task.index === parseInt(listItem.id, 10));
        const updatedDescription = editInput.value;
        const updatedTask = this.list[indexToEdit];
        updatedTask.description = updatedDescription;
        localStorage.setItem('list', JSON.stringify(this.list));
        this.renderTask();
      }
    });
    listGroup.addEventListener('focusout', (event) => {
      const editInput = event.target.closest('.toDoTask');
      if (editInput && document.activeElement !== editInput) {
        const listItem = editInput.closest('.listItem');
        const indexToEdit = this.list.findIndex((task) => task.index === parseInt(listItem.id, 10));
        const updatedDescription = editInput.value;
        const updatedTask = this.list[indexToEdit];
        updatedTask.description = updatedDescription;
        localStorage.setItem('list', JSON.stringify(this.list));
        this.renderTask();
      }
    });
  }

  checkBoxChanger(listTask, task) {
    const checkbox = listTask.querySelector('.checkBox');
    const actualTask = listTask.querySelector('.toDoTask');
    if (checkbox.checked) {
      listTask.classList.add('checked');
      actualTask.classList.add('taskChecked');
    }
    checkbox.addEventListener('click', () => {
      task.completed = checkbox.checked;
      if (checkbox.checked) {
        listTask.classList.add('checked');
        actualTask.classList.add('taskChecked');
      } else {
        listTask.classList.remove('checked');
        actualTask.classList.remove('taskChecked');
      }
      localStorage.setItem('list', JSON.stringify(this.list));
    });
  }

  clearCompleted() {
    const originalLength = this.list.length;
    this.list = this.list.filter((task) => !task.completed);
    if (this.list.length < originalLength) {
      this.renderTask();
      for (let i = 0; i < this.list.length; i += 1) {
        this.list[i].index = i + 1;
      }
      localStorage.setItem('list', JSON.stringify(this.list));
      if (this.list.length === 0) {
        localStorage.removeItem('list');
      }
    }
  }

  saveTask(description, completed, index) {
    const newTask = { description, completed, index };
    this.list.push(newTask);
    if (!localStorage.getItem('list')) {
      localStorage.setItem('list', JSON.stringify(this.list));
    } else {
      const savedList = JSON.parse(localStorage.getItem('list'));
      savedList.push(newTask);
      localStorage.setItem('list', JSON.stringify(savedList));
    }
  }

  loadTask() {
    if (localStorage.getItem('list')) {
      const savedList = JSON.parse(localStorage.getItem('list'));
      savedList.forEach((task) => {
        this.list.push({
          description: task.description,
          completed: task.completed,
          index: task.index,
        });
      });
    }
  }
}
