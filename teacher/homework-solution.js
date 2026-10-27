// JS 13 · Домашнее задание · решение (по шагам ТЗ из materials/homework/script.js)

// ── ШАГ 1 · ПОКАЗАТЬ ЗАДАЧИ
function printTasks(tasks) {
  if (tasks.length === 0) {
    console.log("Задач нет");
    return;
  }
  tasks.forEach((task) => {
    const mark = task.done ? "☑" : "☐";
    console.log(`${mark} ${task.id}. ${task.title}`);
  });
}
printTasks([]);
printTasks([{ id: 1, title: "Купить хлеб", done: true }]);


// ── ШАГ 2 · ДОБАВИТЬ ЗАДАЧУ
function addTask(tasks, title) {
  const text = title.trim();
  if (text === "") {
    console.log("Пустую задачу добавить нельзя");
    return tasks;
  }
  const id = tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1;
  return [...tasks, { id: id, title: text, done: false }];
}
console.log(addTask([], "  Купить хлеб  "));
console.log(addTask([], "   "));


// ── ШАГ 3 · УДАЛИТЬ ЗАДАЧУ
function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}


// ── ШАГ 4 · ОТМЕТИТЬ / СНЯТЬ ОТМЕТКУ
function toggleDone(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}


// ── ШАГ 5 · ПЕРЕИМЕНОВАТЬ
function renameTask(tasks, id, title) {
  return tasks.map((task) =>
    task.id === id ? { ...task, title: title } : task
  );
}


// ── ШАГ 6 · СКОЛЬКО ВЫПОЛНЕНО
function countDone(tasks) {
  let count = 0;
  for (const task of tasks) {
    if (task.done) {
      count++;
    }
  }
  return count;
}


// ── ШАГ 7 · ВСЁ ЛИ ВЫПОЛНЕНО
function allDone(tasks) {
  return tasks.length > 0 && tasks.every((task) => task.done);
}
console.log(allDone([]));
console.log(allDone([{ done: true }]));
console.log(allDone([{ done: true }, { done: false }]));


// ── ШАГ 8 · СЦЕНАРИЙ
let tasks = [];
tasks = addTask(tasks, "Купить хлеб");
tasks = addTask(tasks, "  Сделать домашку ");
tasks = addTask(tasks, "   ");
tasks = addTask(tasks, "Позвонить маме");
tasks = toggleDone(tasks, 1);
tasks = renameTask(tasks, 3, "Позвонить бабушке");

const beforeDelete = tasks;
tasks = deleteTask(tasks, 2);

console.log("До:");
printTasks(beforeDelete);
console.log("После:");
printTasks(tasks);
console.log("Выполнено:", countDone(tasks), "из", tasks.length);
console.log("Все выполнены:", allDone(tasks));
console.log("В beforeDelete задач:", beforeDelete.length);


// ── ШАГ 9
// Ответ: deleteTask не меняет старый массив, а возвращает новый. Переменная tasks
// теперь указывает на новый массив, а beforeDelete — по-прежнему на старый.
