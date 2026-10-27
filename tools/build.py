#!/usr/bin/env python3
"""Собирает практику урока 13: в каждой папке materials/<name>/ только index.html и script.js.
Всё служебное (стили, проверка, приложение) встраивается внутрь index.html.
Запуск: python3 tools/build.py"""
import html, os, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, 'tools')
KIT = open(os.path.join(TOOLS, 'kit.js'), encoding='utf-8').read()
CSS = open(os.path.join(TOOLS, 'page.css'), encoding='utf-8').read()


def task_card(t):
    ba = ''
    if t.get('before'):
        ba = ('<div class="ba"><div><small>БЫЛО</small><pre>' + t['before'] + '</pre></div><div class="arrow">→</div>'
              '<div><small>ДОЛЖНО СТАТЬ</small><pre>' + t['after'] + '</pre></div></div>')
    hint = '<details><summary>Подсказка</summary><pre>' + html.escape(t['hint']) + '</pre></details>' if t.get('hint') else ''
    attr = ' data-task="' + t['fn'] + '"' if t.get('fn') else ''
    badge = '⏳' if t.get('fn') else 'в script.js'
    sig = '<div class="sig"><code>' + t['sig'] + '</code></div>' if t.get('sig') else ''
    msg = '<p class="check-msg"></p>' if t.get('fn') else ''
    return ('<article class="task"' + attr + '><header><span class="num">' + t['num'] + '</span><h3>' + t['title'] + '</h3>'
            '<span class="badge">' + badge + '</span></header><p class="why">' + t['why'] + '</p>' + sig + ba + hint + msg + '</article>')


def page(c):
    return f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{c['title']}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
{CSS}
</style>
</head>
<body>
<main>
  <header>
    <h1>{c['h1']}</h1>
    <p class="lead">{c['lead']}</p>
  </header>
  <section class="steps">
    <div><b>1</b>Пишем функцию в <code>script.js</code></div>
    <div><b>2</b>Сохраняем и обновляем эту страницу — <code>F5</code></div>
    <div><b>3</b>Жмём кнопку: работает — у задания ✅</div>
  </section>
  <section class="card">
    <h2>{c['app_title']}</h2>
    {c['app_html']}
    <div class="status" id="status">Нажмите кнопку — здесь будет видно, что сделала ваша функция.</div>
  </section>
  <section>
    <div class="tasks-head"><h2>ЗАДАНИЯ</h2><div id="score"></div></div>
    <div class="tasks">{''.join(task_card(t) for t in c['tasks'])}</div>
  </section>
