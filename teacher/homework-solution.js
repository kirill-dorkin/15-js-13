// Решение · Домашнее задание: список задач
function addTask(tasks, title) {
  const lastId = tasks.length > 0 ? tasks[tasks.length - 1].id : 0;
  return [...tasks, { id: lastId + 1, title, done: false }];
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

function sortByTitle(tasks) {
  return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
}

function moveUser(user, city) {
  return { ...user, address: { ...user.address, city } };
}

function addTag(user, tag) {
  return { ...user, tags: [...user.tags, tag] };
}

// 8. { ...user } копирует только первый уровень. В copy.tags лежит та же ссылка
//    на массив, что и в user.tags, поэтому push меняет общий массив.
