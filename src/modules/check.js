export default function checkedBox(tasks) {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const taskId = checkbox.getAttribute('data-task-id');
        const taskIndex = parseInt(taskId.split('-')[1], 10);
        if (tasks && tasks.length > taskIndex && tasks[taskIndex]) {
          tasks[taskIndex].completed = checkbox.checked;
          localStorage.setItem('data', JSON.stringify(tasks));
        }
      });
    });
}