</main>
<script>
{KIT}
</script>
<script src="./script.js"></script>
<script>
(function () {{
{c['check_js']}
  reportChecks();
}})();
</script>
<script>
(function () {{
{c['app_js']}
}})();
</script>
</body>
</html>
'''


# ───────────────────────── Вместе: корзина
JOINT = {
    'dir': 'joint', 'title': 'Урок 13 · Корзина', 'h1': 'Вместе · <span>корзина магазина</span>',
    'lead': 'Каждая кнопка магазина вызывает функцию из <b>script.js</b>. Пока функции пустые — кнопки не работают. Пишем три функции, и магазин оживает.',
    'app_title': 'МАГАЗИН',
    'app_html': '''<div class="app">
      <div><h3>Каталог</h3><div class="list" id="catalog"></div></div>
      <div><h3>Корзина <small>cart</small></h3><div class="list" id="cart"></div><div class="total"><span>Итого</span><span id="total">0 сом</span></div></div>
    </div>''',
    'tasks': [
        {'fn': 'addToCart', 'num': '1', 'title': 'Кнопка «В корзину»', 'sig': 'addToCart(cart, product)',
         'why': 'Вернуть <b>новую</b> корзину: все старые товары + <code>product</code> в конце.',
         'before': '[ Чай, Кофе ]', 'after': '[ Чай, Кофе, <mark>Сок</mark> ]',
         'hint': 'return [...cart, product];'},
        {'fn': 'removeFromCart', 'num': '2', 'title': 'Кнопка «✕»', 'sig': 'removeFromCart(cart, id)',
         'why': 'Вернуть новую корзину <b>без</b> товара с этим <code>id</code>.',
         'before': '[ Чай, Кофе ]  ✕ у Кофе', 'after': '[ Чай ]',
         'hint': 'filter оставляет тех, у кого условие true.\nОставляем всех, у кого id не равен удаляемому:\n\nreturn cart.filter((item) => item.id !== id);'},
        {'fn': 'increaseQty', 'num': '3', 'title': 'Кнопка «+»', 'sig': 'increaseQty(cart, id)',
         'why': 'Вернуть новую корзину, где у одного товара <code>qty</code> больше на 1. Остальные — как были.',
         'before': '[ Чай ×1, Кофе ×2 ]  + у Кофе', 'after': '[ Чай ×1, Кофе <mark>×3</mark> ]',
         'hint': 'map проходит по всем товарам.\nНужный товар → новый объект, остальные → как есть:\n\nreturn cart.map((item) =>\n  item.id === id ? { ...item, qty: item.qty + 1 } : item\n);'},
    ],
    'check_js': '''
  const CART = [{ id: 1, name: "Чай", price: 180, qty: 1 }, { id: 2, name: "Кофе", price: 250, qty: 2 }];
  const SOK = { id: 3, name: "Сок", price: 150, qty: 1 };
  check('addToCart', (fn, t) => {
    const c = t.freeze(CART), res = fn(c, t.freeze(SOK));
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 3) t.fail('Должно быть 3 товара. Сейчас: ' + JSON.stringify(res));
    if (!t.same(res[2], SOK)) t.fail('Последним должен быть новый товар.');
  });
  check('removeFromCart', (fn, t) => {
    const res = fn(t.freeze(CART), 2);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || !t.same(res, [CART[0]])) t.fail('Без Кофе (id 2) должен остаться только Чай. Сейчас: ' + JSON.stringify(res));
  });
  check('increaseQty', (fn, t) => {
    const c = t.freeze(CART), res = fn(c, 2);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 2) t.fail('Должно остаться 2 товара.');
    if (res.includes(undefined)) t.fail('В массиве undefined: остальные товары нужно вернуть как есть (: item).');
    if (res[1].qty !== 3) t.fail('У Кофе qty должно стать 3, сейчас ' + res[1].qty + '.');
    if (res[0].qty !== 1) t.fail('Чай не должен меняться.');
  });''',
    'app_js': '''
  const catalog = [
    { id: 1, name: "Чай", price: 180 }, { id: 2, name: "Кофе", price: 250 },
    { id: 3, name: "Сок", price: 150 }, { id: 4, name: "Вода", price: 60 },
  ];
  let cart = [{ id: 1, name: "Чай", price: 180, qty: 1 }, { id: 2, name: "Кофе", price: 250, qty: 2 }];
  function render() {
    document.getElementById('catalog').innerHTML = catalog.map((p) =>
      '<div class="row"><div class="grow"><strong>' + esc(p.name) + '</strong><small>' + p.price + ' сом</small></div><button class="main" data-act="add" data-id="' + p.id + '">В корзину</button></div>').join('');
    document.getElementById('cart').innerHTML = cart.length ? cart.map((p) =>
      '<div class="row"><div class="grow"><strong>' + esc(p.name) + ' × ' + p.qty + '</strong><small>' + p.price + ' сом · id ' + p.id + '</small></div><button data-act="plus" data-id="' + p.id + '">+</button><button class="ghost" data-act="remove" data-id="' + p.id + '">✕</button></div>').join('')
      : '<div class="empty">Корзина пуста</div>';
    document.getElementById('total').textContent = cart.reduce((s, p) => s + (Number(p.price) || 0) * (Number(p.qty) || 0), 0) + ' сом';
  }
  document.querySelector('.app').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id);
    let res, text;
    if (b.dataset.act === 'add') {
      const p = catalog.find((x) => x.id === id);
      if (cart.some((x) => x.id === id)) {
        res = callStudent('increaseQty', [cart, id], 'array');
        text = p.name + ' уже в корзине — сработала increaseQty: количество +1.';
      } else {
        res = callStudent('addToCart', [cart, { ...p, qty: 1 }], 'array');
        text = 'addToCart вернула новую корзину — ' + p.name + ' добавлен.';
      }
    } else if (b.dataset.act === 'remove') {
      res = callStudent('removeFromCart', [cart, id], 'array'); text = 'removeFromCart вернула корзину без товара.';
    } else {
      res = callStudent('increaseQty', [cart, id], 'array'); text = 'increaseQty: количество +1.';
    }
    if (!res.error) cart = res.value;
    showStatus(res, text);
    render();
  });
  render();''',
    'script': '''// Урок 13 · Вместе: корзина
