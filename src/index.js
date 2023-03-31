import './style.css';
import TaskList from './modules/functionality.js';

const taskList = new TaskList();
taskList.loadTask();
taskList.addTask();
taskList.removeTask();
taskList.editTask();
taskList.renderTask();