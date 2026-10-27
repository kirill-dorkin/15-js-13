// Решение · Домашнее задание
function addTask(tasks, task) {
  return [...tasks, task];
}

function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

function toggleDone(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

function renameTask(tasks, id, title) {
  return tasks.map((task) =>
    task.id === id ? { ...task, title } : task
  );
}

// 5. push меняет старый массив. Мы договорились старые данные не трогать,
//    а возвращать новый массив — так экран (и React) видит, что данные изменились.