// Откройте index.html — там магазин. Каждая кнопка вызывает функцию ниже.
// Правило: старую корзину НЕ меняем, а возвращаем НОВУЮ.
//
// Корзина выглядит так:
// [
//   { id: 1, name: "Чай",  price: 180, qty: 1 },
//   { id: 2, name: "Кофе", price: 250, qty: 2 }
// ]


// 1. «В корзину» — новая корзина + product в конце
function addToCart(cart, product) {

}


// 2. «✕» — новая корзина без товара с этим id
function removeFromCart(cart, id) {

}


// 3. «+» — новая корзина, где у товара с этим id qty + 1
function increaseQty(cart, id) {

}
''',
    'solution': '''// Решение · Вместе: корзина
function addToCart(cart, product) {
  return [...cart, product];
}

function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}

function increaseQty(cart, id) {
  return cart.map((item) =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  );
}
''',
}

# ───────────────────────── Сами: плейлист
SOLO = {
    'dir': 'solo', 'title': 'Урок 13 · Плейлист', 'h1': 'Сами · <span>плейлист</span>',
    'lead': 'То же самое, что с корзиной, только песни. Каждая кнопка вызывает функцию из <b>script.js</b>. Цель — три ✅.',
    'app_title': 'ПЛЕЕР',
    'app_html': '''<div class="app">
      <div><h3>Плейлист <small>playlist</small></h3><div class="list" id="playlist"></div></div>
      <div><h3>Добавить песню</h3><div class="row"><input id="newTitle" class="grow" placeholder="Название" maxlength="40" /><button class="main" data-act="add">Добавить</button></div></div>
    </div>''',
    'tasks': [
        {'fn': 'addSong', 'num': '1', 'title': 'Кнопка «Добавить»', 'sig': 'addSong(playlist, song)',
         'why': 'Вернуть новый плейлист: все старые песни + <code>song</code> в конце.',
         'before': '[ Gulzada, Night City ]', 'after': '[ Gulzada, Night City, <mark>Новая</mark> ]',
         'hint': 'Как addToCart в корзине.'},
        {'fn': 'removeSong', 'num': '2', 'title': 'Кнопка «✕»', 'sig': 'removeSong(playlist, id)',
         'why': 'Вернуть новый плейлист без песни с этим <code>id</code>.',
         'before': '[ Gulzada, Night City ]  ✕ у Gulzada', 'after': '[ Night City ]',
         'hint': 'Как removeFromCart в корзине: filter.'},
        {'fn': 'likeSong', 'num': '3', 'title': 'Кнопка «♥»', 'sig': 'likeSong(playlist, id)',
         'why': 'Вернуть новый плейлист, где у одной песни <code>likes</code> больше на 1.',
         'before': 'Gulzada ♥ 12', 'after': 'Gulzada ♥ <mark>13</mark>',
         'hint': 'Как increaseQty в корзине: map + { ...song, likes: song.likes + 1 }'},
    ],
    'check_js': '''
  const LIST = [{ id: 1, title: "Gulzada", likes: 12 }, { id: 2, title: "Night City", likes: 40 }];
  const SONG = { id: 3, title: "Tengri", likes: 0 };
  check('addSong', (fn, t) => {
    const res = fn(t.freeze(LIST), t.freeze(SONG));
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 3 || res[2].id !== 3) t.fail('Должно быть 3 песни, новая — последней.');
  });
  check('removeSong', (fn, t) => {
    const res = fn(t.freeze(LIST), 1);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || !t.same(res, [LIST[1]])) t.fail('Без песни id 1 должна остаться только Night City.');
  });
  check('likeSong', (fn, t) => {
    const res = fn(t.freeze(LIST), 1);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 2) t.fail('Должно остаться 2 песни.');
    if (res.includes(undefined)) t.fail('В массиве undefined: остальные песни нужно вернуть как есть (: song).');
    if (res[0].likes !== 13) t.fail('У Gulzada должно стать 13 лайков, сейчас ' + res[0].likes + '.');
    if (res[1].likes !== 40) t.fail('Night City не должна меняться.');
  });''',
    'app_js': '''
  let playlist = [{ id: 1, title: "Gulzada", likes: 12 }, { id: 2, title: "Night City", likes: 40 }, { id: 3, title: "Ala-Too", likes: 7 }];
  let nextId = 4;
  function render() {
    document.getElementById('playlist').innerHTML = playlist.length ? playlist.map((s) =>
      '<div class="row"><div class="grow"><strong>' + esc(s.title) + '</strong><small>id ' + s.id + '</small></div><button data-act="like" data-id="' + s.id + '">♥ ' + s.likes + '</button><button class="ghost" data-act="remove" data-id="' + s.id + '">✕</button></div>').join('')
      : '<div class="empty">Плейлист пуст</div>';
  }
  document.querySelector('.app').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id);
    let res, text;
    if (b.dataset.act === 'add') {
      const input = document.getElementById('newTitle'), title = input.value.trim();
      if (!title) { showStatus({ kind: 'wait', error: 'Введите название песни.' }); input.focus(); return; }
      res = callStudent('addSong', [playlist, { id: nextId, title, likes: 0 }], 'array');
      text = 'addSong — песня «' + title + '» добавлена.';
      if (!res.error) { nextId++; input.value = ''; }
    } else if (b.dataset.act === 'remove') {
      res = callStudent('removeSong', [playlist, id], 'array'); text = 'removeSong — песня удалена.';
    } else {
      res = callStudent('likeSong', [playlist, id], 'array'); text = 'likeSong — +1 лайк.';
    }
    if (!res.error) playlist = res.value;
    showStatus(res, text);
    render();
  });
  document.getElementById('newTitle').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.querySelector('[data-act=add]').click(); });
  render();''',
    'script': '''// Урок 13 · Сами: плейлист
