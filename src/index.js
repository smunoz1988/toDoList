import './style.css';

const tasks = [
  { description: 'Setup Webpack', completed: false, index: 0 },
  { description: 'Create create function', completed: false, index: 1 },
  { description: 'Create Pull request', completed: false, index: 2 },
  { description: 'rest', completed: false, index: 4 },
];

const generateTaskHTML = (task) => {
  const bodyInt = `<li class='listItems'>
            <div class='itemDescriptionContainer'>
            <input type='checkbox' ${task.completed ? 'checked' : ''}>
            <span class='itemDescription'>${task.description}</span>
            </div>
            <i class="fa-solid fa-ellipsis-vertical itemButton"></i>
          </li>`;
  return bodyInt;
};

const renderTaskList = () => {
  const taskList = document.getElementById('container');
  taskList.innerHTML = '';
  tasks.sort((a, b) => a.index - b.index);
  tasks.forEach((task) => {
    const listItem = generateTaskHTML(task);
    taskList.innerHTML += listItem;
  });
};

window.onload = renderTaskList;