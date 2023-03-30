export default class TaskList {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('data')) || [];
    this.form = document.querySelector('form');
    this.taskList = document.getElementById('container');
    this.form.addEventListener('submit', this.addTask.bind(this));
    this.renderTaskList();
  }

  /* eslint-disable */
  generateTaskHTML(task) {
    const taskId = `task-${task.index}`;
    const bodyInt = `<li class='listItems' id='${taskId}'>
              <div class='itemDescriptionContainer'>
              <input type='checkbox' ${task.completed ? 'checked' : ''}>
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
  }

  addTask(event) {
    event.preventDefault();
    const input = document.getElementById('inputTask');
    const newTask = {
      description: input.value,
      completed: false,
      index: this.tasks.length,
    };

    this.tasks.push(newTask);
    localStorage.setItem('data', JSON.stringify(this.tasks));
    this.renderTaskList();

    input.value = '';
  }

  addDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.removeItem');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const taskId = button.getAttribute('data-task-id');
        this.removeTask(taskId);
      });
    });

    const inputElements = document.querySelectorAll('.itemDescription');
    inputElements.forEach((input) => {
      input.addEventListener('change', () => {
        const taskId = input.getAttribute('data-task-id');
        const taskIndex = parseInt(taskId.split('-')[1], 10);
        this.tasks[taskIndex].description = input.value;
        localStorage.setItem('data', JSON.stringify(this.tasks));
      });
    });
  }

  removeTask(taskId) {
    const taskElement = document.getElementById(taskId);
    const taskIndex = parseInt(taskId.split('-')[1], 10);
    this.tasks.splice(taskIndex, 1);
    localStorage.setItem('data', JSON.stringify(this.tasks));
    taskElement.remove();
    this.refreshTaskIds();
  }

  refreshTaskIds() {
    const taskItems = this.taskList.querySelectorAll('.listItems');
    taskItems.forEach((item, index) => {
      const taskId = `task-${index}`;
      item.id = taskId;
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.setAttribute('data-task-id', taskId);
      const deleteButton = item.querySelector('.removeItem');
      deleteButton.setAttribute('data-task-id', taskId);
      const description = item.querySelector('.itemDescription');
      description.setAttribute('name', `task-${index}-description`);
      this.tasks[index].index = index;
    });
    localStorage.setItem('data', JSON.stringify(this.tasks));
  }
}