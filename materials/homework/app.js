// Приложение на странице. Кнопки вызывают функции из script.js. Этот файл менять не нужно.
(function () {
  let list = [
    { id: 1, title: "Повторить spread", done: true },
    { id: 2, title: "Сделать домашку", done: false },
    { id: 3, title: "Купить хлеб", done: false },
  ];
  let person = { name: "Айдар", address: { city: "Бишкек", street: "Чуй 1" }, tags: ["js"] };

  function render() {
    document.getElementById('tasks').innerHTML = list.length ? list.map((x) =>
      '<div class="row ' + (x.done ? 'done' : '') + '"><input type="checkbox" data-act="toggle" data-id="' + x.id + '" ' + (x.done ? 'checked' : '') + ' /><div class="grow"><strong>' + esc(x.title) + '</strong><small>id ' + x.id + '</small></div>' +
      '<button class="ghost" data-act="rename" data-id="' + x.id + '">✎</button><button class="ghost" data-act="delete" data-id="' + x.id + '">✕</button></div>').join('')
      : '<div class="empty">Задач нет</div>';
    const addr = person.address || {};
    document.getElementById('user').innerHTML = '<div class="row"><div class="grow"><strong>' + esc(person.name) + '</strong><small>' + esc(addr.city) + ', ' + esc(addr.street) + '</small></div></div>' +
      '<div class="row"><div class="grow"><small>Теги</small><strong>' + (Array.isArray(person.tags) ? person.tags.map(esc).join(', ') : '—') + '</strong></div></div>';
  }

  function apply(res, text, set) { if (!res.error) set(res.value); showStatus(res, text); render(); }

  document.querySelector('.app').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id), act = b.dataset.act;
    if (act === 'add') {
      const input = document.getElementById('newTask'), title = input.value.trim();
      if (!title) { showStatus({ kind: 'wait', error: 'Введите текст задачи.' }); input.focus(); return; }
      apply(callStudent('addTask', [list, title], 'array'), 'addTask(tasks, «' + title + '») — задача добавлена.', (v) => { list = v; input.value = ''; });
    } else if (act === 'toggle') {
      e.preventDefault();
      apply(callStudent('toggleDone', [list, id], 'array'), 'toggleDone(tasks, ' + id + ') — переключено.', (v) => { list = v; });
    } else if (act === 'delete') {
      apply(callStudent('deleteTask', [list, id], 'array'), 'deleteTask(tasks, ' + id + ') — удалено.', (v) => { list = v; });
    } else if (act === 'rename') {
      const old = list.find((x) => x.id === id);
      const title = (prompt('Новое название', old ? old.title : '') || '').trim();
      if (!title) return;
      apply(callStudent('renameTask', [list, id, title], 'array'), 'renameTask(tasks, ' + id + ', «' + title + '») — переименовано.', (v) => { list = v; });
    } else if (act === 'sort') {
      apply(callStudent('sortByTitle', [list], 'array'), 'sortByTitle(tasks) — отсортировано А→Я.', (v) => { list = v; });
    } else if (act === 'move') {
      const city = document.getElementById('city').value;
      apply(callStudent('moveUser', [person, city], 'object'), 'moveUser(user, «' + city + '») — новый город.', (v) => { person = v; });
    } else if (act === 'tag') {
      const input = document.getElementById('newTag'), tag = input.value.trim();
      if (!tag) { showStatus({ kind: 'wait', error: 'Введите тег.' }); input.focus(); return; }
      apply(callStudent('addTag', [person, tag], 'object'), 'addTag(user, «' + tag + '») — тег добавлен.', (v) => { person = v; input.value = ''; });
    }
  });
  ['newTask', 'newTag'].forEach((idName) => document.getElementById(idName).addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.querySelector(idName === 'newTask' ? '[data-act=add]' : '[data-act=tag]').click();
  }));
  render();
})();
