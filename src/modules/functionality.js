export default class TaskList {
  constructor() {
    this.list = [];
    this.length = 0;
    const storedList = localStorage.getItem('list');
    if (storedList) {
      const parsedList = JSON.parse(storedList);
      this.length = parsedList[parsedList.length - 1].index;
    }
  }

  renderTask() {
    const listGroup = document.querySelector('.container');
    listGroup.innerHTML = '';
    this.list.forEach((task) => {
      const listTask = document.createElement('li');
      listTask.classList = 'listItem listElement';
      listTask.id = `${task.index}`;
      listTask.innerHTML = `
        <input type="checkbox" class="checkBox" ${task.completed ? 'checked' : ''}>
        <input type="text" class="toDoTask" value="${task.description}">
        <i class="fa-regular fa-trash-can removeIcon"></i>
      `;

      this.checkBoxChanger(listTask, task);

      const clearButton = document.querySelector('.clear');
      clearButton.addEventListener('click', () => {
        this.clearCompleted();
      });

      listGroup.appendChild(listTask);
    });
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