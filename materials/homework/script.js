// ─────────────────────────────────────────────────────────────
// Урок 13 · Домашнее задание: список задач
//
// Откройте index.html: там приложение, кнопки вызывают эти функции.
// ПРАВИЛО: входные данные НЕ меняем. Возвращаем НОВЫЕ (return).
// После каждой функции: сохранить → обновить страницу (F5).
// Шпаргалка по всем приёмам — SUMMARY.md рядом.
// ─────────────────────────────────────────────────────────────

const tasks = [
  { id: 1, title: "Повторить spread", done: true },
  { id: 2, title: "Сделать домашку", done: false },
  { id: 3, title: "Купить хлеб", done: false },
];

const user = {
  name: "Айдар",
  address: { city: "Бишкек", street: "Чуй 1" },
  tags: ["js"],
};

// 1. Новая задача { id, title, done: false }. id = id последней задачи + 1 (или 1, если список пуст)
function addTask(tasks, title) {
}

// 2. Удалить задачу по id
function deleteTask(tasks, id) {
}

// 3. Переключить done у задачи
function toggleDone(tasks, id) {
}

// 4. Поменять title у задачи
function renameTask(tasks, id, title) {
}

// 5. Новый массив, отсортированный по title (localeCompare). Исходный не трогаем!
function sortByTitle(tasks) {
}

// 6. Поменять город. address — вложенный объект
function moveUser(user, city) {
}

// 7. Добавить тег в конец user.tags. tags — вложенный массив
function addTag(user, tag) {
}

// 8. Письменно (комментарием ниже): почему после
//    const copy = { ...user }; copy.tags.push("css");
//    у user тоже появится "css"? Ответ 1–2 предложения.
// Ответ:
