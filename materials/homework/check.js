// Автопроверка заданий. Этот файл менять не нужно.
(function () {
  const TASKS = [{ id: 1, title: "Повторить spread", done: true }, { id: 2, title: "Сделать домашку", done: false }, { id: 3, title: "Купить хлеб", done: false }];
  const USER = { name: "Айдар", address: { city: "Бишкек", street: "Чуй 1" }, tags: ["js"] };

  check('addTask', (fn, t) => {
    const res = fn(t.freeze(TASKS), 'Новая');
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 4) t.fail('Нужен новый массив из 4 задач.');
    if (!t.same(res[3], { id: 4, title: 'Новая', done: false })) t.fail('Ожидалось { id: 4, title: "Новая", done: false }. Сейчас: ' + JSON.stringify(res[3]));
    const empty = fn(t.freeze([]), 'Первая');
    if (!empty || !empty[0] || empty[0].id !== 1) t.fail('Для пустого списка id должен быть 1.');
  });
  check('deleteTask', (fn, t) => {
    const res = fn(t.freeze(TASKS), 2);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || !t.same(res.map((x) => x && x.id), [1, 3])) t.fail('Должны остаться задачи с id 1 и 3.');
  });
  check('toggleDone', (fn, t) => {
    const l = t.freeze(TASKS), res = fn(l, 1);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.includes(undefined)) t.fail('Нужен массив без undefined — return task для остальных.');
    if (res[0].done !== false || res[0] === l[0]) t.fail('Задача 1: done → false, новым объектом.');
    if (res[1] !== l[1]) t.fail('Остальные задачи возвращаем как есть.');
  });
  check('renameTask', (fn, t) => {
    const res = fn(t.freeze(TASKS), 3, 'Купить молоко');
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || !res[2] || res[2].title !== 'Купить молоко' || res[2].done !== false || res[2].id !== 3) t.fail('Задача 3: новый title, id и done сохранены.');
  });
  check('sortByTitle', (fn, t) => {
    const l = t.freeze(TASKS), res = fn(l);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || !t.same(res.map((x) => x.id), [3, 1, 2])) t.fail('Ожидался порядок: Купить хлеб, Повторить spread, Сделать домашку.');
  });
  check('moveUser', (fn, t) => {
    const u = t.freeze(USER), res = fn(u, 'Ош');
    if (res === undefined) return 'wait';
    if (!res.address) t.fail('Потерялся address. Не забудьте ...user.');
    if (res.address === u.address) t.fail('address — та же ссылка. Скопируйте оба уровня: { ...user, address: { ...user.address, city } }.');
    if (res.address.city !== 'Ош' || res.address.street !== 'Чуй 1' || res.name !== 'Айдар') t.fail('Город — Ош, остальные поля сохранены.');
  });
  check('addTag', (fn, t) => {
    const u = t.freeze(USER), res = fn(u, 'react');
    if (res === undefined) return 'wait';
    if (res.tags === u.tags) t.fail('tags — та же ссылка. Нужно tags: [...user.tags, tag].');
    if (!t.same(res.tags, ['js', 'react']) || res.name !== 'Айдар') t.fail('Ожидалось tags ["js", "react"], остальные поля сохранены.');
  });
  reportChecks();
})();
