// ═══════════════════════════════════════════════
//  JS 13 · Домашнее задание: список задач
//  Результат — в консоли: F12 → Console. После сохранения — F5.
//  Правило урока: старый список НЕ меняем, а возвращаем НОВЫЙ.
//  Шпаргалка по всем приёмам — SUMMARY.md.
// ═══════════════════════════════════════════════


// ── Шаг 1 · показать задачи
// Повторяем: if + length (4, 8), forEach (11), тернарный оператор (4), шаблонные строки (7)
function printTasks(tasks) {
  if (tasks.length === 0) {
    console.log("   Задач нет");
    return;
  }
  tasks.forEach((task) => {
    const mark = task.done ? "☑" : "☐";
    console.log(`   ${mark} ${task.id}. ${task.title}`);
  });
}

console.log("1.");
printTasks([{ id: 1, title: "Купить хлеб", done: true }]);
// Ожидается: ☑ 1. Купить хлеб


// ── Шаг 2 · добавить задачу
// Повторяем: trim (7), условия (4). Новое: [...tasks, новая]
// 1) убрать пробелы по краям title (trim)
// 2) пустая строка → сообщение, вернуть tasks
// 3) id: если список пуст — 1, иначе id последней задачи + 1
// 4) вернуть новый список со старыми задачами и новой { id, title, done: false }
function addTask(tasks, title) {
  const text = title.trim();
  if (text === "") {
    console.log("   Пустую задачу добавить нельзя");
    return tasks;
  }
  const id = tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1;
  return [...tasks, { id: id, title: text, done: false }];
}

console.log("2.", addTask([], "  Купить хлеб  ")); // Ожидается: [{ id: 1, title: "Купить хлеб", done: false }]
console.log("2.", addTask([], "   "));             // Ожидается: сообщение, потом []


// ── Шаг 3 · удалить задачу (filter)
function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}


// ── Шаг 4 · отметить выполненной / снять отметку (map + spread)
function toggleDone(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}


// ── Шаг 5 · переименовать (map + spread)
function renameTask(tasks, id, title) {
  return tasks.map((task) =>
    task.id === id ? { ...task, title: title } : task
  );
}


// ── Шаг 6 · сколько задач выполнено
// Повторяем: for...of (9) или filter + length (11)
function countDone(tasks) {
  let count = 0;
  for (const task of tasks) {
    if (task.done) {
      count++;
    }
  }
  return count;
}


// ── Шаг 7 · все ли задачи выполнены (every, урок 12)
function allDone(tasks) {
  return tasks.length > 0 && tasks.every((task) => task.done);
}


// ── Шаг 8 · сценарий
let tasks = [];
tasks = addTask(tasks, "Купить хлеб");
tasks = addTask(tasks, "  Сделать домашку ");
tasks = addTask(tasks, "   ");
tasks = addTask(tasks, "Позвонить маме");
tasks = toggleDone(tasks, 1);
tasks = renameTask(tasks, 3, "Позвонить бабушке");

const beforeDelete = tasks;
tasks = deleteTask(tasks, 2);

console.log("8. До:");
printTasks(beforeDelete);
console.log("8. После:");
printTasks(tasks);
console.log("8. Выполнено:", countDone(tasks), "из", tasks.length);
console.log("8. Все выполнены:", allDone(tasks));
console.log("8. Старый список цел:", beforeDelete.length === 3);
// Ожидается:
//   Пустую задачу добавить нельзя
// До:    ☑ 1. Купить хлеб / ☐ 2. Сделать домашку / ☐ 3. Позвонить бабушке
// После: ☑ 1. Купить хлеб / ☐ 3. Позвонить бабушке
// Выполнено: 1 из 2 · Все выполнены: false · Старый список цел: true


// ── Шаг 9 · ответьте комментарием
// Почему после строки tasks = deleteTask(tasks, 2) в beforeDelete всё ещё 3 задачи?
// Ответ: deleteTask не меняет старый массив, а возвращает новый. В tasks теперь ссылка
// на новый массив, а beforeDelete по-прежнему указывает на старый.
