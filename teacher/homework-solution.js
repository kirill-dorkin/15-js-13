// ═════════════════════════════════════════════
//  Урок 13 · Домашнее задание: список задач
//  Весь код страницы здесь. Вы пишете только раздел 2.
// ═════════════════════════════════════════════


// ─── 1. ДАННЫЕ ───────────────────────────────

let tasks = [
  { id: 1, title: "Купить хлеб", done: false },
  { id: 2, title: "Сделать домашку", done: true },
];

let oldTasks = tasks;                  // список до последнего нажатия
let tasksText = JSON.stringify(tasks); // снимок — чтобы заметить, если его испортили
let nextId = 3;


// ─── 2. ВАШИ ФУНКЦИИ ─────────────────────────
// Правило: старый список НЕ меняем. Возвращаем НОВЫЙ.

// 1. «Добавить»: новый список + task в конце
function addTask(tasks, task) {
  return [...tasks, task];
}

// 2. «✕»: новый список без задачи с этим id
function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

// 3. «✓»: у задачи с этим id done меняется на противоположное
function toggleDone(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

// 4. «✎»: у задачи с этим id новое название title
function renameTask(tasks, id, title) {
  return tasks.map((task) =>
    task.id === id ? { ...task, title: title } : task
  );
}

// 5. Почему в addTask нельзя написать tasks.push(task)?
// Ответ: push меняет старый массив. А мы договорились старые данные не трогать
// и возвращать новый массив — так программа (и React) видит, что данные изменились.


// ─── 3. КНОПКИ ───────────────────────────────
// Нажали кнопку → вызвали вашу функцию → получили новый список.

function clickAdd() {
  const input = document.querySelector("#title");
  const title = input.value.trim();
  if (title === "") {
    showMessage("Введите текст задачи.", "");
    return;
  }
  const task = { id: nextId, title: title, done: false };
  if (save(addTask(tasks, task))) {
    nextId = nextId + 1;
    input.value = "";
  }
}

function clickDelete(id) {
  save(deleteTask(tasks, id));
}

function clickToggle(id) {
  save(toggleDone(tasks, id));
}

function clickRename(id) {
  const title = prompt("Новое название");
  if (title) {
    save(renameTask(tasks, id, title));
  }
}

// Запоминаем новый список и проверяем, что старый не испорчен
function save(newTasks) {
  if (newTasks === undefined) {
    showMessage("⏳ Функция пока пустая — нужен return.", "");
    return false;
  }

  oldTasks = tasks;
  tasks = newTasks;

  if (oldTasks === newTasks) {
    showMessage("❌ Вернулся ТОТ ЖЕ массив. Нужен новый: [...tasks], filter или map.", "bad");
  } else if (JSON.stringify(oldTasks) !== tasksText) {
    showMessage("❌ Старый список изменился — это мутация. Посмотрите на «Было».", "bad");
  } else if (newTasks.includes(undefined)) {
    showMessage("❌ В новом списке undefined — в map нужно вернуть и остальные задачи.", "bad");
  } else {
    showMessage("✅ Получили новый список. Старый не изменился.", "ok");
  }
  tasksText = JSON.stringify(tasks);
  render();
  return true;
}


// ─── 4. ПОКАЗ НА ЭКРАНЕ ──────────────────────

function showTasks(list, withButtons) {
  if (list.length === 0) {
    return `<div class="empty">Пусто</div>`;
  }
  return list.map((task) => {
    if (task === undefined) {
      return `<div class="row bad">undefined — в map забыли вернуть задачу</div>`;
    }
    const buttons = withButtons
      ? `<button onclick="clickToggle(${task.id})">✓</button>
         <button onclick="clickRename(${task.id})">✎</button>
         <button onclick="clickDelete(${task.id})">✕</button>`
      : "";
    const doneClass = task.done ? "row done" : "row";
    return `<div class="${doneClass}"><span>${task.title}</span>${buttons}</div>`;
  }).join("");
}

function render() {
  document.querySelector("#before").innerHTML = showTasks(oldTasks, false);
  document.querySelector("#after").innerHTML = showTasks(tasks, true);
}

function showMessage(text, type) {
  const box = document.querySelector("#message");
  box.textContent = text;
  box.className = type;
}

document.querySelector("#addButton").addEventListener("click", clickAdd);
render();
showMessage("Нажмите любую кнопку.", "");