// Откройте index.html — там плеер. Каждая кнопка вызывает функцию ниже.
// Правило: старый плейлист НЕ меняем, а возвращаем НОВЫЙ.
//
// Плейлист выглядит так:
// [
//   { id: 1, title: "Gulzada",    likes: 12 },
//   { id: 2, title: "Night City", likes: 40 }
// ]


// 1. «Добавить» — новый плейлист + song в конце
function addSong(playlist, song) {

}


// 2. «✕» — новый плейлист без песни с этим id
function removeSong(playlist, id) {

}


// 3. «♥» — новый плейлист, где у песни с этим id likes + 1
function likeSong(playlist, id) {

}
''',
    'solution': '''// Решение · Сами: плейлист
function addSong(playlist, song) {
  return [...playlist, song];
}

function removeSong(playlist, id) {
  return playlist.filter((song) => song.id !== id);
}

function likeSong(playlist, id) {
  return playlist.map((song) =>
    song.id === id ? { ...song, likes: song.likes + 1 } : song
  );
}
''',
}

# ───────────────────────── Домашка: задачи
HOMEWORK = {
    'dir': 'homework', 'title': 'Урок 13 · Домашнее задание', 'h1': 'Домашка · <span>список задач</span>',
    'lead': 'Те же три приёма, что на уроке, плюс один новый. Каждая кнопка вызывает функцию из <b>script.js</b>. Шпаргалка — <b>SUMMARY.md</b>.',
    'app_title': 'СПИСОК ЗАДАЧ',
    'app_html': '''<div class="app">
      <div><h3>Задачи <small>tasks</small></h3><div class="list" id="tasks"></div></div>
      <div><h3>Новая задача</h3><div class="row"><input id="newTask" class="grow" placeholder="Что сделать?" maxlength="50" /><button class="main" data-act="add">Добавить</button></div></div>
    </div>''',
    'tasks': [
        {'fn': 'addTask', 'num': '1', 'title': 'Кнопка «Добавить»', 'sig': 'addTask(tasks, task)',
         'why': 'Вернуть новый список: все старые задачи + <code>task</code> в конце.',
         'before': '[ Купить хлеб, Сделать домашку ]', 'after': '[ Купить хлеб, Сделать домашку, <mark>Новая</mark> ]', 'hint': 'spread'},
        {'fn': 'deleteTask', 'num': '2', 'title': 'Кнопка «✕»', 'sig': 'deleteTask(tasks, id)',
         'why': 'Вернуть новый список без задачи с этим <code>id</code>.',
         'before': '[ Купить хлеб, Сделать домашку ]  ✕ у хлеба', 'after': '[ Сделать домашку ]', 'hint': 'filter'},
        {'fn': 'toggleDone', 'num': '3', 'title': 'Галочка', 'sig': 'toggleDone(tasks, id)',
         'why': 'Вернуть новый список, где у одной задачи <code>done</code> стало противоположным: true ↔ false.',
         'before': '☐ Купить хлеб  (done: false)', 'after': '☑ Купить хлеб  (done: <mark>true</mark>)', 'hint': 'map + { ...task, done: !task.done }'},
        {'fn': 'renameTask', 'num': '4', 'title': 'Кнопка «✎»', 'sig': 'renameTask(tasks, id, title)',
         'why': 'Новое: вернуть новый список, где у одной задачи новое название <code>title</code>.',
         'before': 'Купить хлеб', 'after': '<mark>Купить молоко</mark>', 'hint': 'Как toggleDone, только меняем title.'},
        {'num': '5', 'title': 'Вопрос письменно',
         'why': 'Почему нельзя написать <code>tasks.push(task)</code> в addTask? Ответьте 1–2 предложениями комментарием в конце <b>script.js</b>.'},
    ],
    'check_js': '''
  const TASKS = [{ id: 1, title: "Купить хлеб", done: false }, { id: 2, title: "Сделать домашку", done: true }];
  check('addTask', (fn, t) => {
    const res = fn(t.freeze(TASKS), t.freeze({ id: 3, title: "Новая", done: false }));
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 3 || res[2].id !== 3) t.fail('Должно быть 3 задачи, новая — последней.');
  });
  check('deleteTask', (fn, t) => {
    const res = fn(t.freeze(TASKS), 1);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || !t.same(res, [TASKS[1]])) t.fail('Без задачи id 1 должна остаться только «Сделать домашку».');
  });
  check('toggleDone', (fn, t) => {
    const res = fn(t.freeze(TASKS), 1);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.includes(undefined)) t.fail('Нужен массив без undefined: остальные задачи вернуть как есть.');
    if (res[0].done !== true) t.fail('У задачи 1 done должно стать true.');
    if (res[1].done !== true) t.fail('Задача 2 не должна меняться.');
  });
  check('renameTask', (fn, t) => {
    const res = fn(t.freeze(TASKS), 1, 'Купить молоко');
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.includes(undefined)) t.fail('Нужен массив без undefined.');
    if (res[0].title !== 'Купить молоко' || res[0].done !== false) t.fail('У задачи 1 новое название, done прежний.');
    if (res[1].title !== 'Сделать домашку') t.fail('Задача 2 не должна меняться.');
  });''',
    'app_js': '''
  let tasks = [{ id: 1, title: "Купить хлеб", done: false }, { id: 2, title: "Сделать домашку", done: true }];
  let nextId = 3;
  function render() {
    document.getElementById('tasks').innerHTML = tasks.length ? tasks.map((x) =>
      '<div class="row ' + (x.done ? 'done' : '') + '"><input type="checkbox" data-act="toggle" data-id="' + x.id + '" ' + (x.done ? 'checked' : '') + ' /><div class="grow"><strong>' + esc(x.title) + '</strong><small>id ' + x.id + '</small></div><button class="ghost" data-act="rename" data-id="' + x.id + '">✎</button><button class="ghost" data-act="delete" data-id="' + x.id + '">✕</button></div>').join('')
      : '<div class="empty">Задач нет</div>';
  }
  document.querySelector('.app').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id), act = b.dataset.act;
    let res, text;
    if (act === 'add') {
      const input = document.getElementById('newTask'), title = input.value.trim();
      if (!title) { showStatus({ kind: 'wait', error: 'Введите текст задачи.' }); input.focus(); return; }
      res = callStudent('addTask', [tasks, { id: nextId, title, done: false }], 'array');
      text = 'addTask — задача добавлена.';
      if (!res.error) { nextId++; input.value = ''; }
    } else if (act === 'toggle') {
      e.preventDefault();
      res = callStudent('toggleDone', [tasks, id], 'array'); text = 'toggleDone — переключено.';
    } else if (act === 'delete') {
      res = callStudent('deleteTask', [tasks, id], 'array'); text = 'deleteTask — удалено.';
    } else if (act === 'rename') {
      const old = tasks.find((x) => x.id === id);
      const title = (prompt('Новое название', old ? old.title : '') || '').trim();
      if (!title) return;
      res = callStudent('renameTask', [tasks, id, title], 'array'); text = 'renameTask — переименовано.';
    }
    if (!res.error) tasks = res.value;
    showStatus(res, text);
    render();
  });
  document.getElementById('newTask').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.querySelector('[data-act=add]').click(); });
  render();''',
    'script': '''// Урок 13 · Домашнее задание: список задач
