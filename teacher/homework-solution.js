// ═══════════════════════════════════════════════
//  JS 13 · Домашнее задание: список задач
//  Результат смотрим в консоли: F12 → Console.
//  Правило: старый список НЕ меняем, возвращаем НОВЫЙ.
//  Шпаргалка по всем приёмам — SUMMARY.md.
// ═══════════════════════════════════════════════

const tasks = [
  { id: 1, title: "Купить хлеб", done: false },
  { id: 2, title: "Сделать домашку", done: true },
];

// Помощник для консоли: список → ["☐ Купить хлеб", "☑ Сделать домашку"]
function show(list) {
  if (list === undefined) {
    return "undefined — функция ничего не вернула (нет return)";
  }
  return list.map((task) => {
    if (task === undefined) {
      return "undefined";
    }
    return (task.done ? "☑ " : "☐ ") + task.title;
  });
}


// ── 1. addTask(tasks, task) — новый список + task в конце
function addTask(tasks, task) {
  return [...tasks, task];
}

console.log("1.", show(addTask(tasks, { id: 3, title: "Позвонить маме", done: false })));
// Ожидается: ["☐ Купить хлеб", "☑ Сделать домашку", "☐ Позвонить маме"]


// ── 2. deleteTask(tasks, id) — новый список без задачи с этим id
function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

console.log("2.", show(deleteTask(tasks, 1)));
// Ожидается: ["☑ Сделать домашку"]


// ── 3. toggleDone(tasks, id) — у задачи с этим id done меняется на противоположное
function toggleDone(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

console.log("3.", show(toggleDone(tasks, 1)));
// Ожидается: ["☑ Купить хлеб", "☑ Сделать домашку"]


// ── 4. renameTask(tasks, id, title) — у задачи с этим id новое название
function renameTask(tasks, id, title) {
  return tasks.map((task) =>
    task.id === id ? { ...task, title: title } : task
  );
}

console.log("4.", show(renameTask(tasks, 1, "Купить молоко")));
// Ожидается: ["☐ Купить молоко", "☑ Сделать домашку"]


// ── 5. Старый список не изменился?
console.log("5.", show(tasks));
// Ожидается: ["☐ Купить хлеб", "☑ Сделать домашку"]


// ── 6. Сравните через ===
// Сохраните результат toggleDone(tasks, 1) в переменную и выведите:
//   новый список === tasks                Ожидается: false
//   задача с индексом 1 в обоих списках   Ожидается: true (её не меняли)
const toggled = toggleDone(tasks, 1);
console.log("6. Списки:", toggled === tasks);         // false
console.log("6. Задача 2:", toggled[1] === tasks[1]); // true


// ── 7. Ответьте комментарием: почему в addTask нельзя написать tasks.push(task)?
// Ответ: push меняет старый массив tasks. А функция должна вернуть новый массив
// и не трогать старый — иначе все, у кого есть ссылка на tasks, увидят изменение.

