import './style.css';
import TaskList from './modules/functionality.js';

const taskList = new TaskList();
window.onload = taskList.renderTaskList();