// Откройте index.html — там приложение. Каждая кнопка вызывает функцию ниже.
// Правило: старый список НЕ меняем, а возвращаем НОВЫЙ.
//
// Список выглядит так:
// [
//   { id: 1, title: "Купить хлеб",     done: false },
//   { id: 2, title: "Сделать домашку", done: true }
// ]


// 1. «Добавить» — новый список + task в конце
function addTask(tasks, task) {

}


// 2. «✕» — новый список без задачи с этим id
function deleteTask(tasks, id) {

}


// 3. Галочка — у задачи с этим id done меняется на противоположное
function toggleDone(tasks, id) {

}


// 4. «✎» — у задачи с этим id новое название title
function renameTask(tasks, id, title) {

}


// 5. Почему нельзя написать tasks.push(task) в addTask?
// Ответ:
''',
    'solution': '''// Решение · Домашнее задание
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
''',
}


def build():
    mat = os.path.join(ROOT, 'materials')
    for c in (JOINT, SOLO, HOMEWORK):
        d = os.path.join(mat, c['dir'])
        for f in os.listdir(d):
            os.remove(os.path.join(d, f))
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(page(c))
        open(os.path.join(d, 'script.js'), 'w', encoding='utf-8').write(c['script'])
        open(os.path.join(ROOT, 'teacher', c['dir'] + '-solution.js'), 'w', encoding='utf-8').write(c['solution'])
        if c['dir'] == 'homework':
            open(os.path.join(d, 'SUMMARY.md'), 'w', encoding='utf-8').write(open(os.path.join(mat, 'SUMMARY.md'), encoding='utf-8').read())
        zp = os.path.join(mat, c['dir'] + '.zip')
        with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
            for f in sorted(os.listdir(d)):
                z.write(os.path.join(d, f), c['dir'] + '/' + f)
        print('built', c['dir'], sorted(os.listdir(d)))


if __name__ == '__main__':
    build()
